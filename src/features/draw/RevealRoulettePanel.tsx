
import React, { useEffect, useState } from "react";
import RouletteBallGrid from "@/playground/RouletteBallGrid";
import { useDrawEngine } from "./DrawEngineContext";
import { useNumberSelection } from "../number-select/NumberSelectionContext";
import { useTimer } from "../timer/timer-context";
import ResultBar from "./ResultBar";

/**
 * A bridge between playground RouletteBallGrid and the app DrawEngine.
 * Used for mainline roulette animation merge. Allows rollback to legacy grid easily.
 */
export default function RevealRoulettePanel() {
  const { drawnNumbers, revealResult } = useDrawEngine();
  const { picked: userNumbers } = useNumberSelection();
  const { state } = useTimer();

  // Reveal is true during REVEAL phase, false otherwise
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    setReveal(state === "REVEAL");
  }, [state]);

  // Always pass an array of 18 elements to RouletteBallGrid:
  // - During REVEAL: drawnNumbers is at most 18, rest undefined.
  // - Before REVEAL: pass 18 undefineds (so balls spin)
  // - After REVEAL: drawnNumbers is fully 18, all balls stopped
  const numbersToReveal =
    state === "REVEAL"
      ? // During reveal phase, already revealed numbers + unrevealed as undefined
        Array.from({ length: 18 }, (_, i) =>
          drawnNumbers[i] !== undefined ? drawnNumbers[i] : undefined
        )
      : // Before reveal, all undefined (spinning)
        Array(18).fill(undefined);

  // This allows RouletteBallGrid to display correct grid, and only use "stopped" for slots with a number, "spinning" otherwise.
  // No legacy grid anymore.

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-hidden">
      <ResultBar visible={revealResult.show} creditsWon={revealResult.credits} />
      <div className="w-full flex flex-col items-center justify-center py-0">
        <RouletteBallGrid
          numbersToReveal={numbersToReveal}
          reveal={reveal}
          userPicks={userNumbers}
        />
      </div>
    </div>
  );
}
