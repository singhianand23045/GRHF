
import React from "react";
import { useWallet } from "./WalletContext";
import { Button } from "@/components/ui/button";

export default function CreditsBar() {
  const { balance } = useWallet();
  React.useEffect(() => {
    console.log("[CreditsBar] Consumed balance value:", balance);
  }, [balance]);

  return (
    <div
      className="flex flex-row items-center justify-between w-full px-4 bg-gradient-to-r from-amber-50 to-green-50 border-y border-gray-200 transition-all select-none"
      style={{
        height: "5vh",
        minHeight: 30,
        maxHeight: 60,
      }}
      data-testid="credits-bar"
    >
      {/* Left: Add Credits Button */}
      <Button
        size="sm"
        variant="ghost"
        className="pl-0 font-semibold text-green-800"
        tabIndex={0}
        aria-label="Add credits"
        onClick={() => {
          // Optionally implement adding credits if needed, currently no-op
        }}
      >
        Add credits
      </Button>
      {/* Right: Balance label, always right-aligned */}
      <span
        className="font-bold text-green-700 text-base ml-auto"
        aria-label="Credits balance"
      >
        {balance} credits
      </span>
    </div>
  );
}
