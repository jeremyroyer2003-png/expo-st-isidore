import type { NextConfig } from "next";

// Cache Components désactivé : les pages admin et les flux de réservation lisent les cookies
// de session à chaque requête; le modèle classique (rendu dynamique automatique) est plus simple ici.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Téléversement de photos dans la médiathèque (8 Mo au plus, plus l'enveloppe du formulaire)
  experimental: {
    serverActions: { bodySizeLimit: "9mb" },
  },
  // L'essai /accueil-v2 est devenu l'accueil (11 novembre 2026)
  async redirects() {
    return [{ source: "/accueil-v2", destination: "/", permanent: true }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
