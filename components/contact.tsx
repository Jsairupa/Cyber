"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, MapPin, Phone, Github, Linkedin, Copy, Check, Eye, EyeOff } from "lucide-react"

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  // States for the click-to-reveal functionality
  const [revealedInfo, setRevealedInfo] = useState<{ [key: string]: boolean }>({
    email: false,
    phone: false,
  })
  const [copiedInfo, setCopiedInfo] = useState<{ [key: string]: boolean }>({
    email: false,
    phone: false,
  })

  // Function to toggle the reveal state
  const toggleReveal = (infoType: string) => {
    setRevealedInfo((prev) => ({
      ...prev,
      [infoType]: !prev[infoType],
    }))
  }

  // Function to copy to clipboard
  const copyToClipboard = (text: string, infoType: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedInfo((prev) => ({
        ...prev,
        [infoType]: true,
      }))

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedInfo((prev) => ({
          ...prev,
          [infoType]: false,
        }))
      }, 2000)
    })
  }

  // The actual contact information (hidden from HTML source)
  const contactDetails = {
    email: "sairahulitha@gmail.com",
    phone: "+1 (585)-606-0593",
  }

  // Masked versions of the contact information
  const maskedEmail = contactDetails.email.replace(/(.{3})(.*)(@.*)/, "$1•••$3")
  // Use a hardcoded masked version for the phone to ensure it's properly masked
  const maskedPhone = "+1 (585)-***-****"

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      value: revealedInfo.email ? contactDetails.email : maskedEmail,
      type: "email",
      actionIcon: revealedInfo.email ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />,
      actionText: revealedInfo.email ? "Hide Email" : "Reveal Email",
      copyIcon: copiedInfo.email ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />,
      copyText: copiedInfo.email ? "Copied!" : "Copy",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      value: revealedInfo.phone ? contactDetails.phone : maskedPhone,
      type: "phone",
      actionIcon: revealedInfo.phone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />,
      actionText: revealedInfo.phone ? "Hide Number" : "Reveal Number",
      copyIcon: copiedInfo.phone ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />,
      copyText: copiedInfo.phone ? "Copied!" : "Copy",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Location",
      value: "Rochester, NY",
      type: "location",
    },
  ]

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      name: "GitHub",
      link: "https://github.com/rahul0x0510",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/rahul-isa/",
    },
  ]

  return (
    <section id="contact" ref={sectionRef} className="py-20 relative bg-cyber-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-cyber-foreground/70 max-w-2xl mx-auto">
              Have a security challenge or interested in working together? I'd love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto"
          >
            <div className="glass-card rounded-lg p-6 md:p-8 text-center">
              <h3 className="text-xl font-display font-medium mb-8">Contact Information</h3>

              <div className="space-y-8 mb-10">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="p-3 rounded-md bg-cyber-muted text-primary mb-3">{item.icon}</div>
                    <div>
                      <h4 className="text-sm font-medium text-cyber-foreground/60 mb-1">{item.title}</h4>

                      {/* For email and phone, show the masked/revealed value with action buttons */}
                      {item.type === "email" || item.type === "phone" ? (
                        <div className="flex flex-col items-center">
                          <p className="text-cyber-foreground font-mono mb-2">{item.value}</p>
                          <div className="flex space-x-3">
                            {/* Reveal/Hide button */}
                            <button
                              onClick={() => toggleReveal(item.type)}
                              className="flex items-center text-xs text-primary hover:text-primary/80 transition-colors bg-cyber-muted/30 px-2 py-1 rounded"
                            >
                              {item.actionIcon}
                              <span className="ml-1">{item.actionText}</span>
                            </button>

                            {/* Copy button */}
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  item.type === "email" ? contactDetails.email : contactDetails.phone,
                                  item.type,
                                )
                              }
                              className={`flex items-center text-xs ${
                                copiedInfo[item.type] ? "text-green-400" : "text-primary"
                              } hover:text-primary/80 transition-colors bg-cyber-muted/30 px-2 py-1 rounded`}
                            >
                              {item.copyIcon}
                              <span className="ml-1">{item.copyText}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        // For location, just show the value
                        <p className="text-cyber-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-display font-medium mb-5">Connect Online</h3>

              <div className="flex justify-center space-x-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-md bg-cyber-muted text-primary hover:bg-cyber-muted/80 transition-all hover:-translate-y-1"
                  >
                    {social.icon}
                    <span className="sr-only">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
