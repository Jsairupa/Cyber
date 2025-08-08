"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, FileSearch, Code, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [imageLoaded, setImageLoaded] = useState(false)

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Threat Intelligence & Analysis",
      description:
        "Proficient with MITRE ATT&CK, SIEM tools, and threat hunting techniques to identify and mitigate advanced security threats.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      icon: <FileSearch className="h-6 w-6" />,
      title: "Malware & Forensic Analysis",
      description:
        "Experienced in reverse engineering malware samples and extracting IOCs using tools like Wireshark and x64dbg.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "DevSecOps Integration",
      description:
        "Skilled in implementing secure CI/CD pipelines with Docker, Kubernetes, and automated vulnerability scanning.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Enhanced Security",
      description:
        "Developing hybrid ML models combining CNN and BERT for advanced phishing detection and threat intelligence.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
  ]

  return (
    <section id="about" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-cyber-foreground/70 max-w-2xl mx-auto">
            A journey of curiosity and exploration in the world of cybersecurity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-lg p-6 md:p-10 relative">
            {/* Profile image - circular and positioned on the right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative float-right ml-8 mb-6 md:ml-12"
            >
              <div className="relative w-[10.5rem] h-[10.5rem] md:w-[15.5rem] md:h-[15.5rem] rounded-full overflow-hidden">
                {/* Main image without any effects */}
                <Image
                  src="/avatar-updated.png"
                  alt="Cybersecurity Professional"
                  fill
                  className="object-cover"
                  onLoad={() => setImageLoaded(true)}
                  priority
                  sizes="(max-width: 768px) 10.5rem, 15.5rem"
                  quality={85}
                />
              </div>

              {/* Tech details */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-cyber-background px-4 py-1 border border-primary/30 rounded text-xs font-mono text-primary/80">
                SECURITY RESEARCHER
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-base mb-4">
                I’ve always been driven by curiosity—the kind that pulls you down unfamiliar paths, not knowing exactly 
                where you’ll end up, but trusting that every twist and turn teaches you something new. That same mindset 
                is what led me into cybersecurity.
              </p>
              <p className="text-base mb-4">
                It started back in 10th grade with simple questions: What really happens behind a login screen? 
                How does data move, get protected—or stolen? I didn’t have a guidebook, just curiosity and a knack for 
                breaking things (ethically) to understand how they worked.
              </p>
              <p className="text-base mb-4">
                Over time, I transitioned from a curious tinkerer to a cybersecurity professional with 4+ years of 
                hands-on experience across SOC operations, vulnerability management, penetration testing, compliance, 
                and security automation. I’ve worked with major organizations like CapitalOne, Accenture, and SNR Edatas,
                monitoring large-scale environments, leading awareness programs, optimizing SIEM detections, and ensuring
                 PCI and NIST compliance.
              </p>
              <p className="text-base mb-4">
                Today, I’m deepening my expertise through a Master’s in Cybersecurity at RIT, staying ahead of evolving 
                threats while helping organizations strengthen their security posture. I thrive in environments where 
                learning never stops, and I’m always exploring new tools, attack vectors, and ways to build safer systems.
              </p>
              <p className="text-base mt-4 font-medium">
                If you're someone who values curiosity, security, and continuous growth—let’s connect. 
                There’s always more to discover, and I’d love to hear your story too. 🤝
              </p>
            </motion.div>

            <div className="clear-both"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "glass-card rounded-lg p-4 flex items-start",
                    "hover:translate-y-[-5px] transition-all duration-300",
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={cn("mr-3 p-2 rounded-md", feature.bgColor, feature.borderColor, "border")}>
                    <div className={feature.color}>{feature.icon}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">{feature.title}</h4>
                    <p className="text-cyber-foreground/70 text-xs">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
