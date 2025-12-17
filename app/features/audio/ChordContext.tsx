'use client';

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface ChordContextValue {
  evaluatedChord: ChordValue | null;
  setEvaluatedChord: (value: ChordValue | null) => void;
}

export interface ChordValue {
  value: string;
  version: string;
}


const ChordContext = createContext<ChordContextValue | undefined>(undefined);

interface ChordProviderProps {
  children: ReactNode;
}

export const ChordProvider: React.FC<ChordProviderProps> = ({ children }) => {
  const [evaluatedChord, setEvaluatedChord] = useState<ChordValue | null>(null);

  const value: ChordContextValue = {
    evaluatedChord,
    setEvaluatedChord,
  };

  return (
    <ChordContext.Provider value={value}>
      {children}
    </ChordContext.Provider>
  );
};

export function useChord(): ChordContextValue {
  const context = useContext(ChordContext);
 
  if (!context) {
    throw new Error("useChord must be used inside a ChordProvider");
  }

  return context;
}
