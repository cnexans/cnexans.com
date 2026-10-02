import type { Metadata } from "next";
import { adminBasePath } from "@/lib/admin-auth";
import { PanelNav } from "./panel-nav";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const basePath = adminBasePath();
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        {basePath && <PanelNav basePath={basePath} />}
        {children}
      </body>
    </html>
  );
}
