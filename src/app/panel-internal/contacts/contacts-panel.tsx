"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AdminContact {
  id: number;
  email: string;
  subject: string;
  message: string;
  locale: string;
  created_at: string;
  is_read: boolean;
  response_sent: boolean;
  notes: string | null;
  is_spam: boolean;
  spam_reason: string | null;
}

type Filter = "inbox" | "unread" | "spam" | "all";

const FILTERS: { key: Filter; label: string; match: (c: AdminContact) => boolean }[] = [
  { key: "inbox", label: "Bandeja", match: (c) => !c.is_spam },
  { key: "unread", label: "Sin leer", match: (c) => !c.is_spam && !c.is_read },
  { key: "spam", label: "Spam", match: (c) => c.is_spam },
  { key: "all", label: "Todos", match: () => true },
];

const dateFormat = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Argentina/Buenos_Aires",
});

export function ContactsPanel({ initialContacts, apiBase }: { initialContacts: AdminContact[]; apiBase: string }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [filter, setFilter] = useState<Filter>("inbox");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(() => {
    const match = FILTERS.find((f) => f.key === filter)!.match;
    const q = query.trim().toLowerCase();
    return contacts.filter(
      (c) => match(c) && (!q || [c.email, c.subject, c.message, c.notes ?? ""].some((t) => t.toLowerCase().includes(q)))
    );
  }, [contacts, filter, query]);

  async function request(id: number, method: "PATCH" | "DELETE", body?: Partial<AdminContact>) {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/contacts/${id}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setContacts((prev) =>
        method === "DELETE" ? prev.filter((c) => c.id !== id) : prev.map((c) => (c.id === id ? data : c))
      );
    } catch (e) {
      setError(`#${id}: ${e instanceof Error ? e.message : "error"}`);
    } finally {
      setBusy(null);
    }
  }

  function remove(contact: AdminContact) {
    if (window.confirm(`¿Borrar definitivamente el mensaje de ${contact.email}?`)) request(contact.id, "DELETE");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Contactos</h1>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar…"
          className="h-9 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm sm:w-64"
        />
      </header>

      <nav className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              filter === f.key ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white hover:bg-neutral-100"
            )}
          >
            {f.label} <span className="opacity-60">{contacts.filter(f.match).length}</span>
          </button>
        ))}
      </nav>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {visible.length === 0 && <p className="py-16 text-center text-neutral-500">No hay mensajes.</p>}

      <ul className="space-y-4">
        {visible.map((c) => (
          <ContactCard key={c.id} contact={c} busy={busy === c.id} onUpdate={(b) => request(c.id, "PATCH", b)} onDelete={() => remove(c)} />
        ))}
      </ul>
    </main>
  );
}

function ContactCard({
  contact: c,
  busy,
  onUpdate,
  onDelete,
}: {
  contact: AdminContact;
  busy: boolean;
  onUpdate: (body: Partial<AdminContact>) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(c.notes ?? "");
  const notesChanged = notes.trim() !== (c.notes ?? "").trim();
  const replyHref = `mailto:${c.email}?subject=${encodeURIComponent(`Re: ${c.subject}`)}`;

  return (
    <li
      className={cn(
        "rounded-lg border bg-white p-4 shadow-xs",
        !c.is_read && !c.is_spam ? "border-neutral-900" : "border-neutral-200",
        c.is_spam && "opacity-70",
        busy && "pointer-events-none opacity-50"
      )}
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={cn("break-words text-base", !c.is_read && "font-semibold")}>{c.subject}</h2>
        <time className="shrink-0 text-xs text-neutral-500" dateTime={c.created_at}>
          {dateFormat.format(new Date(c.created_at))}
        </time>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <a href={replyHref} className="break-all text-blue-700 hover:underline">
          {c.email}
        </a>
        <Badge>{c.locale}</Badge>
        {c.response_sent && <Badge className="bg-green-100 text-green-800">respondido</Badge>}
        {c.is_spam && <Badge className="bg-red-100 text-red-800">spam{c.spam_reason ? `: ${c.spam_reason}` : ""}</Badge>}
      </div>

      <p className="mb-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-neutral-800">{c.message}</p>

      <div className="mb-3 flex gap-2">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas"
          rows={1}
          className="min-h-9 flex-1 resize-y rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
        />
        {notesChanged && (
          <Button size="sm" variant="outline" onClick={() => onUpdate({ notes })}>
            Guardar
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => onUpdate({ is_read: !c.is_read })}>
          {c.is_read ? "Marcar no leído" : "Marcar leído"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onUpdate({ response_sent: !c.response_sent, is_read: true })}>
          {c.response_sent ? "No respondido" : "Respondido"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onUpdate({ is_spam: !c.is_spam })}>
          {c.is_spam ? "No es spam" : "Spam"}
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <a href={replyHref}>Responder</a>
        </Button>
        <Button size="sm" variant="destructive" className="ml-auto" onClick={onDelete}>
          Borrar
        </Button>
      </div>
    </li>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-700", className)}>{children}</span>;
}
