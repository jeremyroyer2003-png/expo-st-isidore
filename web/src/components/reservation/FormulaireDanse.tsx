"use client";

import Link from "next/link";
import { useState } from "react";
import FormulaireSimple from "@/components/formulaires/FormulaireSimple";
import { inscrireDanse } from "@/actions/reservations";
import { arretTab, flechesRadio } from "@/lib/clavier";

export type Forfait = { cle: string; libelle: string; description: string; prix: number | null; fictif: boolean };

const argent = (c: number) =>
  new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", minimumFractionDigits: c % 100 ? 2 : 0 }).format(c / 100);

/** `fermee` : hors saison, les forfaits restent affichés pour information, mais on ne paie pas en ligne sans date. */
export default function FormulaireDanse({ forfaits, fermee = false }: { forfaits: Forfait[]; fermee?: boolean }) {
  const achetables = forfaits.filter((f) => f.prix != null);
  const [cle, setCle] = useState(achetables[0]?.cle ?? "");
  const [saisie, setSaisie] = useState("1");
  const personnes = Math.max(1, Math.min(10, Math.floor(Number(saisie)) || 1));
  const f = forfaits.find((x) => x.cle === cle);
  const total = f?.prix != null ? f.prix * personnes : null;

  // Hors saison : les forfaits sont affichés pour information seulement (aucun choix possible)
  if (fermee) {
    return (
      <div className="grid gap-8">
        <ul className="grid gap-5 md:grid-cols-3" aria-label="Forfaits de la saison">
          {forfaits.map((x) => (
            <li key={x.cle} className="p-5 border-[3px] border-encre bg-creme text-encre shadow-affiche-sm">
              <span className="block font-etiquette font-bold uppercase tracking-widest text-[15px]">{x.libelle}</span>
              <span className="block font-affiche text-[44px] leading-none my-2">{x.prix != null ? argent(x.prix) : "—"}</span>
              <span className="block text-[16px]">{x.prix != null ? "par personne" : "Prix sur demande"}{x.fictif && x.prix != null ? " · prix fictif (test)" : ""}</span>
              <span className="block mt-2 text-[15px] opacity-90">{x.description}</span>
            </li>
          ))}
        </ul>
        <div className="avis-bandeau" role="note">
          <div>
            <strong>Les inscriptions en ligne ouvrent à la mi-mai</strong>
            <p>On paie en ligne seulement quand les dates de la saison sont connues. D&apos;ici là, ces prix sont donnés à titre d&apos;information. Questions : bureau, <a href="tel:+14188825649">418 882-5649</a>.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div role="radiogroup" aria-label="Forfaits" onKeyDown={flechesRadio} className="grid gap-5 md:grid-cols-3">
        {forfaits.map((x, i) => {
          const actif = x.cle === cle;
          const dispo = x.prix != null;
          return (
            <button
              key={x.cle}
              type="button"
              role="radio"
              aria-checked={actif}
              tabIndex={arretTab(actif, i === 0, !cle)}
              disabled={!dispo}
              onClick={() => setCle(x.cle)}
              className={`relative text-left p-5 border-[3px] border-encre transition-all duration-200 motion-reduce:transition-none
                ${actif ? "bg-rouge text-creme shadow-affiche -translate-y-1" : dispo ? "bg-creme text-encre shadow-affiche-sm hover:-translate-y-0.5 hover:bg-kraft" : "bg-kraft/60 text-encre/70"}`}
            >
              <span className="block font-etiquette font-bold uppercase tracking-widest text-[15px]">{x.libelle}</span>
              <span className="block font-affiche text-[44px] leading-none my-2">{dispo ? argent(x.prix!) : "—"}</span>
              <span className="block text-[16px]">{dispo ? "par personne" : "Prix sur demande"}{x.fictif && dispo ? " · prix fictif (test)" : ""}</span>
              <span className="block mt-2 text-[15px] opacity-90">{x.description}</span>
            </button>
          );
        })}
      </div>

      {achetables.length === 0 ? (
        <div className="avis-bandeau" role="note"><p>L&apos;inscription en ligne ouvre bientôt. D&apos;ici là, appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p></div>
      ) : (
        <FormulaireSimple action={inscrireDanse} id="form-danse" className="formulaire formulaire--etroit" bouton={total != null ? `Payer ${argent(total)}` : "Continuer"} boutonEnCours="Ouverture du paiement sécurisé…">
          <input type="hidden" name="forfait" value={cle} />
          <fieldset className="etape">
            <legend className="etape__titre">Votre inscription</legend>
            <div className="coordonnees">
              <label className="champ"><span className="champ__etiquette">Nom complet</span><input type="text" name="nom" required autoComplete="name" /></label>
              <label className="champ"><span className="champ__etiquette">Nombre de personnes</span>
                <input type="number" name="personnes" min={1} max={10} required inputMode="numeric" value={saisie}
                  onChange={(e) => setSaisie(e.target.value)} data-erreur="Entre 1 et 10 personnes." /></label>
              <label className="champ"><span className="champ__etiquette">Téléphone</span><input type="tel" name="telephone" required autoComplete="tel" inputMode="tel" placeholder="418 555-1234" /></label>
              <label className="champ"><span className="champ__etiquette">Courriel (pour le reçu)</span><input type="email" name="courriel" required autoComplete="email" /></label>
            </div>
            <label className="consentement">
              <input type="checkbox" name="consentement" value="oui" required />
              <span>J&apos;accepte que l&apos;Expo St-Isidore utilise ces renseignements pour mon inscription, selon sa <Link href="/confidentialite">politique de confidentialité</Link>.</span>
            </label>
          </fieldset>
          <p className="note">Paiement sécurisé par Stripe.</p>
        </FormulaireSimple>
      )}
    </div>
  );
}
