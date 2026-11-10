import Entete from "@/components/site/Entete";
import Pied from "@/components/site/Pied";
import Revele from "@/components/site/Revele";

export default function LayoutPublic({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="lien-evitement" href="#contenu">Aller au contenu</a>
      <div className="cadre">
        <div className="page">
          <Entete />
          <main id="contenu">{children}</main>
          <Pied />
        </div>
      </div>
      <Revele />
    </>
  );
}
