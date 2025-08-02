import { useEffect, useRef } from "react";
import { calculateWinnings } from "./calculateWinnings";
import { useDrawHistory } from "./DrawHistoryContext";

/*
 * Handles awarding prizes and triggering result bar after reveal.
 * Does NOT show warnings—silently skips if userNumbers isn't exactly 6.
 * PHASE 5: User either wins jackpot OR regular credits (not both).
 */
type UseDrawPrizesArgs = {
  isRevealDone: boolean;
  cycleIndex: number;
  sets: number[][];
  SETS_PER_CYCLE: number;
  SET_SIZE: number;
  lastPickedPerCycle: { [cycle: number]: number[] };
  picked: number[];
  wallet: any;
  jackpotContext: any;
  cleanupResultBarTimeout: () => void;
  pendingEntryRef: React.MutableRefObject<{ // Renamed from pendingTicketRef
    cycle: number;
    entry: { date: string; numbers: number[] }; // Renamed from ticket
    entered: boolean;
  } | null>;
  revealStartedForCycle: React.MutableRefObject<number | null>; // New parameter
  confirmedPicksSets: number[][]; // Renamed from confirmedTickets
};

export function useDrawPrizes({
  isRevealDone,
  cycleIndex,
  sets,
  SETS_PER_CYCLE,
  lastPickedPerCycle,
  picked,
  wallet,
  jackpotContext,
  cleanupResultBarTimeout,
  pendingEntryRef, // Renamed
  revealStartedForCycle, // New parameter
  confirmedPicksSets // Renamed
}: UseDrawPrizesArgs) {
  const resultAwardedForCycle = useRef<number | null>(null);
  const { addDrawResult } = useDrawHistory();

  // Reset resultAwardedForCycle when cycle changes
  useEffect(() => {
    resultAwardedForCycle.current = null;
  }, [cycleIndex]);

  useEffect(() => {
    if (
      isRevealDone &&
      revealStartedForCycle.current === cycleIndex && // Ensure reveal really started for this cycle
      cycleIndex !== null &&
      resultAwardedForCycle.current !== cycleIndex
    ) {
      resultAwardedForCycle.current = cycleIndex;

      const startSet = cycleIndex * SETS_PER_CYCLE;
      const activeSets = sets.slice(startSet, startSet + SETS_PER_CYCLE);

      let totalWinningsAcrossAllEntries = 0; // Renamed
      let anyJackpotWon = false;

      // Iterate through all confirmed pick sets for this cycle to calculate overall winnings for history
      confirmedPicksSets.forEach((userNumbers, pickSetIndex) => { // Renamed
        // Ensure the pick set is valid (6 numbers)
        if (userNumbers.length !== 6) {
          console.warn(`[Prize] Pick Set ${pickSetIndex + 1} is invalid (not 6 numbers). Skipping.`); // Renamed
          return;
        }

        const { jackpotWon, totalWinnings } =
          calculateWinnings(userNumbers, activeSets, jackpotContext.jackpot);

        if (jackpotWon) {
          anyJackpotWon = true;
          totalWinningsAcrossAllEntries += jackpotContext.jackpot; // Add jackpot amount
        } else {
          totalWinningsAcrossAllEntries += totalWinnings; // Add regular winnings
        }
      });

      // Record draw result in history (consolidated for the cycle)
      const winningNumbers = activeSets.flat();
      addDrawResult({
        cycle: cycleIndex,
        winningNumbers,
        jackpotWon: anyJackpotWon,
        totalWinnings: totalWinningsAcrossAllEntries
      });

      // Wallet crediting is now handled by useRevealAnimation for each pick set message.
      // No need to call wallet.awardEntryWinnings here.
    }
    // eslint-disable-next-line
  }, [
    isRevealDone,
    cycleIndex,
    sets,
    wallet, // Still needed for history lookup in useRevealAnimation
    jackpotContext,
    lastPickedPerCycle,
    pendingEntryRef, // Renamed
    SETS_PER_CYCLE,
    cleanupResultBarTimeout,
    revealStartedForCycle,
    confirmedPicksSets // Renamed
  ]);
}