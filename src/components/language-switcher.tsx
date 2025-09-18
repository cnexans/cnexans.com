"use client"
import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { Globe } from "lucide-react"

const languages = {
  es: { name: "Español" },
  en: { name: "English" },
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale as "es" | "en" })
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Globe size={16} className="text-muted-foreground" />
        <select
          value={locale}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-background text-foreground border border-border rounded-md px-3 py-1 text-sm font-medium cursor-pointer hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring appearance-none pr-8"
        >
          {Object.entries(languages).map(([code, lang]) => (
            <option key={code} value={code}>
              {lang.name}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg 
            className="w-4 h-4 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

