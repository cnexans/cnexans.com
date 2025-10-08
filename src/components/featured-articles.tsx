"use client";

import { Link } from "@/i18n/navigation";
import { Calendar } from "lucide-react";
import { useLocale } from "next-intl";
import { BlogPost } from "@/content/utils";
import { LikeButton } from "./like-button";
import { createTagColorMap } from "@/lib/utils";

interface FeaturedArticlesProps {
  posts: BlogPost[];
}

export function FeaturedArticles({ posts }: FeaturedArticlesProps) {
  const locale = useLocale();

  const formatDate = (date: string, locale: string) => {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  };

  // Create the tag color mapping function
  const getCategoryStyle = createTagColorMap(posts);

  return (
    <div className="space-y-6">
      {posts.slice(0, 3).map((post) => (
        <article key={post.metadata.slug} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`${getCategoryStyle(post.metadata.tags)} px-2 py-1 rounded text-xs font-medium`}>
              {post.metadata.tags?.[0] || "General"}
            </span>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Calendar size={12} />
              <span>{formatDate(post.metadata.date, locale)}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-3 text-balance">
            <Link href={`/blog/${post.folder}`} className="text-foreground no-underline hover:text-primary transition-colors" locale={locale}>
              {post.metadata.title}
            </Link>
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-pretty font-sans">
            {post.metadata.description}
          </p>

          <div className="flex items-center justify-between">
            <Link href={`/blog/${post.folder}`} className="text-foreground text-sm font-medium no-underline hover:text-primary transition-colors" locale={locale}>
              Leer más →
            </Link>
            <LikeButton postSlug={post.metadata.slug} size="sm" />
          </div>
        </article>
      ))}
    </div>
  );
}
