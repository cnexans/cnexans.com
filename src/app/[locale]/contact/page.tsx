import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { getCanonicalUrl } from "@/i18n/utils";
import { ContactForm } from "@/components/contact-form";

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
          <div className="markdown-content">
            <Content />
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <ContactForm locale={locale} />
        </section>
      </>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
