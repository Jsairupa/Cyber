"use client"

import type { ReactNode } from "react"
import { AnimatePresence } from "framer-motion"

interface FramerProviderProps {
  children: ReactNode
}

export default function FramerProvider({ children }: FramerProviderProps) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>
}
