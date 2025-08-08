"use client"

import { useState, useEffect, useRef, type RefObject } from "react"

interface UseIntersectionOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
  delay?: number
}

export function useIntersection<T extends Element>(options: UseIntersectionOptions = {}): [RefObject<T>, boolean] {
  const { root = null, rootMargin = "0px", threshold = 0, once = false, delay = 0 } = options

  const ref = useRef<T>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTimerElapsed, setHasTimerElapsed] = useState(delay === 0)

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setHasTimerElapsed(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [delay])

  useEffect(() => {
    if (!hasTimerElapsed) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting

        // Update state only if needed
        if (isIntersecting !== isElementIntersecting) {
          setIsIntersecting(isElementIntersecting)

          // Unobserve after first intersection if once is true
          if (once && isElementIntersecting && element) {
            observer.unobserve(element)
          }
        }
      },
      { root, rootMargin, threshold },
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [root, rootMargin, threshold, once, hasTimerElapsed, isIntersecting])

  return [ref, isIntersecting]
}
