"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useIntersection } from "@/hooks/use-intersection"

type AnimationDirection = "up" | "down" | "left" | "right" | "fade"

interface VisibilityAnimationProps {
  children: ReactNode
  direction?: AnimationDirection
  duration?: number
  delay?: number
  className?: string
  once?: boolean
  threshold?: number
  rootMargin?: string
  staggerChildren?: boolean
  staggerDelay?: number
}

export default function VisibilityAnimation({
  children,
  direction = "up",
  duration = 0.5,
  delay = 0,
  className = "",
  once = true,
  threshold = 0.1,
  rootMargin = "0px",
  staggerChildren = false,
  staggerDelay = 0.1,
}: VisibilityAnimationProps) {
  const [ref, isVisible] = useIntersection<HTMLDivElement>({
    threshold,
    rootMargin,
    once,
  })

  // Define animation variants based on direction
  const getVariants = () => {
    switch (direction) {
      case "up":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              ease: "easeOut",
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
      case "down":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              ease: "easeOut",
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
      case "left":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
              ease: "easeOut",
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
      case "right":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
              ease: "easeOut",
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
      case "fade":
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: "easeOut",
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
    }
  }

  const variants = getVariants()

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
