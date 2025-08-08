"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import FeaturedBlogPost from "./featured-blog-post"
import BlogPostCard from "./blog-post-card"

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

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const blogPosts: BlogPost[] = [
    {
      title: "The Future of Quantum-Resistant Cryptography",
      summary:
        "Exploring the evolution of cryptographic algorithms designed to withstand quantum computing attacks. As quantum computers become more powerful, traditional encryption methods face unprecedented challenges.",
      date: "Mar 15, 2023",
      readTime: "8 min read",
      link: "https://example.com/blog/quantum-cryptography",
      category: "Cryptography",
      image: "/placeholder.svg?height=600&width=800",
      featured: true,
    },
    {
      title: "Zero Trust Architecture Implementation",
      summary:
        "How combining traditional security principles with innovative methodologies can create truly resilient systems. Zero Trust assumes breach and verifies each request as though it originates from an open network.",
      date: "Feb 28, 2023",
      readTime: "10 min read",
      link: "https://example.com/blog/zero-trust",
      category: "Architecture",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "The Art and Science of Secure System Design",
      summary:
        "Balancing technical requirements with creative problem-solving in modern security architecture. Security should be built into systems from the ground up, not added as an afterthought.",
      date: "Jan 12, 2023",
      readTime: "6 min read",
      link: "https://example.com/blog/secure-design",
      category: "Design",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "Threat Hunting Techniques for Modern Networks",
      summary:
        "Advanced methodologies for proactively identifying and neutralizing threats in complex network environments. Threat hunting goes beyond traditional monitoring to actively search for signs of compromise.",
      date: "Dec 05, 2022",
      readTime: "12 min read",
      link: "https://example.com/blog/threat-hunting",
      category: "Threat Detection",
      image: "/placeholder.svg?height=600&width=800",
    },
  ]

  // Use all blog posts (no filtering)
  const displayedPosts = blogPosts

  // Separate featured post from regular posts
  const featuredPost = displayedPosts.find((post) => post.featured)
  const regularPosts = displayedPosts.filter((post) => !post.featured)

  return (
    <section id="blog" ref={sectionRef} className="py-20 relative bg-cyber-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Blog <span className="text-gradient">Posts</span>
            </h2>
            <p className="text-cyber-foreground/70 max-w-2xl mx-auto mb-8">
              Insights and analysis on the latest trends and developments in cybersecurity.
            </p>
          </motion.div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <FeaturedBlogPost post={featuredPost} />
            </motion.div>
          )}

          {/* Regular Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <BlogPostCard key={index} post={post} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              href="https://medium.com/@rahulisa501"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-lg border-b border-primary pb-1"
            >
              View All Posts <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
