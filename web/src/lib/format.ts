// Formats d'affichage québécois (fr-CA), partagés par le public, l'admin et les courriels.
const FUSEAU = "America/Toronto";

export function argent(cents: number | null | undefined): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
}

export function dateLongue(iso: string | Date): string {
  return new Date(iso).toLocaleDateString("fr-CA", { timeZone: FUSEAU, weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function dateCourte(iso: string | Date): string {
  return new Date(iso).toLocaleDateString("fr-CA", { timeZone: FUSEAU, day: "numeric", month: "short", year: "numeric" });
}

export function heure(iso: string | Date): string {
  const d = new Date(iso);
  const h = Number(d.toLocaleString("en-CA", { timeZone: FUSEAU, hour: "numeric", hour12: false })) % 24;
  const m = Number(d.toLocaleString("en-CA", { timeZone: FUSEAU, minute: "numeric" }));
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

export function plage(debut: string, fin: string): string {
  return `${heure(debut)} à ${heure(fin)}`;
}

/** Date locale (AAAA-MM-JJ) d'un instant, dans le fuseau de l'Expo. */
export function jourLocal(iso: string | Date): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: FUSEAU });
}

export function dateHeure(iso: string | Date): string {
  return `${dateCourte(iso)}, ${heure(iso)}`;
}
