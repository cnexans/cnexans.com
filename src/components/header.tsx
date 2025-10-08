"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export function Header() {
  const locale = useLocale();
  const t = useTranslations();
  const navItems = [
    { name: t("header.home"), path: `/` },
    { name: t("header.blog"), path: `/blog` },
    { name: t("header.about"), path: `/about` },
    { name: t("header.contact"), path: `/contact` },
  ];

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {/* Mobile Layout - Stack everything vertically */}
        <div className="flex flex-col space-y-4 md:hidden">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/" className="text-xl font-bold text-foreground no-underline font-serif" locale={locale}>
              {"Nexans"}
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-sm text-foreground no-underline hover:text-primary transition-colors"
                locale={locale}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Language Switcher */}
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Tablet Layout - Logo + Nav in one row, Language in second row */}
        <div className="hidden md:block lg:hidden">
          {/* First row: Logo + Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-xl font-bold text-foreground no-underline font-serif" locale={locale}>
              {"Nexans"}
            </Link>
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-sm text-foreground no-underline hover:text-primary transition-colors"
                  locale={locale}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Second row: Language Switcher centered */}
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Desktop Layout - Everything in one row */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground no-underline font-serif" locale={locale}>
              {"Nexans"}
            </Link>
            <nav className="flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-foreground no-underline hover:text-primary transition-colors"
                  locale={locale}
                >
                  {item.name}
                </Link>
              ))}
              <LanguageSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
