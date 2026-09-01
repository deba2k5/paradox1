import { useEffect, useState } from "react";

/** Rough heuristic to scale back 3D/particle work on phones and low-end machines. */
export function useLowPowerDevice() {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrowScreen = window.innerWidth < 768;
    const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    setLowPower((coarsePointer && narrowScreen) || fewCores);
  }, []);

  return lowPower;
}
