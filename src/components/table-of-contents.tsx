import { Heading } from '@/content/utils'

interface TableOfContentsProps {
  headings: Heading[]
  locale?: string
}

export function TableOfContents({ headings, locale = 'en' }: TableOfContentsProps) {
  if (!headings.length) return null

  const minLevel = Math.min(...headings.map((h) => h.level))

  return (
    <nav
      aria-label={locale === 'es' ? 'Tabla de contenidos' : 'Table of contents'}
      className="mb-12 mt-2"
    >
      {/* Label */}
      <p
        className="mb-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-sans"
        style={{ letterSpacing: '0.18em' }}
      >
        {locale === 'es' ? 'Contenidos' : 'Contents'}
      </p>

      {/* Entries with left rule */}
      <div className="border-l border-border pl-5 space-y-0">
        {headings.map((heading, i) => {
          const isSubheading = heading.level - minLevel > 0
          return (
            <div
              key={i}
              className="group relative"
              style={isSubheading ? { paddingLeft: `${(heading.level - minLevel) * 14}px` } : undefined}
            >
              {/* Hover accent line — overlaps the parent border */}
              <span
                className="
                  absolute left-0 top-0 h-full w-px -translate-x-5
                  bg-foreground
                  scale-y-0 origin-top
                  transition-transform duration-200 ease-out
                  group-hover:scale-y-100
                "
                aria-hidden="true"
              />

              <a
                href={`#${heading.id}`}
                className={[
                  'block py-[0.3rem] font-serif leading-snug font-normal',
                  'text-foreground opacity-80',
                  'hover:opacity-100',
                  'transition-colors duration-150',
                  'no-underline',
                  isSubheading ? 'text-base' : 'text-lg',
                ].join(' ')}
              >
                {heading.text}
              </a>
            </div>
          )
        })}
      </div>

      {/* Closing rule */}
      <div className="mt-5 h-px w-8 bg-border" aria-hidden="true" />
    </nav>
  )
}
