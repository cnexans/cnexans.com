// Deletes spam from the Supabase `contacts` and `comments` tables.
//
// Signals (any one is enough to delete):
//   - malformed email
//   - email domain that can't receive mail (no MX / null MX)
//   - disposable email domain (github.com/disposable-email-domains)
//   - email reported to StopForumSpam (api.stopforumspam.org)
//   - gibberish bot text ("GtYIVthYcTaaAGncFAXj")
//   - known cold-outreach phrases
//   - exact duplicate of an earlier row
//
// Never touches approved comments or contacts already answered.
// Logs are public (public repo): only ids, masked emails and reasons are printed.
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DRY_RUN=true to only report.

import { resolveMx } from "node:dns/promises";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.env.DRY_RUN === "true";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  process.exit(1);
}

const SPAM_PHRASES = [
  "guaranteed results",
  "money back",
  "all-in-one platform",
  "propuesta para carlosnexans",
  "hemos visto tu negocio",
  "backlink",
  "seo services",
  "guest post",
  "crypto investment",
  "casino",
];

const SFS_MIN_FREQUENCY = 3;

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

async function db(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers });
  if (!res.ok) throw new Error(`${init.method || "GET"} ${path}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function loadDisposableDomains() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf"
    );
    const text = await res.text();
    return new Set(text.split("\n").map((d) => d.trim().toLowerCase()).filter(Boolean));
  } catch (e) {
    console.warn(`Could not load disposable domains list: ${e.message}`);
    return new Set();
  }
}

const EMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i;

const mxCache = new Map();
async function canReceiveMail(domain) {
  if (!mxCache.has(domain)) {
    mxCache.set(
      domain,
      resolveMx(domain)
        // Null MX (RFC 7505) is a single record pointing to "."
        .then((records) => records.some((r) => r.exchange && r.exchange !== "."))
        .catch((e) => (["ENOTFOUND", "ENODATA"].includes(e.code) ? false : null))
    );
  }
  return mxCache.get(domain);
}

const sfsCache = new Map();
async function reportedToStopForumSpam(email) {
  if (!sfsCache.has(email)) {
    sfsCache.set(
      email,
      fetch(`https://api.stopforumspam.org/api?json&email=${encodeURIComponent(email)}`)
        .then((r) => r.json())
        .then((d) => d.email?.appears === 1 && d.email.frequency >= SFS_MIN_FREQUENCY)
        .catch(() => false)
    );
  }
  return sfsCache.get(email);
}

// Bots submit random mixed-case letters with no spaces, e.g. "RkUlcjKyKFPflrSV".
// Humans almost never write a 10+ letter single word with 2+ lowercase→uppercase jumps.
function isGibberish(text) {
  const t = (text || "").trim();
  if (t.length < 10 || !/^[A-Za-z]+$/.test(t)) return false;
  return (t.match(/[a-z][A-Z]/g) || []).length >= 2;
}

async function emailReasons(email, disposable) {
  if (!email) return [];
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_RE.test(normalized)) return ["malformed email"];
  const domain = normalized.split("@")[1];
  if (disposable.has(domain)) return ["disposable domain"];
  const reasons = [];
  if ((await canReceiveMail(domain)) === false) reasons.push("domain has no MX");
  if (await reportedToStopForumSpam(normalized)) reasons.push("reported to StopForumSpam");
  return reasons;
}

function contentReasons(fields, texts) {
  const reasons = [];
  if (fields.every(isGibberish)) reasons.push("gibberish text");
  const all = texts.join(" ").toLowerCase();
  const phrase = SPAM_PHRASES.find((p) => all.includes(p));
  if (phrase) reasons.push(`spam phrase "${phrase}"`);
  return reasons;
}

function mask(email) {
  if (!email) return "(no email)";
  const [user, domain = ""] = email.split("@");
  return `${user.slice(0, 2)}***@${domain}`;
}

async function cleanTable({ table, select, filter, fields, texts }) {
  const rows = await db(`${table}?select=${select}&${filter}&order=id`);
  const disposable = await loadDisposableDomains();
  const seen = new Set();
  const spam = [];

  for (const row of rows) {
    const key = JSON.stringify(texts(row).map((t) => (t || "").trim().toLowerCase()));
    const reasons = [
      ...(seen.has(key) ? ["duplicate"] : []),
      ...contentReasons(fields(row), texts(row)),
      ...(await emailReasons(row.email, disposable)),
    ];
    seen.add(key);
    if (reasons.length) spam.push({ id: row.id, email: row.email, reasons });
  }

  console.log(`\n${table}: ${spam.length} spam of ${rows.length} checked`);
  for (const s of spam) console.log(`  #${s.id} ${mask(s.email)} — ${s.reasons.join(", ")}`);

  if (!DRY_RUN && spam.length) {
    await db(`${table}?id=in.(${spam.map((s) => s.id).join(",")})`, { method: "DELETE" });
    console.log(`  deleted ${spam.length}`);
  }
  return spam.length;
}

const total =
  (await cleanTable({
    table: "contacts",
    select: "id,email,subject,message",
    filter: "response_sent=eq.false",
    fields: (r) => [r.subject, r.message],
    texts: (r) => [r.email, r.subject, r.message],
  })) +
  (await cleanTable({
    table: "comments",
    select: "id,email,name,message,twitter",
    filter: "is_visible=eq.false",
    fields: (r) => [r.name, r.message],
    texts: (r) => [r.name, r.message, r.twitter],
  }));

console.log(`\n${DRY_RUN ? "[dry run] would delete" : "deleted"} ${total} rows`);
