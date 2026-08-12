"use client";

import { useEffect } from "react";
import { playInterfaceSound } from "@/lib/interface-sound";

const interactiveSelector = [
  "a[href]",
  "button",
  "summary",
  "input[type='checkbox']",
  "input[type='radio']",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
  "[role='menuitem']",
].join(",");

export function InterfaceSoundController() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-interface-sound='none']")) return;

      let control = event.target.closest<HTMLElement>(interactiveSelector);
      if (!control) {
        const label = event.target.closest<HTMLLabelElement>("label");
        if (label?.control?.matches("input[type='checkbox'], input[type='radio']")) control = label.control;
      }

      if (!control || control.hasAttribute("disabled") || control.getAttribute("aria-disabled") === "true") return;
      playInterfaceSound();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
