"use client";

import { useState } from "react";
import { Mail, MessageSquare, User, CheckCircle, Loader2 } from "lucide-react";
import { submitContact } from "@/lib/contacts";

interface ContactFormProps {
  locale: string;
}

export function ContactForm({ locale }: ContactFormProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !subject || !message) {
      setError(locale === 'es' ? 'Por favor completa todos los campos' : 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitContact({
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        locale,
      });

      setIsSubmitted(true);
      setEmail("");
      setSubject("");
      setMessage("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting contact:', err);
      setError(
        locale === 'es' 
          ? 'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.' 
          : 'There was an error sending your message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {isSubmitted && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle size={20} />
            <p className="font-medium">
              {locale === 'es' 
                ? '¡Mensaje enviado con éxito!' 
                : 'Message sent successfully!'}
            </p>
          </div>
          <p className="mt-2 text-sm text-green-700 dark:text-green-300">
            {locale === 'es'
              ? 'Gracias por contactarme. Responderé a la brevedad posible.'
              : 'Thank you for contacting me. I will respond as soon as possible.'}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="email" 
            className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"
          >
            <Mail size={16} />
            Email
          </label>
          <input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={locale === 'es' ? 'tu@email.com' : 'your@email.com'}
            required 
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label 
            htmlFor="subject" 
            className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"
          >
            <User size={16} />
            {locale === 'es' ? 'Asunto' : 'Subject'}
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={locale === 'es' ? '¿Sobre qué te gustaría conversar?' : 'What would you like to talk about?'}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label 
            htmlFor="message" 
            className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"
          >
            <MessageSquare size={16} />
            {locale === 'es' ? 'Mensaje' : 'Message'}
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={locale === 'es' ? 'Comparte tus ideas, preguntas o propuestas...' : 'Share your ideas, questions or proposals...'}
            required
            disabled={isSubmitting}
            rows={6}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-foreground text-background border border-foreground px-6 py-2 font-medium rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting 
            ? (locale === 'es' ? 'Enviando...' : 'Sending...') 
            : (locale === 'es' ? 'Enviar Mensaje' : 'Send Message')
          }
        </button>
      </form>
    </div>
  );
}
