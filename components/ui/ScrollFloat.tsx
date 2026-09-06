'use client'

/**
 * ScrollFloat — inspired by reactbits.dev/text-animations/scroll-float
 * Each character floats up as you scroll through it, driven by
 * Framer Motion's useScroll + useTransform per-character offsets.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'

interface ScrollFloatProps {
  children: string
  className?: string
  amplitude?: number
}

export function ScrollFloat({
  children,
  className = '',
  amplitude = 50,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const chars = children.split('')

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end 30%'],
  })

  const smoothed = useSpring(scrollYProgress, { stiffness: 60, damping: 22 })

  return (
    <span ref={containerRef} className={className} aria-label={children}>
      {chars.map((char, i) => (
        <ScrollChar
          key={i}
          char={char}
          progress={smoothed}
          total={chars.length}
          index={i}
          amplitude={amplitude}
        />
      ))}
    </span>
  )
}

function ScrollChar({
  char,
  progress,
  total,
  index,
  amplitude,
}: {
  char: string
  progress: MotionValue<number>
  total: number
  index: number
  amplitude: number
}) {
  const start = index / total
  const end = Math.min((index + 1.2) / total, 1)

  const y = useTransform(progress, [start, end], [amplitude, 0])
  const opacity = useTransform(progress, [start, end], [0, 1])

  return (
    <motion.span
      style={{
        display: 'inline-block',
        y,
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      {char === ' ' ? '\u00a0' : char}
    </motion.span>
  )
}
