import { getBlogPosts } from "@/content/utils";
import { routing } from "@/i18n/routing";
import { getCanonicalUrl } from "@/i18n/utils";
import { setRequestLocale } from "next-intl/server";
import BlogPageClient from "@/components/blog-page-client";

export const dynamic = 'force-static'

export const revalidate = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const metadata = {
  es: {
    title: "Artículos",
    description: "Exploraciones sobre matemáticas, ciencias de la computación, programación y reflexiones personales.",
  },
  en: {
    title: "Articles",
    description: "Explorations on mathematics, computer science, programming and personal reflections.",
  },
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  return {
    alternates: {
      canonical: getCanonicalUrl({ locale, pathname: "/blog" }),
      languages: {
        es: getCanonicalUrl({ locale: "es", pathname: "/blog" }),
        en: getCanonicalUrl({ locale: "en", pathname: "/blog" }),
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    ...metadata[locale as keyof typeof metadata],
  };
};


export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);
  const posts = (await getBlogPosts()).filter((post) => post.locale === locale);
  
  return <BlogPageClient posts={posts} locale={locale} />;
}
