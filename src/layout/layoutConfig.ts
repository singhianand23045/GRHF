export type LayoutSectionKey =
  | "header"
  | "jackpot"
  | "timer"
  | "drawNumbers"
  | "wallet"
  | "numberSelect";

export type SectionLayoutConfig = {
  key: LayoutSectionKey;
  flex: number; // flex-grow ratio instead of percentage height
  minHeight: string; // minimum height in pixels
  bg?: string; // tailwind gradient classes, optional
  font?: string; // font classes, optional
};

export const layoutConfig: SectionLayoutConfig[] = [
  {
    key: "header",
    flex: 1,
    minHeight: "25px",
    font: "font-extrabold tracking-tight text-3xl text-[#1a1855]",
    bg: ""
  },
  {
    key: "jackpot",
    flex: 3,
    minHeight: "80px", // Changed from 120px to 80px
    font: "font-black text-6xl text-robinhood-green", // Bolder, Robinhood-style
    // Set to plain white
    bg: "from-white to-white"
  },
  {
    key: "timer",
    flex: 2,
    minHeight: "80px",
    font: "font-mono font-black text-3xl text-slate-900", // Bolder
    // Set to plain white
    bg: "from-white to-white"
  },
  {
    key: "drawNumbers",
    flex: 4,
    minHeight: "250px", // Changed from 200px to 250px
    font: "font-normal text-indigo-900",
    // Unified background for consistency
    bg: "from-white to-green-50"
  },
  {
    key: "wallet",
    flex: 1,
    minHeight: "60px",
    font: "font-semibold text-green-900",
    bg: "from-white to-green-50" // Changed from "from-green-50 to-green-100"
  },
  {
    key: "numberSelect",
    flex: 5,
    minHeight: "350px",
    font: "font-normal text-green-900",
    bg: "from-white to-green-50"
  }
];