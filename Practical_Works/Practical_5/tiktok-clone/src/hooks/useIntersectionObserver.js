"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Intersection Observer for infinite scroll (Practical 5).
 * Returns `[ref, isIntersecting]` — attach `ref` to a sentinel at the bottom of the feed.
 *
 * @param {{ enabled?: boolean; rootMargin?: string; threshold?: number }} [options]
 */
export default function useIntersectionObserver(options = {}) {
  const { enabled = true, rootMargin = "400px", threshold = 0 } = options;
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsIntersecting(false);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsIntersecting(Boolean(entries[0]?.isIntersecting));
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, rootMargin, threshold]);

  return [ref, isIntersecting];
}

/**
 * Callback-style observer (optional alternative).
 */
export function useIntersectionObserverCallback(onIntersect, options = {}) {
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
        if (entries[0]?.isIntersecting) cbRef.current();
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, rootMargin, threshold, watchKey]);

  return ref;
}
