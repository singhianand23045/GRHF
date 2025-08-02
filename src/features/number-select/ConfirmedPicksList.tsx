import React from "react";
import ConfirmedNumbersDisplay from "./ConfirmedNumbersDisplay";
import { useNumberSelection } from "./NumberSelectionContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle } from "lucide-react";
import { useTimer } from "../timer/timer-context";
import NumberGrid from "./NumberGrid";

export default function ConfirmedPicksList() {
  const {
    picked,
    canConfirm,
    confirm,
    confirmedPicksSets,
    startNewPickSetSelection,
    isAddingNewPickSet
  } = useNumberSelection();
  const { state: timerState } = useTimer();

  const canAddMorePickSets = confirmedPicksSets.length < 3 && timerState === "OPEN";

  // Determine if the number grid should be shown for picking.
  // This is true if:
  // 1. No sets have been confirmed yet AND we are in OPEN state (initial pick).
  // 2. OR, the user explicitly clicked "Add next set" (isAddingNewPickSet is true) AND we are in OPEN state.
  const showNumberGridForPicking = (confirmedPicksSets.length === 0 || isAddingNewPickSet) && timerState === "OPEN";

  console.log("[ConfirmedPicksList] Rendering. confirmedPicksSets.length:", confirmedPicksSets.length, "isAddingNewPickSet:", isAddingNewPickSet, "showNumberGridForPicking:", showNumberGridForPicking, "canAddMorePickSets:", canAddMorePickSets, "timerState:", timerState);

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Title for confirmed numbers, only if there are confirmed sets */}
      {confirmedPicksSets.length > 0 && (
        <div className="mb-2 font-semibold text-[#16477d] text-lg select-none">
          Your Confirmed Numbers
        </div>
      )}
      
      <ScrollArea className="w-full max-w-md flex-1 px-2 py-2">
        <div className="flex flex-col items-center gap-4"> {/* This div now contains all scrollable content */}
          {/* Display all confirmed pick sets */}
          {confirmedPicksSets.map((pickSetNumbers, index) => {
            console.log(`[ConfirmedPicksList] Rendering ConfirmedNumbersDisplay for pick set ${index + 1}:`, pickSetNumbers);
            return (
              <ConfirmedNumbersDisplay key={index} picked={pickSetNumbers} compact={true} pickSetIndex={index + 1} />
            );
          })}

          {/* Show the number grid if user is picking a new pick set */}
          {showNumberGridForPicking && (
            <div className="w-full flex flex-col items-center gap-4"> {/* Removed mt-4 here, gap-4 on parent handles it */}
              {confirmedPicksSets.length === 0 && ( // Show "Pick 6 numbers" for the very first selection
                <div className="mb-2 font-semibold text-[#16477d] text-lg select-none">
                  Pick 6 numbers
                </div>
              )}
              <NumberGrid />
              <Button
                onClick={confirm}
                disabled={!canConfirm}
                size="lg"
                className="w-full max-w-xs transition-all"
              >
                <CheckCircle className="mr-2 w-5 h-5" />
                Confirm Numbers
              </Button>
              {picked.length < 6 && (
                <div className="text-xs mt-2 text-muted-foreground">
                  Pick {6 - picked.length} more number{6 - picked.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}

          {/* Only show "Add next set of numbers" button if not currently picking a new pick set AND can add more */}
          {!showNumberGridForPicking && canAddMorePickSets && (
            <Button
              onClick={startNewPickSetSelection}
              size="lg"
              className="w-full max-w-xs transition-all" // Removed mt-0, gap-4 on parent handles it
            >
              <PlusCircle className="mr-2 w-5 h-5" />
              Add next set of numbers
            </Button>
          )}
          
          {/* Messages */}
          {confirmedPicksSets.length === 3 && timerState === "OPEN" && (
            <div className="text-sm mt-4 text-muted-foreground text-center">
              Maximum 3 sets of numbers confirmed for this draw.
            </div>
          )}
          {timerState === "CUT_OFF" && confirmedPicksSets.length > 0 && (
            <div className="text-sm mt-4 text-yellow-700 font-medium text-center">
              Numbers locked. Waiting for draw...
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}