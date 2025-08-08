"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Github, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const [activeProject, setActiveProject] = useState<number | null>(null)

  const projects = [
    {
      title: "Hybrid Approach of CNN & BERT",
      period: "Dec 2024 - May 2025",
      description:
        "A hybrid phishing detection model combining CNN for URL analysis and BERT for content classification.",
      longDescription:
        "Designed and implemented a hybrid phishing detection model combining Convolutional Neural Networks (CNN) for analyzing URL structure and BERT for content-based classification, achieving high precision on benchmark datasets. Integrated the model into a custom browser extension, enabling seamless client-side phishing detection with real-time alerts and minimal performance overhead.",
      tags: ["Machine Learning", "Cybersecurity", "Python", "TensorFlow", "NLP"],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CNN_BERT-e2voqeFcIkOx2T8a1DKp7wt2wjYIRi.png",
      github: "https://github.com/rahul0x0510/Portfolio",
      demo: "https://demo.com",
    },
    {
      title: "Proxmox Honeypot Implementation",
      period: "May 2024 - July 2024",
      description: "Honeypot deployment on Proxmox to capture and analyze SSH brute-force attempts.",
      longDescription:
        "Set up Cowrie honeypots on a Proxmox bare-metal server to capture over 1,000 SSH brute-force attempts, revealing real-world attacker behavior in a home-lab environment. Analyzed log data (~4GB/month) via the ELK stack and configured webhook-based alerts to Discord, decreasing manual log review time and enabling 30% faster response.",
      tags: ["Honeypots", "ELK Stack", "Proxmox", "Threat Intelligence", "SSH Security"],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/proxmox-UQ4INER2tlUCbqEP6f04gdTs6vLcjV.png",
      github: "https://github.com/rahul0x0510/Portfolio",
      demo: "https://demo.com",
    },
    {
      title: "Static and Dynamic Analysis of Conti Ransomware",
      period: "Jan 2023 - May 2023",
      description: "Reverse engineering of Conti ransomware to extract IOCs and behavior patterns.",
      longDescription:
        "Reverse engineered the Conti ransomware sample using Wireshark, x64dbg, and Process Monitor, extracting IOCs and behavior patterns from live execution traces. Examined 200+ network packets and sandbox logs to understand payload delivery, enhancing documentation used for detection rules and post-exploitation forensics.",
      tags: ["Malware Analysis", "Reverse Engineering", "Wireshark", "x64dbg", "Forensics"],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/conti-epwoNYSEvmFmgA3eIdTgfmJ1tFxbhF.png",
      github: "https://github.com/rahul0x0510/Portfolio",
      demo: "https://demo.com",
    },
    {
      title: "Vulnerability Analysis and Patch Management Pipeline",
      period: "Nov 2022 - Mar 2023",
      description: "Automated vulnerability scanning and patch deployment for open-source applications.",
      longDescription:
        "Executed 100+ vulnerability scans on open-source applications using OpenVAS; identified and reported CVEs across GitHub to enhance platform security. Automated deployment of 20+ patches via Git and Jenkins in a CI/CD pipeline, reducing exposure to known exploits by 10%.",
      tags: ["Vulnerability Management", "OpenVAS", "CI/CD", "Jenkins", "Git"],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vuln-MQqKZcIAkJXMlCXwVFOOkjj4VanoEH.png",
      github: "https://github.com/rahul0x0510/Portfolio",
      demo: "https://demo.com",
    },
  ]

  return (
    <section id="projects" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-cyber-foreground/70 max-w-2xl mx-auto">
            A selection of my most impactful cybersecurity projects, showcasing practical solutions to complex security
            challenges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className={cn(
                "glass-card rounded-lg overflow-hidden",
                "hover:cyber-glow-box transition-all duration-300",
              )}
              whileHover={{ y: -5 }}
            >
              <div className="relative aspect-video bg-cyber-muted overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg?height=600&width=800"}
                  alt={project.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-background to-transparent opacity-70"></div>
                <div className="absolute top-4 left-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-cyber-muted text-primary">{project.period}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-display font-bold mb-2">{project.title}</h3>
                <p className="text-cyber-foreground/70 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs px-2 py-1 rounded-md bg-cyber-muted text-primary">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-foreground/70 hover:text-primary transition-colors"
                    >
                      <Github size={20} />
                    </a>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-cyber-muted"
                    onClick={() => setActiveProject(activeProject === index ? null : index)}
                  >
                    {activeProject === index ? "Less Details" : "More Details"}
                    <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>

                <AnimatePresence>
                  {activeProject === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-cyber-border"
                    >
                      <p className="text-cyber-foreground/80 text-sm">{project.longDescription}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            className="border-cyber-border hover:bg-cyber-muted/30"
            onClick={() => window.open("https://github.com/rahul0x0510", "_blank")}
          >
            View All Projects
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
