// Feuilles du site statique : chargées seulement pour les pages publiques (pas dans l'admin)
import "@/styles/base-statique/site.css";
import "@/styles/base-statique/composants.css";
import "@/styles/base-statique/pages.css";
import "@/styles/base-statique/remisage.css";
import "@/styles/base-statique/theme-grange.css";
import "@/styles/ajouts.css";
import Entete from "@/components/site/Entete";
import Pied from "@/components/site/Pied";
import Revele from "@/components/site/Revele";
import EssaiFond from "@/components/site/EssaiFond";

export default function LayoutPublic({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="lien-evitement" href="#contenu">Aller au contenu</a>
      <svg className="sprite" aria-hidden="true">
        <symbol id="separateur" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" /></symbol>
      </svg>
      <div className="cadre">
        <div className="page">
          <Entete />
          <main id="contenu">{children}</main>
          <Pied />
        </div>
      </div>
      <Revele />
      <EssaiFond />
    </>
  );
}
