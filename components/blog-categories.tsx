"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BlogCategoriesProps {
  categories: string[]
  activeCategory: string
  onChange: (category: string) => void
}

export default function BlogCategories({ categories, activeCategory, onChange }: BlogCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm transition-all",
          activeCategory === "all"
            ? "bg-primary text-white"
            : "bg-cyber-muted/50 text-cyber-foreground/70 hover:text-cyber-foreground",
        )}
        onClick={() => onChange("all")}
      >
        All
      </motion.button>

      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm transition-all",
            activeCategory === category
              ? "bg-primary text-white"
              : "bg-cyber-muted/50 text-cyber-foreground/70 hover:text-cyber-foreground",
          )}
          onClick={() => onChange(category)}
        >
          {category}
        </motion.button>
      ))}
    </div>
  )
}
