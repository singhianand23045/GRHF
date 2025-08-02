// Lotto draw game constants, centralized.

export const SETS_COUNT = 18; // 6 cycles × 3 sets per cycle
export const SET_SIZE = 6;
export const SETS_PER_CYCLE = 3; // 18 numbers (3x6) per cycle

// Reveal animation config (used in DrawEngineContext)
export const REVEAL_TOTAL_NUMBERS = SETS_PER_CYCLE * SET_SIZE; // e.g. 18
export const REVEAL_DURATION_SEC = 9; // Changed from 18 to 9 for 0.5s per number reveal
export const REVEAL_PER_NUMBER_SEC = REVEAL_DURATION_SEC / REVEAL_TOTAL_NUMBERS; // 0.5s per number