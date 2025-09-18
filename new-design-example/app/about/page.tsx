import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CurrentlyReading } from "@/components/currently-reading"
import { NowPlaying } from "@/components/now-playing"
import { Guestbook } from "@/components/guestbook"
import { User, BookOpen, Music } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* About Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <User className="text-foreground" size={24} />
            <h1 className="text-3xl font-bold text-foreground">Sobre Mí</h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="text-foreground leading-relaxed space-y-6">
              <p className="text-pretty">
                Soy un apasionado de las matemáticas, las ciencias de la computación y la programación. Mi fascinación
                por estos campos comenzó en los años 90 y 2000, cuando di mis primeros pasos en el mundo de la
                programación. Desde entonces, he dedicado mi carrera a explorar la intersección entre la teoría
                matemática y su aplicación práctica en el desarrollo de software.
              </p>

              <p className="text-pretty">
                A través de este sitio web, comparto mis reflexiones, investigaciones y descubrimientos en forma de
                artículos técnicos, análisis de algoritmos y exploraciones matemáticas. Creo firmemente en el poder de
                la educación abierta y en compartir conocimiento para construir una comunidad más fuerte de
                desarrolladores y pensadores.
              </p>

              <p className="text-pretty">
                Cuando no estoy escribiendo código o explorando nuevos conceptos matemáticos, disfruto leyendo,
                escuchando música y conectando con otros profesionales que comparten mi pasión por la tecnología y el
                aprendizaje continuo.
              </p>
            </div>
          </div>
        </section>

        {/* Currently Reading */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Leyendo Actualmente</h2>
          </div>
          <CurrentlyReading />
        </section>

        {/* Now Playing */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Music className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Escuchando Ahora</h2>
          </div>
          <NowPlaying />
        </section>

        {/* Guestbook */}
        <section className="mb-16">
          <Guestbook />
        </section>
      </main>

      <Footer />
    </div>
  )
}
