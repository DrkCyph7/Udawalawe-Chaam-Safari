'use client'

/**
 * BlurText — inspired by reactbits.dev/text-animations/blur-text
 * Animates each word (or char) in with a blur + fade + vertical slide.
 * Fully Framer Motion, no GSAP dependency.
 */

import { useRef } from 'react'
import { motion, useInView, type Variants, type Transition } from 'framer-motion'

interface BlurTextProps {
  text: string
  animateBy?: 'words' | 'chars'
  delay?: number
  className?: string
  rootMargin?: string
  direction?: 'up' | 'down'
  block?: boolean
}

const ITEM_TRANSITION: Transition = { type: 'spring', stiffness: 56, damping: 20, mass: 1 }

export function BlurText({
  text,
  animateBy = 'words',
  delay = 0.07,
  className = '',
  rootMargin = '-60px 0px',
  direction = 'up',
  block = false,
}: BlurTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: rootMargin as `${number}px ${number}px` })

  const tokens = animateBy === 'words' ? text.split(' ') : text.split('')

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: delay } },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : -30,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: ITEM_TRANSITION,
    },
  }

  const tokenSpans = tokens.map((token, i) => (
    <motion.span
      key={i}
      variants={itemVariants}
      style={{ display: 'inline-block', whiteSpace: 'pre' }}
    >
      {token}
      {animateBy === 'words' && i < tokens.length - 1 ? '\u00a0' : ''}
    </motion.span>
  ))

  if (block) {
    return (
      <motion.div
        ref={ref}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {tokenSpans}
      </motion.div>
    )
  }

  return (
    <motion.span
      // framer-motion span accepts HTMLSpanElement ref but we use div ref — cast is safe
      ref={ref as unknown as React.RefObject<HTMLSpanElement>}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      style={{ display: 'inline' }}
    >
      {tokenSpans}
    </motion.span>
  )
}
