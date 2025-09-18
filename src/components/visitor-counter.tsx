"use client";

import { useState, useEffect } from "react";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Simple visitor counter using localStorage
    const visits = localStorage.getItem('visitCount');
    const currentCount = visits ? parseInt(visits) : 0;
    const newCount = currentCount + 1;
    localStorage.setItem('visitCount', newCount.toString());
    setCount(newCount);
  }, []);

  if (count === null) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Cargando contador de visitas...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">
        Has visitado esta página <span className="font-semibold text-foreground">{count}</span> {count === 1 ? 'vez' : 'veces'}
      </p>
    </div>
  );
}
