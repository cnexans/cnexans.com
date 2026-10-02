import { PRIVATE_HEADERS, isAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: PRIVATE_HEADERS });
}

async function parseId(params: Params["params"]) {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, { params }: Params) {
  if (!isAuthorized(request.headers.get("authorization"))) return unauthorizedResponse();
  const id = await parseId(params);
  if (!id) return json({ error: "invalid id" }, 400);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "invalid body" }, 400);

  const update: Record<string, unknown> = {};
  for (const key of ["is_read", "response_sent", "is_spam"] as const) {
    if (key in body) {
      if (typeof body[key] !== "boolean") return json({ error: `${key} must be boolean` }, 400);
      update[key] = body[key];
    }
  }
  if ("notes" in body) {
    if (body.notes !== null && typeof body.notes !== "string") return json({ error: "notes must be string" }, 400);
    update.notes = body.notes?.trim() ? body.notes.trim().slice(0, 5000) : null;
  }
  if (update.is_spam === true) update.spam_reason = "marked manually";
  // Keeps a reason so the spam job (scripts/cleanup-spam.mjs) doesn't flag it again
  if (update.is_spam === false) update.spam_reason = "not spam (manual)";
  if (!Object.keys(update).length) return json({ error: "nothing to update" }, 400);

  const { data, error } = await supabaseAdmin()
    .from("contacts")
    .update(update)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) return json({ error: error.message }, 500);
  if (!data) return json({ error: "not found" }, 404);
  return json(data);
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAuthorized(request.headers.get("authorization"))) return unauthorizedResponse();
  const id = await parseId(params);
  if (!id) return json({ error: "invalid id" }, 400);

  const { data, error } = await supabaseAdmin().from("contacts").delete().eq("id", id).select("id");
  if (error) return json({ error: error.message }, 500);
  if (!data?.length) return json({ error: "not found" }, 404);
  return json({ deleted: id });
}
