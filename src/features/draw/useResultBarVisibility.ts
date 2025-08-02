
import { useEffect } from "react";

/**
 * Ensures ResultBar is always hidden/cleared on phase changes and resets.
 */
type Args = {
  state: string;
  cycleIndex: number;
  resultBar: { show: boolean; credits: number | null };
  hideResultBar: () => void;
};

// Only hide the result bar if we have left the REVEAL state.
export function useResultBarVisibility({
  state,
  cycleIndex,
  resultBar,
  hideResultBar
}: Args) {
  useEffect(() => {
    // Hide only if not in REVEAL (don't double hide on cycle change alone)
    if (state !== "REVEAL" && resultBar.show) {
      hideResultBar();
    }
    // eslint-disable-next-line
  }, [state /* intentionally removed cycleIndex from deps */]);
}
