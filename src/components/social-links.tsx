import { Github, Linkedin, Youtube, Twitter, Mail, Rss } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.carlosnexans.com",
    icon: Github,
    description: "Código fuente y proyectos open source",
    borderColor: "#24292e",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.carlosnexans.com",
    icon: Linkedin,
    description: "Experiencia profesional y networking",
    borderColor: "#0077B5",
  },
  {
    name: "YouTube",
    url: "https://youtube.carlosnexans.com",
    icon: Youtube,
    description: "Tutoriales y charlas técnicas",
    borderColor: "#FF0000",
  },
  {
    name: "Twitter",
    url: "https://x.carlosnexans.com",
    icon: Twitter,
    description: "Pensamientos rápidos y actualizaciones",
    borderColor: "#1DA1F2",
  },
  {
    name: "Email",
    url: "mailto:carlos@nexans.com",
    icon: Mail,
    description: "Contacto directo para colaboraciones",
    borderColor: "#EA4335",
  },
  {
    name: "RSS",
    url: "/rss",
    icon: Rss,
    description: "Suscríbete a las actualizaciones del blog",
    borderColor: "#FF6600",
  },
];

export function SocialLinks() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors group"
            target={link.url.startsWith('http') ? '_blank' : '_self'}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
          >
            <Icon size={20} style={{ color: link.borderColor }} />
            <div>
              <h3 className="font-medium text-foreground font-sans">{link.name}</h3>
              <p className="text-sm text-muted-foreground font-sans">{link.description}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
