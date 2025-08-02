import React from "react";
import { useNumberSelection } from "./NumberSelectionContext";
import { useTimer } from "../timer/timer-context";
import ConfirmedPicksList from "./ConfirmedPicksList"; // This will be the main child

export default function NumberSelectionPanel() {
  const { confirmedPicksSets } = useNumberSelection();
  const { state: timerState } = useTimer();

  // Only show the "Numbers locked" message if in CUT_OFF and no sets were confirmed.
  const showCutOffNoPicksMessage = timerState === "CUT_OFF" && confirmedPicksSets.length === 0;

  console.log("[NumberSelectionPanel] Rendering. showCutOffNoPicksMessage:", showCutOffNoPicksMessage, "confirmedPicksSets.length:", confirmedPicksSets.length, "timerState:", timerState);

  return (
    <div className="flex flex-col items-center w-full h-full">
      {showCutOffNoPicksMessage ? (
        <div className="text-sm mt-2 text-yellow-700 font-medium text-center">
          Numbers locked. No sets confirmed for this draw.
        </div>
      ) : (
        // Always render ConfirmedPicksList, which will handle showing the grid or confirmed sets.
        <ConfirmedPicksList />
      )}
    </div>
  );
}