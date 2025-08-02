import React from "react";
import { cn } from "@/lib/utils";

// Global circle/font constants
const CIRCLE_NUM_FONT_SIZE = "1rem";
const CIRCLE_NUM_DIAM = "2.2rem"; // 35px
const CIRCLE_DIAM_NUM = 35;

type ConfirmedNumbersDisplayProps = {
  picked: number[]; // Now explicitly passed as a prop
  compact?: boolean;
  pickSetIndex?: number; // New prop for displaying pick set number (1-indexed)
};

export default function ConfirmedNumbersDisplay({ picked, compact = false, pickSetIndex }: ConfirmedNumbersDisplayProps) {
  const sorted = [...picked].sort((a, b) => a - b);

  // Define color classes based on pickSetIndex
  const getColorClasses = (index: number) => {
    switch (index) {
      case 1: // First set: Robinhood Green
        return {
          bg: "bg-robinhood-green",
          border: "border-robinhood-darkgreen",
          shadow: "shadow-green-300", // Using default Tailwind green-300 for shadow tint
        };
      case 2: // Second set: Robinhood Blue
        return {
          bg: "bg-robinhood-blue",
          border: "border-blue-700", // Using default Tailwind blue-700 for border
          shadow: "shadow-blue-300", // Using default Tailwind blue-300 for shadow tint
        };
      case 3: // Third set: Robinhood Orange
        return {
          bg: "bg-robinhood-orange",
          border: "border-orange-700", // Using default Tailwind orange-700 for border
          shadow: "shadow-orange-300", // Using default Tailwind orange-300 for shadow tint
        };
      default: // Fallback to first set colors
        return {
          bg: "bg-robinhood-green",
          border: "border-robinhood-darkgreen",
          shadow: "shadow-green-300",
        };
    }
  };

  const currentColors = getColorClasses(pickSetIndex || 1); // Default to 1 if not provided

  return (
    <div
      className={`flex flex-col items-center justify-center w-full px-2 ${compact ? "" : "mt-2 mb-2"}`}
      style={{
        marginTop: compact ? 0 : undefined,
        marginBottom: compact ? 0 : undefined,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {/* Conditionally render the "Your Numbers" or "Set X" label */}
      {!compact && (
        <div className={`mb-2 font-bold text-lg tracking-wide text-[#217d37] text-center w-full`}>
          {pickSetIndex ? `Set ${pickSetIndex}` : "Your Confirmed Numbers"}
        </div>
      )}
      <div
        className="flex flex-nowrap justify-center items-center gap-3 bg-gradient-to-r from-green-100/70 via-white to-green-100/70 rounded-2xl shadow-inner px-1 py-2 w-full"
        style={{
          minHeight: 38,
          paddingTop: compact ? 0 : undefined,
          paddingBottom: compact ? 0 : undefined,
        }}
      >
        {sorted.map((n) => (
          <span
            key={n}
            className={cn(
              "flex items-center justify-center rounded-full text-white font-black shadow-lg border-[2px] select-none lottery-num transition-all aspect-square",
              currentColors.bg,
              currentColors.border,
              currentColors.shadow
            )}
            style={{
              width: CIRCLE_NUM_DIAM,
              minWidth: CIRCLE_DIAM_NUM,
              height: CIRCLE_DIAM_NUM,
              minHeight: CIRCLE_DIAM_NUM,
              fontSize: CIRCLE_NUM_FONT_SIZE,
              lineHeight: 1.12,
              padding: 0,
              boxSizing: "border-box",
            }}
          >
            {n}
          </span>
        ))}
      </div>
      {/* Only show this message if not compact, or if it's the last set and not in OPEN state */}
      {!compact && (
        <div className={`mt-2 text-sm text-muted-foreground text-center px-2 ${compact ? "mt-1" : ""} w-full`}>
          Numbers locked in until next round!
        </div>
      )}
    </div>
  );
}