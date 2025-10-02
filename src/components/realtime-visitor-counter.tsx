"use client";

import { useRealtimeVisitors } from "@/hooks/use-realtime-visitors";
import { Users, Loader2 } from "lucide-react";

interface RealtimeVisitorCounterProps {
  locale?: string;
}

export function RealtimeVisitorCounter({ locale = "en" }: RealtimeVisitorCounterProps) {
  const { visitorCount, isConnected } = useRealtimeVisitors();

  const translations = {
    en: {
      loading: "Connecting...",
      visitors: "visitor",
      visitorsPlural: "visitors",
      online: "online now",
    },
    es: {
      loading: "Conectando...",
      visitors: "visitante",
      visitorsPlural: "visitantes",
      online: "en línea ahora",
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  if (!isConnected) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin text-muted-foreground" size={18} />
          <p className="text-sm text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Users className="text-foreground" size={20} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground text-lg">{visitorCount}</span>{" "}
          {visitorCount === 1 ? t.visitors : t.visitorsPlural}{" "}
          {t.online}
        </p>
      </div>
    </div>
  );
}


