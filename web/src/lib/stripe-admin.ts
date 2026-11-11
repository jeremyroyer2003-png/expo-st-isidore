// Opérations Stripe déclenchées par l'admin : remboursement et facture. Mode test seulement.
import { stripe } from "@/lib/stripe";

/** Retrouve le PaymentIntent d'un paiement (session Checkout ou facture). */
async function intentDe(p: { stripe_payment_intent: string | null; stripe_facture_id: string | null }): Promise<string | null> {
  if (p.stripe_payment_intent) return p.stripe_payment_intent;
  if (p.stripe_facture_id) {
    const liste = await stripe().invoicePayments.list({ invoice: p.stripe_facture_id, limit: 1 });
    const pi = liste.data[0]?.payment?.payment_intent;
    return typeof pi === "string" ? pi : pi?.id ?? null;
  }
  return null;
}

/**
 * Rembourse un paiement en retenant les frais d'annulation.
 * Renvoie le montant réellement remboursé (0 si les frais couvrent tout).
 */
export async function rembourser(
  p: { id: string; montant_cents: number; rembourse_cents: number; stripe_payment_intent: string | null; stripe_facture_id: string | null },
  fraisCents: number,
): Promise<{ frais: number; rembourse: number }> {
  const disponible = p.montant_cents - p.rembourse_cents;
  const frais = Math.max(0, Math.min(fraisCents, disponible));
  const rembourse = disponible - frais;
  if (rembourse > 0) {
    const pi = await intentDe(p);
    if (!pi) throw new Error("Paiement Stripe introuvable : remboursez depuis le tableau de bord Stripe.");
    // Clé d'idempotence liée à l'état du paiement : un double clic, ou un nouvel essai après une
    // erreur de la base, renvoie le même remboursement au lieu d'en créer un deuxième.
    await stripe().refunds.create(
      { payment_intent: pi, amount: rembourse, reason: "requested_by_customer", metadata: { paiement_id: p.id } },
      { idempotencyKey: `remboursement-${p.id}-${p.rembourse_cents}-${rembourse}` },
    );
  }
  return { frais, rembourse };
}

/** Crée et finalise une facture Stripe (à payer en ligne) pour un kiosque extérieur. */
export async function creerFacture(o: { courriel: string; nom: string; entreprise: string; montantCents: number; description: string; demandeId: string }) {
  const s = stripe();
  // Un double clic sur « Envoyer la facture » ne crée qu'une seule facture (clés valides 24 h)
  const cle = `facture-${o.demandeId}-${o.montantCents}`;
  const client = await s.customers.create(
    { email: o.courriel, name: o.entreprise, metadata: { contact: o.nom } },
    { idempotencyKey: `${cle}-client` },
  );
  const facture = await s.invoices.create(
    {
      customer: client.id,
      collection_method: "send_invoice",
      days_until_due: 30,
      metadata: { objet_type: "kiosque", objet_id: o.demandeId },
    },
    { idempotencyKey: `${cle}-facture` },
  );
  await s.invoiceItems.create(
    { customer: client.id, invoice: facture.id, amount: o.montantCents, currency: "cad", description: o.description },
    { idempotencyKey: `${cle}-ligne` },
  );
  // La réponse idempotente peut dater d'avant la finalisation : on relit l'état réel
  const actuelle = await s.invoices.retrieve(facture.id!);
  const finale = actuelle.status === "draft" ? await s.invoices.finalizeInvoice(facture.id!) : actuelle;
  return { id: finale.id!, url: finale.hosted_invoice_url! };
}
