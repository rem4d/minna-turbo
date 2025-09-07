import { useEffect, useState } from "react";

export default function useObserveRect(
  ref: React.RefObject<HTMLDivElement | null>,
) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const elem = ref?.current;
    if (!elem) return;

    const observer = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setWidth(w);
    });
    observer.observe(elem);

    return () => {
      observer.unobserve(elem);
    };
  }, [ref]);

  return { width };
}
