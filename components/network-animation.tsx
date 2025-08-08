"use client"

import { useEffect, useRef, useState } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  connections: number[]
}

export default function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [isVisible, setIsVisible] = useState(false)
  const nodesRef = useRef<Node[]>([])
  const lastFrameTimeRef = useRef<number>(0)

  useEffect(() => {
    // Only initialize the animation when the component is in the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.1 },
    )

    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { innerWidth, innerHeight } = window
      canvas.width = innerWidth
      canvas.height = innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create nodes
    const nodeCount = Math.min(Math.floor(window.innerWidth / 150), 15) // Reduced node count
    const nodes: Node[] = []
    const connectionDistance = Math.min(window.innerWidth / 6, 180) // Reduced connection distance

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2, // Reduced velocity
        vy: (Math.random() - 0.5) * 0.2, // Reduced velocity
        radius: Math.random() * 1.5 + 1, // Smaller radius
        connections: [],
      })
    }

    nodesRef.current = nodes

    // Animation function with frame rate limiting
    const animate = (timestamp: number) => {
      // Limit to ~30fps for better performance
      if (timestamp - lastFrameTimeRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      lastFrameTimeRef.current = timestamp

      // Skip animation if not visible
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update node positions
      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Reset connections
        node.connections = []
      })

      // Find connections - only check every other frame for performance
      if (timestamp % 2 === 0) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x
            const dy = nodes[i].y - nodes[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < connectionDistance) {
              nodes[i].connections.push(j)
              nodes[j].connections.push(i)
            }
          }
        }
      }

      // Draw connections
      ctx.lineWidth = 0.5
      nodes.forEach((node, i) => {
        node.connections.forEach((j) => {
          const targetNode = nodes[j]
          const dx = targetNode.x - node.x
          const dy = targetNode.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const opacity = 1 - distance / connectionDistance

          // Draw line with gradient
          const gradient = ctx.createLinearGradient(node.x, node.y, targetNode.x, targetNode.y)
          gradient.addColorStop(0, `rgba(14, 165, 233, ${opacity * 0.15})`) // Reduced opacity
          gradient.addColorStop(1, `rgba(99, 102, 241, ${opacity * 0.15})`) // Reduced opacity

          ctx.beginPath()
          ctx.strokeStyle = gradient
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(targetNode.x, targetNode.y)
          ctx.stroke()

          // Animate data packet along the connection - reduced frequency
          if (Math.random() < 0.005) {
            // Reduced probability
            const packetPos = Math.random()
            const packetX = node.x + dx * packetPos
            const packetY = node.y + dy * packetPos

            ctx.beginPath()
            ctx.fillStyle = Math.random() < 0.5 ? "rgba(14, 165, 233, 0.7)" : "rgba(99, 102, 241, 0.7)"
            ctx.arc(packetX, packetY, 1.5, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      })

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius)
        gradient.addColorStop(0, "rgba(14, 165, 233, 0.7)") // Reduced opacity
        gradient.addColorStop(1, "rgba(14, 165, 233, 0)")
        ctx.fillStyle = gradient
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [isVisible])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" style={{ pointerEvents: "none" }} />
}
