/**
 * Generates multiple 6-number sets from a larger pool of user-selected numbers
 * based on a pre-defined wheeling system. All numbers are strictly within 1-27.
 * @param strategy The specific wheeling system to apply ('basic_7_3' or 'basic_8_4').
 * @param pool An array of numbers provided by the user (e.g., 7 or 8 numbers).
 * @returns An array of 6-number arrays.
 */
export function generateWheelingSets(
  strategy: "basic_7_3" | "basic_8_4",
  pool: number[]
): number[][] {
  // Filter pool to ensure numbers are within 1-27 range
  const validPool = pool.filter(n => n >= 1 && n <= 27);

  if (strategy === "basic_7_3") {
    // Basic 7-number wheel, guarantees 3 if 3 hit. Requires 7 numbers.
    if (validPool.length !== 7) {
      console.warn("Basic 7-3 wheeling requires exactly 7 numbers in the pool.");
      return [];
    }
    const [n1, n2, n3, n4, n5, n6, n7] = validPool.sort((a, b) => a - b);
    return [
      [n1, n2, n3, n4, n5, n6],
      [n1, n2, n3, n4, n5, n7],
      [n1, n2, n3, n4, n6, n7],
      [n1, n2, n3, n5, n6, n7],
      [n1, n2, n4, n5, n6, n7],
      [n1, n3, n4, n5, n6, n7],
      [n2, n3, n4, n5, n6, n7],
    ];
  } else if (strategy === "basic_8_4") {
    // Basic 8-number wheel, guarantees 4 if 4 hit. Requires 8 numbers.
    if (validPool.length !== 8) {
      console.warn("Basic 8-4 wheeling requires exactly 8 numbers in the pool.");
      return [];
    }
    const [n1, n2, n3, n4, n5, n6, n7, n8] = validPool.sort((a, b) => a - b);
    return [
      [n1, n2, n3, n4, n5, n6],
      [n1, n2, n3, n4, n7, n8],
      [n1, n2, n5, n6, n7, n8],
      [n3, n4, n5, n6, n7, n8],
    ];
  }
  return [];
}