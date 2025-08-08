"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface StaggerItemProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  index?: number
}

export default function StaggerItem({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  index = 0,
}: StaggerItemProps) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay: delay + index * 0.1,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  )
}
