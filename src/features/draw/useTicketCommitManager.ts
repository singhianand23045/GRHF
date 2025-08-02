import { useRef, useEffect } from "react";
import { useWallet } from "../wallet/WalletContext";
import { useNumberSelection } from "../number-select/NumberSelectionContext";

export function useTicketCommitManager(
  cycleIndex: number,
  sets: number[][],
  SETS_PER_CYCLE: number,
  SET_SIZE: number,
  state: string,
  lastPickedPerCycle: { [cycle: number]: number[] },
  picked: number[],
  incrementEntryCountForCycle: (cycle: number, debugSource?: string) => void
) {
  const wallet = useWallet();
  const { isCurrentSelectionLocked, confirmedCycle } = useNumberSelection(); // Updated from isConfirmed
  const entryCommittedCycle = useRef<number | null>(null); // Renamed from ticketCommittedCycle

  // pendingEntryRef: helper to track entry to be entered post-reveal
  const pendingEntryRef = useRef<{
    cycle: number;
    entry: { date: string; numbers: number[] };
    entered: boolean;
  } | null>(null); // Renamed from pendingTicketRef

  // Track the last entry committed to prevent duplicates
  const lastCommittedEntry = useRef<{ cycle: number; numbers: string } | null>(null); // Renamed from lastCommittedTicket

  // Track whether we've committed an entry for this cycle to avoid duplicates (extra defense).
  useEffect(() => {
    // Reset on new cycle
    entryCommittedCycle.current = null;
    pendingEntryRef.current = null;
    lastCommittedEntry.current = null;
  }, [cycleIndex]);

  useEffect(() => {
    // More robust logic: commit if we have 6 numbers confirmed for this cycle and haven't already committed
    const numbersKey = picked.slice().sort((a, b) => a - b).join(',');
    const hasAlreadyCommitted = lastCommittedEntry.current?.cycle === cycleIndex && 
                               lastCommittedEntry.current?.numbers === numbersKey;

    if (
      picked.length === 6 &&
      isCurrentSelectionLocked && // Updated from isConfirmed
      confirmedCycle === cycleIndex &&
      entryCommittedCycle.current !== cycleIndex &&
      !hasAlreadyCommitted
    ) {
      // Commit entry and deduct credits - SET THE CYCLE PROPERTY
      wallet.addConfirmedEntry({ // Updated from addConfirmedTicket
        date: new Date().toISOString(),
        numbers: picked.slice(),
        cycle: cycleIndex, // Ensure cycle is set for proper matching
      });
      entryCommittedCycle.current = cycleIndex;
      lastCommittedEntry.current = { cycle: cycleIndex, numbers: numbersKey };

      // Store pending entry for prize awarding (as before)
      pendingEntryRef.current = {
        cycle: cycleIndex,
        entry: { // Updated from ticket
          date: new Date().toISOString(),
          numbers: picked.slice(),
        },
        entered: true, // entry was entered for this cycle
      };
      console.log("[useTicketCommitManager] Confirmed entry and deducted credits for cycle", cycleIndex, picked);
    }

    // If not confirmed, reset pending entry if present & not for the current cycle
    if (
      (!isCurrentSelectionLocked || picked.length !== 6) && // Updated from !isConfirmed
      pendingEntryRef.current && pendingEntryRef.current.cycle !== cycleIndex
    ) {
      pendingEntryRef.current = null;
    }
  }, [picked, isCurrentSelectionLocked, confirmedCycle, cycleIndex, wallet]); // Updated dependencies

  return {
    entryCommittedCycle, // Renamed
    pendingEntryRef, // Renamed
  };
}