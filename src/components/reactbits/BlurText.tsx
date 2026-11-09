"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
}

export function BlurText({
  text,
  delay = 40,
  className = "",
  animateBy = "words",
  direction = "bottom",
  threshold = 0.1,
  rootMargin = "0px",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          initial={{
            filter: "blur(8px)",
            opacity: 0,
            y: direction === "top" ? -12 : 12,
          }}
          animate={
            inView
              ? {
                  filter: "blur(0px)",
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.4,
            delay: (index * delay) / 1000,
            ease: [0.25, 1, 0.5, 1],
          }}
          className="inline-block"
        >
          {segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </div>
  );
}

