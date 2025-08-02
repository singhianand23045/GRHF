
import { SETS_COUNT } from './drawConstants';

/**
 * Generates sets of 6 unique numbers from 1 to 27 for draws.
 * Numbers are unique within a set, but can appear in multiple sets.
 * @returns number[][]
 */
export function generateDrawSets(): number[][] {
  const max = 27;
  const setSize = 6;
  const sets = SETS_COUNT;

  function getUniqueSet() {
    const pool = Array.from({ length: max }, (_, i) => i + 1);
    // Shuffle pool using Fisher-Yates + crypto
    for (let i = pool.length - 1; i > 0; i--) {
      const randArr = new Uint32Array(1);
      window.crypto.getRandomValues(randArr);
      const j = randArr[0] % (i + 1);
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, setSize);
  }

  const result: number[][] = [];
  for (let i = 0; i < sets; i++) {
    result.push(getUniqueSet());
  }
  return result;
}
