"use client";

import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BlogPost } from "@/content/utils";

interface BlogPageProps {
  posts: BlogPost[];
  locale: string;
}

export default function BlogPageClient({ posts, locale }: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const formatDate = (date: string, locale: string) => {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.metadata.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.metadata.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(posts.flatMap(post => post.metadata.tags)))];
  const categoriesWithCounts = categories.map(cat => ({
    id: cat,
    name: cat === "all" ? (locale === 'es' ? "Todos" : "All") : cat,
    count: cat === "all" ? posts.length : posts.filter(post => post.metadata.tags.includes(cat)).length
  }));

  const getCategoryStyle = (tags: string[]) => {
    if (!tags || tags.length === 0) return "bg-gray-100 text-gray-800 border-gray-200";
    
    const tag = tags[0].toLowerCase();
    const styles = {
      "computer-science": "bg-blue-100 text-blue-800 border-blue-200",
      "mathematics": "bg-green-100 text-green-800 border-green-200",
      "programming": "bg-purple-100 text-purple-800 border-purple-200",
      "personal": "bg-orange-100 text-orange-800 border-orange-200",
      "research": "bg-pink-100 text-pink-800 border-pink-200",
      "algoritmos": "bg-blue-100 text-blue-800 border-blue-200",
      "matemáticas": "bg-green-100 text-green-800 border-green-200",
      "programación": "bg-purple-100 text-purple-800 border-purple-200",
    };
    return styles[tag as keyof typeof styles] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <>
      {/* Page Header */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {locale === 'es' ? 'Artículos' : 'Articles'}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {locale === 'es' 
            ? 'Exploraciones sobre matemáticas, ciencias de la computación, programación y reflexiones personales.'
            : 'Explorations on mathematics, computer science, programming and personal reflections.'
          }
        </p>
      </section>

      {/* Search and Filters */}
      <section className="mb-12">
        <div className="flex flex-col gap-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder={locale === 'es' ? 'Buscar artículos...' : 'Search articles...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categoriesWithCounts.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  selectedCategory === category.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:bg-accent"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {locale === 'es' 
                ? 'No se encontraron artículos que coincidan con tu búsqueda.'
                : 'No articles found matching your search.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <article key={post.metadata.slug} className="border-b border-border pb-8 last:border-b-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`${getCategoryStyle(post.metadata.tags)} px-2 py-1 rounded text-xs font-medium border`}>
                    {post.metadata.tags?.[0] || "General"}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Calendar size={14} />
                    <span>{formatDate(post.metadata.date, locale)}</span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-foreground mb-3 text-balance">
                  <Link href={`/blog/${post.folder}`} className="text-foreground no-underline hover:text-primary transition-colors" locale={locale}>
                    {post.metadata.title}
                  </Link>
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">{post.metadata.description}</p>

                <Link href={`/blog/${post.folder}`} className="text-foreground text-sm font-medium no-underline hover:text-primary transition-colors" locale={locale}>
                  {locale === 'es' ? 'Leer más' : 'Read more'} →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
