"use server";

import { envoyerCourriel } from "@/lib/courriel";
import * as G from "@/lib/courriel/gabarits";
import { env, supabaseConfigure } from "@/lib/env";
import { argent, dateLongue, plage } from "@/lib/format";
import { creerSessionPaiement } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabase/serveur";
import {
  consentement, courriel, ErreurSaisie, estRobot, nombre, telephone, texte, traiter, type Resultat,
} from "@/lib/validation";

const PIED = 0.3048;

function base() {
  if (!supabaseConfigure()) throw new Error("Supabase n'est pas configuré (.env.local)");
  return supabaseService();
}

/** Prix utilisable pour un paiement en ligne : actif, et confirmé (ou fictif permis en dev). */
async function prixPayable(cle: string) {
  const { data } = await base().from("prix").select("*").eq("cle", cle).eq("actif", true).maybeSingle();
  if (!data) return null;
  if (data.a_confirmer && !env.afficherPrixFictifs) return null;
  return data as { cle: string; libelle: string; montant_cents: number; description: string };
}

const admin = (g: G.Gabarit) => envoyerCourriel({ a: env.courrielAdmin, ...g });

// =====================================================================
// 4e. Remisage d'hiver : demande -> approbation (admin) -> dépôt
// =====================================================================
export async function demanderRemisage(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    if (estRobot(fd)) return { ok: true };
    const type = texte(fd, "type", { requis: true, max: 60 });
    const modele = texte(fd, "modele", { max: 120 });
    const metres = texte(fd, "unite", { max: 10 }) === "metres";
    const enPieds = (n: number | null) => (n == null ? null : Math.round((metres ? n / PIED : n) * 100) / 100);
    const longueur = enPieds(nombre(fd, "longueur", { requis: true, min: 0.1, max: 70 }));
    const largeur = enPieds(nombre(fd, "largeur", { requis: true, min: 0.1, max: 25 }));
    const hauteur = enPieds(nombre(fd, "hauteur", { requis: true, min: 0.1, max: 25 }));
    if (!longueur || longueur > 60 || !largeur || largeur > 20 || !hauteur || hauteur > 20) {
      throw new ErreurSaisie("Ce véhicule dépasse les dimensions permises. Appelez-nous au 418 882-9619.");
    }
    const entree = texte(fd, "entree", { max: 80 });
    const nom = texte(fd, "nom", { requis: true, max: 120 });
    const tel = telephone(fd);
    const c = courriel(fd);
    const commentaires = texte(fd, "message", { max: 2000 });
    consentement(fd);

    const sb = base();
    const { data: saison } = await sb.from("contenus").select("valeur").eq("cle", "remisage_saison").maybeSingle();
    const { error } = await sb.from("demandes_remisage").insert({
      saison: saison?.valeur ?? "", type_vehicule: type, marque_modele: modele, longueur_pi: longueur,
      largeur_pi: largeur, hauteur_pi: hauteur, entree_souhaitee: entree, nom, courriel: c, telephone: tel, commentaires,
    });
    if (error) throw error;
    const vehicule = type + (modele ? ` · ${modele}` : "");
    await Promise.all([
      envoyerCourriel({ a: c, ...G.remisageRecu({ nom, vehicule, longueur: `${longueur} pi` }) }),
      admin(G.remisageRecuAdmin([
        ["Véhicule", vehicule], ["Dimensions", `${longueur} × ${largeur} × ${hauteur} pi`], ["Entrée", entree || "—"],
        ["Nom", nom], ["Téléphone", tel], ["Courriel", c], ["Commentaires", commentaires || "—"],
      ])),
    ]);
    return { ok: true };
  }, "418 882-9619");
}

// =====================================================================
// 4a. Salles : réservation libre-service d'un créneau ouvert, paiement immédiat
// =====================================================================
export async function reserverSalle(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    if (estRobot(fd)) return { ok: true };
    const creneauId = texte(fd, "creneau", { requis: true, max: 40 });
    const nom = texte(fd, "nom", { requis: true, max: 120 });
    const c = courriel(fd);
    const tel = telephone(fd);
    const typeEvenement = texte(fd, "type", { requis: true, max: 80 });
    const personnes = nombre(fd, "personnes", { min: 1, max: 2000 });
    const commentaires = texte(fd, "message", { max: 2000 });
    consentement(fd);

    const sb = base();
    const { data: creneau } = await sb.from("creneaux_salle").select("*, salles(*)").eq("id", creneauId).maybeSingle();
    if (!creneau) throw new ErreurSaisie("Ce créneau n'existe plus. Choisissez une autre date.");
    const salle = creneau.salles as { nom: string; cle_prix: string | null };
    const prix = salle.cle_prix ? await prixPayable(salle.cle_prix) : null;
    const montant = creneau.prix_cents ?? prix?.montant_cents;
    if (!montant || (!prix && creneau.prix_cents == null)) {
      throw new ErreurSaisie("Le prix de cette salle n'est pas encore en ligne. Appelez le bureau au 418 882-5649 pour réserver.");
    }

    // Verrou atomique : un seul client peut retenir le créneau (30 min pour payer)
    // 35 min : un peu plus que la session Stripe (30 min), pour qu'un paiement fait à la dernière minute trouve encore la date retenue
    const { data: retenu, error: e1 } = await sb.rpc("retenir_creneau", { p_creneau: creneauId, p_minutes: 35 });
    if (e1) throw e1;
    if (!retenu) throw new ErreurSaisie("Quelqu'un vient de prendre cette date. Choisissez-en une autre.");

    const { data: resa, error: e2 } = await sb.from("reservations_salle").insert({
      creneau_id: creneauId, nom, courriel: c, telephone: tel, type_evenement: typeEvenement,
      personnes, commentaires, montant_cents: montant,
    }).select("id").single();
    if (e2) {
      await sb.from("creneaux_salle").update({ statut: "ouvert", retenu_jusqua: null }).eq("id", creneauId);
      throw e2;
    }
    try {
      const url = await creerSessionPaiement({
        type: "salle", objetId: resa.id, libelle: `${salle.nom} · ${dateLongue(creneau.debut)}`,
        description: `${plage(creneau.debut, creneau.fin)} · ${typeEvenement}`, montantCents: montant,
        courriel: c, retourAnnulation: `/location?annule=${creneauId}`,
      });
      return { ok: true, redirection: url };
    } catch (e) {
      // Paiement impossible à démarrer : on libère tout de suite la date
      await sb.from("reservations_salle").update({ statut: "expiree" }).eq("id", resa.id);
      await sb.from("creneaux_salle").update({ statut: "ouvert", retenu_jusqua: null }).eq("id", creneauId);
      throw e;
    }
  });
}

/** Le client revient de Stripe sans payer : on libère sa retenue tout de suite. */
export async function libererRetenue(creneauId: string): Promise<void> {
  if (!supabaseConfigure() || !/^[0-9a-f-]{36}$/.test(creneauId)) return;
  const sb = base();
  const { data: resa } = await sb.from("reservations_salle").select("id").eq("creneau_id", creneauId).eq("statut", "en_paiement").maybeSingle();
  if (!resa) return;
  const { data: pay } = await sb.from("paiements").select("statut").eq("objet_type", "salle").eq("objet_id", resa.id).eq("statut", "paye").maybeSingle();
  if (pay) return;
  await sb.from("reservations_salle").update({ statut: "expiree" }).eq("id", resa.id);
  await sb.from("creneaux_salle").update({ statut: "ouvert", retenu_jusqua: null }).eq("id", creneauId).eq("statut", "retenu");
}

// =====================================================================
// 4b. Kiosque intérieur : choix sur le plan -> demande -> approbation -> paiement
// =====================================================================
export async function demanderKiosqueInterieur(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    if (estRobot(fd)) return { ok: true };
    const emplacementId = texte(fd, "emplacement", { requis: true, max: 40 });
    const entreprise = texte(fd, "entreprise", { requis: true, max: 160 });
    const nom = texte(fd, "nom", { requis: true, max: 120 });
    const c = courriel(fd);
    const tel = telephone(fd);
    const description = texte(fd, "description", { requis: true, max: 2000 });
    const besoins = texte(fd, "besoins", { max: 1000 });
    consentement(fd);

    const sb = base();
    const annee = Number(texte(fd, "annee", { requis: true, max: 4 }));
    const { data: emp } = await sb.from("emplacements_kiosque").select("id, code, actif").eq("id", emplacementId).maybeSingle();
    if (!emp?.actif) throw new ErreurSaisie("Cet emplacement n'est pas offert. Choisissez-en un autre sur le plan.");
    const { data: pris } = await sb.from("demandes_kiosque").select("id").eq("emplacement_id", emplacementId)
      .eq("annee", annee).in("statut", ["approuvee", "confirmee"]).limit(1);
    if (pris?.length) throw new ErreurSaisie(`L'emplacement ${emp.code} vient d'être attribué. Choisissez-en un autre sur le plan.`);

    const { error } = await sb.from("demandes_kiosque").insert({
      type: "interieur", annee, emplacement_id: emplacementId, entreprise, nom, courriel: c, telephone: tel, description, besoins,
    });
    if (error) throw error;
    await Promise.all([
      envoyerCourriel({ a: c, ...G.kiosqueRecu({ nom, type: "interieur", emplacement: emp.code }) }),
      admin(G.kiosqueRecuAdmin([
        ["Type", "Intérieur (palais des commerces)"], ["Emplacement", emp.code], ["Entreprise", entreprise],
        ["Contact", nom], ["Téléphone", tel], ["Courriel", c], ["Produits", description], ["Besoins", besoins || "—"],
      ])),
    ]);
    return { ok: true };
  }, "418 386-0484");
}

// =====================================================================
// 4c. Kiosque extérieur : demande d'information -> entente et facture par l'admin
// =====================================================================
export async function demanderKiosqueExterieur(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    if (estRobot(fd)) return { ok: true };
    const entreprise = texte(fd, "entreprise", { requis: true, max: 160 });
    const nom = texte(fd, "nom", { requis: true, max: 120 });
    const c = courriel(fd);
    const tel = telephone(fd);
    const description = texte(fd, "description", { requis: true, max: 2000 });
    const besoins = texte(fd, "besoins", { max: 1000 });
    consentement(fd);
    const annee = Number(texte(fd, "annee", { requis: true, max: 4 }));

    const { error } = await base().from("demandes_kiosque").insert({
      type: "exterieur", annee, entreprise, nom, courriel: c, telephone: tel, description, besoins,
    });
    if (error) throw error;
    await Promise.all([
      envoyerCourriel({ a: c, ...G.kiosqueRecu({ nom, type: "exterieur" }) }),
      admin(G.kiosqueRecuAdmin([
        ["Type", "Extérieur"], ["Entreprise", entreprise], ["Contact", nom], ["Téléphone", tel], ["Courriel", c],
        ["Ce qui sera exposé", description], ["Espace et besoins", besoins || "—"],
      ])),
    ]);
    return { ok: true };
  }, "418 386-0484");
}

// =====================================================================
// 4d. Danse country : forfait à paliers, paiement immédiat (pas de dépôt minimum)
// =====================================================================
export async function inscrireDanse(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    if (estRobot(fd)) return { ok: true };
    const cle = texte(fd, "forfait", { requis: true, max: 40 });
    if (!cle.startsWith("danse_")) throw new ErreurSaisie("Choisissez un forfait.");
    const nom = texte(fd, "nom", { requis: true, max: 120 });
    const c = courriel(fd);
    const tel = telephone(fd);
    const personnes = nombre(fd, "personnes", { requis: true, min: 1, max: 10 })!;
    if (!Number.isInteger(personnes)) throw new ErreurSaisie("Le nombre de personnes doit être un nombre entier.");
    consentement(fd);

    const prix = await prixPayable(cle);
    if (!prix) throw new ErreurSaisie("Ce forfait n'est pas encore en vente en ligne. Appelez le bureau au 418 882-5649.");
    const sb = base();
    const { data: ins, error } = await sb.from("inscriptions_danse").insert({
      cle_prix: cle, nom, courriel: c, telephone: tel, personnes, montant_cents: prix.montant_cents * personnes,
    }).select("id").single();
    if (error) throw error;
    const url = await creerSessionPaiement({
      type: "danse", objetId: ins.id, libelle: `Danse country en ligne : ${prix.libelle}`,
      description: `${prix.description} · ${argent(prix.montant_cents)} par personne`,
      montantCents: prix.montant_cents, quantite: personnes, courriel: c, retourAnnulation: "/danse?annule=1",
    });
    return { ok: true, redirection: url };
  });
}
