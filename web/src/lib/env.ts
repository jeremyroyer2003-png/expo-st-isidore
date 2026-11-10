
// Lecture paresseuse des variables d'environnement : le build passe même sans .env.local,
// et une variable manquante donne un message clair au moment où on en a besoin.
function requise(nom: string): string {
  const v = process.env[nom];
  if (!v) throw new Error(`Variable d'environnement manquante : ${nom} (voir .env.example)`);
  return v;
}

export const env = {
  get supabaseUrl() { return requise("NEXT_PUBLIC_SUPABASE_URL"); },
  get supabaseAnon() { return requise("NEXT_PUBLIC_SUPABASE_ANON_KEY"); },
  get supabaseService() { return requise("SUPABASE_SERVICE_ROLE_KEY"); },
  get stripeSecret() {
    const k = requise("STRIPE_SECRET_KEY");
    // Garde-fou : ce projet ne fonctionne qu'en mode test tant que le comité n'a pas approuvé
    if (!k.startsWith("sk_test_") && !k.startsWith("rk_test_")) {
      throw new Error("STRIPE_SECRET_KEY doit être une clé de TEST (sk_test_…). Les clés réelles sont refusées.");
    }
    return k;
  },
  get stripeWebhookSecret() { return process.env.STRIPE_WEBHOOK_SECRET || ""; },
  get urlSite() { return process.env.NEXT_PUBLIC_URL_SITE || "http://localhost:3000"; },
  get courrielFournisseur() { return (process.env.COURRIEL_FOURNISSEUR || "console") as "console" | "resend"; },
  get courrielExpediteur() { return process.env.COURRIEL_EXPEDITEUR || "Expo St-Isidore <info@expobassinchaudiere.com>"; },
  get courrielAdmin() { return process.env.COURRIEL_ADMIN || "info@expobassinchaudiere.com"; },
  get resendCle() { return requise("RESEND_API_KEY"); },
  // Prix fictifs (a_confirmer) montrés au public pour tester le paiement en local seulement
  get afficherPrixFictifs() {
    return process.env.AFFICHER_PRIX_FICTIFS === "true" && process.env.NODE_ENV !== "production";
  },
};

export function supabaseConfigure(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
