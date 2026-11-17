"use client";

import Link from "next/link";
import { PERIODES, type Option } from "@/lib/filtres";

const selectCls = "min-h-[40px] border-2 border-encre bg-white px-2 text-[15px] text-encre";
const etiquetteCls = "block font-etiquette font-bold text-[13px] uppercase tracking-wide text-gris-brun mb-0.5";

/**
 * Barre de filtres d'une liste admin : statut, période et tri, dans l'adresse de la page (lien partageable).
 * La liste se met à jour dès qu'un choix change; le bouton « Filtrer » sert si JavaScript est bloqué.
 */
export default function Filtres({
  statuts, statut, periode, tri, tris, libellePeriode, raccourcis = [], caches = {}, total, autres,
}: {
  statuts: Option[];
  statut: string;
  periode: string;
  tri: string;
  tris: Option[];
  /** Sur quelle date porte la période (« Reçue », « Dernière activité »…). */
  libellePeriode: string;
  /** Vues toutes prêtes : [texte, adresse]. */
  raccourcis?: Option[];
  /** Autres paramètres de l'adresse à garder (ex. onglet). */
  caches?: Record<string, string>;
  total: number;
  /** Boutons à droite (export). */
  autres?: React.ReactNode;
}) {
  return (
    <div className="mb-4 grid gap-3 print:hidden">
      <form method="get" className="flex flex-wrap items-end gap-3" onChange={(e) => e.currentTarget.requestSubmit()}>
        {Object.entries(caches).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
        <label><span className={etiquetteCls}>Statut</span>
          <select name="statut" defaultValue={statut} className={selectCls}>{statuts.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select>
        </label>
        <label><span className={etiquetteCls}>{libellePeriode}</span>
          <select name="periode" defaultValue={periode} className={selectCls}>{PERIODES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select>
        </label>
        <label><span className={etiquetteCls}>Trier par</span>
          <select name="tri" defaultValue={tri} className={selectCls}>{tris.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select>
        </label>
        <noscript><button type="submit" className="min-h-[40px] px-3 border-2 border-encre bg-moutarde font-etiquette font-bold uppercase text-[14px]">Filtrer</button></noscript>
        <Link href={"?" + new URLSearchParams(caches).toString()} className="min-h-[40px] inline-flex items-center px-2 text-[14px] underline">Effacer les filtres</Link>
        <span className="ml-auto flex flex-wrap items-center gap-2">{autres}</span>
      </form>
      <div className="flex flex-wrap items-center gap-2 text-[14px]">
        <span role="status" className="font-semibold">{total} résultat{total > 1 ? "s" : ""}</span>
        {raccourcis.map(([texte, href]) => (
          <Link key={href} href={href} className="min-h-[36px] inline-flex items-center px-2.5 border-2 border-encre/40 bg-[#FBF6EC] text-encre no-underline font-etiquette font-bold hover:bg-kraft">{texte}</Link>
        ))}
      </div>
    </div>
  );
}
