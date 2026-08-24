import { useEffect, useState } from "react";

const QUERY = "(pointer: coarse)";

// True on touch input. Deliberately not a width check: a wide tablet still
// needs the touch behaviour, and a narrow desktop window does not.
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = (event) => setCoarse(event.matches);

    setCoarse(media.matches);
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  return coarse;
}
