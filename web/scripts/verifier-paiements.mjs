// Vérifie que la base et Stripe disent la même chose, et que chaque réservation est cohérente.
// Usage (dans web/) : npm run verifier-paiements
// Lit .env.local. Ne modifie rien : lecture seule, dans la base comme dans Stripe (mode test).
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
  console.error("Clé Stripe de test requise.");
  process.exit(1);
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const $ = (c) => `${(c / 100).toFixed(2).replace(".", ",")} $`;

const problemes = [];
const pb = (quoi, detail) => problemes.push(`${quoi} : ${detail}`);
const tout = async (table, colonnes = "*") => (await sb.from(table).select(colonnes)).data ?? [];

const [paiements, salles, creneaux, kiosques, danse, remisage, prix, courriels] = await Promise.all([
  tout("paiements"), tout("reservations_salle"), tout("creneaux_salle", "id, statut"), tout("demandes_kiosque"),
  tout("inscriptions_danse"), tout("demandes_remisage"), tout("prix"), tout("courriels_sortants", "destinataire, gabarit, sujet"),
]);
const prixDe = Object.fromEntries(prix.map((p) => [p.cle, p.montant_cents]));
const creneauDe = Object.fromEntries(creneaux.map((c) => [c.id, c]));

// ---------------------------------------------------------------- 1. Chaque paiement contre Stripe
let brut = 0, rembourse = 0, frais = 0;
const parType = {};
for (const p of paiements) {
  const nom = `Paiement ${p.objet_type} ${p.courriel} (${p.statut})`;
  if (!["paye", "rembourse", "rembourse_partiel"].includes(p.statut)) continue;
  let recu = 0, remb = 0;
  if (p.stripe_payment_intent) {
    const pi = await stripe.paymentIntents.retrieve(p.stripe_payment_intent, { expand: ["latest_charge"] });
    recu = pi.amount_received;
    remb = pi.latest_charge?.amount_refunded ?? 0;
  } else if (p.stripe_facture_id) {
    const f = await stripe.invoices.retrieve(p.stripe_facture_id);
    recu = f.amount_paid;
    const liste = await stripe.invoicePayments.list({ invoice: f.id, limit: 1 });
    const piId = liste.data[0]?.payment?.payment_intent;
    if (piId) {
      const pi = await stripe.paymentIntents.retrieve(typeof piId === "string" ? piId : piId.id, { expand: ["latest_charge"] });
      remb = pi.latest_charge?.amount_refunded ?? 0;
    }
  } else { pb(nom, "aucun identifiant Stripe"); continue; }
  if (recu !== p.montant_cents) pb(nom, `base ${$(p.montant_cents)} ≠ Stripe a reçu ${$(recu)}`);
  if (remb !== p.rembourse_cents) pb(nom, `remboursé : base ${$(p.rembourse_cents)} ≠ Stripe ${$(remb)}`);
  if (p.rembourse_cents + p.frais_annulation_cents > p.montant_cents) pb(nom, "remboursé + frais dépassent le montant payé");
  if (p.statut === "paye" && p.rembourse_cents) pb(nom, "statut « payé » mais un remboursement existe");
  if (p.statut === "rembourse" && p.rembourse_cents !== p.montant_cents) pb(nom, "statut « remboursé » mais pas au complet");
  if (p.statut === "rembourse_partiel" && p.rembourse_cents + p.frais_annulation_cents !== p.montant_cents) pb(nom, "remboursement partiel + frais ≠ montant payé");
  brut += recu; rembourse += remb; frais += p.frais_annulation_cents;
  const t = (parType[p.objet_type] ??= { n: 0, brut: 0, rembourse: 0 });
  t.n++; t.brut += recu; t.rembourse += remb;
}

// ---------------------------------------------------------------- 2. Cohérence des réservations
const paiementsDe = (type, id) => paiements.filter((p) => p.objet_type === type && p.objet_id === id);
const payeOk = (l) => l.some((p) => p.statut === "paye");
const rembOk = (l) => l.some((p) => p.statut.startsWith("rembourse"));
const envoye = (a, gabarit) => courriels.some((c) => c.destinataire === a && c.gabarit === gabarit);

for (const r of salles) {
  const l = paiementsDe("salle", r.id), c = creneauDe[r.creneau_id];
  const nom = `Salle ${r.nom}`;
  if (r.statut === "confirmee") {
    if (!payeOk(l)) pb(nom, "confirmée sans paiement payé");
    if (c?.statut !== "reserve") pb(nom, `confirmée mais le créneau est « ${c?.statut} »`);
    if (l[0]?.montant_cents !== r.montant_cents) pb(nom, "montant de la réservation ≠ montant payé");
    if (!envoye(r.courriel, "salle_confirmee")) pb(nom, "courriel de confirmation manquant");
  }
  if (r.statut === "annulee") {
    if (l.length && !rembOk(l)) pb(nom, "annulée mais pas remboursée");
    if (c?.statut === "reserve") pb(nom, "annulée mais la date est encore réservée");
  }
  if (r.statut === "expiree" && c?.statut === "reserve" && !salles.some((x) => x.creneau_id === r.creneau_id && x.statut === "confirmee")) pb(nom, "expirée mais la date est restée bloquée");
}
for (const d of kiosques) {
  const l = paiementsDe("kiosque", d.id);
  const nom = `Kiosque ${d.type} ${d.entreprise}`;
  if (d.statut === "confirmee") {
    if (!payeOk(l)) pb(nom, "confirmé sans paiement payé");
    if (l[0]?.montant_cents !== d.montant_cents) pb(nom, `montant convenu ${$(d.montant_cents)} ≠ payé ${$(l[0]?.montant_cents ?? 0)}`);
    if (!envoye(d.courriel, "kiosque_confirme")) pb(nom, "courriel de confirmation manquant");
  }
  if (d.statut === "approuvee" && !envoye(d.courriel, "kiosque_approuve")) pb(nom, "approuvé mais le lien de paiement n'est pas parti");
  if (d.statut === "facturee" && !d.url_facture) pb(nom, "facturé sans lien de facture");
  if (d.statut === "annulee" && l.length && !rembOk(l)) pb(nom, "annulé mais pas remboursé");
}
const emplacementsPris = kiosques.filter((d) => d.emplacement_id && ["approuvee", "confirmee"].includes(d.statut)).map((d) => `${d.annee}-${d.emplacement_id}`);
if (new Set(emplacementsPris).size !== emplacementsPris.length) pb("Plan des kiosques", "un emplacement est attribué deux fois");
for (const i of danse) {
  const l = paiementsDe("danse", i.id);
  const nom = `Danse ${i.nom}`;
  if (i.montant_cents !== prixDe[i.cle_prix] * i.personnes) pb(nom, `montant ${$(i.montant_cents)} ≠ ${$(prixDe[i.cle_prix])} × ${i.personnes}`);
  if (i.statut === "payee" && !payeOk(l)) pb(nom, "payée sans paiement");
  if (i.statut === "payee" && !envoye(i.courriel, "danse_confirmee")) pb(nom, "reçu manquant");
}
for (const d of remisage) {
  const l = paiementsDe("remisage", d.id);
  const nom = `Remisage ${d.nom}`;
  if (["approuvee", "depot_paye"].includes(d.statut)) {
    if (d.depot_cents < prixDe.remisage_depot_min) pb(nom, `dépôt ${$(d.depot_cents)} sous le minimum`);
    if (d.depot_cents > d.prix_total_cents) pb(nom, "dépôt plus grand que le prix de la saison");
  }
  if (d.statut === "depot_paye") {
    if (!payeOk(l)) pb(nom, "dépôt payé sans paiement");
    if (l[0]?.montant_cents !== d.depot_cents) pb(nom, "montant payé ≠ dépôt demandé");
    if (!envoye(d.courriel, "remisage_depot_paye")) pb(nom, "confirmation du dépôt manquante");
  }
}

// ---------------------------------------------------------------- 3. Rapport
const compter = (l, cle = "statut") => l.reduce((a, x) => ((a[x[cle]] = (a[x[cle]] ?? 0) + 1), a), {});
console.log("\n=== Réservations par statut ===");
console.log("Salles     ", compter(salles));
console.log("Kiosques   ", compter(kiosques.map((k) => ({ statut: `${k.type}:${k.statut}` }))));
console.log("Danse      ", compter(danse));
console.log("Remisage   ", compter(remisage));
console.log("Paiements  ", compter(paiements));
console.log("\n=== Argent (vérifié dans Stripe) ===");
for (const [t, v] of Object.entries(parType)) console.log(`${t.padEnd(9)} ${String(v.n).padStart(3)} paiements · encaissé ${$(v.brut).padStart(12)} · remboursé ${$(v.rembourse).padStart(11)} · net ${$(v.brut - v.rembourse).padStart(12)}`);
console.log(`TOTAL     encaissé ${$(brut)} · remboursé ${$(rembourse)} · frais d'annulation gardés ${$(frais)} · NET ${$(brut - rembourse)}`);
console.log(`\n=== Courriels : ${courriels.length} dans la boîte d'envoi ===`);
console.log(compter(courriels, "gabarit"));
console.log(problemes.length ? `\n=== ${problemes.length} PROBLÈME(S) ===\n- ${problemes.join("\n- ")}` : "\n=== Aucun problème : la base et Stripe concordent. ===");
process.exit(problemes.length ? 1 : 0);
