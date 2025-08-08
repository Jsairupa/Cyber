"use client"

import { useEffect, useState, lazy, Suspense } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Hero from "@/components/hero"
import About from "@/components/about"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Lazy load below-the-fold components
const Skills = lazy(() => import("@/components/skills"))
const Experience = lazy(() => import("@/components/experience"))
const Projects = lazy(() => import("@/components/projects"))
const Certifications = lazy(() => import("@/components/certifications"))
const Blog = lazy(() => import("@/components/blog"))
const Contact = lazy(() => import("@/components/contact"))
const Footer = lazy(() => import("@/components/footer"))

// Loading fallback component
const SectionLoading = () => (
  <div className="py-20 flex justify-center items-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
)

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sectionsVisible, setSectionsVisible] = useState({
    skills: false,
    experience: false,
    projects: false,
    certifications: false,
    blog: false,
    contact: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Determine active section based on scroll position
      // Order matches the new content flow
      const sections = ["hero", "about", "skills", "experience", "projects", "certifications", "blog", "contact"]

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200) {
            setActiveSection(section)
            break
          }
        }
      }

      // Check which sections are in viewport or about to be in viewport
      // This triggers lazy loading before the user actually sees the section
      const viewportHeight = window.innerHeight
      const buffer = 500 // Load when section is 500px away from viewport

      const checkSection = (id, stateKey) => {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top < viewportHeight + buffer) {
            setSectionsVisible((prev) => ({ ...prev, [stateKey]: true }))
          }
        }
      }

      checkSection("skills", "skills")
      checkSection("experience", "experience")
      checkSection("projects", "projects")
      checkSection("certifications", "certifications")
      checkSection("blog", "blog")
      checkSection("contact", "contact")
    }

    window.addEventListener("scroll", handleScroll)
    // Trigger once on mount to check initial viewport
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Close the mobile menu first
      setMobileMenuOpen(false)

      // Small delay to ensure menu closing animation doesn't interfere with scrolling
      setTimeout(() => {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: "smooth",
        })
      }, 10)
    }
  }

  // Update navigation items to match the new content flow order
  const navItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "blog", label: "Blog" },
  ]

  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none z-0"></div>

      {/* Noise overlay */}
      <div className="fixed inset-0 noise-bg pointer-events-none z-0"></div>

      {/* Gradient orbs */}
      <div className="fixed top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
      <div className="fixed top-3/4 left-1/3 w-60 h-60 bg-accent/20 rounded-full blur-3xl opacity-20 animate-pulse-slow pointer-events-none"></div>

      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "py-3 bg-cyber-background/80 backdrop-blur-lg border-b border-cyber-border/50" : "py-5",
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <div className="flex justify-end w-24 md:w-32">
              <button
                onClick={() => scrollToSection("hero")}
                className="relative h-10 w-10 md:h-14 md:w-14 transition-all duration-300 cursor-pointer hover:scale-105"
                aria-label="Return to top"
              >
                <Image
                  src="/favicon.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(32%) sepia(95%) saturate(2270%) hue-rotate(10deg) brightness(98%) contrast(95%) drop-shadow(0 0 8px #e9460e)",
                  }}
                  priority
                />
              </button>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeSection === item.id
                    ? "text-cyber-foreground bg-cyber-muted/50"
                    : "text-cyber-foreground/70 hover:text-cyber-foreground hover:bg-cyber-muted/30",
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => scrollToSection("contact")}
                className="ml-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
              >
                Get in Touch
              </Button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-cyber-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-cyber-card/95 backdrop-blur-lg border-b border-cyber-border"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "px-4 py-3 rounded-md text-left text-sm font-medium transition-all",
                      activeSection === item.id
                        ? "text-cyber-foreground bg-cyber-muted/50"
                        : "text-cyber-foreground/70 hover:text-cyber-foreground hover:bg-cyber-muted/30",
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
                >
                  <Button
                    onClick={() => scrollToSection("contact")}
                    className="w-full mt-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                  >
                    Get in Touch
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content - Reorganized according to the new sequence */}
      <main>
        <Hero scrollToSection={scrollToSection} />
        <About />

        {/* Lazy loaded sections */}
        <section id="skills">
          {sectionsVisible.skills && (
            <Suspense fallback={<SectionLoading />}>
              <Skills />
            </Suspense>
          )}
        </section>

        <section id="experience">
          {sectionsVisible.experience && (
            <Suspense fallback={<SectionLoading />}>
              <Experience />
            </Suspense>
          )}
        </section>

        <section id="projects">
          {sectionsVisible.projects && (
            <Suspense fallback={<SectionLoading />}>
              <Projects />
            </Suspense>
          )}
        </section>

        <section id="certifications">
          {sectionsVisible.certifications && (
            <Suspense fallback={<SectionLoading />}>
              <Certifications />
            </Suspense>
          )}
        </section>

        <section id="blog">
          {sectionsVisible.blog && (
            <Suspense fallback={<SectionLoading />}>
              <Blog />
            </Suspense>
          )}
        </section>

        <section id="contact">
          {sectionsVisible.contact && (
            <Suspense fallback={<SectionLoading />}>
              <Contact />
            </Suspense>
          )}
        </section>
      </main>

      <Suspense fallback={null}>{sectionsVisible.contact && <Footer />}</Suspense>
    </div>
  )
}
