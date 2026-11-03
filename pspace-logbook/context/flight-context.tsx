import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAircraft } from "@/context/aircraft-context";
import { useAuth } from "@/context/auth-context";
import { loadFlights, saveFlight } from "@/services/local-records";
import type { AddFlightInput, Flight } from "@/types/records";
import { formatHours, parseDuration } from "@/utils/flight-format";
import { validateFlightInput } from "@/utils/flight-validation";
export type { Flight } from "@/types/records";
export { getFlightTotals } from "@/utils/flight-format";

type FlightContextValue = { flights: Flight[]; isLoading: boolean; error: string | null; reload: () => Promise<void>; addFlight: (flight: AddFlightInput) => Promise<Flight> };
const FlightContext = createContext<FlightContextValue | undefined>(undefined);

export function FlightProvider({ children }: { children: ReactNode }) {
  const owner = useAuth().session?.accountKey;
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { aircraft } = useAircraft();
  const reload = useCallback(async () => {
    setLoading(true); setError(null);
    try { setFlights(owner ? await loadFlights(owner) : []); }
    catch { setError("Your saved flights could not be loaded. Please try again."); }
    finally { setLoading(false); }
  }, [owner]);
  useEffect(() => { void reload(); }, [reload]);
  const addFlight = useCallback(async (input: AddFlightInput) => {
    if (!owner) throw new Error("Please sign in before adding a flight.");
    const validationError = validateFlightInput(input, aircraft);
    if (validationError) throw new Error(validationError);
    const selected = aircraft.find((item) => item.id === input.aircraftId);
    if (!selected) throw new Error("Choose an aircraft from your saved aircrafts.");
    const durationMinutes = parseDuration(input.duration);
    const item: Flight = {
      ...input, departure: input.departure.trim(), destination: input.destination.trim(), instructor: input.instructor.trim(), remarks: input.remarks.trim(),
      blockOff: input.blockOff?.trim() ?? "", blockOn: input.blockOn?.trim() ?? "", pilotRole: input.pilotRole?.trim() ?? "", weather: input.weather?.trim() ?? "",
      aircraftType: selected.makeModelVariant.replaceAll(" / ", " "), aircraftRegistration: selected.registration,
      duration: formatHours(durationMinutes), durationMinutes,
      id: "flight-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10), createdAt: new Date().toISOString(),
    };
    try { await saveFlight(item, owner); }
    catch { throw new Error("The flight could not be saved on this device. Please try again."); }
    setFlights((current) => [item, ...current]);
    return item;
  }, [aircraft, owner]);
  const value = useMemo(() => ({ flights, addFlight, isLoading, error, reload }), [flights, addFlight, isLoading, error, reload]);
  return <FlightContext.Provider value={value}>{children}</FlightContext.Provider>;
}
export function useFlights() {
  const context = useContext(FlightContext);
  if (!context) throw new Error("useFlights must be used within a FlightProvider");
  return context;
}
