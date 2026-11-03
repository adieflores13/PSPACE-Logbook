import type { SavedSession } from "@/types/auth";
const key = "pspace.mobile.session.v1";
// Browser preview only: don't persist bearer credentials in localStorage.
export async function readSession(): Promise<SavedSession | null> {
  const value = globalThis.sessionStorage?.getItem(key);
  return value ? JSON.parse(value) : null;
}
export async function writeSession(value: SavedSession | null) {
  if (value) globalThis.sessionStorage.setItem(key, JSON.stringify(value));
  else globalThis.sessionStorage.removeItem(key);
}
