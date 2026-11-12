// Briques visuelles de l'admin (composants serveur).
import Link from "next/link";

export function Titre({ children, sous }: { children: React.ReactNode; sous?: React.ReactNode }) {
  return (
    <header className="mb-6">
      <h1 className="font-affiche text-[30px] sm:text-[36px] leading-tight text-encre">{children}</h1>
      {sous && <p className="mt-1 text-[17px] text-gris-brun max-w-[70ch]">{sous}</p>}
    </header>
  );
}

export function Carte({ titre, children, className = "", action }: { titre?: React.ReactNode; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <section className={`min-w-0 bg-[#FBF6EC] border-[3px] border-encre shadow-affiche-sm p-4 sm:p-5 ${className}`}>
      {(titre || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {titre && <h2 className="font-etiquette font-extrabold text-[21px] text-encre">{titre}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Chiffre({ valeur, libelle, href, ton = "creme" }: { valeur: React.ReactNode; libelle: string; href?: string; ton?: "creme" | "moutarde" | "rouge" | "olive" | "jean" }) {
  const fonds = { creme: "bg-[#FBF6EC] text-encre", moutarde: "bg-moutarde text-encre", rouge: "bg-rouge text-creme", olive: "bg-olive text-encre", jean: "bg-jean text-encre" };
  const corps = (
    <>
      <span className="block font-affiche text-[38px] leading-none">{valeur}</span>
      <span className="block mt-2 font-etiquette font-bold uppercase tracking-wide text-[15px]">{libelle}</span>
    </>
  );
  const cls = `block border-[3px] border-encre shadow-affiche-sm p-4 ${fonds[ton]} transition-transform`;
  return href ? <Link href={href} className={`${cls} hover:-translate-y-0.5 no-underline`}>{corps}</Link> : <div className={cls}>{corps}</div>;
}

const STATUTS: Record<string, [string, string]> = {
  en_attente: ["En attente", "bg-moutarde text-encre"],
  en_paiement: ["Paiement en cours", "bg-kraft text-encre"],
  approuvee: ["Approuvée, à payer", "bg-jean text-encre"],
  entente: ["Entente notée", "bg-jean text-encre"],
  facturee: ["Facturée", "bg-jean text-encre"],
  confirmee: ["Confirmée", "bg-olive text-encre"],
  payee: ["Payée", "bg-olive text-encre"],
  depot_paye: ["Dépôt payé", "bg-olive text-encre"],
  paye: ["Payé", "bg-olive text-encre"],
  refusee: ["Refusée", "bg-encre text-creme"],
  annulee: ["Annulée", "bg-encre text-creme"],
  expiree: ["Expirée", "bg-kraft text-gris-brun"],
  expire: ["Expiré", "bg-kraft text-gris-brun"],
  rembourse: ["Remboursé", "bg-rouille text-encre"],
  rembourse_partiel: ["Remboursé en partie", "bg-rouille text-encre"],
  ouvert: ["Ouvert", "bg-moutarde text-encre"],
  retenu: ["Retenu (paiement)", "bg-kraft text-encre"],
  reserve: ["Réservé", "bg-olive text-encre"],
  verrouille: ["Verrouillé", "bg-encre text-creme"],
  journalise: ["Simulé", "bg-kraft text-encre"],
  envoye: ["Envoyé", "bg-olive text-encre"],
  echec: ["Échec", "bg-rouge text-creme"],
};

export function Statut({ s }: { s: string }) {
  const [texte, cls] = STATUTS[s] ?? [s, "bg-kraft text-encre"];
  return <span className={`inline-block whitespace-nowrap border-2 border-encre px-2 py-0.5 font-etiquette font-bold text-[14px] ${cls}`}>{texte}</span>;
}

export function Tableau({ entetes, children, vide }: { entetes: string[]; children: React.ReactNode; vide?: boolean }) {
  return (
    <div className="overflow-x-auto border-[3px] border-encre bg-[#FBF6EC]">
      <table className="w-full text-[15px] border-collapse">
        <thead className="bg-planche text-creme">
          <tr>{entetes.map((e) => <th key={e} scope="col" className="text-left font-etiquette font-bold uppercase tracking-wide text-[14px] px-3 py-2 whitespace-nowrap">{e}</th>)}</tr>
        </thead>
        <tbody className="[&>tr]:border-t-2 [&>tr]:border-encre/15 [&>tr:hover]:bg-kraft/40 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top">
          {children}
        </tbody>
      </table>
      {vide && <p className="p-4 text-gris-brun">Rien pour l&apos;instant.</p>}
    </div>
  );
}

export function LectureSeule() {
  return <p className="mb-4 border-2 border-dashed border-encre/50 px-3 py-2 text-[15px] text-gris-brun">Vous êtes en <strong>lecture seule</strong> : les boutons de modification sont cachés, et la base refuse toute écriture.</p>;
}

export const champCls = "w-full min-h-[40px] border-2 border-encre bg-white px-2 py-1 text-[15px] text-encre";
export const etiquetteCls = "block font-etiquette font-bold text-[14px] uppercase tracking-wide text-gris-brun mb-1";
