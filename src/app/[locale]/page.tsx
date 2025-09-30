import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { FeaturedArticles } from "@/components/featured-articles";
import { PublishedBooks } from "@/components/published-books";
import { FeaturedProjects } from "@/components/featured-projects";
import { SocialLinks } from "@/components/social-links";
import { VisitorCounter } from "@/components/visitor-counter";
import { getBlogPosts } from "@/content/utils";
import { getCanonicalUrl } from "@/i18n/utils";
import { BookOpen, Users, BoxIcon, Rss } from "lucide-react";

export const dynamic = 'force-static'

export const revalidate = false;

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const metadata = (await import(`@/content/home/${locale}.mdx`)).metadata;
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: getCanonicalUrl({ locale, pathname: "/" }),
      languages: {
        "en": getCanonicalUrl({ locale: "en", pathname: "/" }),
        "es": getCanonicalUrl({ locale: "es", pathname: "/" }),
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

  const posts = await getBlogPosts();
  const latestPosts = posts.filter((post) => post.locale === locale)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
    .slice(0, 5);

  try {
    const Content = (await import(`@/content/home/${locale}.mdx`)).default;
    
    return (
      <>
        {/* Hero Section */}
        <section className="mb-16">
          <div className="markdown-content">
            <Content />
          </div>
          <div className="mt-8">
            <VisitorCounter />
          </div>
        </section>

        {/* Featured Articles */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Rss className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">
              {locale === 'es' ? 'Artículos Destacados' : 'Featured Articles'}
            </h2>
          </div>
          <FeaturedArticles posts={latestPosts} />
        </section>

        {/* Published Books */}
        <section className="mb-16 hidden">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">
              {locale === 'es' ? 'Libros Publicados' : 'Published Books'}
            </h2>
          </div>
          <PublishedBooks />
        </section>

        {/* Featured Projects */}
        <section className="mb-16 hidden">
          <div className="flex items-center gap-3 mb-8">
            <BoxIcon className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">
              {locale === 'es' ? 'Proyectos Destacados' : 'Featured Projects'}
            </h2>
          </div>
          <FeaturedProjects />
        </section>

        {/* Social Links */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-foreground" size={24} />
            <h2 className="text-2xl font-bold text-foreground">
              {locale === 'es' ? 'Conecta Conmigo' : 'Connect With Me'}
            </h2>
          </div>
          <SocialLinks />
        </section>
      </>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
