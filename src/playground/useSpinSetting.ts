
import { useRef, useEffect } from "react";

/**
 * Custom hook that handles swipe gestures for spin setting.
 * Returns ref callback, and current spinSetting, and a setter.
 */
export function useSpinSetting(
  reveal: boolean,
  setSpinSetting: (cb: (prev: number) => number) => void
) {
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 30;

  // Valid spin settings in order: left fastest, left fast, left slow, right slow, right fast, right fastest
  const SPIN_LEVELS = [-3, -2, -1, 1, 2, 3];

  function attachSwipeHandlers(grid: HTMLDivElement | null) {
    if (!grid) return;

    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      touchStartX.current = e.touches[0].clientX;
    }
    function handleTouchEnd(e: TouchEvent) {
      if (touchStartX.current === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const dx = touchEndX - touchStartX.current;
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        setSpinSetting((prev) => {
          const idx = SPIN_LEVELS.indexOf(prev);
          if (dx < 0) {
            // swipe left → go one step to the left (lower index)
            if (idx > 0) return SPIN_LEVELS[idx - 1];
            return prev; // At leftmost, do nothing
          } else {
            // swipe right → go one step to the right (higher index)
            if (idx < SPIN_LEVELS.length - 1) return SPIN_LEVELS[idx + 1];
            return prev; // At rightmost, do nothing
          }
        });
      }
      touchStartX.current = null;
    }
    grid.addEventListener("touchstart", handleTouchStart);
    grid.addEventListener("touchend", handleTouchEnd);

    return () => {
      grid.removeEventListener("touchstart", handleTouchStart);
      grid.removeEventListener("touchend", handleTouchEnd);
    };
  }

  useEffect(() => {
    // No-op placeholder for now. The hook is entirely "imperative" for the time being.
  }, [reveal]);

  return { attachSwipeHandlers };
}

