"use client"

import { type ReactNode, useState } from "react"
import { useIntersection } from "@/hooks/use-intersection"
import { cn } from "@/lib/utils"

interface VisibilitySectionProps {
  children: ReactNode
  id?: string
  className?: string
  threshold?: number
  rootMargin?: string
  once?: boolean
  fallback?: ReactNode
  preloadDistance?: string
  delay?: number
}

export default function VisibilitySection({
  children,
  id,
  className = "",
  threshold = 0.1,
  rootMargin = "200px", // Preload content before it enters viewport
  once = true,
  fallback,
  preloadDistance = "800px", // Distance to start preloading content
  delay = 0,
}: VisibilitySectionProps) {
  const [isContentLoaded, setIsContentLoaded] = useState(false)

  // First observer to detect when we should preload the content
  const [preloadRef, shouldPreload] = useIntersection<HTMLDivElement>({
    threshold: 0,
    rootMargin: preloadDistance,
    once: true,
  })

  // Second observer to detect when the section is actually visible
  const [visibilityRef, isVisible] = useIntersection<HTMLDivElement>({
    threshold,
    rootMargin,
    once,
    delay,
  })

  // Preload content when approaching the section
  if (shouldPreload && !isContentLoaded) {
    setIsContentLoaded(true)
  }

  return (
    <section
      id={id}
      ref={(el) => {
        // Assign both refs to the same element
        if (el) {
          if (typeof preloadRef === "function") preloadRef(el)
          if (typeof visibilityRef === "function") visibilityRef(el)
        }
      }}
      className={cn("relative", className)}
    >
      {isContentLoaded ? (
        <div className={cn("transition-opacity duration-500", isVisible ? "opacity-100" : "opacity-0")}>{children}</div>
      ) : (
        fallback || (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )
      )}
    </section>
  )
}
