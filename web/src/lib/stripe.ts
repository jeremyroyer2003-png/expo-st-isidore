import Stripe from "stripe";
import { env } from "@/lib/env";

let instance: Stripe | null = null;

/** Client Stripe en MODE TEST seulement (env.stripeSecret refuse toute clé réelle). */
export function stripe(): Stripe {
  if (!instance) instance = new Stripe(env.stripeSecret, { maxNetworkRetries: 2 });
  return instance;
}

export type ObjetPaiement = "salle" | "kiosque" | "danse" | "remisage";

/** Crée une session Stripe Checkout et note le paiement « en attente ». */
export async function creerSessionPaiement(o: {
  type: ObjetPaiement;
  objetId: string;
  libelle: string;
  description?: string;
  montantCents: number;
  quantite?: number;
  courriel: string;
  retourAnnulation: string;
  expireMinutes?: number;
}) {
  const { supabaseService } = await import("@/lib/supabase/serveur");
  const quantite = o.quantite ?? 1;
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    locale: "fr-CA",
    customer_email: o.courriel,
    line_items: [
      {
        quantity: quantite,
        price_data: {
          currency: "cad",
          unit_amount: o.montantCents,
          product_data: { name: o.libelle, ...(o.description ? { description: o.description } : {}) },
        },
      },
    ],
    // Stripe impose au moins 30 minutes
    expires_at: Math.floor(Date.now() / 1000) + 60 * Math.max(30, o.expireMinutes ?? 30),
    metadata: { objet_type: o.type, objet_id: o.objetId },
    // receipt_email : Stripe envoie aussi son reçu de carte officiel (en mode réel)
    payment_intent_data: { receipt_email: o.courriel, metadata: { objet_type: o.type, objet_id: o.objetId } },
    success_url: `${env.urlSite}/paiement/merci?session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.urlSite}${o.retourAnnulation}`,
  });
  await supabaseService().from("paiements").insert({
    objet_type: o.type,
    objet_id: o.objetId,
    stripe_session_id: session.id,
    montant_cents: o.montantCents * quantite,
    courriel: o.courriel,
  });
  return session.url!;
}
