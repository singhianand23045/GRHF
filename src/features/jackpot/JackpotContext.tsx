
import React, { createContext, useContext, useState, useEffect } from "react";

type JackpotContextType = {
  jackpot: number;
  baseJackpot: number;
  addToJackpot: (amount: number) => void;
  resetJackpot: () => void;
};

const LOCAL_STORAGE_KEY = "jackpot";
const BASE_JACKPOT = 1000;

const JackpotContext = createContext<JackpotContextType | undefined>(undefined);

function loadJackpotFromStorage(): number {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === "number") return parsed;
    } catch {}
  }
  return BASE_JACKPOT;
}

function saveJackpotToStorage(value: number) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
}

export function JackpotProvider({ children }: { children: React.ReactNode }) {
  const [jackpot, setJackpot] = useState<number>(() => loadJackpotFromStorage());

  useEffect(() => {
    saveJackpotToStorage(jackpot);
  }, [jackpot]);

  function addToJackpot(amount: number) {
    setJackpot((prev) => prev + amount);
  }

  function resetJackpot() {
    setJackpot(BASE_JACKPOT);
  }

  return (
    <JackpotContext.Provider
      value={{ jackpot, baseJackpot: BASE_JACKPOT, addToJackpot, resetJackpot }}
    >
      {children}
    </JackpotContext.Provider>
  );
}

export function useJackpot() {
  const ctx = useContext(JackpotContext);
  if (!ctx) throw new Error("useJackpot must be used within JackpotProvider");
  return ctx;
}
