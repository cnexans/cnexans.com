import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getBlogPosts } from "@/content/utils";
import "./home.css";
import { getCanonicalUrl } from "@/i18n/utils";

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
    .slice(0, 3);

  try {
    const Content = (await import(`@/content/home/${locale}.mdx`)).default;
    
    return (
      <>
        {/* Hero Section */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="relative mb-6 inline-block">
              <span className="high-contrast-nav inline-block px-6 py-2 text-sm font-inter font-medium border border-teal-600 shadow-[0px_4px_24px_rgba(13,148,136,0.25)]">
                {locale === 'en' ? 'Welcome to my digital garden' : 'Bienvenido a mi jardín digital'}
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-medium tracking-tight md:text-6xl">
              {locale === 'en' ? 'Math, Computer Science & Technology' : 'Matemáticas, Informática y Tecnología'}
            </h1>
            <div className="home markdown-content mx-auto mb-8 max-w-2xl text-xl font-newsreader">
              <Content />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="high-contrast-button">
                <Link href={`/${locale}/blog`}>
                  {locale === 'en' ? 'Explore Articles' : 'Explorar Artículos'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/about`}>{locale === 'en' ? 'About Me' : 'Sobre Mí'}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section className="container py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-3xl font-medium decorative-line">{locale === 'en' ? 'Latest Posts' : 'Últimos Artículos'}</h2>
              <Link href={`/${locale}/blog`} className="text-sm font-inter text-teal-600 hover:text-teal-700">
                {locale === 'en' ? 'View all posts' : 'Ver todos los artículos'}
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <article key={post.slug} className="group high-contrast-card hover-lift p-6 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-inter secondary-text">
                    <time dateTime={post.metadata.date}>{new Date(post.metadata.date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                    <span>•</span>
                    <div className="flex gap-1">
                      {post.metadata.tags && post.metadata.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="px-2 font-inter">
                          {tag.replace(/-/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <h3 className="mt-3 text-xl font-medium">
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="group-hover:text-teal-600 group-hover:underline group-hover:decoration-teal-500/30 group-hover:underline-offset-4"
                    >
                      {post.metadata.title}
                    </Link>
                  </h3>
                  <p className="mt-2">{post.metadata.description}</p>
                  <div className="mt-4">
                    <Button variant="ghost" asChild className="px-0 font-inter text-teal-600 hover:text-teal-700">
                      <Link href={`/${locale}/blog/${post.slug}`} className="flex items-center">
                        {locale === 'en' ? 'Read post' : 'Leer artículo'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Book */}
        <section className="container py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl font-medium decorative-line">{locale === 'en' ? 'Latest Book' : 'Último Libro'}</h2>
            </div>

            <div className="high-contrast-card overflow-hidden p-8 rounded-lg">
              <div className="flex flex-col gap-8 md:flex-row">
                <div className="flex-1">
                  <div className="aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg shadow-lg">
                    <div className="h-full w-full bg-teal-600 p-4 text-white">
                      <div className="flex h-full flex-col justify-between">
                        <div>
                          <div className="font-inter text-xs uppercase tracking-wider opacity-80">{locale === 'en' ? 'New Release' : 'Nuevo Lanzamiento'}</div>
                          <h3 className="mt-2 text-lg font-medium">{locale === 'en' ? 'Algorithms & Data Structures' : 'Algoritmos y Estructuras de Datos'}</h3>
                        </div>
                        <div className="font-newsreader text-sm italic">Carlos Nexans</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-[2]">
                  <h3 className="text-2xl font-medium">{locale === 'en' ? 'Algorithms & Data Structures: A Modern Approach' : 'Algoritmos y Estructuras de Datos: Un Enfoque Moderno'}</h3>
                  <p className="mt-4">
                    {locale === 'en' 
                      ? 'A comprehensive guide to understanding and implementing efficient algorithms and data structures. Perfect for students, professionals, and anyone looking to improve their problem-solving skills.'
                      : 'Una guía completa para entender e implementar algoritmos y estructuras de datos eficientes. Perfecto para estudiantes, profesionales y cualquier persona que busque mejorar sus habilidades de resolución de problemas.'}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm font-inter">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5 text-teal-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      {locale === 'en' ? 'Interactive code examples and visualizations' : 'Ejemplos de código interactivos y visualizaciones'}
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5 text-teal-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      {locale === 'en' ? 'Practical applications and real-world examples' : 'Aplicaciones prácticas y ejemplos del mundo real'}
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5 text-teal-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      {locale === 'en' ? 'Comprehensive coverage of modern techniques' : 'Cobertura completa de técnicas modernas'}
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Button asChild className="high-contrast-button">
                      <Link href={`/${locale}/book`}>
                        {locale === 'en' ? 'Learn More' : 'Saber Más'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="font-inter">
                      <Link href={`/${locale}/book/sample`}>{locale === 'en' ? 'Read Sample' : 'Leer Muestra'}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Programming Course */}
        <section className="container py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl font-medium decorative-line">{locale === 'en' ? 'Advanced Programming Course' : 'Curso Avanzado de Programación'}</h2>
            </div>

            <div className="high-contrast-card overflow-hidden p-8 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="mb-4 bg-purple-100 dark:bg-purple-900 font-inter text-purple-700 dark:text-purple-300">
                    {locale === 'en' ? 'New Course' : 'Nuevo Curso'}
                  </Badge>
                  <h3 className="text-2xl font-medium">{locale === 'en' ? 'Mastering Advanced Programming Techniques' : 'Dominando Técnicas Avanzadas de Programación'}</h3>
                  <p className="mt-4">
                    {locale === 'en'
                      ? 'Take your programming skills to the next level with this comprehensive course covering advanced algorithms, system design, and optimization techniques.'
                      : 'Lleva tus habilidades de programación al siguiente nivel con este curso completo que cubre algoritmos avanzados, diseño de sistemas y técnicas de optimización.'}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-inter">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 font-medium">4.9/5</span>
                      <span className="ml-1 secondary-text">(128 {locale === 'en' ? 'reviews' : 'reseñas'})</span>
                    </div>
                    <span className="secondary-text">|</span>
                    <div className="text-sm font-inter">
                      <span className="font-medium">{locale === 'en' ? 'Duration' : 'Duración'}:</span>{" "}
                      <span className="secondary-text">12 {locale === 'en' ? 'weeks' : 'semanas'}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Button asChild className="high-contrast-button">
                      <Link href={`/${locale}/courses/advanced-programming`}>
                        {locale === 'en' ? 'Enroll Now' : 'Inscribirse Ahora'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/${locale}/courses`}>{locale === 'en' ? 'View All Courses' : 'Ver Todos los Cursos'}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="container py-16">
          <div className="mx-auto max-w-4xl">
            <div className="high-contrast-card overflow-hidden p-8 rounded-lg border-teal-600 border-2">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 inline-block rounded-full bg-teal-100 dark:bg-teal-900 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h2 className="mb-3 text-2xl font-medium">{locale === 'en' ? 'Subscribe to my newsletter' : 'Suscríbete a mi boletín'}</h2>
                <p className="mb-6 max-w-md">
                  {locale === 'en'
                    ? 'Get the latest articles, tutorials, and updates delivered straight to your inbox. No spam, ever.'
                    : 'Recibe los últimos artículos, tutoriales y actualizaciones directamente en tu bandeja de entrada. Sin spam, nunca.'}
                </p>
                <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    placeholder={locale === 'en' ? 'Email address' : 'Dirección de correo electrónico'}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-inter ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
                  />
                  <Button className="high-contrast-button">{locale === 'en' ? 'Subscribe' : 'Suscribirse'}</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
