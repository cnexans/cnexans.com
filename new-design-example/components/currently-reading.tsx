import Image from "next/image"

const currentBooks = [
  {
    id: 1,
    title: "The Art of Computer Programming, Vol. 1",
    author: "Donald E. Knuth",
    cover: "/godel-escher-bach-book.jpg",
    progress: "Capítulo 3",
    thoughts: "Una obra maestra que todo programador debería estudiar. La profundidad matemática es impresionante.",
  },
  {
    id: 2,
    title: "Gödel, Escher, Bach",
    author: "Douglas R. Hofstadter",
    cover: "/godel-escher-bach-book.jpg",
    progress: "Página 245",
    thoughts: "Fascinante exploración de la conciencia, la recursión y los sistemas formales.",
  },
]

export function CurrentlyReading() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {currentBooks.map((book) => (
        <div key={book.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-shrink-0">
              <Image
                src={book.cover || "/placeholder.svg"}
                alt={`Portada de ${book.title}`}
                width={80}
                height={120}
                className="rounded shadow-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1 text-balance">{book.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">por {book.author}</p>
              <p className="text-xs text-foreground font-medium">{book.progress}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{book.thoughts}</p>
        </div>
      ))}
    </div>
  )
}
