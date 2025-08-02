import React, { useState, useEffect, useRef } from "react";
import Ball3D from "./Ball3D";
import { useSpinSetting } from "./useSpinSetting";

// Ball state per slot: spinning or stopped with a number
type GridBall =
  | { state: "spinning" }
  | { state: "stopped"; number: number; isUserPick: boolean };

type Props = {
  numbersToReveal?: number[];
  reveal: boolean;
  userPicks?: number[];
  onDone?: () => void;
};

const ROWS = 3;
const COLS = 6;

const SPIN_SETTINGS = [
  { label: "left fastest", direction: -1, speed: 0.22 },
  { label: "left fast", direction: -1, speed: 0.38 },
  { label: "left slow", direction: -1, speed: 0.65 },
  { label: "right slow", direction: 1, speed: 0.65 },
  { label: "right fast", direction: 1, speed: 0.38 },
  { label: "right fastest", direction: 1, speed: 0.22 },
];
// Index: 0..2 for left speeds, 3..5 for right

function getSpinConfig(spinLevel: number) {
  // spinLevel: -3..-1 for left, 1..3 for right. 0 forbidden.
  if (spinLevel < 0) return SPIN_SETTINGS[spinLevel + 3]; // -3→0, -2→1, -1→2
  if (spinLevel > 0) return SPIN_SETTINGS[spinLevel + 2];
  // fallback right slow
  return SPIN_SETTINGS[3];
}

export default function RouletteBallGrid({
  numbersToReveal = [],
  reveal,
  userPicks = [],
  onDone,
}: Props) {
  // Instead of storing spin config per ball, just track how many have been revealed
  const [revealedCount, setRevealedCount] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // -3: left fastest, -2: left fast, -1: left slow; 1: right slow, 2: right fast, 3: right fastest
  const [spinSetting, setSpinSetting] = useState(1); // Start with right slow
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Attach swipe/touch handlers
  const { attachSwipeHandlers } = useSpinSetting(reveal, setSpinSetting);

  // Reset for new round
  useEffect(() => {
    if (!reveal) {
      setRevealedCount(0);
      setSpinSetting(1);
      setAnimationComplete(false);
    }
  }, [reveal, numbersToReveal]);

  // Reveal balls one by one (increment revealedCount)
  useEffect(() => {
    if (
      reveal &&
      numbersToReveal.length === ROWS * COLS &&
      !animationComplete
    ) {
      let cancelled = false;
      let idx = 0;
      function revealNext() {
        setRevealedCount(idx + 1);
        idx++;
        if (idx < ROWS * COLS && !cancelled) {
          setTimeout(revealNext, 320);
        } else if (!cancelled) {
          setAnimationComplete(true);
          onDone?.();
        }
      }
      revealNext();
      return () => {
        cancelled = true;
      };
    }
    // eslint-disable-next-line
  }, [reveal, numbersToReveal, animationComplete]);

  const currentSpinConf = getSpinConfig(spinSetting);

  // Touch swipe handlers for the grid
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || reveal) return;
    const detach = attachSwipeHandlers(grid);
    return detach;
  }, [reveal, attachSwipeHandlers]);

  // Render balls based on revealedCount
  return (
    <div className="flex flex-col items-center w-full">
      <div className="inline-block p-2 bg-white rounded-xl shadow">
        <div
          className="grid grid-cols-6 grid-rows-3 gap-3 touch-pan-x"
          ref={gridRef}
        >
          {Array.from({ length: ROWS * COLS }).map((_, i) => {
            if (!reveal || i >= revealedCount) {
              // Not yet revealed: always spinning, always current spin config
              return (
                <Ball3D
                  key={"spin" + i}
                  spinning
                  spinConfig={currentSpinConf}
                />
              );
            } else {
              // Revealed: stopped, show number and highlight if user picked
              const number = numbersToReveal[i];
              const isUserPick = userPicks.includes(number);
              return (
                <Ball3D
                  key={"stop" + i}
                  number={number}
                  highlight={isUserPick}
                />
              );
            }
          })}
        </div>
      </div>
      {/* Optional debug */}
      {/* <div className="mt-2 text-xs text-slate-500">{spinSetting < 0 ? "⟲" : "⟳"} {currentSpinConf.label}</div> */}
    </div>
  );
}
