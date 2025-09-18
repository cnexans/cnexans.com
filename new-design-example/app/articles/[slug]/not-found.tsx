import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Artículo no encontrado</h1>
          <p className="text-muted-foreground mb-8">El artículo que buscas no existe o ha sido movido.</p>
          <Link href="/articles" className="inline-flex items-center gap-2 text-foreground no-underline">
            <ArrowLeft size={16} />
            Volver a artículos
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
