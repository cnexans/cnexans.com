import { Youtube, Twitter, Linkedin, Github } from "lucide-react"

const socialLinks = [
  {
    name: "YouTube",
    url: "https://youtube.com/@nexans",
    icon: Youtube,
    description: "Videos sobre programación y matemáticas",
    color: "text-red-600",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/nexans",
    icon: Twitter,
    description: "Pensamientos rápidos y actualizaciones",
    color: "text-foreground",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/nexans",
    icon: Linkedin,
    description: "Conexiones profesionales",
    color: "text-foreground",
  },
  {
    name: "GitHub",
    url: "https://github.com/nexans",
    icon: Github,
    description: "Código abierto y proyectos",
    color: "text-gray-800",
  },
]

export function SocialLinks() {
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {socialLinks.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg no-underline"
          >
            <Icon className={`${link.color} flex-shrink-0`} size={24} />
            <div>
              <h4 className="font-medium text-foreground">{link.name}</h4>
              <p className="text-xs text-muted-foreground text-pretty">{link.description}</p>
            </div>
          </a>
        )
      })}
    </div>
  )
}
