
import React from "react";

// Use a single global font/circle size in this file
const CIRCLE_DIAM = 35; // px
const NUMBER_FONT_SIZE = "1.05rem";

type Ball3DProps = {
  spinning?: boolean;
  number?: number;
  highlight?: boolean;
  spinConfig?: { direction: number; speed: number };
};

export default function Ball3D({
  spinning,
  number,
  highlight,
  spinConfig,
}: Ball3DProps) {
  const isSpinning = !!spinning;

  const ballBackground = highlight
    ? "bg-green-500"
    : isSpinning
    ? "bg-gradient-to-br from-slate-900 via-slate-700 to-neutral-500"
    : "bg-gradient-to-b from-white via-slate-100 to-slate-300";

  const borderColor = highlight
    ? "border-green-600/60"
    : isSpinning
    ? "border-black"
    : "border-slate-500/40";

  const ballBoxShadow = highlight
    ? "0 3px 16px 2px rgba(34,197,94,0.28), 0 0.5px 2.8px 0px #eaf3fa"
    : isSpinning
    ? "0 3px 14px 2px rgba(50,50,60,0.36), 0 0.5px 2.8px 0px #222a"
    : "0 3px 8px 2px rgba(80,90,120,0.20), 0 0.5px 2.8px 0px #eaf3fa";

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
      <span
        className={`
          absolute inset-0 rounded-full
          ${ballBackground}
          shadow-lg border-[2.5px] ${borderColor}
        `}
        style={{
          boxShadow: ballBoxShadow,
          transition: "background 0.3s",
        }}
        aria-hidden
      />

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
        ) : highlight ? (
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
      {!highlight && !isSpinning && (
        <span
          className="absolute"
          style={{
            top: "18%",
            left: "38%",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, #fff 85%, #e0ebfc11 100%)",
            opacity: 0.82,
            filter: "blur(1px)",
          }}
          aria-hidden
        />
      )}
      {typeof number === "number" && (
        <span
          className={`relative font-extrabold select-none`}
          style={{
            zIndex: 10,
            color: highlight ? "#111" : "#222",
            textShadow: highlight
              ? "0 2px 7px #99f6e0ee"
              : "0 1px 6px #d4dfff88",
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

