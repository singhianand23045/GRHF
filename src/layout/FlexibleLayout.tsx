import React from "react";
import { layoutConfig } from "./layoutConfig";
import JackpotSection from "../features/jackpot/JackpotSection";
import TimerSection from "../features/timer/TimerSection";
import CreditsSection from "../features/wallet/CreditsSection";
import DrawNumbersSection from "../features/draw/DrawNumbersSection";
import ConfirmedNumbersSection from "../features/number-select/ConfirmedNumbersSection";
import Header from "../components/Header"; // Import the new Header component

export default function FlexibleLayout() {
  // For easy reference, map keys to components
  const sectionMap: Record<string, React.ReactNode> = {
    header: <Header />, // Use the new Header component here
    jackpot: <JackpotSection />,
    timer: <TimerSection />,
    drawNumbers: <DrawNumbersSection />,
    wallet: <CreditsSection />,
    numberSelect: <ConfirmedNumbersSection />
  };

  // Get individual section configs
  const headerCfg = layoutConfig.find((s) => s.key === "header");
  const jackpotCfg = layoutConfig.find((s) => s.key === "jackpot");
  const timerCfg = layoutConfig.find((s) => s.key === "timer");
  const drawNumbersCfg = layoutConfig.find((s) => s.key === "drawNumbers");
  const walletCfg = layoutConfig.find((s) => s.key === "wallet");
  const numberSelectCfg = layoutConfig.find((s) => s.key === "numberSelect");

  // Spacer utility for gaps
  const SectionGap = () => (
    <div className="flex-none h-0" aria-hidden="true" />
  );

  return (
    <div
      className="w-full flex flex-col"
      style={{
        // Multiple fallbacks for cross-browser compatibility
        height: "calc(100vh - 4rem)", // Fallback
        height: "calc(100dvh - 4rem)", // Modern browsers
        minHeight: "calc(100vh - 4rem)", // Ensure minimum
        maxHeight: "calc(100vh - 4rem)", // Prevent overflow
      }}
    >
      {/* Header */}
      <div
        className={`w-full flex items-center justify-center ${headerCfg?.bg ?? ""} ${headerCfg?.font ?? ""}`}
        style={{
          flex: `${headerCfg?.flex ?? 1} 0 ${headerCfg?.minHeight ?? "40px"}`,
          minHeight: headerCfg?.minHeight ?? "40px",
        }}
      >
        {sectionMap["header"]}
      </div>
      <SectionGap />
      {/* Jackpot and Timer side by side */}
      <div
        className="w-full flex flex-row"
        style={{
          flex: `${(jackpotCfg?.flex ?? 3)} 0 ${jackpotCfg?.minHeight ?? "80px"}`,
          minHeight: jackpotCfg?.minHeight ?? "80px",
        }}
      >
        {/* Jackpot: left, 50% */}
        <div
          className={`h-full flex-1 flex items-center justify-start bg-gradient-to-r ${jackpotCfg?.bg ?? ""} ${jackpotCfg?.font ?? ""}`}
        >
          {sectionMap["jackpot"]}
        </div>
        {/* Timer: right, 50% */}
        <div
          className={`h-full flex-1 flex items-center justify-end bg-gradient-to-r ${timerCfg?.bg ?? ""} ${timerCfg?.font ?? ""}`}
        >
          {sectionMap["timer"]}
        </div>
      </div>
      <SectionGap />
      {/* Draw Numbers */}
      <div
        className={`w-full flex items-center justify-center bg-gradient-to-r ${drawNumbersCfg?.bg ?? ""} ${drawNumbersCfg?.font ?? ""}`}
        style={{
          flex: `${drawNumbersCfg?.flex ?? 4} 0 ${drawNumbersCfg?.minHeight ?? "250px"}`,
          minHeight: drawNumbersCfg?.minHeight ?? "250px",
        }}
      >
        {sectionMap["drawNumbers"]}
      </div>
      <SectionGap />
      {/* Wallet / Credits */}
      <div
        className={`w-full flex items-center justify-center bg-gradient-to-r ${walletCfg?.bg ?? ""} ${walletCfg?.font ?? ""}`}
        style={{
          flex: `${walletCfg?.flex ?? 1} 0 ${walletCfg?.minHeight ?? "60px"}`,
          minHeight: walletCfg?.minHeight ?? "60px",
        }}
      >
        {sectionMap["wallet"]}
      </div>
      <SectionGap />
      {/* Number Select */}
      <div
        className={`w-full flex items-center justify-center bg-gradient-to-r ${numberSelectCfg?.bg ?? ""} ${numberSelectCfg?.font ?? ""}`}
        style={{
          flex: `${numberSelectCfg?.flex ?? 5} 0 ${numberSelectCfg?.minHeight ?? "350px"}`,
          minHeight: numberSelectCfg?.minHeight ?? "350px",
        }}
      >
        {sectionMap["numberSelect"]}
      </div>
    </div>
  );
}