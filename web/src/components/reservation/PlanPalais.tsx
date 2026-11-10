"use client";

import Link from "next/link";
import { useState } from "react";
import FormulaireSimple from "@/components/formulaires/FormulaireSimple";
import { demanderKiosqueInterieur } from "@/actions/reservations";

export type EmplacementPublic = {
  id: string; code: string; x: number; y: number; largeur: number; hauteur: number;
  dimensions: string; occupe: boolean; prix: number | null;
};

const LARGEUR = 24;
const HAUTEUR = 14;
const argent = (c: number) =>
  new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", minimumFractionDigits: c % 100 ? 2 : 0 }).format(c / 100);

/** Plan cliquable du palais des commerces : on choisit un emplacement libre, puis on envoie la demande. */
export default function PlanPalais({ emplacements, annee, fictif }: { emplacements: EmplacementPublic[]; annee: number; fictif: boolean }) {
  const [choisi, setChoisi] = useState<string | null>(null);
  const [survol, setSurvol] = useState<string | null>(null);
  const e = emplacements.find((x) => x.id === choisi);
  const libres = emplacements.filter((x) => !x.occupe).length;

  const choisir = (id: string) => {
    setChoisi(id);
    setTimeout(() => document.getElementById("formulaire-kiosque")?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start",
    }), 50);
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
        <figure className="bg-creme cadre-affiche p-3 sm:p-5">
          <svg viewBox={`-1 -1 ${LARGEUR + 2} ${HAUTEUR + 3}`} className="w-full h-auto" role="group" aria-label={`Plan du palais des commerces : ${libres} emplacements libres`}>
            {/* Murs et porte */}
            <rect x={0} y={-0.5} width={LARGEUR} height={HAUTEUR + 1} fill="#E8D9BA" stroke="#1E140D" strokeWidth={0.18} />
            <rect x={10.2} y={HAUTEUR + 0.3} width={3.6} height={0.4} fill="#F3EAD8" />
            <text x={12} y={HAUTEUR + 1.7} textAnchor="middle" fontSize={0.62} fontWeight={700} fill="#1E140D" fontFamily="Barlow Condensed, sans-serif">ENTRÉE PRINCIPALE</text>
            {/* Allées */}
            <text x={12} y={3.5} textAnchor="middle" fontSize={0.5} fill="#5C4A39" fontFamily="Barlow Condensed, sans-serif" letterSpacing={0.1}>ALLÉE</text>
            <text x={12} y={10.9} textAnchor="middle" fontSize={0.5} fill="#5C4A39" fontFamily="Barlow Condensed, sans-serif" letterSpacing={0.1}>ALLÉE</text>
            {emplacements.map((k) => {
              const actif = k.id === choisi;
              const sur = k.id === survol;
              const fond = k.occupe ? "url(#hachures)" : actif ? "#8E2A1E" : sur ? "#C8622A" : "#D9A441";
              return (
                <g
                  key={k.id}
                  role="button"
                  tabIndex={k.occupe ? -1 : 0}
                  aria-disabled={k.occupe}
                  aria-pressed={actif}
                  aria-label={`Emplacement ${k.code}, ${k.dimensions}${k.occupe ? ", déjà attribué" : ", libre"}`}
                  onClick={() => !k.occupe && choisir(k.id)}
                  onKeyDown={(ev) => { if (!k.occupe && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); choisir(k.id); } }}
                  onMouseEnter={() => setSurvol(k.id)}
                  onMouseLeave={() => setSurvol(null)}
                  className={k.occupe ? "cursor-not-allowed" : "cursor-pointer focus:outline-none [&:focus-visible>rect]:stroke-[#6A97A3] [&:focus-visible>rect]:[stroke-width:.3]"}
                  style={{ transition: "transform .18s", transformOrigin: `${k.x + k.largeur / 2}px ${k.y + k.hauteur / 2}px`, transform: (sur || actif) && !k.occupe ? "scale(1.06)" : undefined }}
                >
                  <rect x={k.x + 0.08} y={k.y + 0.08} width={k.largeur - 0.16} height={k.hauteur - 0.16} fill={fond} stroke="#1E140D" strokeWidth={0.12} rx={0.1} />
                  <text x={k.x + k.largeur / 2} y={k.y + k.hauteur / 2 + 0.22} textAnchor="middle" fontSize={0.62} fontWeight={800}
                    fill={actif ? "#F3EAD8" : k.occupe ? "#5C4A39" : "#1E140D"} fontFamily="Barlow Condensed, sans-serif" pointerEvents="none">{k.code}</text>
                </g>
              );
            })}
            <defs>
              <pattern id="hachures" width={0.5} height={0.5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width={0.5} height={0.5} fill="#E8D9BA" />
                <line x1={0} y1={0} x2={0} y2={0.5} stroke="#5C4A39" strokeWidth={0.16} />
              </pattern>
            </defs>
          </svg>
          <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold text-encre">
            <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-encre bg-moutarde" aria-hidden="true" />Libre</span>
            <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-encre bg-[repeating-linear-gradient(45deg,#E8D9BA_0_3px,#5C4A39_3px_5px)]" aria-hidden="true" />Déjà attribué</span>
            <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-encre bg-rouge" aria-hidden="true" />Votre choix</span>
            <span className="text-gris-brun font-normal">Plan indicatif, Expo {annee}</span>
          </figcaption>
        </figure>

        <div className="grid gap-4">
          <div className="bg-planche text-creme border-[3px] border-encre shadow-affiche p-5">
            <p className="font-etiquette font-bold uppercase tracking-widest text-moutarde text-[15px]">Palais des commerces · {annee}</p>
            <p className="font-affiche text-[44px] leading-none mt-2">{libres}</p>
            <p className="font-etiquette font-bold text-[18px]">emplacement{libres > 1 ? "s" : ""} libre{libres > 1 ? "s" : ""} sur {emplacements.length}</p>
          </div>
          <ol className="grid gap-3 text-[17px] text-encre">
            <li><strong>1. Choisissez</strong> un emplacement libre (en jaune) sur le plan.</li>
            <li><strong>2. Envoyez</strong> votre demande : rien à payer pour l&apos;instant.</li>
            <li><strong>3. Le comité approuve</strong> et vous envoie le lien de paiement. L&apos;emplacement est à vous une fois payé.</li>
          </ol>
          {e && (
            <div className="anim-monter bg-creme cadre-affiche p-4">
              <p className="font-etiquette font-bold uppercase text-[15px] text-gris-brun">Votre choix</p>
              <p className="font-affiche text-[34px] text-rouge leading-none">{e.code}</p>
              <p className="font-semibold">{e.dimensions}{e.prix != null ? ` · ${argent(e.prix)}${fictif ? " (prix fictif, test)" : ""}` : " · prix confirmé à l'approbation"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Liste accessible pour qui ne peut pas utiliser le plan */}
      <details className="text-[16px]">
        <summary className="cursor-pointer font-etiquette font-bold text-[18px] min-h-[44px] flex items-center">Voir la liste des emplacements libres</summary>
        <ul className="mt-2 flex flex-wrap gap-2">
          {emplacements.filter((k) => !k.occupe).map((k) => (
            <li key={k.id}><button type="button" onClick={() => choisir(k.id)} aria-pressed={k.id === choisi}
              className="min-h-[44px] min-w-[56px] border-[3px] border-encre bg-moutarde font-etiquette font-bold aria-pressed:bg-rouge aria-pressed:text-creme">{k.code}</button></li>
          ))}
        </ul>
      </details>

      {e && (
        <div id="formulaire-kiosque" className="anim-monter scroll-mt-32">
          <FormulaireSimple
            key={e.id}
            action={demanderKiosqueInterieur}
            id="form-kiosque"
            className="formulaire"
            bouton={`Demander l'emplacement ${e.code}`}
            merci={<>
              <h3>Merci, c&apos;est reçu!</h3>
              <p>Votre demande pour l&apos;emplacement <strong>{e.code}</strong> est entre les mains du comité. Vous recevez le lien de paiement par courriel dès qu&apos;elle est approuvée.</p>
              <p className="merci__garder">Pas de nouvelles d&apos;ici quelques jours&nbsp;? Appelez la coordination au <a href="tel:+14183860484">418 386-0484</a>.</p>
            </>}
          >
            <input type="hidden" name="emplacement" value={e.id} />
            <input type="hidden" name="annee" value={annee} />
            <fieldset className="etape">
              <legend className="etape__titre"><span className="etape__num" aria-hidden="true">{e.code}</span>Votre kiosque</legend>
              <div className="coordonnees">
                <label className="champ"><span className="champ__etiquette">Entreprise ou ferme</span><input type="text" name="entreprise" required autoComplete="organization" /></label>
                <label className="champ"><span className="champ__etiquette">Nom du responsable</span><input type="text" name="nom" required autoComplete="name" /></label>
                <label className="champ"><span className="champ__etiquette">Téléphone</span><input type="tel" name="telephone" required autoComplete="tel" inputMode="tel" placeholder="418 555-1234" /></label>
                <label className="champ"><span className="champ__etiquette">Courriel</span><input type="email" name="courriel" required autoComplete="email" /></label>
                <label className="champ champ--large"><span className="champ__etiquette">Ce que vous exposez</span><textarea name="description" rows={3} required placeholder="Produits, services, démonstrations…" /></label>
                <label className="champ champ--large"><span className="champ__etiquette">Besoins <span className="facultatif">(facultatif)</span></span><textarea name="besoins" rows={2} placeholder="Électricité, table, accès pour le montage…" /></label>
              </div>
              <label className="consentement">
                <input type="checkbox" name="consentement" value="oui" required />
                <span>J&apos;accepte que l&apos;Expo St-Isidore utilise ces renseignements pour traiter ma demande de kiosque, selon sa <Link href="/confidentialite">politique de confidentialité</Link>.</span>
              </label>
            </fieldset>
          </FormulaireSimple>
        </div>
      )}
    </div>
  );
}
