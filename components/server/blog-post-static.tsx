import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/blog-data"

interface BlogPostStaticProps {
  post: BlogPost
  priority?: boolean
}

export default function BlogPostStatic({ post, priority = false }: BlogPostStaticProps) {
  return (
    <div className="glass-card rounded-lg overflow-hidden hover:cyber-glow-box transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={post.image || "/placeholder.svg?height=600&width=800"}
          alt={post.title}
          width={800}
          height={600}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
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
    </div>
  )
}
