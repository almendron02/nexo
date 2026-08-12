"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type CrowdCanvasProps = {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
};

type Stage = {
  width: number;
  height: number;
};

type Peep = {
  image: HTMLImageElement;
  rect: [number, number, number, number];
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
};

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

function removeRandom<T>(items: T[]) {
  return items.splice(Math.floor(Math.random() * items.length), 1)[0];
}

function renderPeep(context: CanvasRenderingContext2D, peep: Peep) {
  context.save();
  context.translate(peep.x, peep.y);
  context.scale(peep.scaleX, 1);
  context.drawImage(
    peep.image,
    peep.rect[0],
    peep.rect[1],
    peep.rect[2],
    peep.rect[3],
    0,
    0,
    peep.width,
    peep.height,
  );
  context.restore();
}

/**
 * Adapted from Skiper 39's CrowdCanvas and the original Crowd Simulator.
 * The motion is intentionally secondary to the page content and becomes a
 * static crowd when the learner prefers reduced motion.
 */
export function CrowdCanvas({
  src,
  rows = 15,
  cols = 7,
  className,
}: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    const stage: Stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let initialized = false;

    const draw = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(pixelRatio, pixelRatio);
      crowd.forEach((peep) => renderPeep(context, peep));
      context.restore();
    };

    const resetPeep = (peep: Peep) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const depth = stage.height <= 300 ? 18 : Math.min(110, stage.height * 0.28);
      const offsetY = -12 - depth * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width : -peep.width;

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      peep.scaleX = direction;

      return { startY, endX };
    };

    const removePeep = (peep: Peep) => {
      const index = crowd.indexOf(peep);
      if (index >= 0) crowd.splice(index, 1);
      availablePeeps.push(peep);
    };

    const addPeep = () => {
      if (disposed || availablePeeps.length === 0) return;

      const peep = removeRandom(availablePeeps);
      const { startY, endX } = resetPeep(peep);
      const horizontalDuration = 10;
      const bobDuration = 0.25;
      const walk = gsap.timeline({
        onComplete: () => {
          removePeep(peep);
          addPeep();
        },
      });

      walk.timeScale(randomRange(0.55, 1.35));
      walk.to(peep, { duration: horizontalDuration, x: endX, ease: "none" }, 0);
      walk.to(
        peep,
        {
          duration: bobDuration,
          repeat: horizontalDuration / bobDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      walk.progress(Math.random());
    };

    const createPeeps = () => {
      const frameWidth = image.naturalWidth / rows;
      const frameHeight = image.naturalHeight / cols;
      const total = rows * cols;

      for (let index = 0; index < total; index += 1) {
        allPeeps.push({
          image,
          rect: [
            (index % rows) * frameWidth,
            Math.floor(index / rows) * frameHeight,
            frameWidth,
            frameHeight,
          ],
          width: frameWidth,
          height: frameHeight,
          x: 0,
          y: 0,
          anchorY: 0,
          scaleX: 1,
          walk: null,
        });
      }
    };

    const buildStaticCrowd = () => {
      const visibleCount = Math.min(allPeeps.length, Math.max(10, Math.ceil(stage.width / 72)));
      const spacing = stage.width / Math.max(visibleCount - 1, 1);
      crowd.push(...allPeeps.slice(0, visibleCount));
      crowd.forEach((peep, index) => {
        peep.x = index * spacing - peep.width * 0.48;
        peep.y = stage.height - peep.height - 12 - (index % 3) * 18;
        peep.anchorY = peep.y;
        peep.scaleX = index % 2 === 0 ? 1 : -1;
      });
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      draw();
    };

    const resize = () => {
      if (!initialized || disposed) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = Math.round(stage.width * pixelRatio);
      canvas.height = Math.round(stage.height * pixelRatio);

      const figureScale = Math.min(1.3, Math.max(0.65, stage.height / 430));
      allPeeps.forEach((peep) => {
        peep.width = peep.rect[2] * figureScale;
        peep.height = peep.rect[3] * figureScale;
      });

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;

      if (reduceMotion) {
        buildStaticCrowd();
        return;
      }

      availablePeeps.push(...allPeeps);
      const crowdSize = Math.min(allPeeps.length, Math.max(18, Math.ceil(stage.width / 34)));
      for (let index = 0; index < crowdSize; index += 1) addPeep();
    };

    const initialize = () => {
      if (disposed) return;
      createPeeps();
      initialized = true;
      resize();
      if (!reduceMotion) gsap.ticker.add(draw);
    };

    image.onload = initialize;
    image.src = src;
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      image.onload = null;
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(draw);
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [cols, rows, src]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="An animated crowd representing Nexo learners from many backgrounds"
      role="img"
    />
  );
}

/**
 * Credits: Skiper UI component 39, Szenia Zadvornykh's Crowd Simulator,
 * and Open Peeps illustrations by Pablo Stanley.
 */
