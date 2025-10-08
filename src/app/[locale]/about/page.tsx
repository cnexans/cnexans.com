import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CurrentlyReading } from "@/components/currently-reading";
import { NowPlaying } from "@/components/now-playing";
import { getCanonicalUrl } from "@/i18n/utils";
import { BookOpen, Music, User } from "lucide-react";

export const dynamic = 'force-static'

export const revalidate = false;

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const metadata = (await import(`@/content/about/${locale}.mdx`)).metadata;
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: getCanonicalUrl({ locale, pathname: "/about" }),
      languages: {
        "en": getCanonicalUrl({ locale: "en", pathname: "/about" }),
        "es": getCanonicalUrl({ locale: "es", pathname: "/about" }),
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
    const Content = (await import(`@/content/about/${locale}.mdx`)).default;
    
    return (
      <>
        {/* About Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <User className="hidden text-foreground" size={24} />
            <h1 className="text-3xl font-bold text-foreground">
              {locale === 'es' ? 'Sobre Mí' : 'About Me'}
            </h1>
          </div>

          <div className="markdown-content">
            <Content />
          </div>
        </section>

        {/* Currently Reading */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">
              {locale === 'es' ? 'Leyendo Actualmente' : 'Currently Reading'}
            </h2>
          </div>
          <CurrentlyReading />
        </section>

        {/* Now Playing */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Music className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">
              {locale === 'es' ? 'Escuchando Ahora' : 'Now Playing'}
            </h2>
          </div>
          <NowPlaying />
        </section>
      </>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
