import { useRef, useState } from "react";

/**
 * Custom hook to manage the state and behavior of the Result Bar.
 * - Handles display state, credit value, and automatic timeout to hide.
 * - Now accepts a custom message string.
 */
export function useResultBar(
  initial: { show: boolean; credits: number | null; message?: string } = { show: false, credits: null, message: "" },
  defaultTimeoutMs: number = 10000 // Renamed to defaultTimeoutMs
) {
  const [resultBar, setResultBar] = useState<{ show: boolean; credits: number | null; message?: string }>(initial);
  const resultTimeout = useRef<NodeJS.Timeout | null>(null);

  // Added optional 'duration' parameter
  const showResultBar = (credits: number | null, message?: string, duration?: number) => {
    setResultBar({ show: true, credits, message });
    if (resultTimeout.current) clearTimeout(resultTimeout.current);
    resultTimeout.current = setTimeout(() => {
      setResultBar({ show: false, credits: null, message: "" });
    }, duration !== undefined ? duration : defaultTimeoutMs); // Use provided duration or default
  };

  const hideResultBar = () => {
    setResultBar(({ credits }) => ({ show: false, credits: null, message: "" }));
    if (resultTimeout.current) clearTimeout(resultTimeout.current);
  };

  const triggerResultBar = () => {
    setResultBar((curr) => ({ show: true, credits: curr.credits, message: curr.message }));
    if (resultTimeout.current) clearTimeout(resultTimeout.current);
    resultTimeout.current = setTimeout(() => {
      setResultBar({ show: false, credits: null, message: "" });
    }, defaultTimeoutMs);
  };

  // Clean up timeout on unmount
  const cleanup = () => {
    if (resultTimeout.current) clearTimeout(resultTimeout.current);
  };

  return {
    resultBar,
    showResultBar,
    hideResultBar,
    triggerResultBar,
    cleanup,
    setResultBar // for advanced usage
  };
}