import Link from "next/link"
import { Calendar } from "lucide-react"

const featuredArticles = [
  {
    id: 1,
    title: "La Belleza de los Algoritmos Recursivos",
    excerpt: "Explorando cómo la recursión nos ayuda a resolver problemas complejos de manera elegante...",
    category: "computer-science",
    categoryName: "Computer Science",
    date: "Dic 2024",
    slug: "belleza-algoritmos-recursivos",
  },
  {
    id: 2,
    title: "Matemáticas en el Machine Learning: Una Perspectiva Práctica",
    excerpt: "Desentrañando las matemáticas detrás de los algoritmos de aprendizaje automático...",
    category: "mathematics",
    categoryName: "Matemáticas",
    date: "Nov 2024",
    slug: "matematicas-machine-learning",
  },
  {
    id: 3,
    title: "Reflexiones sobre la Programación Funcional",
    excerpt: "Por qué la programación funcional está ganando terreno en el desarrollo moderno...",
    category: "programming",
    categoryName: "Programación",
    date: "Oct 2024",
    slug: "reflexiones-programacion-funcional",
  },
]

export function FeaturedArticles() {
  return (
    <div className="space-y-6">
      {featuredArticles.map((article) => (
        <article key={article.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`category-${article.category} px-2 py-1 rounded text-xs font-medium`}>
              {article.categoryName}
            </span>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Calendar size={12} />
              <span>{article.date}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-3 text-balance">
            <Link href={`/articles/${article.slug}`} className="text-foreground no-underline">
              {article.title}
            </Link>
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-pretty">{article.excerpt}</p>

          <Link href={`/articles/${article.slug}`} className="text-foreground text-sm font-medium no-underline">
            Leer más →
          </Link>
        </article>
      ))}
    </div>
  )
}
