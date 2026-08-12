import type { CSSProperties } from "react";

type ProgressiveBlurProps = {
  className?: string;
  height?: string;
};

/** A restrained adaptation of Skiper 41 for the sticky marketing navigation. */
export function ProgressiveBlur({ className, height = "56px" }: ProgressiveBlurProps) {
  const style: CSSProperties = {
    height,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    maskImage: "linear-gradient(to bottom, black, transparent)",
    WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
  };

  return <div aria-hidden="true" className={className} style={style} />;
}
