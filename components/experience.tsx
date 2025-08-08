"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const experiences = [
    {
      title: "Security Operations Specialist",
      company: "CapitalOne",
      location: "Remote",
      period: "Sept 2023 - Present",
      description: [
        "Strengthened global SOC operations by tuning Splunk SIEM rules, reducing false positives by 40%, and enhancing detection for 1,200+ assets.",
        "Led enterprise-wide cybersecurity awareness efforts, achieving 98%+ training compliance through simulations, risk reporting, and targeted education.",
      ],
    },
    {
      title: "Information Security Analyst",
      company: "SNR Edatas",
      location: "Hyderabad, India",
      period: "Jun 2021 - Apr 2022",
      description: [
        "Ensured NIST 800-53 and PCI-DSS compliance by conducting internal audits, risk assessments, and coordinating third-party pentests.",
        "Authored and maintained security policies, awareness campaigns, and risk registers, directly contributing to 100% audit readiness and regulatory alignment.",
      ],
    },
    {
      title: "Jr. Cybersecurity Analyst",
      company: "Accenture",
      location: "Hyderabad, India",
      period: "Jan 2020 - Jun 2020",
      description: [
        "Automated patch deployment using PowerShell and Tenable.io, reducing the vulnerability backlog by 60% and boosting remediation efficiency.",
        "Conducted penetration testing and malware sandboxing to validate endpoint defenses, contributing to enhanced system hardening and secure rollouts.",
      ],
    },
  ]

  return (
    <section id="experience" ref={sectionRef} className="py-20 relative bg-cyber-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Professional <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-cyber-foreground/70 max-w-2xl mx-auto">
              My career journey in cybersecurity, showcasing roles and achievements that have shaped my expertise.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-cyber-border transform md:translate-x-[-0.5px] hidden md:block"></div>

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className={cn("relative flex flex-col md:flex-row", index % 2 === 0 ? "md:flex-row-reverse" : "")}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 top-0 w-5 h-5 rounded-full bg-primary transform translate-x-[-10px] md:translate-x-[-10px] hidden md:block"></div>

                  {/* Content */}
                  <div
                    className={cn(
                      "w-full md:w-[calc(50%-20px)]",
                      index % 2 === 0 ? "md:pr-0 md:pl-6" : "md:pl-0 md:pr-6",
                    )}
                  >
                    <div className="glass-card rounded-lg p-6 hover:cyber-glow-box transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <h3 className="text-xl font-display font-bold">{exp.title}</h3>
                        <span className="text-primary text-sm font-mono mt-1 sm:mt-0">{exp.period}</span>
                      </div>
                      <div className="text-lg text-cyber-foreground/90 mb-1">{exp.company}</div>
                      <div className="text-sm text-cyber-foreground/70 mb-3">{exp.location}</div>
                      <ul className="space-y-2 text-cyber-foreground/70">
                        {exp.description.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
