import { exigerAdmin } from "@/lib/admin";
import { dateCourte, dateHeure, heure, jourLocal } from "@/lib/format";
import { completerEmplacement, completerEmplacements } from "@/lib/kiosques";

// Export CSV pour la comptabilité : /admin/export/salles, kiosques, remisage, danse ou paiements.
// Réservé aux comptes admin (exigerAdmin redirige vers la connexion; la RLS filtre les lectures).
// Format pensé pour Excel en français : point-virgule, virgule décimale, marque UTF-8 en tête.

type Valeur = string | number | null | undefined;
const dollars = (cents: number | null | undefined) => (cents == null ? "" : (cents / 100).toFixed(2).replace(".", ","));

function cellule(v: Valeur): string {
  let s = v == null ? "" : String(v);
  // Une cellule qui commence par = + - @ serait lue comme une formule par Excel
  if (/^[=+\-@\t\r]/.test(s) && typeof v !== "number") s = `'${s}`;
  return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const STATUTS: Record<string, string> = {
  en_attente: "En attente", en_paiement: "Paiement en cours", approuvee: "Approuvée, à payer", entente: "Entente notée", facturee: "Facturée",
  confirmee: "Confirmée", payee: "Payée", depot_paye: "Dépôt payé", paye: "Payé", refusee: "Refusée", annulee: "Annulée", expiree: "Expirée",
  expire: "Expiré", echec: "Échec", rembourse: "Remboursé", rembourse_partiel: "Remboursé en partie",
};
const statut = (s: string) => STATUTS[s] ?? s;

export async function GET(_requete: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const { sb } = await exigerAdmin();
  let entetes: string[] = [];
  let lignes: Valeur[][] = [];

  if (type === "salles") {
    const { data } = await sb.from("reservations_salle").select("*, creneaux_salle(debut, fin, salles(nom))").order("cree_le", { ascending: false }).limit(5000);
    entetes = ["Date de l'événement", "Début", "Fin", "Salle", "Client", "Téléphone", "Courriel", "Événement", "Personnes", "Montant ($)", "Statut", "Réservé le"];
    lignes = (data ?? []).map((r) => {
      const c = r.creneaux_salle as { debut: string; fin: string; salles: { nom: string } } | null;
      return [c ? jourLocal(c.debut) : "", c ? heure(c.debut) : "", c ? heure(c.fin) : "", c?.salles.nom, r.nom, r.telephone, r.courriel, r.type_evenement, r.personnes, dollars(r.montant_cents), statut(r.statut), dateCourte(r.cree_le)];
    });
  } else if (type === "kiosques") {
    const { data: brut } = await sb.from("demandes_kiosque").select("*, emplacements_kiosque(code)").order("cree_le", { ascending: false }).limit(5000);
    const data = await completerEmplacements(sb, brut ?? []);
    entetes = ["Année", "Type", "Emplacement", "Entreprise", "Contact", "Téléphone", "Courriel", "Expose", "Montant ($)", "Statut", "Notes", "Reçue le"];
    lignes = (data ?? []).map((d) => [d.annee, d.type === "interieur" ? "Intérieur" : "Extérieur", d.codes, d.entreprise, d.nom, d.telephone, d.courriel, d.description, dollars(d.montant_cents), statut(d.statut), d.notes_admin, dateCourte(d.cree_le)]);
  } else if (type === "remisage") {
    const { data } = await sb.from("demandes_remisage").select("*").order("cree_le", { ascending: false }).limit(5000);
    entetes = ["Saison", "Véhicule", "Marque et modèle", "Longueur (pi)", "Largeur (pi)", "Hauteur (pi)", "Client", "Téléphone", "Courriel", "Prix de la saison ($)", "Dépôt ($)", "Statut", "Notes", "Reçue le"];
    lignes = (data ?? []).map((d) => [d.saison, d.type_vehicule, d.marque_modele, String(d.longueur_pi).replace(".", ","), String(d.largeur_pi).replace(".", ","), String(d.hauteur_pi).replace(".", ","), d.nom, d.telephone, d.courriel, dollars(d.prix_total_cents), dollars(d.depot_cents), statut(d.statut), d.notes_admin, dateCourte(d.cree_le)]);
  } else if (type === "danse") {
    const { data } = await sb.from("inscriptions_danse").select("*, prix(libelle)").neq("statut", "expiree").order("cree_le", { ascending: false }).limit(5000);
    entetes = ["Inscrit le", "Nom", "Téléphone", "Courriel", "Forfait", "Personnes", "Montant ($)", "Statut"];
    lignes = (data ?? []).map((i) => [dateCourte(i.cree_le), i.nom, i.telephone, i.courriel, (i.prix as { libelle: string } | null)?.libelle, i.personnes, dollars(i.montant_cents), statut(i.statut)]);
  } else if (type === "paiements") {
    const { data } = await sb.from("paiements").select("*").in("statut", ["paye", "rembourse_partiel", "rembourse"]).order("cree_le", { ascending: false }).limit(5000);
    const NOMS: Record<string, string> = { salle: "Salle", kiosque: "Kiosque", danse: "Danse", remisage: "Remisage" };
    entetes = ["Date", "Pour", "Courriel du client", "Encaissé ($)", "Remboursé ($)", "Frais d'annulation gardés ($)", "Net ($)", "Statut", "Référence Stripe"];
    lignes = (data ?? []).map((p) => [dateHeure(p.cree_le), NOMS[p.objet_type] ?? p.objet_type, p.courriel, dollars(p.montant_cents), dollars(p.rembourse_cents), dollars(p.frais_annulation_cents), dollars(p.montant_cents - p.rembourse_cents), statut(p.statut), p.stripe_payment_intent ?? p.stripe_facture_id ?? p.stripe_session_id]);
  } else {
    return new Response("Export inconnu", { status: 404 });
  }

  const csv = "﻿" + [entetes, ...lignes].map((l) => l.map(cellule).join(";")).join("\r\n") + "\r\n";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="expo-${type}-${jourLocal(new Date())}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
