
export type LayoutSectionKey =
  | "header"
  | "jackpot"
  | "timer"
  | "drawNumbers"
  | "wallet"
  | "numberSelect";

export type SectionLayoutConfig = {
  key: LayoutSectionKey;
  height: string; // e.g., "15%"
  bg?: string; // tailwind gradient classes, optional
  font?: string; // font classes, optional
};

export const layoutConfig: SectionLayoutConfig[] = [
  {
    key: "header",
    height: "5%",
    font: "font-extrabold tracking-tight text-3xl text-[#1a1855]",
    bg: ""
  },
  {
    key: "jackpot",
    height: "15%",
    font: "font-bold text-yellow-700 text-6xl",
    // Set to plain white
    bg: "from-white to-white"
  },
  {
    key: "timer",
    height: "15%",
    font: "font-mono font-extrabold text-blue-900 text-3xl",
    // Set to plain white
    bg: "from-white to-white"
  },
  {
    key: "drawNumbers",
    height: "30%",
    font: "font-normal text-indigo-900",
    // Unified background for consistency
    bg: "from-white to-green-50"
  },
  {
    key: "wallet",
    height: "5%",
    font: "font-semibold text-green-900",
    bg: "from-green-50 to-green-100"
  },
  {
    key: "numberSelect",
    height: "45%",
    font: "font-normal text-green-900",
    bg: "from-white to-green-50"
  }
];
