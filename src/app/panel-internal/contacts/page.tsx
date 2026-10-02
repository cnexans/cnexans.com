import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { adminBasePath, isAuthorized } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ContactsPanel, type AdminContact } from "./contacts-panel";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  // The middleware already checked; check again so the page is never served without auth
  const basePath = adminBasePath();
  if (!basePath || !isAuthorized((await headers()).get("authorization"))) notFound();

  const { data, error } = await supabaseAdmin()
    .from("contacts")
    .select("id,email,subject,message,locale,created_at,is_read,response_sent,notes,is_spam,spam_reason")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    return <p className="p-6 text-red-700">Error cargando contactos: {error.message}</p>;
  }

  return <ContactsPanel initialContacts={(data ?? []) as AdminContact[]} apiBase={`${basePath}/api`} />;
}
