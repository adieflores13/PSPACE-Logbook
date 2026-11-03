import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AddAircraftInput, Aircraft } from "@/types/records";
import { loadAircraft, saveAircraft } from "@/services/local-records";
import { useAuth } from "@/context/auth-context";
export type { Aircraft, AddAircraftInput } from "@/types/records";

type AircraftContextValue = {
  aircraft: Aircraft[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addAircraft: (input: AddAircraftInput) => Promise<Aircraft>;
};
const AircraftContext = createContext<AircraftContextValue | undefined>(undefined);

export function AircraftProvider({ children }: { children: ReactNode }) {
  const owner = useAuth().session?.accountKey;
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setAircraft(owner ? await loadAircraft(owner) : []); }
    catch { setError("Your saved aircraft could not be loaded. Please try again."); }
    finally { setLoading(false); }
  }, [owner]);
  useEffect(() => { void reload(); }, [reload]);

  const addAircraft = useCallback(async (input: AddAircraftInput) => {
    if (!owner) throw new Error("Please sign in before adding an aircraft.");
    const registration = input.registration.trim().toUpperCase();
    if (!registration || !input.make.trim() || !input.model.trim()) throw new Error("Registration, manufacturer and model are required.");
    if (aircraft.some((item) => item.registration === registration)) throw new Error("This aircraft registration is already saved.");
    const make = input.make.trim(); const model = input.model.trim(); const variant = input.variant.trim();
    const item: Aircraft = {
      id: "aircraft-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10), registration, make, model, variant,
      makeModelVariant: [make, model, variant].filter(Boolean).join(" / "), hours: 0,
      category: input.category?.trim() ?? "", engineCategory: input.engineCategory?.trim() ?? "",
      serialNumber: input.serialNumber?.trim() ?? "", yearModel: input.yearModel?.trim() ?? "",
      homeBase: input.homeBase?.trim() ?? "", maxOccupants: input.maxOccupants?.trim() ?? "", fuelType: input.fuelType?.trim() ?? "",
      registrationDate: input.registrationDate?.trim() ?? "", expiryDate: input.expiryDate?.trim() ?? "", createdAt: new Date().toISOString(),
    };
    try { await saveAircraft(item, owner); }
    catch { throw new Error("The aircraft could not be saved. Check the registration and try again."); }
    setAircraft((current) => [item, ...current]);
    return item;
  }, [aircraft, owner]);
  const value = useMemo(() => ({ aircraft, addAircraft, isLoading, error, reload }), [aircraft, addAircraft, isLoading, error, reload]);
  return <AircraftContext.Provider value={value}>{children}</AircraftContext.Provider>;
}
export function useAircraft() {
  const context = useContext(AircraftContext);
  if (!context) throw new Error("useAircraft must be used within an AircraftProvider");
  return context;
}
