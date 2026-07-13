import { useCallback, useEffect, useRef, useState } from "react";

export function useSaveFeedback(durationMs = 1100) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutId = useRef<number>();

  useEffect(
    () => () => {
      if (timeoutId.current) window.clearTimeout(timeoutId.current);
    },
    []
  );

  const trigger = useCallback(() => {
    if (timeoutId.current) window.clearTimeout(timeoutId.current);
    setIsVisible(true);
    timeoutId.current = window.setTimeout(() => setIsVisible(false), durationMs);
  }, [durationMs]);

  return { isVisible, trigger };
}
