"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"

const fadeUpVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

interface FadeUpProps extends HTMLMotionProps<"div"> {
  delay?: number
  children: React.ReactNode
}

export function FadeUp({ delay = 0, children, ...props }: FadeUpProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={reduced ? {} : fadeUpVariants}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function Stagger({ children, className, delay = 0 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      variants={reduced ? {} : fadeUpVariants}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { motion }
