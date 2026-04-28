import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type Aircraft = {
  id: string;
  registration: string;
  makeModelVariant: string;
  hours: number;
};

type AddAircraftInput = {
  registration: string;
  make: string;
  model: string;
  variant: string;
};

type AircraftContextValue = {
  aircraft: Aircraft[];
  addAircraft: (input: AddAircraftInput) => void;
};

const AircraftContext = createContext<AircraftContextValue | undefined>(undefined);

function normalize(value: string) {
  return value.trim();
}

export function AircraftProvider({ children }: { children: ReactNode }) {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);

  const addAircraft = (input: AddAircraftInput) => {
    const registration = normalize(input.registration);
    const make = normalize(input.make);
    const model = normalize(input.model);
    const variant = normalize(input.variant);

    if (!registration) {
      return;
    }

    const makeModelVariant = [make, model, variant].filter(Boolean).join(" / ") || "N/A";

    setAircraft((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        registration: registration.toUpperCase(),
        makeModelVariant,
        hours: 0,
      },
    ]);
  };

  const value = useMemo(
    () => ({
      aircraft,
      addAircraft,
    }),
    [aircraft]
  );

  return <AircraftContext.Provider value={value}>{children}</AircraftContext.Provider>;
}

export function useAircraft() {
  const context = useContext(AircraftContext);

  if (!context) {
    throw new Error("useAircraft must be used within an AircraftProvider");
  }

  return context;
}
