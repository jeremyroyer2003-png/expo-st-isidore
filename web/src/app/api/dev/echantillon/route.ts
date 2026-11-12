// Échantillon de test : crée des dizaines de réservations de tous les types en passant par le VRAI code
// de l'app (actions publiques, actions admin, gabarits de courriels) et de vrais paiements Stripe de TEST.
// Seule différence avec un vrai client : le paiement se fait par un PaymentIntent de test au lieu de la
// page Checkout (qui ne se remplit pas par programme).
//
// - Développement seulement (404 ailleurs) et clé Stripe de test seulement (env.stripeSecret refuse le reste).
// - Les étapes admin utilisent la session de la personne connectée : lancer depuis un onglet connecté à /admin.
//   POST /api/dev/echantillon   -> crée l'échantillon, renvoie le journal de chaque étape
//   DELETE /api/dev/echantillon -> efface tout ce qui a une adresse @example.com, et les avis admin envoyés
//                                 pendant la création de l'échantillon
import { NextResponse } from "next/server";
import {
  annulerEtRembourser, approuverKiosque, approuverRemisage, envoyerFacture, marquerMessage, noterEntente, refuserDemande,
} from "@/actions/admin/gestion";
import { envoyerMessage } from "@/actions/messages";
import { trouverAPayer } from "@/actions/paiement";
import {
  demanderKiosqueExterieur, demanderKiosqueInterieur, demanderRemisage, inscrireDanse, libererRetenue, reserverSalle,
} from "@/actions/reservations";
import { env } from "@/lib/env";
import { confirmerPaiementTest, expirerSession, factureePayee } from "@/lib/paiements";
import { creerSessionPaiement, stripe } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabase/serveur";
import type { Resultat } from "@/lib/validation";

export const maxDuration = 600;

const DOMAINE = "example.com";
const ANNEE_KIOSQUES = 2027;

function interdit() {
  return process.env.NODE_ENV !== "development";
}

// ---------------------------------------------------------------- outils
type Ligne = { etape: string; ok: boolean; detail?: string };
const journal: Ligne[] = [];
function noter(etape: string, r: Resultat | { ok: boolean; erreur?: string; message?: string }) {
  journal.push({ etape, ok: r.ok, detail: r.ok ? ("message" in r ? r.message : undefined) : ("erreur" in r ? r.erreur : undefined) });
  return r.ok;
}
function form(champs: Record<string, string | number | undefined>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(champs)) if (v !== undefined) fd.set(k, String(v));
  fd.set("consentement", "oui");
  fd.set("conditions", "oui");
  return fd;
}
const sb = () => supabaseService();
const adresse = (prenom: string, nom: string) =>
  `${prenom}.${nom}`.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z.]/g, "").toLowerCase() + "@" + DOMAINE;
let tel = 100;
const telephone = () => `418 555-0${tel++}`;

/** Paie le dernier paiement « en attente » d'un objet avec la carte de test Visa, comme sur Checkout. */
async function payer(objetType: string, objetId: string, etape: string) {
  const { data: p } = await sb().from("paiements").select("*").eq("objet_type", objetType).eq("objet_id", objetId)
    .eq("statut", "en_attente").order("cree_le", { ascending: false }).limit(1).maybeSingle();
  if (!p) return noter(etape, { ok: false, erreur: "aucun paiement en attente" });
  const pi = await stripe().paymentIntents.create({
    amount: p.montant_cents, currency: "cad", payment_method: "pm_card_visa", confirm: true,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    receipt_email: p.courriel, description: `Échantillon de test : ${objetType}`,
    metadata: { objet_type: objetType, objet_id: objetId, echantillon: "oui" },
  });
  await confirmerPaiementTest(p.id, pi.id);
  if (p.stripe_session_id) await stripe().checkout.sessions.expire(p.stripe_session_id).catch(() => {});
  return noter(etape, { ok: pi.status === "succeeded", message: `${(p.montant_cents / 100).toFixed(2)} $ payé (${pi.id})` });
}

async function idPar(table: string, courriel: string) {
  const colonnes = table === "demandes_kiosque" || table === "demandes_remisage" ? "id, jeton_paiement" : "id";
  const { data } = await sb().from(table).select(colonnes).eq("courriel", courriel).order("cree_le", { ascending: false }).limit(1).single();
  return data as unknown as { id: string; jeton_paiement?: string };
}

// ---------------------------------------------------------------- scénarios
type Personne = { prenom: string; nom: string };
const P = (s: string): Personne => { const [prenom, ...n] = s.split(" "); return { prenom, nom: n.join(" ") }; };

async function salles() {
  const { data: creneaux } = await sb().from("creneaux_salle").select("id, debut, salles(nom)").eq("statut", "ouvert").gt("debut", new Date().toISOString()).order("debut");
  const libres = [...(creneaux ?? [])];
  const prendre = () => libres.splice(Math.floor(libres.length / 3), 1)[0] ?? libres.shift();
  // [personne, type d'événement, personnes, suite]
  const cas: [string, string, number, "payer" | "annuler-frais" | "annuler-sans-frais" | "abandonner" | "en-cours"][] = [
    ["Marie-Ève Poulin", "Mariage", 180, "payer"],
    ["Steve Lessard", "Party de bureau", 65, "payer"],
    ["Nathalie Giguère", "Anniversaire 50 ans", 90, "payer"],
    ["Club Optimiste St-Isidore", "Souper spaghetti", 220, "payer"],
    ["Jonathan Morin", "Shower de bébé", 40, "payer"],
    ["Caisse Desjardins Beauce", "Assemblée annuelle", 150, "payer"],
    ["Karine Vachon", "Party de Noël de famille", 75, "payer"],
    ["Patrick Bolduc", "Tournoi de cartes", 60, "payer"],
    ["Sylvie Roy", "Réception après funérailles", 110, "annuler-frais"],
    ["Mathieu Cloutier", "Fête de quartier", 130, "annuler-frais"],
    ["Isabelle Fortin", "Brunch de famille", 35, "annuler-sans-frais"],
    ["Guillaume Labbé", "Party de fête", 50, "abandonner"],
    ["Émilie Turcotte", "Mariage", 160, "abandonner"],
    ["Alexandre Drouin", "Réunion de club", 25, "en-cours"],
  ];
  for (const [qui, type, personnes, suite] of cas) {
    const c = prendre();
    if (!c) break;
    const p = P(qui);
    const courriel = adresse(p.prenom, p.nom);
    const salle = (c.salles as unknown as { nom: string }).nom;
    const etiquette = `Salle · ${qui} · ${salle} ${c.debut.slice(0, 10)}`;
    const r = await reserverSalle(form({ creneau: c.id, nom: qui, courriel, telephone: telephone(), type, personnes, message: "" }));
    if (!noter(`${etiquette} : réservation`, r)) continue;
    const { id } = await idPar("reservations_salle", courriel);
    if (suite === "abandonner") {
      await libererRetenue(c.id);
      const { data: p2 } = await sb().from("paiements").select("stripe_session_id").eq("objet_id", id).single();
      if (p2?.stripe_session_id) await stripe().checkout.sessions.expire(p2.stripe_session_id).catch(() => {});
      noter(`${etiquette} : retour de Stripe sans payer (date libérée)`, { ok: true });
      continue;
    }
    if (suite === "en-cours") { noter(`${etiquette} : laissée en paiement (retenue 35 min)`, { ok: true }); continue; }
    await payer("salle", id, `${etiquette} : paiement`);
    if (suite === "annuler-frais") noter(`${etiquette} : annulation, 50 $ de frais`, await annulerEtRembourser(form({ type: "salle", id, frais: 50, par: "client", aviser: "oui" })));
    if (suite === "annuler-sans-frais") noter(`${etiquette} : annulée par l'Expo (sans frais)`, await annulerEtRembourser(form({ type: "salle", id, frais: 50, par: "expo", aviser: "oui" })));
  }
}

async function kiosquesInterieurs() {
  const { data: emp } = await sb().from("emplacements_kiosque").select("id, code").eq("actif", true).order("code");
  const libres = [...(emp ?? [])];
  const cas: [string, string, string, number | null, "payer" | "approuver" | "attendre" | "refuser" | "annuler-frais"][] = [
    ["Fromagerie Gilbert", "Linda Gilbert", "Fromages fins de la Beauce, dégustation", 350, "payer"],
    ["Érablière du Rang 4", "Pierre Lehoux", "Produits de l'érable, tire sur la neige en juillet", 350, "payer"],
    ["Quincaillerie BMR Avantis", "Daniel Fecteau", "Outils et équipement de ferme", 700, "payer"],
    ["Boulangerie La Mie Beauceronne", "Julie Nadeau", "Pain, pâtisseries et tartes", 350, "payer"],
    ["Assurances Beauce-Appalaches", "Richard Poirier", "Information sur les assurances agricoles", 425, "payer"],
    ["Bijoux Création Sophie", "Sophie Bilodeau", "Bijoux faits à la main", 350, "approuver"],
    ["Miel des Appalaches", "Denis Jacques", "Miel et produits de la ruche", 350, "approuver"],
    ["Ferme Les Petits Fruits", "Annie Bélanger", "Confitures et petits fruits", null, "attendre"],
    ["Vêtements Western Plus", "Martin Bisson", "Bottes et chapeaux western", null, "attendre"],
    ["Solutions Spa Beauce", "Éric Veilleux", "Spas et piscines (grand espace demandé)", null, "refuser"],
    ["Savonnerie du Coin", "Chantal Breton", "Savons artisanaux", 350, "annuler-frais"],
  ];
  for (const [entreprise, qui, description, montant, suite] of cas) {
    const e = libres.splice(Math.floor(libres.length / 2), 1)[0];
    const p = P(qui);
    const courriel = adresse(p.prenom, p.nom);
    const etiquette = `Kiosque ${e.code} · ${entreprise}`;
    const r = await demanderKiosqueInterieur(form({ emplacement: e.id, entreprise, nom: qui, courriel, telephone: telephone(), description, besoins: suite === "refuser" ? "Espace de 30 pi × 20 pi, prise 240 V" : "Prise électrique", annee: ANNEE_KIOSQUES }));
    if (!noter(`${etiquette} : demande`, r)) continue;
    const { id, jeton_paiement } = await idPar("demandes_kiosque", courriel);
    if (suite === "attendre") continue;
    if (suite === "refuser") { noter(`${etiquette} : refus`, await refuserDemande(form({ type: "kiosque", id, raison: "Le palais n'a pas d'espace de cette taille. Pensez à un kiosque extérieur.", aviser: "oui" }))); continue; }
    if (!noter(`${etiquette} : approbation à ${montant} $`, await approuverKiosque(form({ id, montant: montant!, notes: "" })))) continue;
    if (suite === "approuver") continue;
    const a = await trouverAPayer(jeton_paiement!);
    if (!a) { noter(`${etiquette} : lien de paiement`, { ok: false, erreur: "rien à payer derrière le lien" }); continue; }
    await creerSessionPaiement({ type: a.type, objetId: a.id, libelle: a.libelle, description: a.description, montantCents: a.montant, courriel: a.courriel, retourAnnulation: `/payer/${jeton_paiement}`, expireMinutes: 60 });
    await payer("kiosque", id, `${etiquette} : paiement par le lien`);
    if (suite === "annuler-frais") noter(`${etiquette} : annulation, 50 $ de frais`, await annulerEtRembourser(form({ type: "kiosque", id, frais: 50, par: "client", aviser: "oui" })));
  }
}

async function kiosquesExterieurs() {
  const cas: [string, string, string, number | null, "facture-payee" | "facture" | "entente" | "attendre" | "refuser"][] = [
    ["Machinerie JNG", "Jean-Guy Nadeau", "Tracteurs neufs John Deere, 6 machines", 1500, "facture-payee"],
    ["Location Dalzi", "Marc Dallaire", "Équipement de location", 750, "facture-payee"],
    ["Camions Beauce Inc.", "Sébastien Grenier", "Camions et remorques", 950, "facture"],
    ["Cabanons Ste-Marie", "Louis Paré", "Cabanons et gazebos", 600, "entente"],
    ["Food truck Le Gros Lard", "Kevin Doyon", "Poutines et burgers", null, "attendre"],
    ["Manèges Forains Québec", "Réjean Côté", "Manège pour enfants", null, "refuser"],
  ];
  for (const [entreprise, qui, description, montant, suite] of cas) {
    const p = P(qui);
    const courriel = adresse(p.prenom, p.nom);
    const etiquette = `Kiosque extérieur · ${entreprise}`;
    if (!noter(`${etiquette} : demande`, await demanderKiosqueExterieur(form({ entreprise, nom: qui, courriel, telephone: telephone(), description, besoins: "Espace sur le gazon, près de l'allée principale", annee: ANNEE_KIOSQUES })))) continue;
    const { id } = await idPar("demandes_kiosque", courriel);
    if (suite === "attendre") continue;
    if (suite === "refuser") { noter(`${etiquette} : refus`, await refuserDemande(form({ type: "kiosque", id, raison: "Les manèges sont déjà fournis par l'Expo.", aviser: "oui" }))); continue; }
    if (!noter(`${etiquette} : entente à ${montant} $`, await noterEntente(form({ id, montant: montant!, notes: "Entente au téléphone" })))) continue;
    if (suite === "entente") continue;
    if (!noter(`${etiquette} : facture Stripe envoyée`, await envoyerFacture(form({ id })))) continue;
    if (suite === "facture") continue;
    // Le client paie la facture (ce que ferait la page de facture Stripe), puis le webhook « facture payée »
    const { data: d } = await sb().from("demandes_kiosque").select("stripe_facture_id").eq("id", id).single();
    const f = await stripe().invoices.retrieve(d!.stripe_facture_id!);
    const pm = await stripe().paymentMethods.attach("pm_card_visa", { customer: f.customer as string });
    const payee = await stripe().invoices.pay(f.id!, { payment_method: pm.id });
    await factureePayee(payee);
    noter(`${etiquette} : facture payée`, { ok: payee.status === "paid", message: `${(payee.amount_paid / 100).toFixed(2)} $` });
  }
}

async function danse() {
  const cas: [string, string, number, "payer" | "abandonner" | "annuler"][] = [
    ["Lise Morin", "danse_session", 1, "payer"],
    ["Gilles Boucher", "danse_session", 2, "payer"],
    ["Francine Lagrange", "danse_mois", 1, "payer"],
    ["Roger Dupuis", "danse_mois", 2, "payer"],
    ["Carole Pelchat", "danse_saison", 1, "payer"],
    ["Yvon Mercier", "danse_saison", 2, "payer"],
    ["Diane Lachance", "danse_session", 4, "payer"],
    ["Michel Rodrigue", "danse_mois", 1, "abandonner"],
    ["Hélène Busque", "danse_session", 3, "annuler"],
  ];
  for (const [qui, forfait, personnes, suite] of cas) {
    const p = P(qui);
    const courriel = adresse(p.prenom, p.nom);
    const etiquette = `Danse · ${qui} · ${forfait.replace("danse_", "")} × ${personnes}`;
    if (!noter(`${etiquette} : inscription`, await inscrireDanse(form({ forfait, nom: qui, courriel, telephone: telephone(), personnes })))) continue;
    const { id } = await idPar("inscriptions_danse", courriel);
    if (suite === "abandonner") {
      const { data: pay } = await sb().from("paiements").select("stripe_session_id").eq("objet_id", id).single();
      const session = await stripe().checkout.sessions.expire(pay!.stripe_session_id!);
      await expirerSession(session);
      noter(`${etiquette} : session Stripe expirée (abandon)`, { ok: true });
      continue;
    }
    await payer("danse", id, `${etiquette} : paiement`);
    if (suite === "annuler") noter(`${etiquette} : annulation sans frais`, await annulerEtRembourser(form({ type: "danse", id, frais: 0, par: "client", aviser: "oui" })));
  }
}

async function remisage() {
  // [personne, type, modèle, unité, longueur, largeur, hauteur, entrée, suite, dépôt $]
  const cas: [string, string, string, "pieds" | "metres", number, number, number, string, "payer" | "approuver" | "attendre" | "refuser" | "annuler-frais", number][] = [
    ["Réal Poulin", "Roulotte", "Jayco Jay Flight 28BHS", "pieds", 32, 8, 11, "Mi-octobre", "payer", 150],
    ["Ginette Bernard", "VR (motorisé)", "Winnebago Minnie Winnie", "pieds", 26, 8.5, 11.5, "Fin octobre", "payer", 100],
    ["André Giroux", "Bateau", "Princecraft Vectra 21", "pieds", 23, 8.5, 7, "Début novembre", "payer", 100],
    ["Lucie Gagnon", "Auto", "Ford Mustang 1967", "pieds", 15, 6, 4.5, "Mi-octobre", "payer", 100],
    ["Bruno Lapointe", "Roulotte à sellette", "Montana 3855BR", "metres", 12.2, 2.6, 4, "Mi-octobre", "payer", 300],
    ["Josée Veilleux", "Moto ou Spyder", "Can-Am Spyder RT", "pieds", 9, 5, 5, "Novembre", "approuver", 100],
    ["Claude Roy", "Pick-up", "Ford F-150", "pieds", 19, 7, 6.5, "Novembre", "approuver", 100],
    ["Marcel Boucher", "Roulotte", "Coachmen Catalina", "pieds", 30, 8, 11, "Mi-octobre", "attendre", 0],
    ["Sandra Plante", "Bateau", "Ponton Legend", "pieds", 24, 8.5, 9, "Fin octobre", "attendre", 0],
    ["Normand Fortier", "Autobus converti", "Bluebird", "pieds", 45, 8.5, 12.5, "Mi-octobre", "refuser", 0],
    ["Paul Cliche", "Roulotte", "Keystone Hideout", "pieds", 28, 8, 10.5, "Mi-octobre", "annuler-frais", 100],
  ];
  const { data: tarif } = await sb().from("prix").select("montant_cents").eq("cle", "remisage_pied").single();
  for (const [qui, type, modele, unite, longueur, largeur, hauteur, entree, suite, depot] of cas) {
    const p = P(qui);
    const courriel = adresse(p.prenom, p.nom);
    const etiquette = `Remisage · ${qui} · ${type} ${longueur} ${unite === "metres" ? "m" : "pi"}`;
    if (!noter(`${etiquette} : demande`, await demanderRemisage(form({ type, modele, unite, longueur, largeur, hauteur, entree, nom: qui, courriel, telephone: telephone(), message: "" })))) continue;
    const { id, jeton_paiement } = await idPar("demandes_remisage", courriel);
    if (suite === "attendre") continue;
    if (suite === "refuser") { noter(`${etiquette} : refus`, await refuserDemande(form({ type: "remisage", id, raison: "Trop long pour nos portes (45 pi).", aviser: "oui" }))); continue; }
    // Prix de la saison = longueur en pieds (enregistrée par l'app) × tarif au pied
    const { data: d } = await sb().from("demandes_remisage").select("longueur_pi").eq("id", id).single();
    const total = Math.round(Number(d!.longueur_pi) * (tarif!.montant_cents / 100) * 100) / 100;
    if (!noter(`${etiquette} : approbation (${d!.longueur_pi} pi × ${tarif!.montant_cents / 100} $ = ${total} $, dépôt ${depot} $)`, await approuverRemisage(form({ id, total, depot, notes: "" })))) continue;
    if (suite === "approuver") continue;
    const a = await trouverAPayer(jeton_paiement!);
    if (!a) { noter(`${etiquette} : lien de dépôt`, { ok: false, erreur: "rien à payer derrière le lien" }); continue; }
    await creerSessionPaiement({ type: a.type, objetId: a.id, libelle: a.libelle, description: a.description, montantCents: a.montant, courriel: a.courriel, retourAnnulation: `/payer/${jeton_paiement}`, expireMinutes: 60 });
    await payer("remisage", id, `${etiquette} : dépôt payé`);
    if (suite === "annuler-frais") noter(`${etiquette} : annulation, 25 $ de frais`, await annulerEtRembourser(form({ type: "remisage", id, frais: 25, par: "client", aviser: "oui" })));
  }
  // Cas limite : dépôt sous le minimum, refusé par l'app
  const courriel = adresse("Test", "Depotmin");
  await demanderRemisage(form({ type: "Auto", modele: "", unite: "pieds", longueur: 14, largeur: 6, hauteur: 5, entree: "", nom: "Test Dépôt Minimum", courriel, telephone: telephone(), message: "" }));
  const { id } = await idPar("demandes_remisage", courriel);
  const r = await approuverRemisage(form({ id, total: 210, depot: 50, notes: "" }));
  noter("Remisage · dépôt de 50 $ (sous le minimum de 100 $) : doit être refusé", { ok: !r.ok, message: r.ok ? "ACCEPTÉ À TORT" : `refusé : ${(r as { erreur: string }).erreur}` });
  await refuserDemande(form({ type: "remisage", id, raison: "Test", aviser: "non" }));
}

async function messages() {
  const cas: [string, "contact" | "exposants", string, string, boolean][] = [
    ["Johanne Thibodeau", "contact", "Information générale", "Est-ce que les chiens sont permis sur le site pendant l'Expo?", true],
    ["Robert Lachance", "contact", "Location de salle", "Est-ce que le palais des commerces a une cuisine pour un traiteur?", false],
    ["Ferme Laitière Vachon", "exposants", "Kiosque intérieur", "On aimerait exposer nos produits laitiers en 2027.", false],
    ["Nicole Doyon", "contact", "Bénévolat", "Je voudrais être bénévole à l'accueil cet été.", true],
  ];
  for (const [qui, formulaire, sujet, message, traite] of cas) {
    const p = P(qui);
    const courriel = adresse(p.prenom, p.nom);
    const r = await envoyerMessage(form({ formulaire, nom: qui, courriel, telephone: telephone(), sujet, emplacement: sujet, entreprise: formulaire === "exposants" ? qui : undefined, message }));
    noter(`Message ${formulaire} · ${qui}`, r);
    if (traite) {
      const { data } = await sb().from("messages").select("id").eq("courriel", courriel).single();
      noter(`Message ${qui} : marqué traité`, await marquerMessage(form({ id: data!.id, traite: "oui" })));
    }
  }
}

// ---------------------------------------------------------------- routes
export async function POST() {
  if (interdit()) return new NextResponse(null, { status: 404 });
  journal.length = 0;
  const debut = Date.now();
  const { count } = await sb().from("paiements").select("id", { count: "exact", head: true }).like("courriel", `%@${DOMAINE}`);
  if (count) return NextResponse.json({ erreur: "Un échantillon existe déjà. Effacez-le d'abord (DELETE)." }, { status: 409 });
  for (const [nom, f] of [["salles", salles], ["kiosques intérieurs", kiosquesInterieurs], ["kiosques extérieurs", kiosquesExterieurs], ["danse", danse], ["remisage", remisage], ["messages", messages]] as const) {
    try { await f(); } catch (e) { journal.push({ etape: `${nom} : ERREUR`, ok: false, detail: e instanceof Error ? e.message : String(e) }); }
  }
  return NextResponse.json({ secondes: Math.round((Date.now() - debut) / 1000), etapes: journal.length, echecs: journal.filter((l) => !l.ok), journal });
}

export async function DELETE() {
  if (interdit()) return new NextResponse(null, { status: 404 });
  const s = sb();
  const motif = `%@${DOMAINE}`;
  const { data: resas } = await s.from("reservations_salle").select("creneau_id").like("courriel", motif);
  // Début de l'échantillon : les avis envoyés à l'admin pendant sa création n'ont pas tous l'adresse du client
  const premiers = await Promise.all(["paiements", "demandes_kiosque", "demandes_remisage", "messages"].map((t) =>
    s.from(t).select("cree_le").like("courriel", motif).order("cree_le").limit(1).maybeSingle()));
  const debut = premiers.map((r) => r.data?.cree_le as string | undefined).filter(Boolean).sort()[0];
  const compte: Record<string, number> = {};
  const effacer = async (table: string, colonne: string) => {
    const { data } = await s.from(table).delete().like(colonne, motif).select("id");
    compte[table] = data?.length ?? 0;
  };
  await effacer("paiements", "courriel");
  await effacer("reservations_salle", "courriel");
  await effacer("demandes_kiosque", "courriel");
  await effacer("inscriptions_danse", "courriel");
  await effacer("demandes_remisage", "courriel");
  await effacer("messages", "courriel");
  await effacer("courriels_sortants", "destinataire");
  const { data: admin } = await s.from("courriels_sortants").delete().like("texte", `%@${DOMAINE}%`).select("id");
  compte.courriels_admin = admin?.length ?? 0;
  if (debut) {
    // Seuls les avis « paiement reçu » n'ont pas l'adresse du client; on ne touche à rien d'autre
    // (l'adresse de l'admin peut aussi être celle d'un vrai client).
    const { data: avis } = await s.from("courriels_sortants").delete().eq("destinataire", env.courrielAdmin).eq("gabarit", "paiement_admin")
      .gte("cree_le", debut).not("texte", "like", "%@%").select("id");
    compte.courriels_admin += avis?.length ?? 0;
  }
  const ids = [...new Set((resas ?? []).map((r) => r.creneau_id))];
  if (ids.length) await s.from("creneaux_salle").update({ statut: "ouvert", retenu_jusqua: null }).in("id", ids);
  compte.creneaux_rouverts = ids.length;
  return NextResponse.json({ efface: compte, note: "Les paiements de test restent visibles dans le tableau de bord Stripe (mode test)." });
}
