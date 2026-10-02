// Panel sections. To add one: create panel-internal/<slug>/page.tsx (check
// auth like contacts/page.tsx does), its API under api/panel-internal/<slug>/,
// and list it here.
export const PANEL_SECTIONS = [{ slug: "contacts", label: "Contactos" }] as const;
