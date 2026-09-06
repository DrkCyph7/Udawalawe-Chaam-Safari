'use client'

/**
 * GradientText — inspired by reactbits.dev/text-animations/gradient-text
 * A shimmering animated gradient that sweeps across the text continuously.
 * Uses CSS keyframes via Framer Motion's motion.span + inline style.
 */

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  /** Gradient stop colors */
  colors?: string[]
  /** Speed of sweep in seconds */
  speed?: number
}

export function GradientText({
  children,
  className = '',
  colors = ['#d1a05d', '#e8c88a', '#b47b42', '#f0d8a0', '#d1a05d'],
  speed = 5,
}: GradientTextProps) {
  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`

  return (
    <motion.span
      className={className}
      style={{
        backgroundImage: gradient,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
        animation: `gradient-sweep ${speed}s linear infinite`,
      }}
    >
      {children}
    </motion.span>
  )
}
