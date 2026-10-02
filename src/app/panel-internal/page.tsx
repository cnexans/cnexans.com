import { redirect, notFound } from "next/navigation";
import { adminBasePath } from "@/lib/admin-auth";
import { PANEL_SECTIONS } from "./sections";

export const dynamic = "force-dynamic";

export default function PanelIndex() {
  const base = adminBasePath();
  if (!base) notFound();
  redirect(`${base}/${PANEL_SECTIONS[0].slug}`);
}
