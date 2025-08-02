import React, { useEffect } from "react";

interface ResultBarProps {
  visible: boolean;
  creditsWon: number | null; // Kept for compatibility if needed, but message is primary
  message?: string; // New prop for direct message
}

export default function ResultBar({ visible, creditsWon, message }: ResultBarProps) {
  if (!visible) return null;

  // Use the provided message if available, otherwise fallback to old logic
  const displayMessage = message || (
    creditsWon && creditsWon > 0 && creditsWon >= 1000 // Assuming jackpot is >= 1000
      ? `Congrats! You won the jackpot of $${creditsWon}!`
      : creditsWon && creditsWon > 0
      ? `Congrats! You won ${creditsWon} credits!`
      : "Try again. Win next time!"
  );

  // Determine styling based on whether it's a winning message (contains "Congrats")
  const isWinningMessage = displayMessage.includes("Congrats!");
  const isJackpotMessage = displayMessage.includes("jackpot");

  return (
    <div className="w-full flex justify-center items-center py-2">
      <div
        className={`rounded-xl border-2 shadow-md px-7 py-2 font-semibold text-base
          ${
            isJackpotMessage
              ? "bg-yellow-100 border-yellow-500 text-yellow-800 animate-scale-in"
              : isWinningMessage
              ? "bg-green-50 border-green-400 text-green-700 animate-scale-in"
              : "bg-yellow-50 border-yellow-300 text-yellow-700 animate-fade-in"
          }
        `}
        style={{ minWidth: 210, maxWidth: 350, textAlign: "center" }}
        data-testid="result-bar"
      >
        {displayMessage}
      </div>
    </div>
  );
}