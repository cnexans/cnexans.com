import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { getCanonicalUrl } from "@/i18n/utils";
import { Mail, MessageSquare, User } from "lucide-react";

export const dynamic = 'force-static'

export const revalidate = false;

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const metadata = (await import(`@/content/contact/${locale}.mdx`)).metadata;
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: getCanonicalUrl({ locale, pathname: "/contact" }),
      languages: {
        "en": getCanonicalUrl({ locale: "en", pathname: "/contact" }),
        "es": getCanonicalUrl({ locale: "es", pathname: "/contact" }),
      },
    },
  };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  try {
    const Content = (await import(`@/content/contact/${locale}.mdx`)).default;
    
    return (
      <>
        {/* Page Header */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {locale === 'es' ? 'Contacto' : 'Contact'}
          </h1>
          <div className="prose prose-lg max-w-none">
            <div className="text-muted-foreground text-lg leading-relaxed markdown-content">
              <Content />
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-2xl">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Mail size={16} />
                Email
              </label>
              <input 
                id="email" 
                type="email" 
                placeholder={locale === 'es' ? 'tu@email.com' : 'your@email.com'}
                required 
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <User size={16} />
                {locale === 'es' ? 'Asunto' : 'Subject'}
              </label>
              <input
                id="subject"
                type="text"
                placeholder={locale === 'es' ? '¿Sobre qué te gustaría conversar?' : 'What would you like to talk about?'}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MessageSquare size={16} />
                {locale === 'es' ? 'Mensaje' : 'Message'}
              </label>
              <textarea
                id="message"
                placeholder={locale === 'es' ? 'Comparte tus ideas, preguntas o propuestas...' : 'Share your ideas, questions or proposals...'}
                required
                rows={6}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-foreground text-background border border-foreground px-6 py-2 font-medium rounded-md hover:bg-foreground/90 transition-colors"
            >
              {locale === 'es' ? 'Enviar Mensaje' : 'Send Message'}
            </button>
          </form>
        </section>
      </>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
