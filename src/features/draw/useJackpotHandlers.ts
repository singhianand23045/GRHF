import { useEffect, useRef } from "react";
import { useJackpot } from "../jackpot/JackpotContext";
import { useWallet } from "../wallet/WalletContext"; // Import useWallet

/**
 * Handles increment/reset of jackpot based on confirmed entry per cycle entry.
 * The jackpot increments (for the PREVIOUS cycle) ONLY after the timer hits 0:00 and advances,
 * i.e., when cycleIndex increments.
 */
export function useJackpotHandlers(
  cycleIndex: number,
  // lastPickedPerCycle is no longer directly used for jackpot increment logic
  // but kept in signature for compatibility if other parts rely on it.
  // The actual check will be against wallet.history.
  lastPickedPerCycle: { [cycle: number]: number[] } 
) {
  const jackpotContext = useJackpot();
  const wallet = useWallet(); // Get wallet context
  const incrementedCycles = useRef<Set<number>>(new Set());
  const prevCycleIndex = useRef<number>(cycleIndex); // INIT to current

  // On new demo/game OR mount, clear tracking and reset prevCycleIndex to cycleIndex
  useEffect(() => {
    if (cycleIndex === 0) {
      incrementedCycles.current.clear();
      prevCycleIndex.current = 0;
      console.log("[useJackpotHandlers] cycleIndex 0, resetting for new demo/game.");
      // No need to continue; don't run increment logic on reset
      return;
    }

    console.log("[useJackpotHandlers] --- DEBUG CYCLE ---");
    console.log(`[useJackpotHandlers] cycleIndex now: ${cycleIndex}, prevCycleIndex: ${prevCycleIndex.current}`);
    // console.log("[useJackpotHandlers] lastPickedPerCycle snapshot:", JSON.stringify(lastPickedPerCycle)); // No longer directly relevant for jackpot increment

    // Detect AND handle real cycle transitions (from N to N+1)
    if (cycleIndex === prevCycleIndex.current + 1) {
      const prevCycle = cycleIndex - 1;
      
      // Check if any entry was confirmed for the previous cycle
      const hadAnyValidEntryInPrevCycle = wallet.history.some(
        entry => entry.cycle === prevCycle && entry.numbers.length === 6
      );

      console.log(`[useJackpotHandlers] cycle advanced: previous cycle was ${prevCycle}.`);
      console.log(`[useJackpotHandlers] Had any valid entry in prevCycle ${prevCycle}? ${hadAnyValidEntryInPrevCycle}`);
      console.log(`[useJackpotHandlers] Jackpot already incremented for prevCycle? ${incrementedCycles.current.has(prevCycle)}`);

      // Only increment jackpot ONCE per prevCycle if there was at least one valid entry
      if (hadAnyValidEntryInPrevCycle && !incrementedCycles.current.has(prevCycle)) {
        console.log(`[useJackpotHandlers] Adding $1 to jackpot for previous cycle ${prevCycle}`);
        jackpotContext.addToJackpot(1);
        incrementedCycles.current.add(prevCycle);
      } else if (!hadAnyValidEntryInPrevCycle) {
        console.log(`[useJackpotHandlers] No valid entries for prevCycle ${prevCycle}. Jackpot not incremented.`);
      } else if (incrementedCycles.current.has(prevCycle)) {
        console.log(`[useJackpotHandlers] Jackpot already incremented for prevCycle ${prevCycle}. No action taken.`);
      }
    } else {
      // Either initial mount or not a cycle transition
      console.log("[useJackpotHandlers] Not a cycle transition or first render; no jackpot check.");
    }

    prevCycleIndex.current = cycleIndex;
    // eslint-disable-next-line
  }, [cycleIndex, jackpotContext, wallet.history]); // Add wallet.history to dependencies
}