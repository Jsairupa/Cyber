"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowDown, Shield, Lock, Code, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import NetworkAnimation from "./network-animation"
import PulseEffect from "./pulse-effect"
import GradientTypingAnimation from "./gradient-typing-animation"
import UltraSimpleModal from "./ultra-simple-modal"
import { downloadFile } from "@/lib/utils"
import VisibilityAnimation from "./visibility-animation"

interface HeroProps {
  scrollToSection: (sectionId: string) => void
}

export default function Hero({ scrollToSection }: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Only run client-side code after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Add class to body when modal is open to prevent scrolling
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }

    return () => {
      document.body.classList.remove("modal-open")
    }
  }, [isModalOpen])

  const handleDownloadClick = () => {
    setIsModalOpen(true)
    setDownloadError(null)
  }

  // Handle verification success and initiate download
  const handleVerified = async (token: string) => {
    setIsDownloading(true)
    setDownloadError(null)

    try {
      console.log("Verification successful, initiating secure download...")

      // Call our secure server action instead of using the hardcoded URL
      const { success, url, directUrl, message } = await import("@/app/actions/secure-download").then((module) =>
        module.getSecureDownloadUrl(token),
      )

      if (success && url) {
        try {
          // First try the secure URL
          await downloadFile(url, "Rahul_Itha_eJPT_Sec+_CEH.pdf")

          // Close the modal after a short delay to show success state
          setTimeout(() => {
            setIsModalOpen(false)
            setIsDownloading(false)
          }, 1500)
        } catch (downloadError) {
          console.error("Download error:", downloadError)

          // Only use the fallback if the primary download fails
          if (directUrl) {
            console.log("Using direct download URL as fallback")
            window.open(directUrl, "_blank")

            // Close the modal after a short delay
            setTimeout(() => {
              setIsModalOpen(false)
              setIsDownloading(false)
            }, 1500)
          } else {
            setDownloadError("There was an error downloading the resume. Please try again.")
            setIsDownloading(false)
          }
        }
      } else {
        setDownloadError(message || "There was an error downloading the resume. Please try again.")
        setIsDownloading(false)
      }
    } catch (error) {
      console.error("Download error:", error)
      setDownloadError("There was an error downloading the resume. Please try again.")
      setIsDownloading(false)
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Only render these components on the client side */}
      {isClient && (
        <>
          <NetworkAnimation />
          <PulseEffect />
        </>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated grid lines */}
        <div className="absolute inset-0 grid-pattern opacity-10"></div>

        {/* Animated particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/30"
              style={{
                width: Math.random() * 8 + 3,
                height: Math.random() * 8 + 3,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 30 - 15, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating icons with autonomous animations */}
      <VisibilityAnimation direction="fade" delay={0.6}>
        <motion.div
          className="absolute top-1/4 left-1/4 w-12 h-12 text-primary/60 z-10"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Shield className="w-full h-full" />
        </motion.div>
      </VisibilityAnimation>

      <VisibilityAnimation direction="fade" delay={0.8}>
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-10 h-10 text-secondary/60 z-10"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Lock className="w-full h-full" />
        </motion.div>
      </VisibilityAnimation>

      <VisibilityAnimation direction="fade" delay={1}>
        <motion.div
          className="absolute top-2/3 left-1/3 w-14 h-14 text-accent/60 z-10"
          animate={{
            y: [0, 10, -5, 0],
            x: [0, 5, -5, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Code className="w-full h-full" />
        </motion.div>
      </VisibilityAnimation>

      {/* Digital circuit lines */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <motion.div
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent"
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      <div className="container mx-auto px-4 z-20">
        <div className="max-w-4xl mx-auto text-center">
          <VisibilityAnimation direction="up" duration={0.8}>
            <span className="inline-block py-1.5 px-4 rounded-full text-sm md:text-base font-medium bg-cyber-muted text-primary mb-4">
              Cybersecurity Professional
            </span>
          </VisibilityAnimation>

          <VisibilityAnimation direction="up" duration={0.8} delay={0.2}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              <GradientTypingAnimation
                prefix=">_ Hello, I am"
                gradientText="Rahul"
                typingSpeed={120}
                className="inline"
                prefixColor="text-cyber-foreground" // White text
                gradientTextColor="text-primary cyber-glow" // Blue text with glow
                spaceBetween={true} // Add space between prefix and gradient text
              />
            </h1>
          </VisibilityAnimation>

          <VisibilityAnimation direction="up" duration={0.8} delay={0.4}>
            <p className="text-base md:text-lg text-cyber-foreground/80 mb-8 max-w-2xl mx-auto">
              Cybersecurity professional with 4+ years of hands-on experience and a Master's in Cybersecurity from RIT. Proven expertise in both defensive and offensive security—ranging from SOC operations and vulnerability management to penetration testing and compliance. Adept at securing enterprise environments, automating security workflows, and driving awareness across organizations.
            </p>
          </VisibilityAnimation>

          <VisibilityAnimation direction="up" duration={0.8} delay={0.6}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleDownloadClick}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-6 rounded-md relative overflow-hidden group"
                size="lg"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Download Resume
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </>
                )}
              </Button>

              <Button
                onClick={() => scrollToSection("about")}
                variant="outline"
                className="border-cyber-border hover:bg-cyber-muted/30 px-8 py-6 rounded-md"
                size="lg"
              >
                About Me
              </Button>
            </div>
          </VisibilityAnimation>

          <div className="text-xs text-cyber-foreground/50 text-center mt-2">
            Protected by Cloudflare Turnstile verification
          </div>

          {/* Display download error if any */}
          {downloadError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-red-500 text-sm flex items-center justify-center"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              {downloadError}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <VisibilityAnimation
        direction="up"
        delay={1.5}
        duration={0.8}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
          className="flex flex-col items-center"
          onClick={() => scrollToSection("about")}
          style={{ cursor: "pointer" }}
        >
          <span className="text-xs text-cyber-foreground/60 mb-2">Scroll to explore</span>
          <ArrowDown className="h-5 w-5 text-primary" />
        </motion.div>
      </VisibilityAnimation>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cyber-background to-transparent pointer-events-none z-20"></div>

      {/* Ultra Simple Modal */}
      <UltraSimpleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVerified={handleVerified}
        isProcessing={isDownloading}
        error={downloadError}
      />
    </section>
  )
}
