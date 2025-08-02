import { EntryType } from "@/features/wallet/WalletContext";
import { DrawHistoryEntry } from "@/features/draw/DrawHistoryContext";

/**
 * Analyzes the player's past entries and draw results to identify personal patterns,
 * "near misses," or numbers that have historically performed well (or poorly)
 * in conjunction with their picks. Generates a new 6-number set based on these insights.
 * All numbers are strictly within 1-27.
 * @param walletHistory The user's past lottery entries.
 * @param drawHistory The historical draw results.
 * @returns A single array of 6 numbers.
 */
export function analyzeUserPerformance(
  walletHistory: EntryType[],
  drawHistory: DrawHistoryEntry[]
): number[] {
  if (walletHistory.length === 0 || drawHistory.length === 0) {
    // Fallback to a balanced random set if no history
    const allNumbers = Array.from({ length: 27 }, (_, i) => i + 1);
    return allNumbers.sort(() => 0.5 - Math.random()).slice(0, 6).sort((a, b) => a - b);
  }

  const numberFrequency = new Map<number, number>();
  const nearMissNumbers: number[] = [];

  // Analyze user's past picks and their performance
  walletHistory.forEach(entry => {
    const correspondingDraw = drawHistory.find(d => d.cycle === entry.cycle);
    if (correspondingDraw) {
      const matches = entry.numbers.filter(n => correspondingDraw.winningNumbers.includes(n));
      const nonMatches = entry.numbers.filter(n => !correspondingDraw.winningNumbers.includes(n));

      // For numbers that matched, increase their "hotness"
      matches.forEach(num => numberFrequency.set(num, (numberFrequency.get(num) || 0) + 2)); // Give more weight to matches

      // For near misses (e.g., 4 or 5 matches), consider the non-matching numbers from the user's pick
      if (entry.matches >= 4 && entry.matches < 6) {
        nonMatches.forEach(num => nearMissNumbers.push(num));
      }
    }
  });

  // Also consider numbers that frequently appeared in winning draws
  drawHistory.forEach(draw => {
    draw.winningNumbers.forEach(num => {
      numberFrequency.set(num, (numberFrequency.get(num) || 0) + 1);
    });
  });

  // Combine and sort numbers by frequency, prioritizing near-misses if available
  const candidateNumbers: number[] = [];
  const uniqueNearMisses = Array.from(new Set(nearMissNumbers)).filter(n => n >= 1 && n <= 27);

  // Prioritize unique near-misses first
  if (uniqueNearMisses.length > 0) {
    candidateNumbers.push(...uniqueNearMisses);
  }

  // Add other numbers based on frequency, ensuring uniqueness and range
  const sortedByFrequency = Array.from(numberFrequency.entries())
    .sort(([, freqA], [, freqB]) => freqB - freqA)
    .map(([num]) => num)
    .filter(n => n >= 1 && n <= 27);

  for (const num of sortedByFrequency) {
    if (!candidateNumbers.includes(num)) {
      candidateNumbers.push(num);
    }
  }

  // If we still don't have enough numbers, fill with random unique numbers
  const allNumbers = Array.from({ length: 27 }, (_, i) => i + 1);
  const remainingNumbers = allNumbers.filter(num => !candidateNumbers.includes(num));
  const shuffledRemaining = remainingNumbers.sort(() => 0.5 - Math.random());

  while (candidateNumbers.length < 6 && shuffledRemaining.length > 0) {
    candidateNumbers.push(shuffledRemaining.shift()!);
  }

  // Ensure exactly 6 numbers and sort them
  return candidateNumbers.slice(0, 6).sort((a, b) => a - b);
}