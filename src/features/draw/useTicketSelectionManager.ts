
import { useEffect, useRef } from "react";
import { useNumberSelection } from "../number-select/NumberSelectionContext";

/**
 * Tracks last picked numbers per cycle.
 * Only stores numbers when they are confirmed, preventing unconfirmed picks from incrementing jackpot.
 */
export function useTicketSelectionManager(cycleIndex: number) {
  const { picked, isConfirmed } = useNumberSelection();

  // Cache last picked numbers per cycle (persists across rerenders)
  const lastPickedPerCycle = useRef<{ [cycle: number]: number[] }>({});

  // Clear cache when new game starts (cycleIndex resets to 0)
  useEffect(() => {
    if (cycleIndex === 0) {
      lastPickedPerCycle.current = {};
      console.log("[useTicketSelectionManager] Cleared cache for new game");
    }
  }, [cycleIndex]);

  // When picked numbers update AND are confirmed, record them for the current cycle
  useEffect(() => {
    if (picked && picked.length === 6 && isConfirmed) {
      lastPickedPerCycle.current[cycleIndex] = picked.slice();
      console.log(`[useTicketSelectionManager] Stored confirmed numbers for cycle ${cycleIndex}:`, picked);
    }
  }, [picked, isConfirmed, cycleIndex]);

  // On cycle change, capture/transfer previous cycle's picks if still valid for jackpot
  useEffect(() => {
    if (cycleIndex > 0) {
      const prevCycle = cycleIndex - 1;
      // If no valid entry exists for prevCycle, but current selection is confirmed and valid, set it
      if (
        !lastPickedPerCycle.current[prevCycle] ||
        lastPickedPerCycle.current[prevCycle].length !== 6
      ) {
        // Try to use current cycle picks only if they are confirmed
        if (picked && picked.length === 6 && isConfirmed) {
          lastPickedPerCycle.current[prevCycle] = picked.slice();
          console.log(
            `[useTicketSelectionManager] Copied confirmed numbers for prevCycle ${prevCycle} on cycle change:`,
            lastPickedPerCycle.current[prevCycle]
          );
        }
      }
    }
  }, [cycleIndex, picked, isConfirmed]);

  return {
    lastPickedPerCycle: lastPickedPerCycle.current,
    picked,
  };
}
