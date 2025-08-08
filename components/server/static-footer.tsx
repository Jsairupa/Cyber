export default function StaticFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-10 border-t border-cyber-border relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-cyber-foreground/60 text-sm mb-4 md:mb-0">
            © {currentYear} Rahul Itha. All rights reserved.
          </p>
          <div className="text-cyber-foreground/60 text-sm">
            <span className="font-mono">Security-first, always.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
