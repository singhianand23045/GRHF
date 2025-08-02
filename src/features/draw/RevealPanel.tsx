import React from "react";
import { useDrawEngine } from "./DrawEngineContext";
import { useNumberSelection } from "../number-select/NumberSelectionContext";
import { useTimer } from "../timer/timer-context";
import ResultBar from "./ResultBar";
import RouletteBallGrid from "./RouletteBallGrid";

// Use a single global font/circle size in this file
const BASE_FONT_SIZE = "1rem";
const BASE_DIAM = "2.2rem"; // same as used elsewhere (ConfirmedNumbersDisplay)

// FEATURE FLAG: Set to true to activate roulette animation, false for legacy grid
const ENABLE_ROULETTE_ANIMATION = true;

export default function RevealPanel() {
  let ctx;
  try {
    ctx = useDrawEngine();
  } catch (e) {
    console.error("[RevealPanel] useDrawEngine context error! Is RevealPanel rendered outside DrawEngineProvider?");
    throw e;
  }

  const { drawnNumbers, revealResult } = ctx; // drawnNumbers now includes highlight info
  const { confirmedPicksSets } = useNumberSelection(); // Get all confirmed pick sets
  const { state } = useTimer();

  // Define the ResultBar's height (adjust as needed for nice appearance)
  const RESULT_BAR_HEIGHT = 44; // px, fits 1-line ResultBar text + spacing

  // Spacing between message and ball grid: only 0.5% of screen height
  const DRAWN_GRID_MARGIN_TOP = "0.5vh";

  // --- FEATURE FLAG CONDITIONAL ---
  if (ENABLE_ROULETTE_ANIMATION) {
    // Pass the full drawnNumbers array (which now contains highlightMatches)
    return (
      <div className="flex flex-col items-center w-full h-full overflow-y-hidden">
        <div
          className="w-full flex justify-center items-center"
          style={{
            height: RESULT_BAR_HEIGHT,
            minHeight: RESULT_BAR_HEIGHT,
            maxHeight: RESULT_BAR_HEIGHT
          }}
        >
          <ResultBar
            visible={!!revealResult.show}
            creditsWon={revealResult.credits}
            message={revealResult.message}
            jackpot={Boolean(revealResult.credits && revealResult.credits > 0 && revealResult.credits >= 1000)}
          />
        </div>
        <div
          className="flex-1 w-full flex items-center justify-center py-0"
          style={{
            marginTop: DRAWN_GRID_MARGIN_TOP
          }}
        >
          <div className="w-full space-y-1 flex flex-col items-center justify-center">
            <RouletteBallGrid
              drawnNumbersWithHighlights={drawnNumbers} // Pass the new structure
              reveal={state === "REVEAL"}
              confirmedPicksSets={confirmedPicksSets} // Pass confirmedPicksSets for internal logic if needed
            />
          </div>
        </div>
      </div>
    );
  }

  // ---- Legacy (non-roulette) display remains below ----
  // This part will not be used if ENABLE_ROULETTE_ANIMATION is true, but keeping it for completeness.
  // It would also need to be updated to handle multi-highlights if it were to be used.
  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-hidden">
      <div
        className="w-full flex justify-center items-center"
        style={{
          height: RESULT_BAR_HEIGHT,
          minHeight: RESULT_BAR_HEIGHT,
          maxHeight: RESULT_BAR_HEIGHT
        }}
      >
        <ResultBar
          visible={!!revealResult.show}
          creditsWon={revealResult.credits}
          message={revealResult.message}
          jackpot={Boolean(revealResult.credits && revealResult.credits > 0 && revealResult.credits >= 1000)}
        />
      </div>
      <div
        className="flex-1 w-full flex items-center justify-center py-0"
        style={{
          marginTop: DRAWN_GRID_MARGIN_TOP
        }}
      >
        <div className="w-full space-y-1 flex flex-col items-center justify-center">
          {/* This part needs to be updated if legacy grid is to support multi-highlights */}
          {/* For now, it will just show numbers without multi-highlights */}
          {Array.from({ length: 3 }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex flex-nowrap justify-center items-center gap-2 w-full max-w-full min-h-[30px]"
            >
              {Array.from({ length: 6 }).map((_, colIdx) => {
                const index = rowIdx * 6 + colIdx;
                const drawnNum = drawnNumbers[index]?.number; // Access the number
                const isHighlighted = drawnNumbers[index]?.highlightMatches?.pickSet1; // Only checks pickSet1 for legacy
                const baseCircleStyle = {
                  width: BASE_DIAM,
                  minWidth: 28,
                  height: BASE_DIAM,
                  minHeight: 28,
                  fontSize: BASE_FONT_SIZE,
                  lineHeight: 1.05,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                };
                if (drawnNum === undefined) {
                  return (
                    <span
                      key={colIdx}
                      className="flex items-center justify-center rounded-full bg-robinhood-black border-2 border-robinhood-black select-none aspect-square transition-all"
                      style={baseCircleStyle}
                      aria-hidden
                    ></span>
                  );
                }
                if (isHighlighted) {
                  return (
                    <span
                      key={colIdx}
                      className="flex items-center justify-center rounded-full bg-robinhood-green text-white font-black shadow-robinhood-green/30 shadow-lg border-2 border-robinhood-green select-none transition-all aspect-square animate-scale-in"
                      style={baseCircleStyle}
                    >
                      {drawnNum}
                    </span>
                  );
                }
                return (
                  <span
                    key={colIdx}
                    className="flex items-center justify-center rounded-full bg-white text-robinhood-black font-black border-2.5 border-robinhood-black shadow-md select-none aspect-square animate-scale-in transition-all"
                    style={baseCircleStyle}
                  >
                    {drawnNum}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}