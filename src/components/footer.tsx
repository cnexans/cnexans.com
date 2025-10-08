import { Github, Linkedin, Youtube, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Mobile Layout - Stack everything vertically */}
        <div className="flex flex-col items-center space-y-4 md:hidden">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a href="https://youtube.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
              <Youtube size={22} />
            </a>
            <a href="https://x.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
              <Twitter size={22} />
            </a>
            <a href="https://linkedin.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
              <Linkedin size={22} />
            </a>
            <a href="https://github.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
              <Github size={22} />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-muted-foreground text-xs text-center font-sans">
            © 2025 Nexans. Hecho con curiosidad y café.
          </p>
        </div>

        {/* Tablet Layout - Social links in first row, copyright in second row */}
        <div className="hidden md:block lg:hidden">
          {/* First row: Social Links centered */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-5">
              <a href="https://youtube.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="https://x.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://github.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Second row: Copyright centered */}
          <div className="flex justify-center">
            <p className="text-muted-foreground text-sm text-center font-sans">
              © 2025 Nexans. Hecho con curiosidad y café.
            </p>
          </div>
        </div>

        {/* Desktop Layout - Everything in one row */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm  font-sans">© 2025 Nexans. Hecho con curiosidad y café.</p>
            <div className="flex items-center gap-4">
              <a href="https://youtube.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="https://x.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://github.carlosnexans.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}