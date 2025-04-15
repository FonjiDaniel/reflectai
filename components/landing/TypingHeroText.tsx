"use client";

import React from 'react';
import { TypeAnimation } from 'react-type-animation';

interface TypingHeroTextProps {
    textLines: (string | number)[]; // Array of strings and pause durations
    className?: string;
    highlightClassName?: string;
}

export default function TypingHeroText({ textLines, className, highlightClassName }: TypingHeroTextProps) {
  return (
    <h2 className={className}>
      Transform Your{' '}
      <span className={highlightClassName}>
        <TypeAnimation
          sequence={textLines}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          cursor={true}
        />
      </span>{' '}
      Into Insights
    </h2>
  );
}