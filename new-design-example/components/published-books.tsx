import Image from "next/image"

const books = [
  {
    id: 1,
    title: "Algoritmos y Estructuras de Datos",
    subtitle: "Una Guía Práctica",
    cover: "/computer-science-book-cover-algorithms.jpg",
    description: "Una exploración profunda de los algoritmos fundamentales y estructuras de datos.",
    year: "2024",
  },
  {
    id: 2,
    title: "Matemáticas Discretas",
    subtitle: "Para Ciencias de la Computación",
    cover: "/mathematics-textbook-discrete-math.jpg",
    description: "Los fundamentos matemáticos esenciales para la informática moderna.",
    year: "2023",
  },
]

export function PublishedBooks() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {books.map((book) => (
        <div key={book.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={book.cover || "/placeholder.svg"}
              alt={`Portada de ${book.title}`}
              width={120}
              height={180}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1 text-balance">{book.title}</h3>
            <p className="text-muted-foreground text-sm mb-2">{book.subtitle}</p>
            <p className="text-muted-foreground text-xs mb-3">Publicado en {book.year}</p>
            <p className="text-sm text-foreground leading-relaxed text-pretty">{book.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
