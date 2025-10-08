"use client"
import { Github, Linkedin, Youtube, Twitter, Mail, Rss } from "lucide-react";
import { useEffect, useState } from "react";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.carlosnexans.com",
    icon: Github,
    description: "Código fuente y proyectos open source",
    lightColor: "#24292e",
    darkColor: "#f0f6fc",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.carlosnexans.com",
    icon: Linkedin,
    description: "Experiencia profesional y networking",
    lightColor: "#0077B5",
    darkColor: "#0A66C2",
  },
  {
    name: "YouTube",
    url: "https://youtube.carlosnexans.com",
    icon: Youtube,
    description: "Tutoriales y charlas técnicas",
    lightColor: "#FF0000",
    darkColor: "#FF0000",
  },
  {
    name: "Twitter",
    url: "https://x.carlosnexans.com",
    icon: Twitter,
    description: "Pensamientos rápidos y actualizaciones",
    lightColor: "#1DA1F2",
    darkColor: "#1D9BF0",
  },
  {
    name: "Email",
    url: "mailto:carlos@nexans.com",
    icon: Mail,
    description: "Contacto directo para colaboraciones",
    lightColor: "#EA4335",
    darkColor: "#F87171",
  },
  {
    name: "RSS",
    url: "/rss",
    icon: Rss,
    description: "Suscríbete a las actualizaciones del blog",
    lightColor: "#FF6600",
    darkColor: "#FB923C",
  },
];

export function SocialLinks() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detectar el tema inicial
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();

    // Observar cambios en la clase del documento
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        const iconColor = isDark ? link.darkColor : link.lightColor;
        return (
          <a
            key={link.name}
            href={link.url}
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors group"
            target={link.url.startsWith('http') ? '_blank' : '_self'}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
          >
            <Icon size={20} style={{ color: iconColor }} />
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
