import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground no-underline">
            {"Nexans"}
          </Link>
          <nav className="flex items-center gap-8">
            <Link href="/articles" className="text-foreground no-underline">
              Artículos
            </Link>
            <Link href="/about" className="text-foreground no-underline">
              About
            </Link>
            <Link href="/contact" className="text-foreground no-underline">
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
