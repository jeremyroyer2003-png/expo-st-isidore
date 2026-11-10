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
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
