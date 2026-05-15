"use client";

import { useEffect, useRef } from "react";

/**
 * @param {() => void} onIntersect
 * @param {{ enabled?: boolean; rootMargin?: string; threshold?: number; watchKey?: unknown }} [options]
 */
export function useIntersectionObserver(onIntersect, options = {}) {
  const { enabled = true, rootMargin = "400px", threshold = 0, watchKey = 0 } = options;
  const ref = useRef(null);
  const cbRef = useRef(onIntersect);
  cbRef.current = onIntersect;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          cbRef.current();
        }
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, rootMargin, threshold, watchKey]);

  return ref;
}
