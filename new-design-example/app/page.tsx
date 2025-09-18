import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VisitorCounter } from "@/components/visitor-counter"
import { FeaturedArticles } from "@/components/featured-articles"
import { PublishedBooks } from "@/components/published-books"
import { FeaturedProjects } from "@/components/featured-projects"
import { SocialLinks } from "@/components/social-links"
import { BookOpen, Users, BoxIcon, Rss } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Bienvenido a mi rincón digital</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Un espacio personal donde comparto artículos sobre matemáticas, ciencias de la computación, programación y
            reflexiones sobre el mundo digital que nos rodea.
          </p>
          <VisitorCounter />
        </section>

        {/* Featured Articles */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Rss className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Artículos Destacados</h2>
          </div>
          <FeaturedArticles />
        </section>

        {/* Published Books */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Libros Publicados</h2>
          </div>
          <PublishedBooks />
        </section>

        {/* Featured Projects */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BoxIcon className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Proyectos Destacados</h2>
          </div>
          <FeaturedProjects />
        </section>

        {/* Social Links */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Conecta Conmigo</h2>
          </div>
          <SocialLinks />
        </section>
      </main>

      <Footer />
    </div>
  )
}
