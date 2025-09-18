"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const articles = [
  {
    id: 1,
    title: "La Belleza de los Algoritmos Recursivos",
    excerpt: "Explorando cómo la recursión nos ayuda a resolver problemas complejos de manera elegante y eficiente.",
    category: "computer-science",
    categoryName: "Computer Science",
    date: "Dic 2024",
    slug: "belleza-algoritmos-recursivos",
  },
  {
    id: 2,
    title: "Matemáticas en el Machine Learning: Una Perspectiva Práctica",
    excerpt: "Desentrañando las matemáticas detrás de los algoritmos de aprendizaje automático más populares.",
    category: "mathematics",
    categoryName: "Matemáticas",
    date: "Nov 2024",
    slug: "matematicas-machine-learning",
  },
  {
    id: 3,
    title: "Reflexiones sobre la Programación Funcional",
    excerpt: "Por qué la programación funcional está ganando terreno en el desarrollo moderno y sus ventajas.",
    category: "programming",
    categoryName: "Programación",
    date: "Oct 2024",
    slug: "reflexiones-programacion-funcional",
  },
  {
    id: 4,
    title: "La Importancia de las Estructuras de Datos",
    excerpt: "Cómo elegir la estructura de datos correcta puede hacer la diferencia en el rendimiento.",
    category: "computer-science",
    categoryName: "Computer Science",
    date: "Sep 2024",
    slug: "importancia-estructuras-datos",
  },
  {
    id: 5,
    title: "Teoría de Números y Criptografía",
    excerpt: "Explorando la conexión entre conceptos matemáticos abstractos y la seguridad digital.",
    category: "mathematics",
    categoryName: "Matemáticas",
    date: "Ago 2024",
    slug: "teoria-numeros-criptografia",
  },
  {
    id: 6,
    title: "Patrones de Diseño en JavaScript Moderno",
    excerpt: "Implementando patrones clásicos con las características más recientes del lenguaje.",
    category: "programming",
    categoryName: "Programación",
    date: "Jul 2024",
    slug: "patrones-diseno-javascript",
  },
  {
    id: 7,
    title: "Pensamientos sobre la Educación en Tecnología",
    excerpt: "Reflexiones personales sobre cómo enseñar y aprender en el mundo digital actual.",
    category: "personal",
    categoryName: "Personal",
    date: "Jun 2024",
    slug: "educacion-tecnologia",
  },
  {
    id: 8,
    title: "Investigación en Inteligencia Artificial: Estado Actual",
    excerpt: "Un análisis de los avances recientes y los desafíos pendientes en IA.",
    category: "research",
    categoryName: "Investigación",
    date: "May 2024",
    slug: "investigacion-ia-estado-actual",
  },
]

const categories = [
  { id: "all", name: "Todos", count: articles.length },
  {
    id: "computer-science",
    name: "Computer Science",
    count: articles.filter((a) => a.category === "computer-science").length,
  },
  { id: "mathematics", name: "Matemáticas", count: articles.filter((a) => a.category === "mathematics").length },
  { id: "programming", name: "Programación", count: articles.filter((a) => a.category === "programming").length },
  { id: "personal", name: "Personal", count: articles.filter((a) => a.category === "personal").length },
  { id: "research", name: "Investigación", count: articles.filter((a) => a.category === "research").length },
]

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryStyle = (category: string) => {
    const styles = {
      "computer-science": "bg-blue-100 text-blue-800 border-blue-200",
      mathematics: "bg-green-100 text-green-800 border-green-200",
      programming: "bg-purple-100 text-purple-800 border-purple-200",
      personal: "bg-orange-100 text-orange-800 border-orange-200",
      research: "bg-pink-100 text-pink-800 border-pink-200",
    }
    return styles[category as keyof typeof styles] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Artículos</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Exploraciones sobre matemáticas, ciencias de la computación, programación y reflexiones personales.
          </p>
        </section>

        {/* Search and Filters */}
        <section className="mb-12">
          <div className="flex flex-col gap-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    selectedCategory === category.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles List */}
        <section>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron artículos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredArticles.map((article) => (
                <article key={article.id} className="border-b border-border pb-8 last:border-b-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`${getCategoryStyle(article.category)} px-2 py-1 rounded text-xs font-medium border`}
                    >
                      {article.categoryName}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Calendar size={14} />
                      <span>{article.date}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-foreground mb-3 text-balance">
                    <Link href={`/articles/${article.slug}`} className="text-foreground no-underline">
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">{article.excerpt}</p>

                  <Link href={`/articles/${article.slug}`} className="text-foreground text-sm font-medium no-underline">
                    Leer más →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
