"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, Send, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface GuestbookEntry {
  id: number
  name: string
  message: string
  date: string
  likes: number
}

const initialEntries: GuestbookEntry[] = [
  {
    id: 1,
    name: "María González",
    message: "Excelente contenido sobre algoritmos recursivos. Me ayudó mucho a entender el concepto. ¡Gracias!",
    date: "15 Dic 2024",
    likes: 12,
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    message: "Tus explicaciones sobre matemáticas discretas son muy claras. Espero más contenido así.",
    date: "12 Dic 2024",
    likes: 8,
  },
  {
    id: 3,
    name: "Ana Martín",
    message: "Me encanta el enfoque práctico que le das a los conceptos teóricos. Sigue así!",
    date: "10 Dic 2024",
    likes: 15,
  },
]

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries)
  const [showForm, setShowForm] = useState(false)
  const [newEntry, setNewEntry] = useState({ name: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEntry.name.trim() && newEntry.message.trim()) {
      const entry: GuestbookEntry = {
        id: entries.length + 1,
        name: newEntry.name.trim(),
        message: newEntry.message.trim(),
        date: new Date().toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        likes: 0,
      }
      setEntries([entry, ...entries])
      setNewEntry({ name: "", message: "" })
      setShowForm(false)
    }
  }

  const handleLike = (id: number) => {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, likes: entry.likes + 1 } : entry)))
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-foreground" size={24} />
          <h2 className="text-2xl font-bold text-foreground">Libro de Visitas</h2>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
          {showForm ? "Cancelar" : "Dejar Comentario"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Tu nombre"
                value={newEntry.name}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Deja tu comentario..."
                value={newEntry.message}
                onChange={(e) => setNewEntry({ ...newEntry, message: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                <Send size={16} className="mr-2" />
                Enviar
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-foreground">{entry.name}</h4>
                <p className="text-xs text-muted-foreground">{entry.date}</p>
              </div>
              <button onClick={() => handleLike(entry.id)} className="flex items-center gap-1 text-muted-foreground">
                <Heart size={16} />
                <span className="text-sm">{entry.likes}</span>
              </button>
            </div>
            <p className="text-foreground leading-relaxed text-pretty">{entry.message}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
