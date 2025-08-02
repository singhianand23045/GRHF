
import { useRef } from "react";
import { generateDrawSets } from "./numberPool";

/**
 * Custom hook to generate and memoize the draw sets once per session.
 * No state, returns reference-stable array.
 */
export function useDrawSets() {
  const setsRef = useRef<number[][] | null>(null);
  if (!setsRef.current) {
    setsRef.current = generateDrawSets();
  }
  return setsRef.current;
}
