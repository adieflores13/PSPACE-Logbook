import { isValidDate } from "@/utils/flight-format";
export function passwordError(value: string): string | null {
  if (value.length < 8 || !/[A-Z]/.test(value) || !/\d/.test(value) || !/[^\w\s]/.test(value)) return "Use at least 8 characters, an uppercase letter, a number, and a special character.";
  return null;
}
export function birthDateError(value: string, today = new Date()): string | null {
  if (!isValidDate(value)) return "Enter a valid date of birth.";
  const dob = new Date(`${value}T12:00:00`);
  const age = today.getFullYear() - dob.getFullYear() - (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) ? 1 : 0);
  return age < 13 || age > 120 ? "You must be at least 13 years old. Check your date of birth." : null;
}
