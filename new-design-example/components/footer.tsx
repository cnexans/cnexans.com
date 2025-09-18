import { Github, Linkedin, Youtube, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">© 2025 Nexans. Hecho con curiosidad y café.</p>
          <div className="flex items-center gap-4">
            <a href="https://youtube.com" className="text-muted-foreground">
              <Youtube size={20} />
            </a>
            <a href="https://twitter.com" className="text-muted-foreground">
              <Twitter size={20} />
            </a>
            <a href="https://linkedin.com" className="text-muted-foreground">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com" className="text-muted-foreground">
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
