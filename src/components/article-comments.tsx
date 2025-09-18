"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Heart, Calendar, User } from "lucide-react";

interface Comment {
  id: number;
  name: string;
  message: string;
  date: string;
  likes: number;
}

interface ArticleCommentsProps {
  articleTitle: string;
  locale: string;
}

const getInitialComments = (articleTitle: string): Comment[] => [
  {
    id: 1,
    name: "María González",
    message: `Excelente artículo sobre "${articleTitle}". Me ayudó mucho a entender los conceptos presentados. ¡Gracias por compartir!`,
    date: "15 Dic 2024",
    likes: 8,
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    message: "Muy clara la explicación. Me gustaría ver más contenido relacionado con este tema.",
    date: "12 Dic 2024",
    likes: 5,
  },
  {
    id: 3,
    name: "Ana Martín",
    message: "Perfecto timing para este artículo. Justo estaba buscando información sobre esto.",
    date: "10 Dic 2024",
    likes: 12,
  },
];

export function ArticleComments({ articleTitle, locale }: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(getInitialComments(articleTitle));
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState({ name: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.name.trim() && newComment.message.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        name: newComment.name.trim(),
        message: newComment.message.trim(),
        date: new Date().toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        likes: 0,
      };
      setComments([comment, ...comments]);
      setNewComment({ name: "", message: "" });
      setShowForm(false);
    }
  };

  const handleLike = (id: number) => {
    setComments(comments.map((comment) => 
      comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
    ));
  };

  const texts = {
    es: {
      title: "Comentarios",
      addComment: "Añadir Comentario",
      cancel: "Cancelar",
      namePlaceholder: "Tu nombre",
      messagePlaceholder: "Comparte tu opinión sobre este artículo...",
      send: "Enviar",
      noComments: "Sé el primero en comentar este artículo"
    },
    en: {
      title: "Comments",
      addComment: "Add Comment",
      cancel: "Cancel",
      namePlaceholder: "Your name",
      messagePlaceholder: "Share your thoughts about this article...",
      send: "Send",
      noComments: "Be the first to comment on this article"
    }
  };

  const t = texts[locale as keyof typeof texts] || texts.es;

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-foreground" size={24} />
          <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
          <span className="text-muted-foreground text-sm">({comments.length})</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent transition-colors text-sm font-medium"
        >
          {showForm ? t.cancel : t.addComment}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="comment-name" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <User size={16} />
                {t.namePlaceholder}
              </label>
              <input
                id="comment-name"
                type="text"
                placeholder={t.namePlaceholder}
                value={newComment.name}
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="comment-message" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MessageSquare size={16} />
                {t.messagePlaceholder}
              </label>
              <textarea
                id="comment-message"
                placeholder={t.messagePlaceholder}
                value={newComment.message}
                onChange={(e) => setNewComment({ ...newComment, message: e.target.value })}
                rows={4}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors text-sm font-medium"
              >
                <Send size={16} />
                {t.send}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent transition-colors text-sm"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">{t.noComments}</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{comment.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>{comment.date}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Heart size={16} className="group-hover:text-red-500 transition-colors" />
                  <span className="text-sm">{comment.likes}</span>
                </button>
              </div>
              <p className="text-foreground leading-relaxed text-pretty">{comment.message}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
