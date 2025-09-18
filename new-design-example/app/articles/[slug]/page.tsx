"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar, Heart, ArrowLeft, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock article data - in a real app this would come from a database
const articles = {
  "belleza-algoritmos-recursivos": {
    id: 1,
    title: "La Belleza de los Algoritmos Recursivos",
    category: "computer-science",
    categoryName: "Computer Science",
    date: "Dic 2024",
    likes: 24,
    content: `
# La Belleza de los Algoritmos Recursivos

La recursión es uno de los conceptos más elegantes y poderosos en las ciencias de la computación. A menudo, los problemas que parecen complejos e intratables se vuelven sorprendentemente simples cuando los abordamos desde una perspectiva recursiva.

## ¿Qué hace especial a la recursión?

La recursión nos permite descomponer problemas grandes en versiones más pequeñas del mismo problema. Esta característica de **auto-similitud** es lo que hace que muchos algoritmos recursivos sean tan elegantes.

Consideremos el clásico ejemplo del factorial:

\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
\`\`\`

## La matemática detrás de la recursión

Matemáticamente, la recursión se relaciona estrechamente con la **inducción matemática**. Ambos conceptos requieren:

1. Un **caso base** que detiene la recursión
2. Un **paso inductivo** que reduce el problema

Esta conexión no es coincidencia. Muchos teoremas matemáticos que se prueban por inducción tienen implementaciones recursivas naturales.

## Aplicaciones prácticas

Los algoritmos recursivos brillan en problemas que tienen estructura recursiva natural:

- **Árboles y grafos**: Recorridos en profundidad
- **Divide y vencerás**: Merge sort, quick sort
- **Programación dinámica**: Fibonacci con memoización
- **Backtracking**: Resolución de sudokus, N-reinas

## Reflexiones finales

La recursión nos enseña que a veces la solución más elegante no es la más obvia. Nos invita a pensar en términos de patrones y estructuras, más que en pasos secuenciales.

Como dijo Dijkstra: *"La elegancia no es opcional"*. En el mundo de los algoritmos, la recursión es una de nuestras herramientas más elegantes.
    `,
    relatedArticles: [
      { title: "Matemáticas en el Machine Learning", slug: "matematicas-machine-learning", category: "mathematics" },
      {
        title: "La Importancia de las Estructuras de Datos",
        slug: "importancia-estructuras-datos",
        category: "computer-science",
      },
      {
        title: "Patrones de Diseño en JavaScript Moderno",
        slug: "patrones-diseno-javascript",
        category: "programming",
      },
    ],
  },
  "matematicas-machine-learning": {
    id: 2,
    title: "Matemáticas en el Machine Learning: Una Perspectiva Práctica",
    category: "mathematics",
    categoryName: "Matemáticas",
    date: "Nov 2024",
    likes: 18,
    content: `
# Matemáticas en el Machine Learning: Una Perspectiva Práctica

El machine learning puede parecer mágico desde fuera, pero en su núcleo encontramos matemáticas elegantes y bien establecidas. Entender estos fundamentos no solo nos hace mejores practicantes, sino que nos permite intuir cuándo y por qué funcionan ciertos algoritmos.

## Los pilares matemáticos

### Álgebra Lineal
El álgebra lineal es el lenguaje del machine learning. Vectores, matrices y transformaciones lineales aparecen en casi todos los algoritmos:

- **Vectores**: Representan características y datos
- **Matrices**: Transformaciones y pesos
- **Eigenvalores**: PCA y reducción de dimensionalidad

### Cálculo
El cálculo nos permite optimizar. El descenso de gradiente, corazón de muchos algoritmos, es puro cálculo aplicado:

$$\\frac{\\partial J}{\\partial \\theta} = \\frac{1}{m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)}) x^{(i)}$$

### Probabilidad y Estadística
La incertidumbre es inherente a los datos reales. La probabilidad nos da herramientas para manejarla:

- **Teorema de Bayes**: Clasificación naive Bayes
- **Distribuciones**: Modelos generativos
- **Inferencia**: Intervalos de confianza

## De la teoría a la práctica

Lo hermoso del machine learning es cómo conceptos matemáticos abstractos se traducen en código que resuelve problemas reales. Una regresión lineal es simplemente:

$$y = X\\beta + \\epsilon$$

Pero implementada correctamente, puede predecir precios de casas, demanda de productos, o tendencias de mercado.

## Reflexión final

Las matemáticas no son un obstáculo para entender machine learning; son el mapa que nos guía. Cada ecuación cuenta una historia sobre los datos y los patrones que buscamos descubrir.
    `,
    relatedArticles: [
      {
        title: "La Belleza de los Algoritmos Recursivos",
        slug: "belleza-algoritmos-recursivos",
        category: "computer-science",
      },
      { title: "Teoría de Números y Criptografía", slug: "teoria-numeros-criptografia", category: "mathematics" },
      {
        title: "Investigación en Inteligencia Artificial",
        slug: "investigacion-ia-estado-actual",
        category: "research",
      },
    ],
  },
}

interface Comment {
  id: number
  author: string
  content: string
  date: string
  likes: number
}

const mockComments: Comment[] = [
  {
    id: 1,
    author: "Elena Rodríguez",
    content:
      "Excelente explicación de la recursión. Me ayudó mucho a entender la conexión con la inducción matemática.",
    date: "2 días",
    likes: 5,
  },
  {
    id: 2,
    author: "Miguel Santos",
    content: "Los ejemplos de código están muy claros. ¿Podrías hacer un artículo sobre recursión de cola?",
    date: "1 día",
    likes: 3,
  },
]

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug as keyof typeof articles]
  const [likes, setLikes] = useState(article?.likes || 0)
  const [hasLiked, setHasLiked] = useState(false)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState({ author: "", content: "" })
  const [showCommentForm, setShowCommentForm] = useState(false)

  if (!article) {
    notFound()
  }

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1)
      setHasLiked(true)
    }
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.author.trim() && newComment.content.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: newComment.author.trim(),
        content: newComment.content.trim(),
        date: "ahora",
        likes: 0,
      }
      setComments([comment, ...comments])
      setNewComment({ author: "", content: "" })
      setShowCommentForm(false)
    }
  }

  const handleCommentLike = (commentId: number) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center gap-2 text-muted-foreground no-underline">
            <ArrowLeft size={16} />
            Volver a artículos
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className={`category-${article.category} px-3 py-1 rounded text-sm font-medium`}>
              {article.categoryName}
            </span>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar size={14} />
              <span>{article.date}</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-6 text-balance">{article.title}</h1>

          <div className="flex items-center justify-between border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  hasLiked
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-background border-border text-muted-foreground hover:border-foreground"
                }`}
              >
                <Heart size={16} className={hasLiked ? "fill-current" : ""} />
                <span>{likes}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-16">
          <div className="font-serif text-foreground leading-relaxed space-y-6">
            <p className="text-lg">
              La recursión es uno de los conceptos más elegantes y poderosos en las ciencias de la computación. A
              menudo, los problemas que parecen complejos e intratables se vuelven sorprendentemente simples cuando los
              abordamos desde una perspectiva recursiva.
            </p>

            <p>
              La recursión nos permite descomponer problemas grandes en versiones más pequeñas del mismo problema. Esta
              característica de <strong>auto-similitud</strong> es lo que hace que muchos algoritmos recursivos sean tan
              elegantes.
            </p>

            <p>
              Consideremos el clásico ejemplo del factorial. En JavaScript, podemos implementarlo de manera recursiva de
              forma muy natural:
            </p>

            <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
              <code className="text-sm font-mono">{`function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`}</code>
            </pre>

            <p>
              Matemáticamente, la recursión se relaciona estrechamente con la <strong>inducción matemática</strong>.
              Ambos conceptos requieren un caso base que detiene la recursión y un paso inductivo que reduce el
              problema. Esta conexión no es coincidencia: muchos teoremas matemáticos que se prueban por inducción
              tienen implementaciones recursivas naturales.
            </p>

            <p>
              Los algoritmos recursivos brillan en problemas que tienen estructura recursiva natural. Algunos ejemplos
              incluyen el recorrido de árboles y grafos, algoritmos de divide y vencerás como merge sort y quick sort,
              programación dinámica con memoización, y técnicas de backtracking para resolver problemas como sudokus o
              el problema de las N-reinas.
            </p>

            <p>
              La recursión nos enseña que a veces la solución más elegante no es la más obvia. Nos invita a pensar en
              términos de patrones y estructuras, más que en pasos secuenciales. Como dijo Dijkstra:{" "}
              <em>"La elegancia no es opcional"</em>. En el mundo de los algoritmos, la recursión es una de nuestras
              herramientas más elegantes.
            </p>

            <p>
              Al dominar la recursión, no solo aprendemos una técnica de programación, sino que desarrollamos una forma
              de pensar que nos permite abordar problemas complejos con mayor claridad y elegancia. Es una habilidad que
              trasciende los lenguajes de programación y se convierte en una herramienta fundamental del pensamiento
              computacional.
            </p>
          </div>
        </article>

        {/* Related Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Artículos Relacionados</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {article.relatedArticles.map((related, index) => (
              <Link
                key={index}
                href={`/articles/${related.slug}`}
                className="bg-card border border-border rounded-lg p-6 no-underline block"
              >
                <span
                  className={`category-${related.category} px-2 py-1 rounded text-xs font-medium mb-3 inline-block`}
                >
                  {related.category.replace("-", " ")}
                </span>
                <h3 className="font-semibold text-foreground text-balance">{related.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Comments Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-foreground" size={24} />
              <h2 className="text-2xl font-bold text-foreground">Comentarios ({comments.length})</h2>
            </div>
            <Button onClick={() => setShowCommentForm(!showCommentForm)} variant="outline" size="sm">
              {showCommentForm ? "Cancelar" : "Comentar"}
            </Button>
          </div>

          {showCommentForm && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Tu nombre"
                    value={newComment.author}
                    onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Escribe tu comentario..."
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    <Send size={16} className="mr-2" />
                    Publicar
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowCommentForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{comment.author}</h4>
                    <p className="text-xs text-muted-foreground">hace {comment.date}</p>
                  </div>
                  <button
                    onClick={() => handleCommentLike(comment.id)}
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <Heart size={16} />
                    <span className="text-sm">{comment.likes}</span>
                  </button>
                </div>
                <p className="text-foreground leading-relaxed text-pretty">{comment.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
