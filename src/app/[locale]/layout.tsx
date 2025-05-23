import { routing } from "@/i18n/routing";
import "@/styles/highlight-js/github-dark.css";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";

export const revalidate = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col high-contrast-bg">
      <NextIntlClientProvider messages={messages} locale={locale}>
        {/* Header */}
        <header className="py-6 border-b">
          <div className="container">
            <div className="mx-auto flex max-w-4xl items-center justify-between">
              <Link href={`/${locale}`} className="text-2xl font-medium font-newsreader italic">
                Carlos Nexans
              </Link>
              <nav className="high-contrast-nav flex items-center gap-6 text-sm ui-sans">
                <Link href={`/${locale}`} className="font-medium text-teal-600 transition-colors hover:text-teal-700">
                  {locale === 'en' ? 'Home' : 'Inicio'}
                </Link>
                <Link href={`/${locale}/blog`} className="font-medium text-foreground/80 transition-colors hover:text-foreground">
                  Blog
                </Link>
                <Link href={`/${locale}/about`} className="font-medium text-foreground/80 transition-colors hover:text-foreground">
                  {locale === 'en' ? 'About' : 'Acerca de'}
                </Link>
                <div className="flex items-center gap-2 border-l pl-6">
                  <Link href="/es" className={cn("font-medium transition-colors hover:text-foreground", locale === 'es' ? "text-teal-600 hover:text-teal-700" : "text-foreground/80")}>
                    ES
                  </Link>
                  <Link href="/en" className={cn("font-medium transition-colors hover:text-foreground", locale === 'en' ? "text-teal-600 hover:text-teal-700" : "text-foreground/80")}>
                    EN
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="container">
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-8 md:flex-row">
              <div className="flex flex-col items-center gap-4 md:items-start">
                <Link href={`/${locale}`} className="text-xl font-medium font-newsreader italic">
                  Carlos Nexans
                </Link>
                <p className="text-sm font-inter secondary-text">
                  {locale === 'en' 
                    ? 'Sharing knowledge about math, computer science, and technology.' 
                    : 'Compartiendo conocimiento sobre matemáticas, informática y tecnología.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm ui-sans font-medium uppercase tracking-wider secondary-text">
                    {locale === 'en' ? 'Navigation' : 'Navegación'}
                  </h3>
                  <div className="flex flex-col gap-2 text-sm ui-sans">
                    <Link href={`/${locale}`} className="hover:text-teal-600">
                      {locale === 'en' ? 'Home' : 'Inicio'}
                    </Link>
                    <Link href={`/${locale}/blog`} className="hover:text-teal-600">
                      Blog
                    </Link>
                    <Link href={`/${locale}/about`} className="hover:text-teal-600">
                      {locale === 'en' ? 'About' : 'Acerca de'}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm ui-sans font-medium uppercase tracking-wider secondary-text">
                    {locale === 'en' ? 'Connect' : 'Conectar'}
                  </h3>
                  <div className="flex flex-col gap-2 text-sm ui-sans">
                    <Link href="https://twitter.com/carlosnexans" className="hover:text-teal-600">
                      Twitter
                    </Link>
                    <Link href="https://github.com/carlosnexans" className="hover:text-teal-600">
                      GitHub
                    </Link>
                    <Link href="/rss.xml" className="hover:text-teal-600">
                      RSS
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-8 max-w-4xl border-t border-border pt-8 text-center">
              <p className="text-sm font-inter secondary-text">© 2025 Carlos Nexans. {locale === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
            </div>
          </div>
        </footer>
      </NextIntlClientProvider>
    </div>
  );
}
