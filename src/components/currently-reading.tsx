"use client";

import Image from "next/image";

const currentBooks = [
  {
    id: 1,
    title: "Thinking in Systems",
    author: "Donella Meadows",
    isbn: "9781603580557", // ISBN para obtener la portada desde Open Library
    thoughts: null,
  },
  {
    id: 2,
    title: "Wholeness and the Implicate Order",
    author: "David Bohm",
    isbn: "9781134438723", // ISBN para obtener la portada desde Open Library
    thoughts: null,
  },
];

export function CurrentlyReading() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {currentBooks.map((book) => (
        <div key={book.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-shrink-0">
              <Image
                src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                alt={`Portada de ${book.title}`}
                width={80}
                height={120}
                className="rounded shadow-md object-cover"
                onError={(e) => {
                  // Fallback si la imagen no se encuentra
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1 text-balance">{book.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">por {book.author}</p>
            </div>
          </div>
          {book.thoughts && <p className="hidden lg:block text-md text-foreground leading-relaxed text-pretty">{book.thoughts}</p>}
        </div>
      ))}
    </div>
  );
}
