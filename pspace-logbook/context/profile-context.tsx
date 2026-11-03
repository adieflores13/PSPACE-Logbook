import React, { createContext, ReactNode, useCallback, useContext } from "react";
import { Platform } from "react-native";
import { useAuth } from "@/context/auth-context";
import type { AccountUser } from "@/types/auth";
import type { LocalProfile } from "@/types/records";

type ProfileContextValue = {
  profile: LocalProfile; isLoading: boolean; error: string | null;
  reload: () => Promise<void>; updateProfile: (profile: LocalProfile) => Promise<void>;
};
const EMPTY: LocalProfile = { fullName: "", firstName: "", lastName: "", email: "", dateOfBirth: "", profileImage: null, academy: "", studentId: "" };
const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { session, ready, request, updateUser } = useAuth();
  const profile: LocalProfile = session?.user ?? EMPTY;
  const reload = useCallback(async () => {
    if (session) await updateUser((await request<{ user: AccountUser }>("/me")).user);
  }, [session, request, updateUser]);
  const updateProfile = useCallback(async (input: LocalProfile) => {
    if (!session) throw new Error("Please sign in before updating your profile.");
    const firstName = input.firstName?.trim() ?? "";
    const lastName = input.lastName?.trim() ?? "";
    if (!firstName || !lastName) throw new Error("First and last name are required.");
    const result = await request<{ user: AccountUser }>("/me", {
      method: "PATCH", body: JSON.stringify({ firstName, lastName, dateOfBirth: input.dateOfBirth.trim() }),
    });
    // Publish each confirmed server change, including a partial save if photo upload fails.
    await updateUser(result.user);
    if (input.profileImage && input.profileImage !== session.user.profileImage) {
      const data = new FormData();
      if (Platform.OS === "web") {
        const response = await fetch(input.profileImage);
        data.append("profile_photo", await response.blob(), "profile.jpg");
      } else {
        data.append("profile_photo", { uri: input.profileImage, name: "profile.jpg", type: "image/jpeg" } as unknown as Blob);
      }
      try {
        await updateUser((await request<{ user: AccountUser }>("/me/photo", { method: "POST", body: data })).user);
      } catch (error) {
        throw new Error(`Your name and date of birth were saved, but the photo was not. ${error instanceof Error ? error.message : "Please retry."}`);
      }
    }
  }, [session, request, updateUser]);
  return <ProfileContext.Provider value={{ profile, isLoading: !ready, error: null, reload, updateProfile }}>{children}</ProfileContext.Provider>;
}
export function useProfile() { const context = useContext(ProfileContext); if (!context) throw new Error("ProfileProvider is required."); return context; }
