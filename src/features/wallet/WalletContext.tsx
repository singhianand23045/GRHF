import React, { createContext, useContext, useEffect, useState } from "react";
import { getCreditsForMatches } from "../draw/getCreditsForMatches";

export type WalletType = {
  balance: number;
  history: EntryType[];
};

export type EntryType = {
  id: string;
  date: string;
  numbers: number[];
  matches: number;
  creditChange: number;
  winnings?: number; // <-- for display only
  processed?: boolean; // <-- to track if entry has been processed for winnings
  cycle?: number; // <-- to track which cycle this entry belongs to
};

type WalletContextType = {
  balance: number;
  history: EntryType[];
  addConfirmedEntry: (entry: Omit<EntryType, "id" | "creditChange" | "matches" | "winnings" | "processed">) => void;
  processEntryResult: (entryId: string, matches: number, winnings: number, jackpotWon: boolean) => void; // Updated signature
  resetWallet: () => void;
};

const LOCAL_STORAGE_KEY = "wallet";
const STARTING_BALANCE = 200;

const WalletContext = createContext<WalletContextType | undefined>(undefined);

function saveWalletToStorage(wallet: WalletType) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wallet));
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed.balance === "number") {
          return parsed.balance;
        }
      } catch {}
    }
    return STARTING_BALANCE;
  });
  const [history, setHistory] = useState<EntryType[]>(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed.history)) {
          return parsed.history;
        }
      } catch {}
    }
    return [];
  });

  // Save wallet state when either balance or history changes
  useEffect(() => {
    saveWalletToStorage({ balance, history });
  }, [balance, history]);

  function addConfirmedEntry(entryCore: Omit<EntryType, "id" | "creditChange" | "matches" | "winnings" | "processed">) {
    const newEntry: EntryType = {
      ...entryCore,
      id: Math.random().toString(36).slice(2) + Date.now(),
      matches: 0,
      creditChange: -30, // Always -30 for entry purchase
      winnings: 0,
      processed: false, // Mark as unprocessed initially
    };
    setBalance(prev => prev - 30);
    setHistory(prev => [newEntry, ...prev]);
  }

  /**
   * Processes the result for a single entry, updates its status, and awards winnings.
   */
  function processEntryResult(entryId: string, matches: number, winnings: number, jackpotWon: boolean) {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.map(entry => {
        if (entry.id === entryId && !entry.processed) {
          const awardedAmount = jackpotWon ? winnings : winnings; // If jackpot, winnings is already jackpot amount
          setBalance(prevBal => prevBal + awardedAmount);
          return {
            ...entry,
            matches: matches,
            winnings: awardedAmount,
            processed: true,
          };
        }
        return entry;
      });
      return updatedHistory;
    });
  }

  function resetWallet() {
    setBalance(STARTING_BALANCE);
    setHistory([]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ balance: STARTING_BALANCE, history: [] }));
  }

  return (
    <WalletContext.Provider value={{ balance, history, addConfirmedEntry, processEntryResult, resetWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}