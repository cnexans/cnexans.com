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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground no-underline" locale={locale}>
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
    </header>
  );
}
