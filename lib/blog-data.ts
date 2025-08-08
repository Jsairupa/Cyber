// This file contains static blog data that can be pre-rendered

export interface BlogPost {
  id: string
  title: string
  summary: string
  date: string
  readTime: string
  link: string
  category: string
  image: string
  featured?: boolean
}

// Static blog data
export const blogPosts: BlogPost[] = [
  {
    id: "quantum-cryptography",
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
    id: "zero-trust",
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
    id: "secure-design",
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
    id: "threat-hunting",
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

// Get all blog categories
export function getBlogCategories(): string[] {
  const categories = blogPosts.map((post) => post.category)
  return [...new Set(categories)]
}

// Get all blog posts
export function getAllBlogPosts(): BlogPost[] {
  return blogPosts
}

// Get featured blog post
export function getFeaturedBlogPost(): BlogPost | undefined {
  return blogPosts.find((post) => post.featured)
}

// Get blog posts by category
export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (category === "all") {
    return blogPosts
  }
  return blogPosts.filter((post) => post.category === category)
}

// Get blog post by ID
export function getBlogPostById(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id)
}
