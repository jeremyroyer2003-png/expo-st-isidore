// Heures de la programmation (« 19 h », « 10 h 30 à 15 h », « 21 h à minuit », « 13 h à 1 h »…) :
// pour savoir ce qui se passe en ce moment pendant l'Expo et pour créer un fichier de calendrier (.ics).
import type { Evenement } from "@/lib/donnees";

const FUSEAU = "America/Toronto";
/** Durée supposée d'une activité sans heure de fin. */
const DUREE_DEFAUT = 60;

function minutes(t: string): number | null {
  const s = t.trim().toLowerCase();
  if (s.startsWith("minuit")) return 24 * 60;
  const m = s.match(/^(\d{1,2})\s*h(?:\s*(\d{2}))?/);
  return m ? Number(m[1]) * 60 + Number(m[2] ?? 0) : null;
}

/** Début et fin en minutes depuis minuit (la fin peut dépasser 24 h). Null si l'heure n'est pas lisible. */
export function plageMinutes(heure: string): { debut: number; fin: number } | null {
  const [a, b] = heure.split(/\s+à\s+/);
  const debut = minutes(a ?? "");
  if (debut == null) return null;
  let fin = b ? minutes(b) : null;
  if (fin == null) fin = debut + DUREE_DEFAUT;
  if (fin <= debut) fin += 24 * 60; // « 13 h à 1 h » finit le lendemain
  return { debut, fin };
}

/** Jour (AAAA-MM-JJ) et minute de la journée au Québec. `simule` = « 2026-07-16T19:30 », lu comme une heure du Québec. */
export function instantQuebec(simule?: string | null): { jour: string; minute: number } {
  if (simule && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(simule)) {
    return { jour: simule.slice(0, 10), minute: Number(simule.slice(11, 13)) * 60 + Number(simule.slice(14, 16)) };
  }
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: FUSEAU, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { jour: `${p.year}-${p.month}-${p.day}`, minute: Number(p.hour) * 60 + Number(p.minute) };
}

/** Ce qui se passe maintenant et ce qui s'en vient plus tard aujourd'hui (activités de la veille qui finissent après minuit comprises). */
export function enCeMoment(evenements: Evenement[], jour: string, minute: number) {
  const veille = new Date(new Date(jour + "T12:00:00Z").getTime() - 864e5).toISOString().slice(0, 10);
  const maintenant: Evenement[] = [];
  const plusTard: { e: Evenement; debut: number }[] = [];
  for (const e of evenements) {
    const p = plageMinutes(e.heure);
    if (!p) continue;
    if (e.jour === jour) {
      if (p.debut <= minute && minute < p.fin) maintenant.push(e);
      else if (p.debut > minute) plusTard.push({ e, debut: p.debut });
    } else if (e.jour === veille && p.fin > 24 * 60 && minute < p.fin - 24 * 60) {
      maintenant.push(e);
    }
  }
  plusTard.sort((a, b) => a.debut - b.debut);
  return { maintenant, plusTard: plusTard.map((x) => x.e) };
}

const deux = (n: number) => String(n).padStart(2, "0");
function horodatage(jour: string, min: number) {
  const d = new Date(jour + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + Math.floor(min / 1440));
  const m = min % 1440;
  return `${d.toISOString().slice(0, 10).replace(/-/g, "")}T${deux(Math.floor(m / 60))}${deux(m % 60)}00`;
}
const echapper = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Fichier .ics d'une activité, à l'heure du Québec. */
export function fichierIcs(e: Evenement): string {
  const p = plageMinutes(e.heure) ?? { debut: 10 * 60, fin: 11 * 60 };
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Expo St-Isidore//Programmation//FR", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${e.id}@expo-st-isidore`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${FUSEAU}:${horodatage(e.jour, p.debut)}`,
    `DTEND;TZID=${FUSEAU}:${horodatage(e.jour, p.fin)}`,
    `SUMMARY:${echapper(`${e.titre} · Expo St-Isidore`)}`,
    `LOCATION:${echapper(`${e.lieu ? `${e.lieu}, ` : ""}Expo St-Isidore, 132 route Coulombe, Saint-Isidore (Québec)`)}`,
    `DESCRIPTION:${echapper([e.description, e.prix && `Prix : ${e.prix}`].filter(Boolean).join("\n"))}`,
    "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
}

/** Télécharge le fichier .ics (le téléphone ou l'ordinateur l'ouvre dans son calendrier). */
export function telechargerIcs(e: Evenement) {
  const url = URL.createObjectURL(new Blob([fichierIcs(e)], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `expo-${e.jour}-${e.titre.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
