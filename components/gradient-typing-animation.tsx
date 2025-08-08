"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface GradientTypingAnimationProps {
  prefix: string
  gradientText?: string
  typingSpeed?: number
  className?: string
  prefixColor?: string
  gradientTextColor?: string
  spaceBetween?: boolean // New prop to control spacing
}

export default function GradientTypingAnimation({
  prefix,
  gradientText = "",
  typingSpeed = 100,
  className = "",
  prefixColor = "text-cyber-foreground", // Default to white text
  gradientTextColor = "text-gradient cyber-glow", // Default to gradient text with glow
  spaceBetween = false, // Default to no extra space
}: GradientTypingAnimationProps) {
  const [displayedPrefix, setDisplayedPrefix] = useState("")
  const [displayedGradient, setDisplayedGradient] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const typingRef = useRef<NodeJS.Timeout | null>(null)

  // Handle spacing - don't add space if spaceBetween is true (we'll add it separately)
  const prefixWithSpace = spaceBetween ? prefix : prefix.endsWith(" ") ? prefix : prefix + " "

  useEffect(() => {
    let currentIndex = 0
    setDisplayedPrefix("")
    setDisplayedGradient("")
    setIsTypingComplete(false)
    setShowCursor(true)

    const typeNextCharacter = () => {
      if (currentIndex < prefixWithSpace.length) {
        // Still typing the prefix
        setDisplayedPrefix((prev) => prev + prefixWithSpace.charAt(currentIndex))
        currentIndex++
        typingRef.current = setTimeout(typeNextCharacter, typingSpeed)
      } else if (gradientText && currentIndex < prefixWithSpace.length + gradientText.length) {
        // Typing the gradient text (only if it exists)
        const gradientIndex = currentIndex - prefixWithSpace.length
        setDisplayedGradient((prev) => prev + gradientText.charAt(gradientIndex))
        currentIndex++
        typingRef.current = setTimeout(typeNextCharacter, typingSpeed)
      } else {
        // Typing complete
        setIsTypingComplete(true)

        // Hide cursor after typing is complete
        setTimeout(() => {
          setShowCursor(false)
        }, 1000) // Hide cursor 1 second after typing completes
      }
    }

    typingRef.current = setTimeout(typeNextCharacter, typingSpeed)

    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current)
      }
    }
  }, [prefixWithSpace, gradientText, typingSpeed])

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className={prefixColor}>{displayedPrefix}</span>
      {/* Add a visible space when spaceBetween is true */}
      {spaceBetween && isTypingComplete && <span className={prefixColor}>&nbsp;</span>}
      {gradientText && <span className={gradientTextColor}>{displayedGradient}</span>}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1,
            repeatDelay: 0,
          }}
          className="ml-1 inline-block w-[0.1em] h-[1.2em] bg-primary"
        />
      )}
    </div>
  )
}
