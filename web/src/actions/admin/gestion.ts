"use server";

import { revalidatePath } from "next/cache";
import { exigerRole, verifierEcriture } from "@/lib/admin";
import { envoyerCourriel } from "@/lib/courriel";
import * as G from "@/lib/courriel/gabarits";
import { env } from "@/lib/env";
import { argent } from "@/lib/format";
import { annuler, TABLES, type ParQui, type TypeObjet } from "@/lib/annulation";
import { creerFacture } from "@/lib/stripe-admin";
import { ErreurSaisie, nombre, texte, traiter, type Resultat } from "@/lib/validation";

const UUID = /^[0-9a-f-]{36}$/;
function id(fd: FormData, nom = "id") {
  const v = texte(fd, nom, { requis: true, max: 40 });
  if (!UUID.test(v)) throw new ErreurSaisie("Identifiant invalide.");
  return v;
}
/** Montant en dollars saisi par l'admin -> cents. */
function dollars(fd: FormData, nom: string, requis = true): number | null {
  const n = nombre(fd, nom, { requis, min: 0, max: 1_000_000 });
  return n == null ? null : Math.round(n * 100);
}
const lienPaiement = (jeton: string) => `${env.urlSite}/payer/${jeton}`;

// =====================================================================
// Annulation + remboursement (code partagé avec le lien d'annulation du client : lib/annulation.ts)
// Qui annule : le client paie les frais d'annulation; l'Expo rembourse au complet.
// =====================================================================
export async function annulerEtRembourser(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const type = texte(fd, "type", { requis: true, max: 10 }) as TypeObjet;
    if (!TABLES[type]) throw new ErreurSaisie("Type inconnu.");
    const parQui: ParQui = fd.get("par") === "expo" ? "expo" : "client";
    const r = await annuler(sb, { type, objetId: id(fd), parQui, fraisCents: dollars(fd, "frais", false) ?? 0, aviser: fd.get("aviser") === "oui" });
    revalidatePath("/admin", "layout");
    const qui = parQui === "expo" ? "par l'Expo, sans frais" : "à la demande du client";
    return { ok: true, message: r.paye ? `Annulé ${qui}. Remboursé : ${argent(r.rembourse)} (frais retenus : ${argent(r.retenu)}).` : `Annulé ${qui} (aucun paiement à rembourser).` };
  });
}

// =====================================================================
// Kiosques
// =====================================================================
export async function approuverKiosque(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const demandeId = id(fd);
    const montant = dollars(fd, "montant")!;
    if (montant <= 0) throw new ErreurSaisie("Entrez le montant à payer.");
    const r = await sb.from("demandes_kiosque").update({ statut: "approuvee", montant_cents: montant, notes_admin: texte(fd, "notes", { max: 2000 }) })
      .eq("id", demandeId).eq("type", "interieur").eq("statut", "en_attente").select("*, emplacements_kiosque(code)");
    if (r.error?.code === "23505") throw new ErreurSaisie("Cet emplacement est déjà attribué à une autre demande cette année.");
    verifierEcriture(r);
    const d = r.data![0];
    await envoyerCourriel({ a: d.courriel, ...G.kiosqueApprouve({ nom: d.nom, emplacement: d.emplacements_kiosque.code, montant, lien: lienPaiement(d.jeton_paiement) }) });
    revalidatePath("/admin/kiosques");
    return { ok: true, message: "Approuvée. Le lien de paiement est envoyé." };
  });
}

export async function refuserDemande(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const type = texte(fd, "type", { requis: true }) as "kiosque" | "remisage";
    const table = type === "kiosque" ? "demandes_kiosque" : "demandes_remisage";
    const raison = texte(fd, "raison", { max: 1000 });
    const r = await sb.from(table).update({ statut: "refusee", notes_admin: raison }).eq("id", id(fd)).in("statut", ["en_attente", "entente"]).select("*");
    verifierEcriture(r);
    const d = r.data![0];
    if (fd.get("aviser") === "oui") {
      await envoyerCourriel({ a: d.courriel, ...(type === "kiosque" ? G.kiosqueRefuse({ nom: d.nom, raison }) : G.remisageRefuse({ nom: d.nom, raison })) });
    }
    revalidatePath(`/admin/${type === "kiosque" ? "kiosques" : "remisage"}`);
    return { ok: true, message: "Demande refusée." };
  });
}

/** Kiosque extérieur : l'admin note l'entente conclue avec l'entreprise. */
export async function noterEntente(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const montant = dollars(fd, "montant")!;
    verifierEcriture(await sb.from("demandes_kiosque").update({ statut: "entente", montant_cents: montant, notes_admin: texte(fd, "notes", { max: 2000 }) })
      .eq("id", id(fd)).eq("type", "exterieur").in("statut", ["en_attente", "entente"]).select("id"));
    revalidatePath("/admin/kiosques");
    return { ok: true, message: "Entente notée." };
  });
}

/** Kiosque extérieur : crée la facture Stripe (test) et l'envoie par courriel. */
export async function envoyerFacture(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const demandeId = id(fd);
    const { data: d } = await sb.from("demandes_kiosque").select("*").eq("id", demandeId).eq("type", "exterieur").eq("statut", "entente").single();
    if (!d?.montant_cents) throw new ErreurSaisie("Notez d'abord l'entente avec son montant.");
    const f = await creerFacture({ courriel: d.courriel, nom: d.nom, entreprise: d.entreprise, montantCents: d.montant_cents, description: `Kiosque extérieur, Expo ${d.annee}`, demandeId });
    verifierEcriture(await sb.from("demandes_kiosque").update({ statut: "facturee", stripe_facture_id: f.id, url_facture: f.url }).eq("id", demandeId).select("id"));
    verifierEcriture(await sb.from("paiements").insert({ objet_type: "kiosque", objet_id: demandeId, stripe_facture_id: f.id, montant_cents: d.montant_cents, courriel: d.courriel }).select("id"));
    await envoyerCourriel({ a: d.courriel, ...G.kiosqueFacture({ nom: d.nom, montant: d.montant_cents, lien: f.url }) });
    revalidatePath("/admin/kiosques");
    return { ok: true, message: "Facture créée et envoyée." };
  });
}

export async function majEmplacement(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const champs = {
      code: texte(fd, "code", { requis: true, max: 10 }),
      x: nombre(fd, "x", { requis: true, min: 0, max: 23 }),
      y: nombre(fd, "y", { requis: true, min: 0, max: 13 }),
      largeur: nombre(fd, "largeur", { requis: true, min: 1, max: 8 }),
      hauteur: nombre(fd, "hauteur", { requis: true, min: 1, max: 8 }),
      dimensions: texte(fd, "dimensions", { max: 40 }) || "10 pi × 10 pi",
      prix_cents: dollars(fd, "prix", false),
      actif: fd.get("actif") === "oui",
    };
    const ident = String(fd.get("id") ?? "");
    const r = ident
      ? await sb.from("emplacements_kiosque").update(champs).eq("id", ident).select("id")
      : await sb.from("emplacements_kiosque").insert(champs).select("id");
    if (r.error?.code === "23505") throw new ErreurSaisie("Ce code d'emplacement existe déjà.");
    verifierEcriture(r);
    revalidatePath("/admin/kiosques");
    revalidatePath("/kiosques");
    return { ok: true, message: ident ? "Emplacement modifié." : "Emplacement ajouté." };
  });
}

// =====================================================================
// Remisage
// =====================================================================
export async function approuverRemisage(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const total = dollars(fd, "total")!;
    const depot = dollars(fd, "depot")!;
    const { data: min } = await sb.from("prix").select("montant_cents").eq("cle", "remisage_depot_min").single();
    const minimum = min?.montant_cents ?? 10000;
    if (depot < minimum) throw new ErreurSaisie(`Le dépôt doit être d'au moins ${argent(minimum)}.`);
    if (depot > total) throw new ErreurSaisie("Le dépôt ne peut pas dépasser le prix de la saison.");
    const r = await sb.from("demandes_remisage").update({ statut: "approuvee", prix_total_cents: total, depot_cents: depot, notes_admin: texte(fd, "notes", { max: 2000 }) })
      .eq("id", id(fd)).eq("statut", "en_attente").select("*");
    verifierEcriture(r);
    const d = r.data![0];
    await envoyerCourriel({ a: d.courriel, ...G.remisageApprouve({ nom: d.nom, vehicule: d.type_vehicule, total, depot, lien: lienPaiement(d.jeton_paiement) }) });
    revalidatePath("/admin/remisage");
    return { ok: true, message: "Approuvée. Le lien du dépôt est envoyé." };
  });
}

// =====================================================================
// Calendrier des salles
// =====================================================================
/** Ajoute des créneaux : une date, ou chaque jour de semaine choisi entre deux dates. */
export async function ajouterCreneaux(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const salles = fd.getAll("salle").map(String).filter((s) => UUID.test(s));
    if (!salles.length) throw new ErreurSaisie("Choisissez au moins une salle.");
    const du = texte(fd, "du", { requis: true, max: 10 });
    const au = texte(fd, "au", { max: 10 }) || du;
    const debut = texte(fd, "debut", { requis: true, max: 5 });
    const fin = texte(fd, "fin", { requis: true, max: 5 });
    const jours = fd.getAll("jour").map(Number);
    const prix = dollars(fd, "prix", false);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(du) || !/^\d{4}-\d{2}-\d{2}$/.test(au) || au < du) throw new ErreurSaisie("Vérifiez les dates.");
    if (!/^\d{2}:\d{2}$/.test(debut) || !/^\d{2}:\d{2}$/.test(fin)) throw new ErreurSaisie("Vérifiez les heures.");

    // Heure locale du Québec -> instant UTC (gère l'heure d'été)
    const instant = (jour: string, h: string) => {
      const naif = new Date(`${jour}T${h}:00Z`);
      const decalage = new Date(naif.toLocaleString("en-US", { timeZone: "America/Toronto" })).getTime() - new Date(naif.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
      return new Date(naif.getTime() - decalage).toISOString();
    };
    const lignes: { salle_id: string; debut: string; fin: string; prix_cents: number | null }[] = [];
    for (let d = new Date(du + "T12:00:00Z"); d <= new Date(au + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + 1)) {
      const jour = d.toISOString().slice(0, 10);
      if (du !== au && jours.length && !jours.includes(d.getUTCDay())) continue;
      const lendemain = new Date(d.getTime() + 864e5).toISOString().slice(0, 10);
      for (const s of salles) lignes.push({ salle_id: s, debut: instant(jour, debut), fin: instant(fin <= debut ? lendemain : jour, fin), prix_cents: prix });
    }
    if (!lignes.length) throw new ErreurSaisie("Aucune date ne correspond.");
    if (lignes.length > 500) throw new ErreurSaisie("Trop de créneaux d'un coup (500 au plus).");
    verifierEcriture(await sb.from("creneaux_salle").insert(lignes).select("id"));
    revalidatePath("/admin/calendrier");
    return { ok: true, message: `${lignes.length} créneau${lignes.length > 1 ? "x" : ""} ajouté${lignes.length > 1 ? "s" : ""}.` };
  });
}

export async function basculerCreneau(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const action = texte(fd, "action", { requis: true });
    const creneau = id(fd);
    if (action === "supprimer") {
      verifierEcriture(await sb.from("creneaux_salle").delete().eq("id", creneau).in("statut", ["ouvert", "verrouille"]).select("id"));
    } else {
      const vers = action === "verrouiller" ? "verrouille" : "ouvert";
      const de = action === "verrouiller" ? "ouvert" : "verrouille";
      verifierEcriture(await sb.from("creneaux_salle").update({ statut: vers }).eq("id", creneau).eq("statut", de).select("id"));
    }
    revalidatePath("/admin/calendrier");
    return { ok: true, message: action === "supprimer" ? "Créneau supprimé." : action === "verrouiller" ? "Créneau verrouillé." : "Créneau rouvert." };
  });
}

export async function verrouillerDate(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const jour = texte(fd, "jour", { requis: true, max: 10 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(jour)) throw new ErreurSaisie("Vérifiez la date.");
    const salle = String(fd.get("salle") || "");
    const r = await sb.from("dates_verrouillees").insert({ jour, salle_id: UUID.test(salle) ? salle : null, raison: texte(fd, "raison", { max: 200 }) }).select("id");
    if (r.error?.code === "23505") throw new ErreurSaisie("Cette date est déjà verrouillée.");
    verifierEcriture(r);
    revalidatePath("/admin/calendrier");
    return { ok: true, message: "Date verrouillée." };
  });
}

export async function deverrouillerDate(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    verifierEcriture(await sb.from("dates_verrouillees").delete().eq("id", id(fd)).select("id"));
    revalidatePath("/admin/calendrier");
    return { ok: true, message: "Date déverrouillée." };
  });
}

// =====================================================================
// Programmation
// =====================================================================
export async function enregistrerEvenement(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const jour = texte(fd, "jour", { requis: true, max: 10 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(jour)) throw new ErreurSaisie("Vérifiez la date.");
    const champs = {
      annee: Number(jour.slice(0, 4)), jour,
      heure: texte(fd, "heure", { requis: true, max: 40 }),
      titre: texte(fd, "titre", { requis: true, max: 160 }),
      lieu: texte(fd, "lieu", { max: 120 }),
      prix: texte(fd, "prix", { max: 80 }),
      description: texte(fd, "description", { max: 1000 }),
      categories: fd.getAll("categories").map(String).filter((c) => ["animaux", "tire", "spectacles", "famille", "kiosques", "autres"].includes(c)),
      photo: texte(fd, "photo", { max: 400 }),
      publie: fd.get("publie") === "oui",
      ordre: nombre(fd, "ordre", { min: 0, max: 99 }) ?? 0,
    };
    if (!champs.categories.length) champs.categories = ["autres"];
    const ident = String(fd.get("id") ?? "");
    verifierEcriture(ident
      ? await sb.from("evenements").update(champs).eq("id", ident).select("id")
      : await sb.from("evenements").insert(champs).select("id"));
    revalidatePath("/admin/programmation");
    revalidatePath("/programmation");
    return { ok: true, message: ident ? "Événement modifié." : "Événement ajouté." };
  });
}

export async function supprimerEvenement(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    verifierEcriture(await sb.from("evenements").delete().eq("id", id(fd)).select("id"));
    revalidatePath("/admin/programmation");
    revalidatePath("/programmation");
    return { ok: true, message: "Événement supprimé." };
  });
}

// =====================================================================
// Prix et textes
// =====================================================================
export async function majPrix(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const cle = texte(fd, "cle", { requis: true, max: 40 });
    verifierEcriture(await sb.from("prix").update({
      montant_cents: dollars(fd, "montant")!,
      libelle: texte(fd, "libelle", { requis: true, max: 120 }),
      description: texte(fd, "description", { max: 300 }),
      a_confirmer: fd.get("a_confirmer") === "oui",
      actif: fd.get("actif") === "oui",
    }).eq("cle", cle).select("cle"));
    revalidatePath("/", "layout");
    return { ok: true, message: "Prix enregistré." };
  });
}

export async function majContenu(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    verifierEcriture(await sb.from("contenus").update({ valeur: texte(fd, "valeur", { max: 4000 }) }).eq("cle", texte(fd, "cle", { requis: true, max: 60 })).select("cle"));
    revalidatePath("/", "layout");
    return { ok: true, message: "Texte enregistré." };
  });
}

export async function marquerMessage(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    verifierEcriture(await sb.from("messages").update({ traite: fd.get("traite") === "oui" }).eq("id", id(fd)).select("id"));
    revalidatePath("/admin/messages");
    return { ok: true };
  });
}
