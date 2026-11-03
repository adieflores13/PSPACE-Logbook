import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { accountKey, ApiError, apiRequest, normalizeUser, platformUrl, post } from "@/services/auth-api";
import { cachedAccount, cacheAccount } from "@/services/local-records";
import { readSession, writeSession } from "@/services/session-storage";
import type { AccountUser, AuthResponse, RegistrationInput, SavedSession } from "@/types/auth";

type Session = SavedSession & { user: AccountUser; accessToken: string; accessUntil: number };
type AuthValue = {
  session: Session | null; ready: boolean; offline: boolean; message: string;
  signIn: (email: string, password: string) => Promise<void>;
  register: (input: RegistrationInput) => Promise<void>;
  signOut: () => Promise<void>;
  request: <T>(path: string, options?: RequestInit) => Promise<T>;
  updateUser: (user: AccountUser) => Promise<void>;
};
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [offline, setOffline] = useState(false);
  const [message, setMessage] = useState("");
  const current = useRef<Session | null>(null);
  const generation = useRef(0);
  const refreshing = useRef<Promise<Session> | null>(null);

  const clear = useCallback(async (notice = "") => {
    generation.current++;
    current.current = null;
    setSession(null); setOffline(false); setMessage(notice);
    await writeSession(null);
  }, []);

  const accept = useCallback(async (response: AuthResponse, offlineUntil: number, version: number) => {
    if (version !== generation.current) throw new ApiError("This sign-in was cancelled.");
    const next: Session = { ...response, user: normalizeUser(response.user), accountKey: accountKey(response.user.id), offlineUntil, accessUntil: Date.now() + response.expiresIn * 1000 };
    await cacheAccount(next.user, next.accountKey);
    if (version !== generation.current) throw new ApiError("This sign-in was cancelled.");
    // Persist the rotated refresh token before announcing a successful session.
    await writeSession({ refreshToken: next.refreshToken, accountKey: next.accountKey, offlineUntil });
    if (version !== generation.current) throw new ApiError("This sign-in was cancelled.");
    current.current = next; setSession(next); setOffline(false); setMessage("");
    return next;
  }, []);

  const refresh = useCallback(() => {
    if (refreshing.current) return refreshing.current;
    const previous = current.current;
    if (!previous) return Promise.reject(new ApiError("Please sign in to PSPACE.", 401));
    const version = generation.current;
    const pending = (async () => {
      try {
        const result = await post<AuthResponse>("/auth/refresh", { refreshToken: previous.refreshToken });
        return await accept(result, previous.offlineUntil, version);
      } catch (error) {
        if (version === generation.current && error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          await clear(error.message);
        }
        throw error;
      }
    })();
    refreshing.current = pending;
    void pending.finally(() => { if (refreshing.current === pending) refreshing.current = null; }).catch(() => {});
    return pending;
  }, [accept, clear]);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const saved = await readSession();
        if (!active || !saved) return;
        if (!platformUrl || !saved.accountKey.startsWith(`${platformUrl}|`) || saved.offlineUntil <= Date.now()) { await clear(); return; }
        const user = await cachedAccount(saved.accountKey);
        if (!active || !user || accountKey(user.id) !== saved.accountKey) { await clear(); return; }
        current.current = { ...saved, user, accessToken: "", accessUntil: 0 };
        try { await refresh(); }
        catch (error) {
          if (active && current.current && error instanceof ApiError && (error.status === 0 || error.status >= 500)) {
            setSession(current.current); setOffline(true);
          } else if (active && current.current) await clear("Please sign in again to connect to PSPACE.");
        }
      } catch { if (active) await clear("Your saved session could not be restored. Please sign in again."); }
      finally { if (active) setReady(true); }
    })();
    return () => { active = false; };
  }, [clear, refresh]);

  const request = useCallback(async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
    const version = generation.current;
    const assertCurrent = () => { if (version !== generation.current) throw new ApiError("The account changed. Please try again.", 409); };
    let active = current.current;
    if (!active) throw new ApiError("Please sign in to PSPACE.", 401);
    if (active.accessUntil <= Date.now() + 15000) active = await refresh();
    const send = async (token: string) => {
      assertCurrent();
      const result = await apiRequest<T>(path, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
      assertCurrent();
      return result;
    };
    try { return await send(active.accessToken); }
    catch (error) {
      // Never retry an earlier account's write with a newly signed-in account's token.
      assertCurrent();
      if (error instanceof ApiError && error.status === 401) {
        const renewed = await refresh();
        try { return await send(renewed.accessToken); }
        catch (retryError) {
          if (retryError instanceof ApiError && (retryError.status === 401 || retryError.status === 403)) await clear(retryError.message);
          throw retryError;
        }
      }
      if (error instanceof ApiError && error.status === 403) await clear(error.message);
      throw error;
    }
  }, [clear, refresh]);

  const updateUser = useCallback(async (user: AccountUser) => {
    const existing = current.current;
    if (!existing || existing.user.id !== user.id) return;
    user = normalizeUser(user);
    await cacheAccount(user, existing.accountKey);
    if (current.current?.accountKey !== existing.accountKey) return;
    const next = { ...current.current, user };
    current.current = next; setSession(next);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active" || !current.current || !ready) return;
      void request<{ user: AccountUser }>("/me").then(({ user }) => { setOffline(false); return updateUser(user); }).catch((error) => {
        if (error instanceof ApiError && (error.status === 0 || error.status >= 500)) setOffline(true);
      });
    });
    return () => subscription.remove();
  }, [ready, request, updateUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    const version = ++generation.current;
    await accept(await post<AuthResponse>("/auth/login", { email: email.trim(), password }), Date.now() + 30 * 86400000, version);
  }, [accept]);
  const register = useCallback(async (input: RegistrationInput) => {
    const version = ++generation.current;
    await accept(await post<AuthResponse>("/auth/register", input), Date.now() + 30 * 86400000, version);
  }, [accept]);
  const signOut = useCallback(async () => {
    const token = current.current?.refreshToken;
    await clear();
    // Local sign-out works offline. The server accepts current or rotated-out
    // refresh tokens for family revocation; an unreachable session expires naturally.
    if (token) void post("/auth/logout", { refreshToken: token }).catch(() => {});
  }, [clear]);

  return <AuthContext.Provider value={{ session, ready, offline, message, signIn, register, signOut, request, updateUser }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("AuthProvider is required."); return value; }
