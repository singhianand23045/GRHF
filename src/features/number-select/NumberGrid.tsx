
import React, { useRef } from "react";
import { useNumberSelection } from "./NumberSelectionContext";
import { cn } from "@/lib/utils";

// Global circle/font constants for grid
const PICK_GRID_NUM_FONT_SIZE = "0.98rem";
const PICK_GRID_NUM_DIAM = "2rem"; // 32px
const GRID_DIAM_NUM = 32;

type Props = {};

export default function NumberGrid({}: Props) {
  const { picked, setPicked, canPick, isConfirmed } = useNumberSelection();
  const shakeRef = useRef<HTMLDivElement>(null);

  const numbers = Array.from({ length: 27 }, (_, i) => i + 1);

  function handlePick(num: number) {
    if (!canPick) return;
    setPicked(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      } else if (prev.length < 6) {
        return [...prev, num];
      } else {
        if (shakeRef.current) {
          shakeRef.current.classList.remove("animate-shake");
          void shakeRef.current.offsetWidth;
          shakeRef.current.classList.add("animate-shake");
        }
        return prev;
      }
    });
  }

  return (
    <div
      ref={shakeRef}
      className={cn("w-full max-w-md grid grid-cols-9 grid-rows-3 gap-2 px-2 py-2 bg-white rounded-2xl shadow-lg transition-all", isConfirmed && "pointer-events-none opacity-60")}
    >
      {numbers.map(num => {
        const selected = picked.includes(num);
        return (
          <button
            key={num}
            className={cn(
              "aspect-square rounded-full flex items-center justify-center font-semibold select-none transition-colors outline-none focus:z-10",
              selected
                ? "bg-green-500 text-white shadow-md ring-2 ring-green-400"
                : "bg-gray-100 hover:bg-blue-100 text-gray-800",
              !canPick && !selected && "opacity-40 pointer-events-none"
            )}
            type="button"
            style={{
              width: PICK_GRID_NUM_DIAM,
              minWidth: GRID_DIAM_NUM,
              height: PICK_GRID_NUM_DIAM,
              minHeight: GRID_DIAM_NUM,
              fontSize: PICK_GRID_NUM_FONT_SIZE,
              lineHeight: 1.1,
            }}
            tabIndex={isConfirmed ? -1 : 0}
            onClick={() => handlePick(num)}
            aria-pressed={selected}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}
