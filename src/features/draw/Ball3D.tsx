import React from "react";

const CIRCLE_DIAM = 35; // px
const NUMBER_FONT_SIZE = "1.05rem";

type HighlightMatches = {
  pickSet1?: boolean; // Green
  pickSet2?: boolean; // Blue
  pickSet3?: boolean; // Yellow
};

type Ball3DProps = {
  spinning?: boolean;
  number?: number;
  highlightMatches?: HighlightMatches; // Changed from 'highlight'
  spinConfig?: { direction: number; speed: number };
};

export default function Ball3D({
  spinning,
  number,
  highlightMatches,
  spinConfig,
}: Ball3DProps) {
  const isSpinning = !!spinning;

  // Determine highlight state
  const ps1 = highlightMatches?.pickSet1;
  const ps2 = highlightMatches?.pickSet2;
  const ps3 = highlightMatches?.pickSet3;

  const numMatches = (ps1 ? 1 : 0) + (ps2 ? 1 : 0) + (ps3 ? 1 : 0);

  let ballBackgroundStyle: React.CSSProperties = {};
  let ballBorderColor = "";
  let ballBoxShadow = "";
  let textColor = "#222";
  let textShadow = "0 1px 6px #d4dfff88";

  if (isSpinning) {
    ballBackgroundStyle.background = "linear-gradient(to bottom right, #19181a, #333, #19181a)";
    ballBorderColor = "border-black";
    ballBoxShadow = "0 3px 14px 2px rgba(50,50,60,0.36), 0 0.5px 2.8px 0px #222a";
    textColor = "#eee"; // Spinning balls have lighter text
    textShadow = "0 1px 6px rgba(0,0,0,0.5)";
  } else if (numMatches === 0) {
    // Stopped, no highlight - clean look
    ballBackgroundStyle.background = "transparent"; // No background
    ballBorderColor = "border-transparent"; // No border
    ballBoxShadow = "none"; // No shadow
    textColor = "#222"; // Keep text visible
    textShadow = "none"; // No text shadow
  } else if (numMatches === 1) {
    // Single highlight
    if (ps1) {
      ballBackgroundStyle.backgroundColor = "#00c805"; // Robinhood green
      ballBorderColor = "border-green-700";
      ballBoxShadow = "0 3px 16px 2px rgba(34,197,94,0.28), 0 0.5px 2.8px 0px #eaf3fa";
      textColor = "#111";
      textShadow = "0 2px 7px #99f6e0ee";
    } else if (ps2) {
      ballBackgroundStyle.backgroundColor = "#00afff"; // Robinhood blue
      ballBorderColor = "border-blue-700";
      ballBoxShadow = "0 3px 16px 2px rgba(0,175,255,0.28), 0 0.5px 2.8px 0px #eaf3fa";
      textColor = "#111";
      textShadow = "0 2px 7px rgba(0,175,255,0.5)";
    } else if (ps3) {
      ballBackgroundStyle.backgroundColor = "#FFA500"; // Robinhood orange
      ballBorderColor = "border-orange-700";
      ballBoxShadow = "0 3px 16px 2px rgba(255,165,0,0.28), 0 0.5px 2.8px 0px #eaf3fa";
      textColor = "#111";
      textShadow = "0 2px 7px rgba(255,165,0,0.5)";
    }
  } else if (numMatches === 2) {
    // Two highlights - split circle
    let gradientColors = "";
    if (ps1 && ps2) gradientColors = "#00c805 50%, #00afff 50%"; // Green-Blue
    else if (ps1 && ps3) gradientColors = "#00c805 50%, #FFA500 50%"; // Green-Orange
    else if (ps2 && ps3) gradientColors = "#00afff 50%, #FFA500 50%"; // Blue-Orange
    
    ballBackgroundStyle.background = `linear-gradient(to right, ${gradientColors})`;
    ballBorderColor = "border-gray-400"; // Neutral border for mixed colors
    ballBoxShadow = "0 3px 16px 2px rgba(0,0,0,0.15), 0 0.5px 2.8px 0px #eaf3fa";
    textColor = "#111";
    textShadow = "0 2px 7px rgba(0,0,0,0.2)";
  } else if (numMatches === 3) {
    // Three highlights - wedge
    ballBackgroundStyle.background = `conic-gradient(from 90deg, #00c805 0 33.3%, #00afff 33.3% 66.6%, #FFA500 66.6% 100%)`;
    ballBorderColor = "border-gray-400"; // Neutral border for mixed colors
    ballBoxShadow = "0 3px 16px 2px rgba(0,0,0,0.15), 0 0.5px 2.8px 0px #eaf3fa";
    textColor = "#111";
    textShadow = "0 2px 7px rgba(0,0,0,0.2)";
  }

  let glossAnimation = undefined;
  let glossDuration = undefined;
  if (spinning && spinConfig) {
    glossAnimation =
      spinConfig.direction === 1
        ? "roulette-ball-gloss-move-right"
        : "roulette-ball-gloss-move-left";
    glossDuration = `${spinConfig.speed}s`;
  }

  return (
    <div
      className={`relative flex items-center justify-center aspect-square`}
      style={{
        width: CIRCLE_DIAM,
        height: CIRCLE_DIAM,
        minWidth: 28,
        minHeight: 28,
      }}
    >
      {/* Main ball surface */}
      <span
        className={`
          absolute inset-0 rounded-full
          shadow-lg border-[2.5px] ${ballBorderColor}
        `}
        style={{
          ...ballBackgroundStyle,
          boxShadow: ballBoxShadow,
          transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        }}
        aria-hidden
      />

      {/* Gloss/shine layer */}
      <span
        className="absolute left-0 top-0 w-full h-full rounded-full pointer-events-none overflow-hidden"
        aria-hidden
        style={{ zIndex: 2 }}
      >
        {spinning ? (
          <span
            className="block absolute left-[-40%] top-1/4 w-2/3 h-1/2"
            style={{
              background:
                "linear-gradient(100deg, rgba(255,255,255,0.23) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.08) 100%)",
              filter: "blur(2.5px)",
              borderRadius: "40%",
              transform: "rotate(-14deg)",
              animation: glossAnimation
                ? `${glossAnimation} ${glossDuration} linear infinite`
                : undefined,
            }}
          />
        ) : numMatches > 0 ? (
          <span
            className="block absolute left-[18%] top-1/4 w-2/3 h-2/5"
            style={{
              background:
                "linear-gradient(96deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.05) 100%)",
              filter: "blur(1.8px)",
              borderRadius: "50%",
              transform: "rotate(-15deg)",
              opacity: 0.9,
            }}
          />
        ) : (
          <span
            className="block absolute left-[20%] top-1/4 w-2/3 h-1/2"
            style={{
              background:
                "linear-gradient(100deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.6) 35%, rgba(255,255,255,0.07) 98%)",
              filter: "blur(2.1px)",
              borderRadius: "40%",
              transform: "rotate(-14deg)",
              opacity: 0.85,
            }}
          />
        )}
      </span>
      {typeof number === "number" && (
        <span
          className={`relative font-extrabold select-none`}
          style={{
            zIndex: 10,
            color: textColor,
            textShadow: textShadow,
            fontFamily: "Poppins, Inter, sans-serif",
            letterSpacing: "-0.02em",
            userSelect: "none",
            fontSize: NUMBER_FONT_SIZE,
            lineHeight: 1.13,
          }}
        >
          {number}
        </span>
      )}
      <style>{`
        @keyframes roulette-ball-gloss-move-right {
          0%   { left: -45%; opacity: 0.2;}
          12%  { opacity: 0.5;}
          38%  { opacity: 0.98;}
          50%  { left: 55%; opacity: 1;}
          80%  { opacity: .5;}
          100% { left: 102%; opacity: 0.2;}
        }
        @keyframes roulette-ball-gloss-move-left {
          0%   { left: 102%; opacity: 0.2;}
          12%  { opacity: 0.5;}
          38%  { opacity: 0.98;}
          50%  { left: -45%; opacity: 1;}
          80%  { opacity: .5;}
          100% { left: -80%; opacity: 0.2;}
        }
      `}</style>
    </div>
  );
}