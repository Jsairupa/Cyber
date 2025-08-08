"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  title: string
  summary: string
  date: string
  readTime: string
  link: string
  category: string
  image: string
  featured?: boolean
}

interface BlogPostCardProps {
  post: BlogPost
  index: number
}

export default function BlogPostCard({ post, index }: BlogPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      className="glass-card rounded-lg overflow-hidden hover:cyber-glow-box transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-background/80 to-transparent opacity-70"></div>
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-cyber-muted text-primary">{post.category}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between text-xs text-cyber-foreground/60 mb-3">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3 className="text-lg font-medium mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-cyber-foreground/70 mb-4 text-sm line-clamp-3">{post.summary}</p>

        <Link
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm"
        >
          Read More <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </motion.div>
  )
}
