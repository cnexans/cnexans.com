"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PANEL_SECTIONS } from "./sections";

export function PanelNav({ basePath }: { basePath: string }) {
  const pathname = usePathname();
  return (
    <nav className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4">
        {PANEL_SECTIONS.map((s) => {
          const href = `${basePath}/${s.slug}`;
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={s.slug}
              href={href}
              className={cn(
                "border-b-2 px-3 py-3 text-sm",
                active ? "border-neutral-900 font-medium" : "border-transparent text-neutral-500 hover:text-neutral-900"
              )}
            >
              {s.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
