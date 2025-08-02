
/**
 * Returns the credit payout based on numbers matched.
 * 6: 1000, 5: 100, 4: 40, 3: 20, 2: 10, else 0.
 */
export function getCreditsForMatches(matches: number): number {
  switch (matches) {
    case 6: return 1000;
    case 5: return 100;
    case 4: return 40;
    case 3: return 20;
    case 2: return 10;
    default: return 0;
  }
}
