"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useIntersection } from "@/hooks/use-intersection"
import { cn } from "@/lib/utils"

interface VisibilityImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  threshold?: number
  rootMargin?: string
  once?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  sizes?: string
  quality?: number
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
}

export default function VisibilityImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  threshold = 0.1,
  rootMargin = "200px", // Load images before they enter viewport
  once = true,
  placeholder = "empty",
  blurDataURL,
  sizes,
  quality,
  fill = false,
  style,
  onLoad,
}: VisibilityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [ref, isVisible] = useIntersection<HTMLDivElement>({
    threshold,
    rootMargin,
    once,
  })

  // If priority is true, always render the image regardless of visibility
  const shouldRender = priority || isVisible

  const handleImageLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  return (
    <div ref={ref} className={cn("overflow-hidden relative", fill ? "w-full h-full" : "", className)} style={style}>
      {shouldRender ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          className={cn("transition-opacity duration-500", isLoaded ? "opacity-100" : "opacity-0", className)}
          onLoad={handleImageLoad}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes}
          quality={quality}
          fill={fill}
        />
      ) : (
        // Placeholder div with the same dimensions
        <div
          className="bg-cyber-muted/20 animate-pulse"
          style={{
            width: fill ? "100%" : width,
            height: fill ? "100%" : height,
            aspectRatio: width && height ? `${width} / ${height}` : undefined,
          }}
        />
      )}
    </div>
  )
}
