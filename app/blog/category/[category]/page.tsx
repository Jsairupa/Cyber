import type { Metadata } from "next"
import type { PageProps } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBlogPostsByCategory, getBlogCategories } from "@/lib/blog-data"
import BlogPostStatic from "@/components/server/blog-post-static"
import { notFound } from "next/navigation"

// Generate static params for all categories
export async function generateStaticParams(): Promise<{ category: string }[]> {
  const categories = getBlogCategories()
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }))
}

// Generate dynamic metadata based on the category
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1)

  return {
    title: `${categoryName} Articles | Cybersecurity Portfolio`,
    description: `Read the latest articles on ${categoryName.toLowerCase()} topics in cybersecurity`,
  }
}

// Use ISR with revalidation every 24 hours
export const revalidate = 86400

export default async function CategoryPage({ params }: PageProps["params"]) {
  const categories = getBlogCategories()
  const matchedCategory = categories.find((cat) => cat.toLowerCase() === params.category.toLowerCase())

  if (!matchedCategory) {
    notFound()
  }

  const posts = getBlogPostsByCategory(matchedCategory)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-cyber-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Posts
            </Link>
          </Button>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="text-gradient">{matchedCategory}</span> Articles
            </h1>
            <p className="text-cyber-foreground/70 max-w-2xl mx-auto mb-8">
              Specialized insights on {matchedCategory.toLowerCase()} topics in cybersecurity.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <Link
              href="/blog"
              className="px-3 py-1.5 rounded-md text-sm transition-all bg-cyber-muted/50 text-cyber-foreground/70 hover:text-cyber-foreground"
            >
              All
            </Link>

            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog/category/${category.toLowerCase()}`}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  category === matchedCategory
                    ? "bg-primary text-white"
                    : "bg-cyber-muted/50 text-cyber-foreground/70 hover:text-cyber-foreground"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogPostStatic key={post.id} post={post} priority={index < 3} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
