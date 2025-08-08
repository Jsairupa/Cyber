"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Award, Shield, Lock, Code, Activity, Cloud, CheckCircle } from "lucide-react"

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const certifications = [
    {
      name: "eLearnSecurity Junior Penetration Tester (eJPT)",
      issuer: "INE Security",
      date: "2025",
      status: "Completed",
      icon: <Lock className="h-6 w-6" />,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      name: "Certified Ethical Hacker (CEHv11)",
      issuer: "EC-Council",
      date: "2023",
      status: "Completed",
      icon: <Shield className="h-6 w-6" />,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20",
    },
    {
      name: "Security+",
      issuer: "CompTIA",
      date: "2025",
      status: "Completed",
      icon: <Award className="h-6 w-6" />,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
    },
    {
      name: "CySA+",
      issuer: "CompTIA",
      date: "2025",
      status: "Completed",
      icon: <Activity className="h-6 w-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
    },
    {
      name: "Azure Security Engineer Associate",
      issuer: "Microsoft",
      date: "2025",
      status: "In Progress",
      icon: <Code className="h-6 w-6" />,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/20",
    },
    {
      name: "INE Certified Cloud Associate",
      issuer: "INE Security",
      date: "2025",
      status: "Completed",
      icon: <Cloud className="h-6 w-6" />,
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
      borderColor: "border-sky-400/20",
    },
  ]

  return (
    <section id="certifications" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Professional <span className="text-gradient">Certifications</span>
            </h2>
            <p className="text-cyber-foreground/70 max-w-2xl mx-auto">
              Industry-recognized credentials that validate my expertise and commitment to cybersecurity excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="glass-card rounded-lg p-6 hover:cyber-glow-box transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-md ${cert.bgColor} ${cert.borderColor} border mr-4`}>
                    <div className={cert.color}>{cert.icon}</div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-cyber-foreground/60">{cert.date}</span>
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-2">{cert.name}</h3>

                <div className="flex items-center text-cyber-foreground/70">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                  <span>{cert.issuer}</span>
                </div>

                {/* Status indicator */}
                <div className="mt-4 pt-4 border-t border-cyber-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cyber-foreground/60">Status</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        cert.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
