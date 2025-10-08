"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, Heart, Calendar, User, CheckCircle, Mail, AtSign } from "lucide-react";
import { getComments, addComment, likeComment, type Comment } from "@/lib/comments";

interface UnifiedCommentsProps {
  contentId: string;
  locale: string;
  contentTitle?: string;
}

export function UnifiedComments({ contentId, locale, contentTitle }: UnifiedCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState({ name: "", message: "", twitter: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getComments(contentId, locale);
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [contentId, locale]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.name.trim() && newComment.message.trim()) {
      try {
        setSubmitting(true);
        setError(null);
        await addComment({
          content_id: contentId,
          locale,
          name: newComment.name.trim(),
          message: newComment.message.trim(),
          twitter: newComment.twitter.trim() || undefined,
          email: newComment.email.trim() || undefined,
          is_visible: false,
        });
        setNewComment({ name: "", message: "", twitter: "", email: "" });
        setShowForm(false);
        setSubmitSuccess(true);
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } catch (err) {
        console.error('Error submitting comment:', err);
        setError('Failed to submit comment. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleLike = async (id: number) => {
    try {
      // Optimistic update
      setComments(comments.map((comment) => 
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
      ));
      await likeComment(id);
    } catch (err) {
      console.error('Error liking comment:', err);
      // Revert optimistic update on error
      await loadComments();
    }
  };

  const texts = {
    es: {
      title: "Comentarios",
      addComment: "Añadir Comentario",
      cancel: "Cancelar",
      namePlaceholder: "Tu nombre",
      twitterPlaceholder: "@tuusuario (opcional)",
      emailPlaceholder: "tu@email.com (opcional)",
      messagePlaceholder: "Comparte tu opinión",
      send: "Enviar",
      sending: "Enviando...",
      noComments: "Sé el primero en comentar",
      loading: "Cargando comentarios...",
      pendingApproval: "¡Gracias! Tu comentario está pendiente de aprobación y será visible pronto.",
      error: "Error al cargar los comentarios. Por favor, intenta de nuevo más tarde.",
    },
    en: {
      title: "Comments",
      addComment: "Add Comment",
      cancel: "Cancel",
      namePlaceholder: "Your name",
      twitterPlaceholder: "@yourhandle (optional)",
      emailPlaceholder: "your@email.com (optional)",
      messagePlaceholder: "Share your thoughts...",
      send: "Send",
      sending: "Sending...",
      noComments: "Be the first to comment",
      loading: "Loading comments...",
      pendingApproval: "Thank you! Your comment is pending approval and will be visible soon.",
      error: "Error loading comments. Please try again later.",
    }
  };

  const t = texts[locale as keyof typeof texts] || texts.es;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', options).format(date);
  };

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

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-green-800 dark:text-green-200 text-sm">{t.pendingApproval}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Comment Form */}
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
                disabled={submitting}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="comment-twitter" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <AtSign size={16} />
                  Twitter/X
                </label>
                <input
                  id="comment-twitter"
                  type="text"
                  placeholder={t.twitterPlaceholder}
                  value={newComment.twitter}
                  onChange={(e) => setNewComment({ ...newComment, twitter: e.target.value })}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="comment-email" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  id="comment-email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={newComment.email}
                  onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>
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
                disabled={submitting}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                {submitting ? t.sending : t.send}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent transition-colors text-sm disabled:opacity-50"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-muted-foreground mb-4 animate-pulse" size={48} />
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        ) : comments.length === 0 ? (
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{comment.name}</h4>
                      {comment.twitter && (
                        <a
                          href={`https://twitter.com/${comment.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <AtSign size={12} />
                          <span>{comment.twitter.startsWith('@') ? comment.twitter : `@${comment.twitter}`}</span>
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>{formatDate(comment.created_at)}</span>
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
              <p className="text-foreground leading-relaxed text-pretty whitespace-pre-wrap">{comment.message}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
