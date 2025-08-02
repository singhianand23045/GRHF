import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// PHASE 1 STATE MACHINE CONSTANTS
const LOOP_DURATION_SEC = 2 * 60; // 2 minutes
const CUT_OFF_START = 60; // 1:00 (starts at 1:00 ends at 0:46)
const CUT_OFF_END = 45; // 0:45 (ends at 0:45, reveal starts at 0:45)
const MAX_CYCLES = 6; // Changed from 2 to 6

const LOCAL_STORAGE_KEY = "draw_history"; // New for Phase 7

type TimerState = "OPEN" | "CUT_OFF" | "REVEAL" | "COMPLETE";
interface TimerContextType {
  state: TimerState;
  countdown: string; // "mm:ss"
  nextDrawTime: Date;
  cycleIndex: number;
  resetDemo: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

function getDrawHistoryFromStorage(): number[][] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function getNextDrawAppLocal(now: Date) {
  // For completeness only; not used for timer, but as a display value (could be current time + remaining seconds)
  return new Date(now.getTime() + LOOP_DURATION_SEC * 1000);
}

function formatCountdown(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  // No more alignment to any wall clock; timer is always relative to in-app state!
  const [secondsLeft, setSecondsLeft] = useState<number>(LOOP_DURATION_SEC);
  const [cycleIndex, setCycleIndex] = useState<number>(0);
  const [nextDrawTime, setNextDrawTime] = useState<Date>(() => getNextDrawAppLocal(new Date()));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derived state calculation
  let state: TimerState = "OPEN";
  if (cycleIndex >= MAX_CYCLES) state = "COMPLETE";
  else if (secondsLeft <= CUT_OFF_START && secondsLeft > CUT_OFF_END) state = "CUT_OFF";
  else if (secondsLeft <= CUT_OFF_END) state = "REVEAL";

  const resetDemo = () => {
    setSecondsLeft(LOOP_DURATION_SEC);
    setCycleIndex(0);
    setNextDrawTime(getNextDrawAppLocal(new Date()));
  };

  // add after setCycleIndex etc
  // We simulate a new draw at the end of each cycle (for demo).
  useEffect(() => {
    // At each time the cycleIndex increments (so a cycle just completed)
    if (cycleIndex === 0) return; // skip very first "pre-draw" load
    // Create a new random draw (18 numbers between 1-99)
    const draw = Array.from({ length: 18 }, () => Math.floor(Math.random() * 99) + 1);
    // Save this draw to localStorage
    const prev = getDrawHistoryFromStorage();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...prev, draw]));
    // Debug:
    console.log("[TimerProvider] Saved new draw to localStorage", draw);
  }, [cycleIndex]);

  useEffect(() => {
    if (cycleIndex >= MAX_CYCLES) return; // stop timer at demo complete

    function tick() {
      setSecondsLeft(prev => {
        if (prev > 0) return prev - 1;
        // If timer has reached zero, start next cycle if any
        // Use setTimeout to increment cycle after a brief moment
        setTimeout(() => {
          setCycleIndex(i => {
            const newIndex = i + 1;
            if (newIndex < MAX_CYCLES) {
              setSecondsLeft(LOOP_DURATION_SEC);
              setNextDrawTime(getNextDrawAppLocal(new Date()));
            }
            return newIndex;
          });
        }, 0);
        return 0;
      });
    }

    intervalRef.current = setInterval(tick, 1000); // 1 second granularity
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cycleIndex]);

  return (
    <TimerContext.Provider
      value={{
        state,
        countdown: formatCountdown(secondsLeft),
        nextDrawTime,
        cycleIndex,
        resetDemo,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
}
