import { getBlogPosts } from "@/content/utils";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { baseUrl } from "@/app/sitemap";
import { getCanonicalUrl } from "@/i18n/utils";
import { UnifiedComments } from "@/components/unified-comments";
import { Calendar, Clock, Tag } from "lucide-react";
import { LikeButton } from "@/components/like-button";

export const dynamic = 'force-static'

export const revalidate = false;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; folder: string }>;
}): Promise<Metadata> => {
  const { locale, folder } = await params;
  const posts = await getBlogPosts();
  const post = posts.find(
    (post) => post.folder === folder && post.locale === locale
  );

  const otherLocales = posts.filter(
    (post) => post.folder === folder && post.locale !== locale
  );

  const alternates = otherLocales.reduce((acc, post) => {
    acc[post.metadata.slug] = getCanonicalUrl({ locale: post.locale, pathname: `/${post.metadata.slug}` });
    return acc;
  }, {} as Record<string, string>);

  const canonical = getCanonicalUrl({ locale, pathname: `/${post?.metadata.slug}` });

  return {
    title: post?.metadata.title,
    description: post?.metadata.description,
    authors: [{ name: "Carlos Nexans" }],
    creator: "Carlos Nexans",
    publisher: "Carlos Nexans",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonical,
      languages: alternates,
    },
    openGraph: {
      title: post?.metadata.title,
      description: post?.metadata.description,
      type: 'article',
      publishedTime: post?.metadata.date,
      url: canonical,
      images: [
        {
          url: `${baseUrl}/og?title=${post?.metadata.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post?.metadata.title,
      description: post?.metadata.description,
      images: [`${baseUrl}/og?title=${post?.metadata.title}`],
    },
  };
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ locale: post.locale, folder: post.folder }));
}

const getContent = async (locale: string, folder: string) => {
  try {
    return (await import(`@/content/blog/${folder}/${locale}.mdx`)).default;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; folder: string }>;
}) {
  const { locale, folder } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  const Content = await getContent(locale, folder);
  const posts = await getBlogPosts();
  const post = posts.find(
    (post) => post.folder === folder && post.locale === locale
  );

  if (Content && post) {
    const formatDate = (date: string, locale: string) => {
      const dateObj = new Date(date);
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Intl.DateTimeFormat(locale, options).format(dateObj);
    };

    const estimatedReadTime = Math.ceil(post.content.split(' ').length / 200); // ~200 words per minute

    return (
      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-4xl font-bold text-foreground text-balance flex-1">
              {post.metadata.title}
            </h1>
            <div className="ml-6 mt-2">
              <LikeButton postSlug={post.metadata.slug} size="lg" />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.metadata.date, locale)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{estimatedReadTime} {locale === 'es' ? 'min de lectura' : 'min read'}</span>
            </div>
          </div>

          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-8">
              <Tag size={16} className="text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {post.metadata.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            {post.metadata.description}
          </p>
        </header>

        {/* Article Content */}
        <div className="markdown-content">
          <Content />
        </div>

        {/* Comments Section */}
        <UnifiedComments 
          contentId={`article-${folder}`}
          locale={locale}
          contentTitle={post.metadata.title}
        />
      </article>
    );
  }

  return notFound();
}
