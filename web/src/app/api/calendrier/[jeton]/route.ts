import { lireJeton } from "@/lib/jeton";
import { supabaseConfigure } from "@/lib/env";
import { supabaseService } from "@/lib/supabase/serveur";

// Fichier .ics « Ajouter à mon calendrier » d'une réservation de salle confirmée.
// Le lien est signé (lib/jeton.ts) : il ne s'ouvre que pour la réservation du client.
const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const texte = (s: string) => s.replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");

export async function GET(_requete: Request, { params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  const id = supabaseConfigure() ? lireJeton("calendrier-salle", jeton) : null;
  if (!id) return new Response("Lien invalide", { status: 404 });
  const { data: r } = await supabaseService().from("reservations_salle")
    .select("id, statut, type_evenement, creneaux_salle(debut, fin, salles(nom))").eq("id", id).maybeSingle();
  if (!r || r.statut !== "confirmee") return new Response("Réservation introuvable", { status: 404 });
  const c = r.creneaux_salle as unknown as { debut: string; fin: string; salles: { nom: string } };

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Expo St-Isidore//Location de salle//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:salle-${r.id}@expobassinchaudiere.com`,
    `DTSTAMP:${utc(new Date().toISOString())}`,
    `DTSTART:${utc(c.debut)}`,
    `DTEND:${utc(c.fin)}`,
    `SUMMARY:${texte(`${r.type_evenement || "Événement"} · ${c.salles.nom}`)}`,
    `LOCATION:${texte("Expo St-Isidore, 132, route Coulombe, Saint-Isidore (Québec) G0S 2S0")}`,
    `DESCRIPTION:${texte("Location de salle à l'Expo St-Isidore. Bureau : 418 882-5649.")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="location-salle-expo-st-isidore.ics"',
      "Cache-Control": "private, no-store",
    },
  });
}
