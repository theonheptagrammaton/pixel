"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import { AnimationType } from "@/types/template";

const ANIMATION_STYLES: Record<AnimationType, { hidden: CSSProperties; visible: CSSProperties }> = {
  "fade-up": {
    hidden: { opacity: 0, transform: "translateY(28px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-left": {
    hidden: { opacity: 0, transform: "translateX(-40px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  "slide-right": {
    hidden: { opacity: 0, transform: "translateX(40px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  scale: {
    hidden: { opacity: 0, transform: "scale(0.92)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
  none: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
};

export function useScrollAnimation(disabled = false, animation: AnimationType = "fade-up") {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled]);

  const styles = ANIMATION_STYLES[animation] ?? ANIMATION_STYLES["fade-up"];

  const animationStyle: CSSProperties = {
    transition: "opacity 0.7s ease, transform 0.7s ease",
    ...(visible ? styles.visible : styles.hidden),
  };

  return { ref, visible, animationStyle };
}
