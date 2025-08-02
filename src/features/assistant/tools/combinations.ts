import { DrawHistoryEntry } from "@/features/draw/DrawHistoryContext";

/**
 * Generates all unique combinations (pairs or triplets) from a given array of numbers.
 */
function getCombinations(arr: number[], k: number): number[][] {
  const result: number[][] = [];
  function backtrack(start: number, currentCombination: number[]) {
    if (currentCombination.length === k) {
      result.push([...currentCombination]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      currentCombination.push(arr[i]);
      backtrack(i + 1, currentCombination);
      currentCombination.pop();
    }
  }
  backtrack(0, []);
  return result;
}

/**
 * Identifies numbers that have frequently appeared together ("hot pairs/triplets")
 * or have been absent for a long time ("cold pairs/triplets") in recent draw history.
 * All numbers are strictly within 1-27.
 * @param drawHistory The historical draw results.
 * @param type Specifies whether to find 'pair' or 'triplet' combinations.
 * @param status Specifies whether to find 'hot' (most frequent) or 'cold' (least frequent/overdue) combinations.
 * @param count The number of top combinations to return.
 * @returns An array of number arrays, where each inner array represents a combination.
 */
export function getFrequentCombinations(
  drawHistory: DrawHistoryEntry[],
  type: "pair" | "triplet",
  status: "hot" | "cold",
  count: number = 5
): number[][] {
  const k = type === "pair" ? 2 : 3;
  const combinationCounts = new Map<string, number>();
  const allPossibleNumbers = Array.from({ length: 27 }, (_, i) => i + 1);

  // Initialize all possible combinations with 0 frequency
  const allCombinations = getCombinations(allPossibleNumbers, k);
  allCombinations.forEach(combo => {
    combinationCounts.set(combo.sort((a, b) => a - b).join(","), 0);
  });

  drawHistory.forEach((draw) => {
    const drawNumbers = draw.winningNumbers.filter(n => n >= 1 && n <= 27); // Ensure numbers are in range
    const combinationsInDraw = getCombinations(drawNumbers, k);
    combinationsInDraw.forEach((combo) => {
      const key = combo.sort((a, b) => a - b).join(",");
      combinationCounts.set(key, (combinationCounts.get(key) || 0) + 1);
    });
  });

  const sortedCombinations = Array.from(combinationCounts.entries()).sort(
    ([, freqA], [, freqB]) => (status === "hot" ? freqB - freqA : freqA - freqB)
  );

  return sortedCombinations
    .slice(0, count)
    .map(([key]) => key.split(",").map(Number));
}