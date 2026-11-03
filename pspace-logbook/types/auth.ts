export type AccountRole = "student" | "instructor";
export type AccountUser = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  role: AccountRole;
  profileImage: string | null;
  academy: string;
  studentId: string;
};
export type AuthResponse = { accessToken: string; refreshToken: string; expiresIn: number; user: AccountUser };
export type RegistrationInput = {
  firstName: string; lastName: string; email: string; dateOfBirth: string;
  password: string; role: AccountRole; acceptTerms: boolean; verificationToken: string;
};
export type SavedSession = { refreshToken: string; accountKey: string; offlineUntil: number };
