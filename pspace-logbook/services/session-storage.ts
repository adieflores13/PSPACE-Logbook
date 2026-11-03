import * as SecureStore from "expo-secure-store";
import type { SavedSession } from "@/types/auth";
const key = "pspace.mobile.session.v1";
let writes: Promise<void> = Promise.resolve();
export async function readSession(): Promise<SavedSession | null> {
  await writes;
  const value = await SecureStore.getItemAsync(key);
  return value ? JSON.parse(value) : null;
}
export function writeSession(value: SavedSession | null) {
  const pending = writes.catch(() => {}).then(async () => {
    if (value) await SecureStore.setItemAsync(key, JSON.stringify(value), { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
    else await SecureStore.deleteItemAsync(key);
  });
  writes = pending;
  return pending;
}
