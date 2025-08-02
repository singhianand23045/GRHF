import { useRef, useState, useEffect } from "react";
import { REVEAL_PER_NUMBER_SEC, SETS_PER_CYCLE, SET_SIZE } from "./drawConstants";
import { calculateWinnings } from "./calculateWinnings"; // Import calculateWinnings
import { getCreditsForMatches } from "./getCreditsForMatches"; // Import getCreditsForMatches

// Define the structure for a revealed number with its highlight status
type RevealedNumber = {
  number: number;
  highlightMatches: {
    pickSet1?: boolean; // Renamed from ticket1
    pickSet2?: boolean; // Renamed from ticket2
    pickSet3?: boolean; // Renamed from ticket3
  };
};

/**
 * Animates reveal of numbers, now in per-row order:
 * - For each row, reveal all numbers that are matches first, then non-matches, then next row.
 * @param sets - All 6x6 drawn numbers
 * @param SETS_PER_CYCLE - How many sets (rows) per draw
 * @param SET_SIZE - Size of each set (row)
 * @param confirmedPicksSets - All confirmed pick sets by the user (array of number arrays)
 * @param cycleIndex - Current cycle index to reset state on cycle changes
 * @param showResultBar - Function to show the result bar message
 * @param hideResultBar - Function to hide the result bar message
 * @param wallet - Wallet context for accessing history and balance
 * @param jackpotContext - Jackpot context for jackpot amount
 */
export function useRevealAnimation(
  sets: number[][],
  SETS_PER_CYCLE: number,
  SET_SIZE: number,
  confirmedPicksSets: number[][], // Renamed from confirmedTickets
  cycleIndex: number,
  showResultBar: (credits: number | null, message?: string, duration?: number) => void,
  hideResultBar: () => void,
  wallet: any, // Passed from DrawEngineContext
  jackpotContext: any // Passed from DrawEngineContext
) {
  const [drawnNumbers, setDrawnNumbers] = useState<RevealedNumber[]>([]);
  const [isRevealDone, setIsRevealDone] = useState(false);
  const revealTimeouts = useRef<NodeJS.Timeout[]>([]);
  const highlightTimeouts = useRef<NodeJS.Timeout[]>([]);
  const messageTimeouts = useRef<NodeJS.Timeout[]>([]); // New for message scheduling
  const revealStartedForCycle = useRef<number | null>(null);

  const REVEAL_TOTAL_NUMBERS = SETS_PER_CYCLE * SET_SIZE;

  // PHASE 9: Highlight overlay timings (relative to REVEAL start at 0:45)
  // Pick Set 1 Message: 0:35 - 0:33 (2 seconds) -> 10s from 0:45 start
  // Pick Set 2 Highlight: 0:32 - 0:26 (6 seconds) -> 13s from 0:45 start, ends 19s from 0:45 start
  // Pick Set 2 Message: 0:25 - 0:23 (2 seconds) -> 20s from 0:45 start
  // Pick Set 3 Highlight: 0:22 - 0:16 (6 seconds) -> 23s from 0:45 start, ends 29s from 0:45 start
  // Pick Set 3 Message: 0:15 - 0:13 (2 seconds) -> 30s from 0:45 start
  // Final Result Message: 0:12 - 0:02 (10 seconds) -> 33s from 0:45 start

  const PICKSET1_MESSAGE_START_MS = 10 * 1000;
  const PICKSET1_MESSAGE_DURATION_MS = 2 * 1000;

  const PICKSET2_HIGHLIGHT_START_MS = 13 * 1000;
  const PICKSET2_MESSAGE_START_MS = 20 * 1000;
  const PICKSET2_MESSAGE_DURATION_MS = 2 * 1000;

  const PICKSET3_HIGHLIGHT_START_MS = 23 * 1000;
  const PICKSET3_MESSAGE_START_MS = 30 * 1000;
  const PICKSET3_MESSAGE_DURATION_MS = 2 * 1000;

  const FINAL_MESSAGE_START_MS = 33 * 1000;
  const FINAL_MESSAGE_DURATION_MS = 10 * 1000;

  // Interval for sequential highlighting (6 seconds / 18 numbers)
  const SEQUENTIAL_HIGHLIGHT_INTERVAL_MS = 6000 / REVEAL_TOTAL_NUMBERS;

  // Reset reveal state when cycle changes to prevent premature prize awarding
  useEffect(() => {
    setIsRevealDone(false);
    setDrawnNumbers([]);
    revealStartedForCycle.current = null;
    cleanupRevealTimeouts(); // Clear all pending timeouts
  }, [cycleIndex]);

  // Helper: return the correct reveal sequence per requirements
  function buildRevealSequence(setsForDraw: number[][], firstPickSetNumbers: number[]): number[] { // Renamed ticket1Numbers
    if (!firstPickSetNumbers || firstPickSetNumbers.length !== 6) {
      // fallback: flat in order
      return setsForDraw.flat();
    }
    const revealSeq: number[] = [];
    for (const row of setsForDraw) {
      // Matches first
      const matches = row.filter((n) => firstPickSetNumbers.includes(n));
      const rest = row.filter((n) => !firstPickSetNumbers.includes(n));
      revealSeq.push(...matches, ...rest);
    }
    return revealSeq;
  }

  function startReveal(cycle: number) {
    cleanupRevealTimeouts(); // Clear all previous timeouts

    const startSet = cycle * SETS_PER_CYCLE;
    const activeSets = sets.slice(startSet, startSet + SETS_PER_CYCLE);

    // Get the first pick set's numbers for the initial reveal sequence
    const firstPickSetNumbers = confirmedPicksSets[0] || []; // Renamed
    const sequence = buildRevealSequence(activeSets, firstPickSetNumbers);

    setDrawnNumbers([]);
    setIsRevealDone(false);
    revealStartedForCycle.current = cycle;

    // Schedule number reveals
    for (let i = 0; i < sequence.length; i++) {
      revealTimeouts.current.push(
        setTimeout(() => {
          setDrawnNumbers((prev) => {
            const newDrawn = [...prev, { number: sequence[i], highlightMatches: { pickSet1: firstPickSetNumbers.includes(sequence[i]) } }]; // Renamed highlightMatches
            return newDrawn;
          });
          if (i === sequence.length - 1) {
            setIsRevealDone(true);
          }
        }, REVEAL_PER_NUMBER_SEC * 1000 * i)
      );
    }

    // --- Schedule messages and highlight overlays ---
    // Helper to calculate winnings for a specific pick set
    const getPickSetWinnings = (pickSetNumbers: number[]) => { // Renamed
      if (!pickSetNumbers || pickSetNumbers.length !== 6) {
        return { matches: 0, totalWinnings: 0, jackpotWon: false };
      }
      let totalMatches = 0;
      for (const drawnRow of activeSets) {
        totalMatches += drawnRow.filter((n) => pickSetNumbers.includes(n)).length;
      }
      const { jackpotWon, totalWinnings } = calculateWinnings(pickSetNumbers, activeSets, jackpotContext.jackpot);
      return { matches: totalMatches, totalWinnings, jackpotWon };
    };

    // Pick Set 1 Message & Crediting
    if (confirmedPicksSets.length > 0) {
      messageTimeouts.current.push(
        setTimeout(() => {
          const entry = wallet.history.find((e: any) => e.cycle === cycle && e.numbers.join(',') === confirmedPicksSets[0].join(',')); // Renamed ticket to entry
          if (entry) {
            const { matches, totalWinnings, jackpotWon } = getPickSetWinnings(confirmedPicksSets[0]); // Renamed
            const ps1Message = jackpotWon ? `Congrats! You won the jackpot of $${totalWinnings}!` : (totalWinnings > 0 ? `Congrats! You won ${totalWinnings} credits!` : (matches > 0 ? "Wait for next set!" : "No matches. Wait for next set!"));
            showResultBar(null, ps1Message, PICKSET1_MESSAGE_DURATION_MS); // Renamed
            wallet.processEntryResult(entry.id, matches, totalWinnings, jackpotWon); // Renamed processTicketResult
            if (jackpotWon) jackpotContext.resetJackpot();
          }
        }, PICKSET1_MESSAGE_START_MS) // Renamed
      );
    }

    // Pick Set 2 Highlight & Message & Crediting
    if (confirmedPicksSets.length > 1) {
      messageTimeouts.current.push(
        setTimeout(() => {
          // Apply pickSet2 highlights sequentially
          setDrawnNumbers(currentDrawn => {
            const initialDrawnState = [...currentDrawn]; // Capture current state
            currentDrawn.forEach((dn, index) => {
              if (confirmedPicksSets[1].includes(dn.number)) {
                highlightTimeouts.current.push(
                  setTimeout(() => {
                    setDrawnNumbers(prev => {
                      const updated = [...prev];
                      if (updated[index]) {
                        updated[index] = {
                          ...updated[index],
                          highlightMatches: {
                            ...updated[index].highlightMatches,
                            pickSet2: true
                          }
                        };
                      }
                      return updated;
                    });
                  }, index * SEQUENTIAL_HIGHLIGHT_INTERVAL_MS)
                );
              }
            });
            return initialDrawnState; // Return the state as it was before scheduling updates
          });
        }, PICKSET2_HIGHLIGHT_START_MS)
      );
      messageTimeouts.current.push(
        setTimeout(() => {
          const entry = wallet.history.find((e: any) => e.cycle === cycle && e.numbers.join(',') === confirmedPicksSets[1].join(',')); // Renamed ticket to entry
          if (entry) {
            const { matches, totalWinnings, jackpotWon } = getPickSetWinnings(confirmedPicksSets[1]); // Renamed
            const ps2Message = jackpotWon ? `Congrats! You won the jackpot of $${totalWinnings}!` : (totalWinnings > 0 ? `Congrats! You won ${totalWinnings} credits!` : (matches > 0 ? "Wait for next set!" : "No matches. Wait for next set!"));
            showResultBar(null, ps2Message, PICKSET2_MESSAGE_DURATION_MS); // Renamed
            wallet.processEntryResult(entry.id, matches, totalWinnings, jackpotWon); // Renamed processTicketResult
            if (jackpotWon) jackpotContext.resetJackpot();
          }
        }, PICKSET2_MESSAGE_START_MS) // Renamed
      );
    }

    // Pick Set 3 Highlight & Message & Crediting
    if (confirmedPicksSets.length > 2) {
      messageTimeouts.current.push(
        setTimeout(() => {
          // Apply pickSet3 highlights sequentially
          setDrawnNumbers(currentDrawn => {
            const initialDrawnState = [...currentDrawn]; // Capture current state
            currentDrawn.forEach((dn, index) => {
              if (confirmedPicksSets[2].includes(dn.number)) {
                highlightTimeouts.current.push(
                  setTimeout(() => {
                    setDrawnNumbers(prev => {
                      const updated = [...prev];
                      if (updated[index]) {
                        updated[index] = {
                          ...updated[index],
                          highlightMatches: {
                            ...updated[index].highlightMatches,
                            pickSet3: true
                          }
                        };
                      }
                      return updated;
                    });
                  }, index * SEQUENTIAL_HIGHLIGHT_INTERVAL_MS)
                );
              }
            });
            return initialDrawnState; // Return the state as it was before scheduling updates
          });
        }, PICKSET3_HIGHLIGHT_START_MS)
      );
      messageTimeouts.current.push(
        setTimeout(() => {
          const entry = wallet.history.find((e: any) => e.cycle === cycle && e.numbers.join(',') === confirmedPicksSets[2].join(',')); // Renamed ticket to entry
          if (entry) {
            const { matches, totalWinnings, jackpotWon } = getPickSetWinnings(confirmedPicksSets[2]); // Renamed
            const ps3Message = jackpotWon ? `Congrats! You won the jackpot of $${totalWinnings}!` : (totalWinnings > 0 ? `Congrats! You won ${totalWinnings} credits!` : (matches > 0 ? "Wait for final result!" : "No matches. Wait for final result!"));
            showResultBar(null, ps3Message, PICKSET3_MESSAGE_DURATION_MS); // Renamed
            wallet.processEntryResult(entry.id, matches, totalWinnings, jackpotWon); // Renamed processTicketResult
            if (jackpotWon) jackpotContext.resetJackpot();
          }
        }, PICKSET3_MESSAGE_START_MS) // Renamed
      );
    }

    // Final Result Message (consolidated)
    messageTimeouts.current.push(
      setTimeout(() => {
        let totalWinningsAcrossAllEntries = 0; // Renamed
        let anyJackpotWon = false;

        confirmedPicksSets.forEach(userNumbers => { // Renamed
          if (userNumbers.length === 6) {
            const { jackpotWon, totalWinnings } = calculateWinnings(userNumbers, activeSets, jackpotContext.jackpot);
            if (jackpotWon) {
              anyJackpotWon = true;
              totalWinningsAcrossAllEntries += jackpotContext.jackpot;
            } else {
              totalWinningsAcrossAllEntries += totalWinnings;
            }
          }
        });

        if (anyJackpotWon) {
          showResultBar(totalWinningsAcrossAllEntries, `Congrats! You won the jackpot of $${totalWinningsAcrossAllEntries}!`, FINAL_MESSAGE_DURATION_MS);
          jackpotContext.resetJackpot(); // Reset jackpot here if won by any pick set
        } else if (totalWinningsAcrossAllEntries > 0) {
          showResultBar(totalWinningsAcrossAllEntries, `Congrats! You won total ${totalWinningsAcrossAllEntries} credits!`, FINAL_MESSAGE_DURATION_MS);
        } else {
          showResultBar(0, "Try again. Win next time!", FINAL_MESSAGE_DURATION_MS);
        }
      }, FINAL_MESSAGE_START_MS)
    );
  }

  function instantlyFinishReveal(cycle: number) {
    cleanupRevealTimeouts(); // Clear all timeouts

    const startSet = cycle * SETS_PER_CYCLE;
    const activeSets = sets.slice(startSet, startSet + SETS_PER_CYCLE);
    const firstPickSetNumbers = confirmedPicksSets[0] || []; // Renamed
    const sequence = buildRevealSequence(activeSets, firstPickSetNumbers);

    const finalDrawnNumbers: RevealedNumber[] = sequence.map(num => {
      const highlightMatches: RevealedNumber["highlightMatches"] = { // Updated type reference
        pickSet1: confirmedPicksSets[0]?.includes(num), // Renamed
        pickSet2: confirmedPicksSets[1]?.includes(num), // Renamed
        pickSet3: confirmedPicksSets[2]?.includes(num), // Renamed
      };
      return { number: num, highlightMatches };
    });

    setDrawnNumbers(finalDrawnNumbers);
    setIsRevealDone(true);
    revealStartedForCycle.current = cycle;

    // Process all pick sets and trigger final message immediately if instantly finishing
    let totalWinningsAcrossAllEntries = 0; // Renamed
    let anyJackpotWon = false;

    confirmedPicksSets.forEach(userNumbers => { // Renamed
      if (userNumbers.length === 6) {
        const { jackpotWon, totalWinnings } = calculateWinnings(userNumbers, activeSets, jackpotContext.jackpot);
        const entry = wallet.history.find((e: any) => e.cycle === cycle && e.numbers.join(',') === userNumbers.join(',')); // Renamed ticket to entry
        if (entry) {
          wallet.processEntryResult(entry.id, 0, totalWinnings, jackpotWon); // Renamed processTicketResult
        }

        if (jackpotWon) {
          anyJackpotWon = true;
          totalWinningsAcrossAllEntries += jackpotContext.jackpot;
        } else {
          totalWinningsAcrossAllEntries += totalWinnings;
        }
      }
    });

    if (anyJackpotWon) {
      showResultBar(totalWinningsAcrossAllEntries, `Congrats! You won the jackpot of $${totalWinningsAcrossAllEntries}!`, FINAL_MESSAGE_DURATION_MS);
      jackpotContext.resetJackpot();
    } else if (totalWinningsAcrossAllEntries > 0) {
      showResultBar(totalWinningsAcrossAllEntries, `Congrats! You won total ${totalWinningsAcrossAllEntries} credits!`, FINAL_MESSAGE_DURATION_MS);
    } else {
      showResultBar(0, "Try again. Win next time!", FINAL_MESSAGE_DURATION_MS);
    }
  }

  // cleanup
  function cleanupRevealTimeouts() {
    revealTimeouts.current.forEach(clearTimeout);
    revealTimeouts.current = [];
    highlightTimeouts.current.forEach(clearTimeout);
    highlightTimeouts.current = [];
    messageTimeouts.current.forEach(clearTimeout); // Clear message timeouts
    messageTimeouts.current = [];
    hideResultBar(); // Ensure result bar is hidden on cleanup
  }

  return {
    drawnNumbers,
    isRevealDone,
    startReveal,
    instantlyFinishReveal,
    cleanupRevealTimeouts,
    revealStartedForCycle
  };
}