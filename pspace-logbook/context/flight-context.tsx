import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type Flight = {
  id: string;
  date: string;
  departure: string;
  destination: string;
  aircraftType: string;
  aircraftRegistration: string;
  duration: string;
  landings: string;
  instructor: string;
};

type AddFlightInput = Omit<Flight, "id">;
type FlightContextValue = { flights: Flight[]; addFlight: (flight: AddFlightInput) => void };

const FlightContext = createContext<FlightContextValue | undefined>(undefined);

const initialFlights: Flight[] = [
  { id: "flight-1", date: "May 20, 2026", departure: "KAPA", destination: "KDEN", aircraftType: "Cessna 172S", aircraftRegistration: "N1234AB", duration: "2.5", landings: "3", instructor: "John D. Anderson" },
  { id: "flight-2", date: "May 18, 2026", departure: "KEFT", destination: "KAPA", aircraftType: "Piper PA-28-181", aircraftRegistration: "N5678CD", duration: "1.3", landings: "3", instructor: "Sarah M. Lee" },
  { id: "flight-3", date: "May 15, 2026", departure: "KAPA", destination: "KBJC", aircraftType: "Cessna 172S", aircraftRegistration: "N1234AB", duration: "1.8", landings: "2", instructor: "John D. Anderson" },
];

export function FlightProvider({ children }: { children: ReactNode }) {
  const [flights, setFlights] = useState(initialFlights);
  const addFlight = (flight: AddFlightInput) => setFlights((current) => [{ ...flight, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }, ...current]);
  const value = useMemo(() => ({ flights, addFlight }), [flights]);
  return <FlightContext.Provider value={value}>{children}</FlightContext.Provider>;
}

export function useFlights() {
  const context = useContext(FlightContext);
  if (!context) throw new Error("useFlights must be used within a FlightProvider");
  return context;
}
