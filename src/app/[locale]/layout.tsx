import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { routing } from "@/i18n/routing";
import "@/styles/highlight-js/github-dark.css";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { QueryProvider } from "@/components/query-provider";

export const dynamic = "force-static";

export const revalidate = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang={locale}>
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <div className="min-h-screen bg-background">
          <QueryProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <Header />
              <main className="max-w-4xl mx-auto px-4 py-12">
                {children}
              </main>
              <Footer />
            </NextIntlClientProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
