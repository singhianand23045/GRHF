
import { getCreditsForMatches } from "./getCreditsForMatches";

/**
 * Pure logic for evaluating a user's ticket against drawn rows.
 *
 * @param userNumbers - The 6 numbers picked by the user.
 * @param drawnRows - Array of rows (each 6 numbers) for this draw cycle.
 * @param jackpotAmount - The current jackpot amount to pay if there's a jackpot win.
 * @returns Result object indicating if the jackpot was won, the winnings for each row, total winnings, and result type.
 */
export function calculateWinnings(
  userNumbers: number[],
  drawnRows: number[][],
  jackpotAmount: number
): {
  jackpotWon: boolean;
  rowWinnings: number[];
  totalWinnings: number;
  resultType: "jackpot" | "credits" | "none";
} {
  let jackpotWon = false;
  let rowWinnings: number[] = [0, 0, 0];

  // Validate correct input shape
  if (!userNumbers || userNumbers.length !== 6) {
    return {
      jackpotWon: false,
      rowWinnings,
      totalWinnings: 0,
      resultType: "none",
    };
  }

  // Row-wise matching for "rowWinnings"
  for (let i = 0; i < drawnRows.length; i++) {
    const drawnRow = drawnRows[i];
    const matches = drawnRow.filter((n) => userNumbers.includes(n)).length;
    if (matches === 6) jackpotWon = true;
    rowWinnings[i] = getCreditsForMatches(matches);
  }

  let totalWinnings = 0;
  let resultType: "jackpot" | "credits" | "none" = "none";

  if (jackpotWon) {
    totalWinnings = jackpotAmount;
    resultType = "jackpot";
    // If jackpot won, ignore regular row winnings (Phase5 rule)
    rowWinnings = [0, 0, 0];
  } else {
    totalWinnings = rowWinnings.reduce((sum, w) => sum + w, 0);
    if (totalWinnings > 0) {
      resultType = "credits";
    }
  }

  return {
    jackpotWon,
    rowWinnings,
    totalWinnings,
    resultType,
  };
}
