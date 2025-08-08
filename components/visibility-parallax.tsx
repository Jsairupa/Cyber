"use client"

import { type ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useIntersection } from "@/hooks/use-intersection"
import { cn } from "@/lib/utils"

interface VisibilityParallaxProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down"
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export default function VisibilityParallax({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
  threshold = 0.1,
  rootMargin = "0px",
  once = true,
}: VisibilityParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibilityRef, isVisible] = useIntersection<HTMLDivElement>({
    threshold,
    rootMargin,
    once,
  })

  // Combine refs
  const combinedRef = (el: HTMLDivElement | null) => {
    containerRef.current = el
    if (typeof visibilityRef === "function") visibilityRef(el)
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Calculate parallax effect based on direction and speed
  const factor = direction === "down" ? speed : -speed
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * factor])

  return (
    <div ref={combinedRef} className={cn("overflow-hidden", className)}>
      {isVisible && (
        <motion.div style={{ y }} transition={{ type: "spring", stiffness: 100, damping: 30 }}>
          {children}
        </motion.div>
      )}
    </div>
  )
}
