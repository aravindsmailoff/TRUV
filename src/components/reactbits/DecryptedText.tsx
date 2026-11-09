"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover";
}

export function DecryptedText({
  text,
  speed = 45,
  maxIterations = 8,
  sequential = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$<>_",
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  animateOn = "hover",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrolledIntoView, setIsScrolledIntoView] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIteration = 0;

    const shouldAnimate =
      (animateOn === "hover" && isHovering) ||
      (animateOn === "view" && isScrolledIntoView);

    if (shouldAnimate) {
      const textArray = text.split("");
      interval = setInterval(() => {
        setDisplayText(
          textArray
            .map((char, index) => {
              if (char === " ") return " ";
              if (currentIteration >= maxIterations) return char;
              if (sequential) {
                const threshold = (currentIteration / maxIterations) * textArray.length;
                if (index < threshold) return char;
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("")
        );

        currentIteration++;
        if (currentIteration > maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, speed);
    } else {
      setDisplayText(text);
    }

    return () => clearInterval(interval);
  }, [isHovering, isScrolledIntoView, animateOn, text, speed, maxIterations, sequential, characters]);

  useEffect(() => {
    if (animateOn !== "view") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsScrolledIntoView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [animateOn]);

  return (
    <motion.span
      ref={elementRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className={className}>
        {displayText.split("").map((char, index) => {
          const isDecrypted = char === text[index];
          return (
            <span
              key={index}
              className={isDecrypted ? className : encryptedClassName || "text-[#b2eb76] opacity-90"}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}

