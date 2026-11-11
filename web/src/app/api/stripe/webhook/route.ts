import { env } from "@/lib/env";
import { expirerSession, factureePayee, finaliserSession } from "@/lib/paiements";
import { stripe } from "@/lib/stripe";

// Webhook Stripe (mode test). En local : `stripe listen --forward-to localhost:3000/api/stripe/webhook`
// puis mettre le secret affiché dans STRIPE_WEBHOOK_SECRET. Sans webhook, /paiement/merci confirme quand même.
export async function POST(request: Request) {
  const secret = env.stripeWebhookSecret;
  if (!secret) return new Response("Webhook non configuré", { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Signature manquante", { status: 400 });

  let evenement;
  try {
    evenement = await stripe().webhooks.constructEventAsync(await request.text(), signature, secret);
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }

  try {
    switch (evenement.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await finaliserSession(evenement.data.object.id);
        break;
      case "checkout.session.expired":
        await expirerSession(evenement.data.object);
        break;
      case "checkout.session.async_payment_failed":
        await expirerSession(evenement.data.object, "echec");
        break;
      case "invoice.paid":
        await factureePayee(evenement.data.object);
        break;
    }
  } catch (e) {
    console.error("[webhook]", evenement.type, e);
    // 500 : Stripe réessaiera plus tard (tout est idempotent)
    return new Response("Erreur", { status: 500 });
  }
  return Response.json({ recu: true });
}
