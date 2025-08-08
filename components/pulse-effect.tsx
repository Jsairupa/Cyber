"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"

export default function PulseEffect() {
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number; size: number }[]>([])
  const isVisibleRef = useRef(false)

  useEffect(() => {
    // Use Intersection Observer to only run animation when visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("hero")
    if (element) {
      observer.observe(element)
    }

    // Create a new pulse at random intervals
    const interval = setInterval(() => {
      // Only add pulses when component is visible and limit the number
      if (isVisibleRef.current && pulses.length < 3) {
        // Reduced from 5 to 3
        const newPulse = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 15, // Reduced size
        }

        setPulses((prev) => [...prev, newPulse])

        // Remove the pulse after animation completes
        setTimeout(() => {
          setPulses((prev) => prev.filter((pulse) => pulse.id !== newPulse.id))
        }, 4000)
      }
    }, 3000) // Increased interval from 2000 to 3000

    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [pulses.length])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
      {pulses.map((pulse) => (
        <motion.div
          key={pulse.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${pulse.x}%`,
            top: `${pulse.y}%`,
            width: 3, // Reduced from 4
            height: 3, // Reduced from 4
          }}
          initial={{ opacity: 0.7 }} // Reduced from 0.8
          animate={{
            opacity: 0,
            scale: pulse.size,
          }}
          transition={{
            duration: 4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
