// Finalisation des paiements Stripe. Appelée par le webhook ET par la page /paiement/merci :
// tout est idempotent (un paiement n'est confirmé et annoncé qu'une seule fois).
import type Stripe from "stripe";
import { envoyerCourriel } from "@/lib/courriel";
import * as G from "@/lib/courriel/gabarits";
import { env } from "@/lib/env";
import { argent, dateLongue, plage } from "@/lib/format";
import { stripe } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabase/serveur";

export type Recapitulatif = { titre: string; lignes: [string, string][]; message: string };

const admin = (g: G.Gabarit) => envoyerCourriel({ a: env.courrielAdmin, ...g });

/** Passe le paiement à « payé ». Renvoie false s'il l'était déjà (rien d'autre à faire). */
async function marquerPaye(sessionId: string, paymentIntent: string | null): Promise<{ id: string; objet_type: string; objet_id: string; montant_cents: number } | null> {
  const { data } = await supabaseService()
    .from("paiements")
    .update({ statut: "paye", stripe_payment_intent: paymentIntent })
    .eq("stripe_session_id", sessionId)
    .neq("statut", "paye")
    .select("id, objet_type, objet_id, montant_cents");
  return data?.[0] ?? null;
}

/** Récapitulatif affiché sur la page de remerciement (que ce soit la 1re ou la 2e visite). */
async function recapitulatif(objetType: string, objetId: string): Promise<Recapitulatif> {
  const sb = supabaseService();
  if (objetType === "salle") {
    const { data: r } = await sb.from("reservations_salle").select("*, creneaux_salle(debut, fin, salles(nom))").eq("id", objetId).single();
    const c = r.creneaux_salle as { debut: string; fin: string; salles: { nom: string } };
    if (r.statut !== "confirmee") {
      return { titre: "Paiement remboursé", lignes: [], message: "Le délai pour payer était dépassé et la date a été prise entre-temps. Votre paiement est remboursé au complet. Appelez le bureau au 418 882-5649 pour trouver une autre date." };
    }
    return {
      titre: "Votre salle est réservée",
      lignes: [["Salle", c.salles.nom], ["Date", dateLongue(c.debut)], ["Heures", plage(c.debut, c.fin)], ["Payé", argent(r.montant_cents)]],
      message: `La confirmation est envoyée à ${r.courriel}.`,
    };
  }
  if (objetType === "danse") {
    const { data: i } = await sb.from("inscriptions_danse").select("*, prix(libelle)").eq("id", objetId).single();
    return {
      titre: "Inscription confirmée",
      lignes: [["Forfait", (i.prix as { libelle: string }).libelle], ["Personnes", String(i.personnes)], ["Payé", argent(i.montant_cents)]],
      message: `Le reçu est envoyé à ${i.courriel}. À bientôt dans la grange 2!`,
    };
  }
  if (objetType === "kiosque") {
    const { data: d } = await sb.from("demandes_kiosque").select("*, emplacements_kiosque(code)").eq("id", objetId).single();
    return {
      titre: "Kiosque confirmé",
      lignes: [["Emplacement", (d.emplacements_kiosque as { code: string } | null)?.code ?? "Extérieur"], ["Entreprise", d.entreprise], ["Payé", argent(d.montant_cents)]],
      message: `La confirmation est envoyée à ${d.courriel}.`,
    };
  }
  const { data: d } = await sb.from("demandes_remisage").select("*").eq("id", objetId).single();
  return {
    titre: "Votre place est gardée",
    lignes: [["Véhicule", d.type_vehicule + (d.marque_modele ? ` · ${d.marque_modele}` : "")], ["Dépôt payé", argent(d.depot_cents)]],
    message: `La confirmation est envoyée à ${d.courriel}. On vous appelle pour fixer la date d'entrée.`,
  };
}

/** Effets d'un paiement réussi, selon ce qui a été payé. */
async function appliquer(p: { id: string; objet_type: string; objet_id: string; montant_cents: number }, paymentIntent: string | null) {
  const sb = supabaseService();
  if (p.objet_type === "salle") {
    const { data: r } = await sb.from("reservations_salle").select("*, creneaux_salle(id, debut, fin, statut, salles(nom))").eq("id", p.objet_id).single();
    const c = r.creneaux_salle as { id: string; debut: string; fin: string; statut: string; salles: { nom: string } };
    // « confirmee » : un essai précédent a été interrompu en cours de route, on le termine
    if (r.statut !== "en_paiement" && r.statut !== "confirmee") {
      // Paiement arrivé après l'expiration de la retenue et la date reprise : remboursement complet
      if (paymentIntent) await stripe().refunds.create({ payment_intent: paymentIntent, reason: "duplicate" });
      await sb.from("paiements").update({ statut: "rembourse", rembourse_cents: p.montant_cents }).eq("id", p.id);
      await admin(G.paiementRecuAdmin("remboursé automatiquement (date déjà prise)", [["Client", r.nom], ["Courriel", r.courriel], ["Montant", argent(p.montant_cents)]]));
      return;
    }
    await sb.from("reservations_salle").update({ statut: "confirmee" }).eq("id", r.id);
    await sb.from("creneaux_salle").update({ statut: "reserve", retenu_jusqua: null }).eq("id", c.id);
    const commun = { nom: r.nom, salle: c.salles.nom, date: dateLongue(c.debut), heures: plage(c.debut, c.fin), montant: r.montant_cents };
    await Promise.all([
      envoyerCourriel({ a: r.courriel, ...G.salleConfirmee(commun) }),
      admin(G.salleConfirmeeAdmin({ ...commun, courriel: r.courriel, telephone: r.telephone, type: r.type_evenement, personnes: r.personnes ? String(r.personnes) : "—" })),
    ]);
  } else if (p.objet_type === "danse") {
    const { data: i } = await sb.from("inscriptions_danse").update({ statut: "payee" }).eq("id", p.objet_id).select("*, prix(libelle)").single();
    const forfait = (i.prix as { libelle: string }).libelle;
    await Promise.all([
      envoyerCourriel({ a: i.courriel, ...G.danseConfirmee({ nom: i.nom, forfait, personnes: i.personnes, montant: i.montant_cents }) }),
      admin(G.danseAdmin([["Nom", i.nom], ["Forfait", forfait], ["Personnes", String(i.personnes)], ["Téléphone", i.telephone], ["Courriel", i.courriel], ["Payé", argent(i.montant_cents)]])),
    ]);
  } else if (p.objet_type === "kiosque") {
    const { data: d } = await sb.from("demandes_kiosque").update({ statut: "confirmee" }).eq("id", p.objet_id).select("*, emplacements_kiosque(code)").single();
    const code = (d.emplacements_kiosque as { code: string } | null)?.code;
    await Promise.all([
      envoyerCourriel({ a: d.courriel, ...G.kiosqueConfirme({ nom: d.nom, quoi: code ? `l'emplacement ${code}` : "votre kiosque extérieur", montant: p.montant_cents }) }),
      admin(G.paiementRecuAdmin(`kiosque ${code ?? "extérieur"}`, [["Entreprise", d.entreprise], ["Contact", d.nom], ["Payé", argent(p.montant_cents)]])),
    ]);
  } else if (p.objet_type === "remisage") {
    const { data: d } = await sb.from("demandes_remisage").update({ statut: "depot_paye" }).eq("id", p.objet_id).select("*").single();
    await Promise.all([
      envoyerCourriel({ a: d.courriel, ...G.remisageDepotPaye({ nom: d.nom, depot: p.montant_cents }) }),
      admin(G.paiementRecuAdmin("dépôt de remisage", [["Nom", d.nom], ["Véhicule", d.type_vehicule], ["Téléphone", d.telephone], ["Dépôt", argent(p.montant_cents)]])),
    ]);
  }
}

/**
 * Applique les effets d'un paiement. En cas d'erreur, le paiement repasse « en attente » :
 * le prochain essai (webhook réessayé par Stripe, ou rechargement de /paiement/merci) refait tout.
 */
async function appliquerOuAnnuler(p: { id: string; objet_type: string; objet_id: string; montant_cents: number }, paymentIntent: string | null) {
  try {
    await appliquer(p, paymentIntent);
  } catch (e) {
    await supabaseService().from("paiements").update({ statut: "en_attente" }).eq("id", p.id);
    throw e;
  }
}

/** Session Checkout payée : confirme (une seule fois) et renvoie le récapitulatif. */
export async function finaliserSession(sessionId: string): Promise<Recapitulatif | null> {
  const session = await stripe().checkout.sessions.retrieve(sessionId);
  const type = session.metadata?.objet_type;
  const objet = session.metadata?.objet_id;
  if (!type || !objet) return null;
  if (session.payment_status !== "paid") {
    return { titre: "Paiement en attente", lignes: [], message: "Stripe n'a pas encore confirmé le paiement. Vous recevrez un courriel dès qu'il le sera." };
  }
  const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
  const p = await marquerPaye(session.id, pi);
  if (p) await appliquerOuAnnuler(p, pi);
  return recapitulatif(type, objet);
}

/**
 * Session abandonnée (expirée) ou paiement différé refusé (statut « echec ») :
 * libère la date ou l'inscription retenue.
 */
export async function expirerSession(session: Stripe.Checkout.Session, statut: "expire" | "echec" = "expire") {
  const sb = supabaseService();
  const { data } = await sb.from("paiements").update({ statut }).eq("stripe_session_id", session.id).eq("statut", "en_attente").select("objet_type, objet_id");
  const p = data?.[0];
  if (!p) return;
  if (p.objet_type === "salle") {
    const { data: r } = await sb.from("reservations_salle").update({ statut: "expiree" }).eq("id", p.objet_id).eq("statut", "en_paiement").select("creneau_id");
    if (r?.[0]) await sb.from("creneaux_salle").update({ statut: "ouvert", retenu_jusqua: null }).eq("id", r[0].creneau_id).eq("statut", "retenu");
  } else if (p.objet_type === "danse") {
    await sb.from("inscriptions_danse").update({ statut: "expiree" }).eq("id", p.objet_id).eq("statut", "en_paiement");
  }
  // Kiosque et remisage : la demande reste approuvée, le lien de paiement reste valide.
}

/** Facture de kiosque extérieur payée (Stripe Invoicing). */
export async function factureePayee(facture: Stripe.Invoice) {
  const sb = supabaseService();
  const { data } = await sb.from("paiements").update({ statut: "paye" }).eq("stripe_facture_id", facture.id).neq("statut", "paye").select("id, objet_type, objet_id, montant_cents");
  if (data?.[0]) await appliquerOuAnnuler(data[0], null);
}
