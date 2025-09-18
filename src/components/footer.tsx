import { Github, Linkedin, Youtube, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">© 2025 Nexans. Hecho con curiosidad y café.</p>
          <div className="flex items-center gap-4">
            <a href="https://youtube.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Youtube size={20} />
            </a>
            <a href="https://x.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://linkedin.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://github.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}