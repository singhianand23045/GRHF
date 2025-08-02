import React, { createContext, useContext, useEffect, useState } from "react";

export type DrawHistoryEntry = {
  cycle: number;
  date: string;
  winningNumbers: number[];
  jackpotWon: boolean;
  totalWinnings: number;
};

type DrawHistoryContextType = {
  drawHistory: DrawHistoryEntry[];
  addDrawResult: (entry: Omit<DrawHistoryEntry, "date">) => void;
  clearHistory: () => void;
  getHotNumbers: (count?: number) => number[];
  getColdNumbers: (count?: number) => number[];
  getRecentPatterns: () => string;
};

const DRAW_HISTORY_KEY = "drawHistory";
const DrawHistoryContext = createContext<DrawHistoryContextType | undefined>(undefined);

export function DrawHistoryProvider({ children }: { children: React.ReactNode }) {
  const [drawHistory, setDrawHistory] = useState<DrawHistoryEntry[]>(() => {
    const saved = localStorage.getItem(DRAW_HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Persist to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem(DRAW_HISTORY_KEY, JSON.stringify(drawHistory));
  }, [drawHistory]);

  const addDrawResult = (entry: Omit<DrawHistoryEntry, "date">) => {
    const newEntry: DrawHistoryEntry = {
      ...entry,
      date: new Date().toISOString(),
    };
    setDrawHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50 draws
    console.log("[DrawHistory] Added draw result:", newEntry);
  };

  const clearHistory = () => {
    setDrawHistory([]);
    localStorage.removeItem(DRAW_HISTORY_KEY);
  };

  // Analyze hot numbers (most frequently drawn)
  const getHotNumbers = (count = 6) => {
    const frequency: { [key: number]: number } = {};
    
    drawHistory.forEach(draw => {
      draw.winningNumbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
      });
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([num]) => parseInt(num));
  };

  // Analyze cold numbers (least frequently drawn)
  const getColdNumbers = (count = 6) => {
    const frequency: { [key: number]: number } = {};
    
    // Initialize all numbers 1-27 with frequency 0
    for (let i = 1; i <= 27; i++) {
      frequency[i] = 0;
    }

    drawHistory.forEach(draw => {
      draw.winningNumbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
      });
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => a - b)
      .slice(0, count)
      .map(([num]) => parseInt(num));
  };

  // Get patterns from recent draws
  const getRecentPatterns = () => {
    if (drawHistory.length === 0) return "No draws yet";
    
    const recent = drawHistory.slice(0, 5);
    const patterns = recent.map(draw => 
      `Cycle ${draw.cycle}: ${draw.winningNumbers.slice(0, 6).sort((a, b) => a - b).join(", ")}`
    );
    
    return patterns.join("\n");
  };

  return (
    <DrawHistoryContext.Provider value={{
      drawHistory,
      addDrawResult,
      clearHistory,
      getHotNumbers,
      getColdNumbers,
      getRecentPatterns
    }}>
      {children}
    </DrawHistoryContext.Provider>
  );
}

export function useDrawHistory() {
  const ctx = useContext(DrawHistoryContext);
  if (!ctx) throw new Error("useDrawHistory must be used within DrawHistoryProvider");
  return ctx;
}