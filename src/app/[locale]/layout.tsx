import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { routing } from "@/i18n/routing";
import "@/styles/highlight-js/github-dark.css";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono, Inter, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";

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

// Load Newsreader font for headings and body text
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  // Include both regular and italic styles
  style: ["normal", "italic"],
  // Include multiple weights
  weight: ["400", "500", "600", "700"],
})

// Make sure the Inter font is loaded with all the weights we need
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  // Include multiple weights for UI elements
  weight: ["400", "500", "600", "700"],
})

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${inter.variable} antialiased px-6 lg:px-0`}
      >
        <div className="flex flex-col min-h-screen max-w-screen-md mx-auto min-h-screen">
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
