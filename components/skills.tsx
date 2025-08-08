"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Terminal, ChevronRight, Folder, FileText } from "lucide-react"

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [typedCommand, setTypedCommand] = useState("")
  const [showOutput, setShowOutput] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [currentDirectory, setCurrentDirectory] = useState("/usr/local/skills")
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  // Skill directory structure with consistent colors per category
  // Only including skills mentioned in the resume
  const skillDirectories = [
    {
      name: "offensive_security",
      type: "directory",
      description: "Skills related to offensive security practices and techniques",
      contents: [
        {
          name: "nmap",
          description: "Network mapping and port scanning for vulnerability discovery",
          color: "text-primary",
        },
        {
          name: "metasploit",
          description: "Using Metasploit Framework for penetration testing and exploitation",
          color: "text-blue-400",
        },
        {
          name: "burp_suite",
          description: "Web application security testing with Burp Suite",
          color: "text-indigo-400",
        },
        {
          name: "owasp_top_10",
          description: "Knowledge of OWASP Top 10 web application security risks",
          color: "text-violet-400",
        },
        {
          name: "vulnerability_scanners",
          description: "Using OpenVAS, Nessus, and Qualys for vulnerability assessment",
          color: "text-purple-400",
        },
        {
          name: "kali_linux",
          description: "Proficiency with Kali Linux penetration testing platform",
          color: "text-fuchsia-400",
        },
        {
          name: "honeypots",
          description: "Deploying decoy systems to detect and analyze attack methods",
          color: "text-pink-400",
        },
        {
          name: "forensics_analysis",
          description: "Collecting and analyzing digital evidence for investigation",
          color: "text-rose-400",
        },
      ],
    },
    {
      name: "defensive_security",
      type: "directory",
      description: "Skills focused on protecting systems and responding to threats",
      contents: [
        {
          name: "incident_response",
          description: "Addressing and managing the aftermath of security breaches",
          color: "text-secondary",
        },
        {
          name: "threat_hunting",
          description: "Proactively searching for threats that evade existing security solutions",
          color: "text-sky-400",
        },
        {
          name: "siem_tools",
          description: "Security Information and Event Management with Splunk and ELK Stack",
          color: "text-cyan-400",
        },
        {
          name: "malware_analysis",
          description: "Analyzing malicious software to understand its functionality and impact",
          color: "text-teal-400",
        },
        {
          name: "ids_ips",
          description: "Intrusion Detection and Prevention Systems (Snort, Suricata)",
          color: "text-emerald-400",
        },
        {
          name: "edr",
          description: "Endpoint Detection and Response for threat protection",
          color: "text-green-400",
        },
        {
          name: "yara",
          description: "Creating YARA rules for malware identification",
          color: "text-lime-400",
        },
        {
          name: "security_auditing",
          description: "Systematic evaluation of security controls and compliance",
          color: "text-yellow-400",
        },
        {
          name: "playbook_development",
          description: "Creating standardized response procedures for security incidents",
          color: "text-amber-400",
        },
        {
          name: "soar",
          description: "Security Orchestration, Automation and Response",
          color: "text-orange-400",
        },
      ],
    },
    {
      name: "frameworks_methodologies",
      type: "directory",
      description: "Security frameworks and methodologies",
      contents: [
        {
          name: "mitre_attack",
          description: "MITRE ATT&CK framework for threat modeling and defense",
          color: "text-blue-300",
        },
        {
          name: "cyber_kill_chain",
          description: "Understanding and disrupting the stages of cyber attacks",
          color: "text-indigo-300",
        },
        {
          name: "nist_framework",
          description: "National Institute of Standards and Technology Cybersecurity Framework",
          color: "text-violet-300",
        },
        {
          name: "iso_27001",
          description: "Information security management standards and compliance",
          color: "text-purple-300",
        },
        {
          name: "cis_controls",
          description: "Center for Internet Security Critical Security Controls",
          color: "text-fuchsia-300",
        },
        {
          name: "zero_trust",
          description: "Zero Trust Architecture principles and implementation",
          color: "text-pink-300",
        },
        {
          name: "rbac",
          description: "Role-Based Access Control for managing user permissions",
          color: "text-rose-300",
        },
        {
          name: "behavioral_analytics",
          description: "User and Entity Behavior Analytics (UEBA) for threat detection",
          color: "text-blue-500",
        },
      ],
    },
    {
      name: "devsecops",
      type: "directory",
      description: "Skills focused on integrating security into development operations",
      contents: [
        {
          name: "secure_sdlc",
          description: "Implementing security throughout the software development lifecycle",
          color: "text-orange-400",
        },
        {
          name: "ci_cd_pipelines",
          description: "Securing Continuous Integration and Continuous Deployment pipelines",
          color: "text-red-400",
        },
        {
          name: "docker",
          description: "Containerization with Docker and security best practices",
          color: "text-rose-400",
        },
        {
          name: "kubernetes",
          description: "Container orchestration security with Kubernetes",
          color: "text-pink-400",
        },
        {
          name: "ansible",
          description: "Infrastructure as Code automation with security controls",
          color: "text-fuchsia-400",
        },
        {
          name: "git",
          description: "Secure version control practices and code management",
          color: "text-red-300",
        },
        {
          name: "jenkins",
          description: "Securing Jenkins automation server and build pipelines",
          color: "text-rose-300",
        },
        {
          name: "version_control",
          description: "Managing code versions and secure collaboration",
          color: "text-pink-300",
        },
      ],
    },
    {
      name: "cloud_security",
      type: "directory",
      description: "Skills related to securing cloud environments and infrastructure",
      contents: [
        {
          name: "aws_security",
          description: "Securing Amazon Web Services environments",
          color: "text-accent",
        },
        {
          name: "active_directory",
          description: "Managing and securing Active Directory services",
          color: "text-green-400",
        },
        {
          name: "encryption",
          description: "Implementing data encryption for security and privacy",
          color: "text-lime-400",
        },
        {
          name: "cryptography",
          description: "Applying cryptographic principles to secure systems",
          color: "text-yellow-400",
        },
        {
          name: "patch_management",
          description: "Systematic management of software updates and security patches",
          color: "text-amber-400",
        },
        {
          name: "vulnerability_assessment",
          description: "Identifying and evaluating security vulnerabilities in cloud systems",
          color: "text-orange-400",
        },
        {
          name: "compliance",
          description: "Ensuring cloud environments meet regulatory requirements",
          color: "text-yellow-300",
        },
        {
          name: "pki",
          description: "Public Key Infrastructure for secure communications",
          color: "text-lime-300",
        },
      ],
    },
    {
      name: "programming_networking",
      type: "directory",
      description: "Programming languages, networking, and system administration skills",
      contents: [
        {
          name: "python",
          description: "Scripting and automation for security tasks",
          color: "text-slate-300",
        },
        {
          name: "bash",
          description: "Shell scripting for security automation",
          color: "text-zinc-300",
        },
        {
          name: "c_cpp",
          description: "C/C++ programming for security applications",
          color: "text-stone-300",
        },
        {
          name: "java",
          description: "Java programming and application security",
          color: "text-neutral-300",
        },
        {
          name: "sql",
          description: "Database querying and securing database systems",
          color: "text-gray-300",
        },
        {
          name: "linux",
          description: "Advanced Linux administration and security hardening",
          color: "text-slate-400",
        },
        {
          name: "windows_server",
          description: "Windows Server administration and security",
          color: "text-zinc-400",
        },
        {
          name: "virtualization",
          description: "Creating and managing virtual environments for security testing",
          color: "text-stone-400",
        },
        {
          name: "tcp_ip",
          description: "Understanding and securing TCP/IP network communications",
          color: "text-gray-400",
        },
        {
          name: "firewalls",
          description: "Configuring and managing network firewalls",
          color: "text-slate-500",
        },
      ],
    },
    {
      name: "ai_ml_security",
      type: "directory",
      description: "AI and Machine Learning for cybersecurity applications",
      contents: [
        {
          name: "scikit_learn",
          description: "Machine learning library for security analytics",
          color: "text-purple-400",
        },
        {
          name: "tensorflow",
          description: "Deep learning framework for advanced threat detection",
          color: "text-indigo-400",
        },
        {
          name: "nlp_threat_detection",
          description: "Natural Language Processing for identifying threats",
          color: "text-blue-400",
        },
        {
          name: "cnn",
          description: "Convolutional Neural Networks for pattern recognition in security",
          color: "text-violet-400",
        },
        {
          name: "bert",
          description: "Bidirectional Encoder Representations from Transformers for security analysis",
          color: "text-purple-300",
        },
        {
          name: "ueba",
          description: "User and Entity Behavior Analytics for anomaly detection",
          color: "text-indigo-300",
        },
        {
          name: "threat_intelligence",
          description: "Using AI to process and analyze threat intelligence data",
          color: "text-blue-300",
        },
        {
          name: "anomaly_detection",
          description: "Machine learning techniques for identifying unusual patterns",
          color: "text-violet-300",
        },
      ],
    },
  ]

  // Typing animation effect
  useEffect(() => {
    if (!isInView) return

    const command = "ls /usr/local/skills"
    let currentIndex = 0

    // Type the command character by character
    const typingInterval = setInterval(() => {
      if (currentIndex <= command.length) {
        setTypedCommand(command.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setShowOutput(true)
        }, 500)
      }
    }, 100)

    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
    }
  }, [isInView])

  // Handle directory change
  const handleDirectoryClick = (dirName: string) => {
    if (currentDirectory === "/usr/local/skills") {
      setCurrentDirectory(`/usr/local/skills/${dirName}`)
    } else {
      setCurrentDirectory("/usr/local/skills")
    }
  }

  // Render current directory contents
  const renderDirectoryContents = () => {
    if (currentDirectory === "/usr/local/skills") {
      // Render main directories
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {skillDirectories.map((dir, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              className="relative"
            >
              <button
                className="flex items-center space-x-2 hover:bg-cyber-muted/30 p-2 rounded-md w-full text-left"
                onClick={() => handleDirectoryClick(dir.name)}
                onMouseEnter={() => setShowTooltip(dir.name)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Folder className="h-5 w-5 text-primary" />
                <span className="text-cyber-foreground/90 truncate">{dir.name}</span>
              </button>

              {showTooltip === dir.name && (
                <div className="absolute z-10 bg-cyber-card/95 p-2 rounded border border-cyber-border shadow-lg left-0 mt-1 w-64">
                  <div className="text-xs">
                    <div className="font-medium text-primary mb-1">{dir.name.replace(/_/g, " ")}</div>
                    <div className="text-cyber-foreground/80">{dir.description}</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )
    } else {
      // Find the selected directory
      const selectedDir = skillDirectories.find((dir) => `/usr/local/skills/${dir.name}` === currentDirectory)

      if (!selectedDir) return null

      // Render files in the selected directory
      return (
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 mb-4">
            <button
              className="flex items-center space-x-2 hover:bg-cyber-muted/30 p-2 rounded-md"
              onClick={() => handleDirectoryClick("")}
            >
              <ChevronRight className="h-4 w-4 text-primary" />
              <span className="text-primary">Back to /usr/local/skills</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedDir.contents.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="relative group"
              >
                <div
                  className="flex items-center space-x-2 hover:bg-cyber-muted/30 p-2 rounded-md cursor-default"
                  onMouseEnter={() => setShowTooltip(`${selectedDir.name}-${index}`)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <FileText className={`h-4 w-4 ${skill.color}`} />
                  <span className={`${skill.color} truncate`}>{skill.name}</span>
                </div>

                {showTooltip === `${selectedDir.name}-${index}` && (
                  <div className="absolute z-10 bg-cyber-card/95 p-2 rounded border border-cyber-border shadow-lg left-0 mt-1 w-64">
                    <div className="text-xs">
                      <div className="font-medium text-primary mb-1">{skill.name.replace(/_/g, " ")}</div>
                      <div className="text-cyber-foreground/80">{skill.description}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <section id="skills" ref={sectionRef} className="py-20 relative bg-cyber-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Technical <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-cyber-foreground/70 max-w-2xl mx-auto">
              My expertise spans across various cybersecurity domains, with a focus on practical application and
              continuous learning.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-lg overflow-hidden border border-cyber-border"
          >
            {/* Terminal header */}
            <div className="bg-cyber-muted/80 px-4 py-2 flex items-center justify-between border-b border-cyber-border">
              <div className="flex items-center">
                <Terminal className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium">{currentDirectory}</span>
              </div>
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
              </div>
            </div>

            {/* Terminal content */}
            <div className="p-4 font-mono text-sm bg-cyber-background/50 min-h-[400px] max-h-[600px] overflow-y-auto">
              {/* Command prompt and typing animation */}
              <div className="flex items-center text-cyber-foreground/90 mb-6">
                <span className="text-primary mr-1">rahul@kali</span>
                <span className="text-cyber-foreground/70">:</span>
                <span className="text-secondary ml-1">~</span>
                <span className="text-cyber-foreground/70 mx-1">$</span>
                <span>{typedCommand}</span>
                {cursorVisible && <span className="inline-block w-2 h-4 bg-primary ml-0.5"></span>}
              </div>

              {/* Command output */}
              {showOutput && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  {renderDirectoryContents()}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Terminal description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-center text-cyber-foreground/60 text-sm"
          >
            <p>
              <span className="text-primary">Pro Tip:</span> Click on directories to explore skills and hover over items
              for details
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
