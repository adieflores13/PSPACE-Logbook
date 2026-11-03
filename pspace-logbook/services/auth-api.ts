import type { AccountUser } from "@/types/auth";

const configured = process.env.EXPO_PUBLIC_PSPACE_URL?.trim().replace(/\/+$/, "") ?? "";
export const platformUrl = configured;
export const apiUrl = configured ? `${configured}/api/mobile/v1` : "";

export class ApiError extends Error {
  constructor(message: string, public status = 0) { super(message); }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiUrl) throw new ApiError("PSPACE is not configured. Set EXPO_PUBLIC_PSPACE_URL and restart Expo.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options, credentials: "omit", signal: controller.signal,
      headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...options.headers },
    });
    const data = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) throw new ApiError(data?.error || "PSPACE could not complete the request. Please try again.", response.status);
    if (response.status !== 204 && !data) throw new ApiError("Unexpected response from PSPACE. Check the server URL.", response.status);
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Unable to reach PSPACE. Check your connection and try again.");
  } finally { clearTimeout(timeout); }
}

export const post = <T,>(path: string, data: unknown) => apiRequest<T>(path, { method: "POST", body: JSON.stringify(data) });
export function accountKey(userId: string) { return `${platformUrl}|${userId}`; }
export function normalizeUser(user: AccountUser): AccountUser {
  const image = user.profileImage;
  return { ...user, profileImage: image?.startsWith("/") ? `${platformUrl}${image}` : image };
}
