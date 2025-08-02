
import React from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useWallet } from "./WalletContext";

export default function BalanceLabel() {
  const { balance } = useWallet();
  const motionValue = useMotionValue(balance);
  const spring = useSpring(motionValue, { stiffness: 210, damping: 20 });

  React.useEffect(() => {
    motionValue.set(balance);
    console.log("[BalanceLabel] Consumed balance value:", balance);
  }, [balance, motionValue]);

  return (
    <motion.div
      className="font-extrabold text-xl text-green-700 bg-gradient-to-r from-green-50 via-white to-green-50 px-5 py-2 rounded-full shadow pulse"
      style={{
        scale: 1
      }}
      aria-label="Balance"
      tabIndex={0}
    >
      <span>Balance: {balance} credits</span>
    </motion.div>
  );
}
