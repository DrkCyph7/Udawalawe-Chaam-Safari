'use client'

/**
 * CountUp — inspired by reactbits.dev/text-animations/count-up
 * Animates a number from 0 to `to` when in view, using Framer Motion's
 * useMotionValue + useTransform approach (no GSAP required).
 */

import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring, motion } from 'framer-motion'

interface CountUpProps {
  to: number
  /** Prefix rendered before the number, e.g. '$' */
  prefix?: string
  /** Suffix rendered after the number, e.g. '+' or '%' */
  suffix?: string
  /** Decimals to show */
  decimals?: number
  /** Spring stiffness */
  stiffness?: number
  /** Spring damping */
  damping?: number
  className?: string
}

export function CountUp({
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  stiffness = 50,
  damping = 20,
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, { stiffness, damping })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (inView) motionVal.set(to)
  }, [inView, to, motionVal])

  useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      setDisplay(latest.toFixed(decimals))
    })
    return unsubscribe
  }, [springVal, decimals])

  return (
    <motion.span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </motion.span>
  )
}
