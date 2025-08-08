"use client"
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

interface FeaturedBlogPostProps {
  post: BlogPost
}

export default function FeaturedBlogPost({ post }: FeaturedBlogPostProps) {
  return (
    <div className="glass-card rounded-lg overflow-hidden hover:cyber-glow-box transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-background/80 to-transparent opacity-70"></div>
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">Featured</span>
          </div>
        </div>
        <div className="p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs px-2 py-1 rounded-md bg-cyber-muted text-primary inline-block">
              {post.category}
            </span>
            <div className="flex items-center text-cyber-foreground/60 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center text-cyber-foreground/60 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
          <h3 className="text-2xl font-medium mb-3">{post.title}</h3>
          <p className="text-cyber-foreground/70 mb-4">{post.summary}</p>
          <Link
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mt-auto"
          >
            Read Full Article <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
