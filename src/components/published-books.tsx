"use client";

import Image from "next/image";

const books = [
  {
    id: 1,
    title: "Algoritmos y Estructuras de Datos",
    subtitle: "Una Guía Práctica",
    isbn: "9780262033848", // Introduction to Algorithms (CLRS) - libro de referencia
    description: "Una exploración profunda de los algoritmos fundamentales y estructuras de datos.",
    year: "2024",
  },
  {
    id: 2,
    title: "Matemáticas Discretas",
    subtitle: "Para Ciencias de la Computación",
    isbn: "9780072899054", // Discrete Mathematics and Its Applications
    description: "Los fundamentos matemáticos esenciales para la informática moderna.",
    year: "2023",
  },
];

export function PublishedBooks() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {books.map((book) => (
        <div key={book.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
              alt={`Portada de ${book.title}`}
              width={120}
              height={180}
              className="rounded-lg shadow-md object-cover"
              onError={(e) => {
                // Fallback si la imagen no se encuentra
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
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
  );
}
