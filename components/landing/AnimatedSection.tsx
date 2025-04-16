"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    variants?: Variants;
    initial?: string;
    whileInView?: string;
    viewport?: object;
    tag?: keyof typeof motion;
}

const defaultFadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function AnimatedSection({
    children,
    className,
    variants = defaultFadeIn,
    initial = "hidden",
    whileInView = "visible",
    viewport = { once: true },
    tag = 'div'
}: AnimatedSectionProps) {

    const MotionComponent = (motion[tag as keyof typeof motion] ?? motion.div) as React.ElementType;
    
    return (
        <MotionComponent
            className={className}
            variants={variants}
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
        >
            {children}
        </MotionComponent>
    );
}