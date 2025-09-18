import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, MessageSquare, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Contacto</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              [Aquí escribiré un texto personal sobre por qué es importante conectar, mi filosofía sobre el intercambio
              de ideas, y cómo me gusta colaborar con otros en temas de matemáticas, programación y tecnología.]
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              [También mencionaré los tipos de conversaciones que más disfruto, proyectos en los que podríamos
              colaborar, y mi compromiso con responder a cada mensaje de manera thoughtful.]
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-2xl">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Mail size={16} />
                Email
              </label>
              <Input id="email" type="email" placeholder="tu@email.com" required className="w-full" />
            </div>

            <div>
              <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <User size={16} />
                Asunto
              </label>
              <Input
                id="subject"
                type="text"
                placeholder="¿Sobre qué te gustaría conversar?"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MessageSquare size={16} />
                Mensaje
              </label>
              <Textarea
                id="message"
                placeholder="Comparte tus ideas, preguntas o propuestas..."
                required
                rows={6}
                className="w-full resize-none"
              />
            </div>

            <Button
              type="submit"
              className="bg-foreground text-background border border-foreground px-6 py-2 font-medium"
            >
              Enviar Mensaje
            </Button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}
