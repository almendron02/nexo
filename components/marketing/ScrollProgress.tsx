"use client";

import { useEffect, useRef } from "react";

/** A minimal, non-floating interpretation of Skiper 89's scroll progress. */
export function ScrollProgress() {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      const progress = distance > 0 ? root.scrollTop / distance : 0;
      progressRef.current?.style.setProperty("--home-scroll-progress", String(progress));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <span ref={progressRef} aria-hidden="true" className="home-scroll-progress" />;
}
