import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllBlogPosts, getFeaturedBlogPost, getBlogCategories } from "@/lib/blog-data"
import BlogPostStatic from "@/components/server/blog-post-static"
import FeaturedBlogPost from "@/components/featured-blog-post"

// Generate static metadata
export const metadata: Metadata = {
  title: "Blog | Cybersecurity Portfolio",
  description: "Read the latest articles on cybersecurity topics and research",
}

// Use ISR with revalidation every 24 hours
export const revalidate = 86400

export default function BlogPage() {
  // Get blog data
  const allPosts = getAllBlogPosts()
  const featuredPost = getFeaturedBlogPost()
  const categories = getBlogCategories()

  // Filter out the featured post from regular posts
  const regularPosts = featuredPost ? allPosts.filter((post) => post.id !== featuredPost.id) : allPosts

  return (
    <div className="min-h-screen bg-cyber-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Blog <span className="text-gradient">Posts</span>
            </h1>
            <p className="text-cyber-foreground/70 max-w-2xl mx-auto mb-8">
              Insights and analysis on the latest trends and developments in cybersecurity.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <Link href="/blog" className="px-3 py-1.5 rounded-md text-sm transition-all bg-primary text-white">
              All
            </Link>

            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog/category/${category.toLowerCase()}`}
                className="px-3 py-1.5 rounded-md text-sm transition-all bg-cyber-muted/50 text-cyber-foreground/70 hover:text-cyber-foreground"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-12">
              <FeaturedBlogPost post={featuredPost} />
            </div>
          )}

          {/* Regular Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <BlogPostStatic
                key={post.id}
                post={post}
                priority={index < 3} // Only prioritize the first 3 posts
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
