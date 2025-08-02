
import React from "react";
import { useJackpot } from "./JackpotContext";

export default function JackpotBar() {
  const { jackpot } = useJackpot();

  return (
    <div
      className="flex items-center gap-2 w-full h-full px-4"
      style={{
        minHeight: 40, maxHeight: 80,
      }}
      data-testid="jackpot-bar"
    >
      <span className="font-bold text-6xl text-robinhood-green drop-shadow-sm">
        ${jackpot}
      </span>
    </div>
  );
}
