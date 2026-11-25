import type { Metadata, Viewport } from "next";
import "./globals.css";

const URL_SITE = process.env.NEXT_PUBLIC_URL_SITE || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: "Expo St-Isidore – Exposition agricole gratuite en Beauce depuis 1982",
    template: "%s | Expo St-Isidore",
  },
  description:
    "Expo agricole gratuite à Saint-Isidore, en Beauce : jugements d'animaux, tire de tracteurs, spectacles et activités familiales.",
  icons: { icon: "/images/favicon.png" },
  openGraph: {
    siteName: "Expo St-Isidore",
    locale: "fr_CA",
    type: "website",
    images: [{ url: "/images/partage/index.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  // Site d'essai : pas d'indexation tant que PERMETTRE_INDEXATION n'est pas « true » (voir lib/referencement.ts)
  robots: process.env.PERMETTRE_INDEXATION === "true" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#F3EAD8" };

// Saison : hiver du 15 octobre au 14 mai (remisage en avant), été le reste de l'année (Expo).
// Exécuté avant l'affichage pour éviter un saut de contenu.
// Fond d'écran du site public : la peinture par défaut (?fond=photo ou ?fond=0 pour changer, gardé dans le navigateur).
const SCRIPT_SAISON = `(function(){var h=document.documentElement;h.classList.add('js');var d=new Date(),m=d.getMonth()+1,j=d.getDate();var hiver=m>10||m<5||(m===10&&j>=15)||(m===5&&j<15);var q=/[?&]saison=(ete|hiver)/.exec(location.search);if(q)hiver=q[1]==='hiver';h.classList.add(hiver?'saison-hiver':'saison-ete');if(location.pathname.indexOf('/admin')!==0){var f='peinture';try{var u=/[?&]fond=([a-z0-9]+)/.exec(location.search);if(u)localStorage.setItem('essai-fond',u[1]);f=localStorage.getItem('essai-fond')||'peinture';}catch(e){}if(f==='photo'||f==='peinture')h.classList.add('fond-'+f);}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_SAISON }} />
        <link rel="preload" href="/fonts/alfa-slab-one-latin-400.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/barlow-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="font-corps">{children}</body>
    </html>
  );
}
