"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FormulaireSimple from "@/components/formulaires/FormulaireSimple";
import { arretTab, flechesRadio } from "@/lib/clavier";
import { reserverSalle } from "@/actions/reservations";

export type SallePublique = { id: string; slug: string; nom: string; description: string; prix: number | null; fictif: boolean };
export type CreneauPublic = { id: string; salle_id: string; debut: string; fin: string; prix_cents: number | null; libre: boolean };

const FUSEAU = "America/Toronto";
const JOURS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
const jourLocal = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: FUSEAU });
const heure = (iso: string) => {
  const t = new Date(iso).toLocaleTimeString("fr-CA", { timeZone: FUSEAU, hour: "numeric", minute: "2-digit" });
  return t.replace(/ h 00$/, " h");
};
const argent = (c: number) =>
  new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", minimumFractionDigits: c % 100 ? 2 : 0 }).format(c / 100);

/** Grille d'un mois : semaines du lundi au dimanche (cases vides avant le 1er). */
function grille(annee: number, mois: number) {
  const premier = new Date(annee, mois, 1);
  const decalage = (premier.getDay() + 6) % 7;
  const n = new Date(annee, mois + 1, 0).getDate();
  return [...Array(decalage).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)];
}

export default function CalendrierSalles({
  salles, creneaux, verrous, salleInitiale, aujourdhui, fraisAnnulation, delaiHeures,
}: {
  /** Frais d'annulation affichés (null = pas encore validés) et délai d'annulation en ligne. */
  fraisAnnulation: string | null;
  delaiHeures: number;
  salles: SallePublique[];
  creneaux: CreneauPublic[];
  verrous: { jour: string; salle_id: string | null }[];
  salleInitiale?: string;
  aujourdhui: string;
}) {
  const [salleId, setSalleId] = useState(salles.find((s) => s.slug === salleInitiale)?.id ?? salles[0]?.id);
  const [a0, m0] = aujourdhui.split("-").map(Number);
  const [vue, setVue] = useState({ annee: a0, mois: m0 - 1 });
  const [sens, setSens] = useState<"suivant" | "precedent">("suivant");
  const [jour, setJour] = useState<string | null>(null);
  const [creneauId, setCreneauId] = useState<string | null>(null);

  const salle = salles.find((s) => s.id === salleId)!;
  const verrouille = (j: string) => verrous.some((v) => v.jour === j && (v.salle_id == null || v.salle_id === salleId));
  const parJour = useMemo(() => {
    const m = new Map<string, CreneauPublic[]>();
    creneaux.filter((c) => c.salle_id === salleId).forEach((c) => {
      const j = jourLocal(c.debut);
      m.set(j, [...(m.get(j) ?? []), c]);
    });
    return m;
  }, [creneaux, salleId]);

  const etatJour = (j: string): "passe" | "libre" | "pris" | "aucun" => {
    if (j < aujourdhui) return "passe";
    const liste = parJour.get(j);
    if (!liste?.length) return "aucun";
    if (verrouille(j)) return "pris";
    return liste.some((c) => c.libre) ? "libre" : "pris";
  };

  const changerMois = (d: number) => {
    setSens(d > 0 ? "suivant" : "precedent");
    setVue(({ annee, mois }) => {
      const t = new Date(annee, mois + d, 1);
      return { annee: t.getFullYear(), mois: t.getMonth() };
    });
  };
  const premierMois = vue.annee === a0 && vue.mois === m0 - 1;
  const titreMois = new Date(vue.annee, vue.mois, 1).toLocaleDateString("fr-CA", { month: "long", year: "numeric" });
  const libresDuMois = [...parJour.keys()].filter((j) => j.startsWith(`${vue.annee}-${String(vue.mois + 1).padStart(2, "0")}`) && etatJour(j) === "libre").length;

  // Première date libre de la salle choisie : évite de chercher de mois en mois
  const prochaineLibre = [...parJour.keys()].sort().find((j) => etatJour(j) === "libre") ?? null;
  const allerA = (j: string) => {
    const [a, m] = j.split("-").map(Number);
    setSens("suivant");
    setVue({ annee: a, mois: m - 1 });
    setJour(j);
    setCreneauId(null);
  };

  // Sur téléphone, l'étape suivante apparaît sous l'écran : on l'amène en vue (sans animation si mouvement réduit)
  useEffect(() => {
    const cible = document.getElementById(creneauId ? "formulaire-salle" : jour ? "heures-salle" : "");
    if (!cible) return;
    const r = cible.getBoundingClientRect();
    if (r.top < window.innerHeight - 220 && r.top > 0) return;
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cible.scrollIntoView({ behavior: doux ? "smooth" : "auto", block: "start" });
  }, [jour, creneauId]);

  const creneauxJour = jour ? (parJour.get(jour) ?? []) : [];
  const choisi = creneaux.find((c) => c.id === creneauId);
  const prixChoisi = choisi ? (choisi.prix_cents ?? salle.prix) : null;
  const dateLisible = (j: string) => new Date(j + "T12:00:00").toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="grid gap-8">
      {/* 1. La salle */}
      <div className="grid gap-3">
      <h3 className="etape__titre" id="etape-salle"><span className="etape__num" aria-hidden="true">1</span>La salle</h3>
      <div role="radiogroup" aria-labelledby="etape-salle" onKeyDown={flechesRadio} className="grid gap-4 sm:grid-cols-2">
        {salles.map((s, i) => {
          const actif = s.id === salleId;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={actif}
              tabIndex={arretTab(actif, i === 0, !salleId)}
              onClick={() => { setSalleId(s.id); setJour(null); setCreneauId(null); }}
              className={`text-left px-5 py-4 border-[3px] border-encre transition-all duration-200 motion-reduce:transition-none
                ${actif ? "bg-planche text-creme shadow-affiche -translate-y-1" : "bg-creme text-encre shadow-affiche-sm hover:-translate-y-0.5 hover:bg-kraft"}`}
            >
              <span className="block font-affiche text-[24px] leading-tight">{s.nom}</span>
              <span className={`block mt-1 font-etiquette font-bold text-[17px] ${actif ? "text-moutarde" : "text-rouge"}`}>
                {s.prix != null ? <>À partir de {argent(s.prix)} la réservation{s.fictif && " · prix fictif (test)"}</> : "Prix sur demande"}
              </span>
            </button>
          );
        })}
      </div>
      </div>

      <div className="grid gap-3">
      <h3 className="etape__titre"><span className="etape__num" aria-hidden="true">2</span>La date et les heures</h3>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start">
        {/* 2. Le calendrier */}
        <div className="bg-creme cadre-affiche p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <button type="button" onClick={() => changerMois(-1)} disabled={premierMois} aria-label="Mois précédent"
              className="min-h-[44px] min-w-[44px] border-[3px] border-encre bg-kraft font-bold text-[20px] disabled:opacity-30 hover:bg-moutarde transition-colors">←</button>
            <h4 className="font-affiche text-[24px] sm:text-[28px] capitalize text-encre" aria-live="polite">{titreMois}</h4>
            <button type="button" onClick={() => changerMois(1)} aria-label="Mois suivant"
              className="min-h-[44px] min-w-[44px] border-[3px] border-encre bg-kraft font-bold text-[20px] hover:bg-moutarde transition-colors">→</button>
          </div>
          <p className="font-etiquette font-semibold text-[16px] text-gris-brun mb-3">
            {libresDuMois ? `${libresDuMois} date${libresDuMois > 1 ? "s" : ""} libre${libresDuMois > 1 ? "s" : ""} ce mois-ci` : "Aucune date libre ce mois-ci"}
          </p>
          {prochaineLibre && (
            <p className="mb-4">
              {prochaineLibre !== jour ? (
                <button type="button" onClick={() => allerA(prochaineLibre)}
                  className="min-h-[44px] w-full sm:w-auto px-4 py-2 border-[3px] border-encre bg-creme text-encre text-left font-etiquette font-bold text-[17px] hover:bg-kraft transition-colors">
                  Prochaine date libre : <span className="underline">{dateLisible(prochaineLibre)}</span> <span aria-hidden="true">→</span>
                </button>
              ) : (
                <span className="min-h-[44px] inline-flex items-center px-4 py-2 border-[3px] border-dashed border-encre/40 font-etiquette font-bold text-[17px] text-gris-brun">
                  C&apos;est la prochaine date libre.
                </span>
              )}
            </p>
          )}
          {!prochaineLibre && (
            <p className="mb-4 text-[16px] text-encre">Aucune date n&apos;est ouverte pour cette salle en ce moment. Appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p>
          )}
          <div key={`${vue.annee}-${vue.mois}-${salleId}`} className={sens === "suivant" ? "anim-mois-suivant" : "anim-mois-precedent"}>
            <div className="grid grid-cols-7 gap-1.5 mb-1.5" aria-hidden="true">
              {JOURS.map((j) => <span key={j} className="text-center font-etiquette font-bold uppercase text-[14px] text-gris-brun">{j}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {grille(vue.annee, vue.mois).map((n, i) => {
                if (!n) return <span key={`v${i}`} />;
                const j = `${vue.annee}-${String(vue.mois + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
                const e = etatJour(j);
                const actif = j === jour;
                const libelle = `${dateLisible(j)} : ${{ libre: "dates libres", pris: "réservé", passe: "passé", aucun: "pas offert" }[e]}`;
                return (
                  <button
                    key={j}
                    type="button"
                    disabled={e !== "libre"}
                    aria-pressed={actif}
                    aria-label={libelle}
                    onClick={() => { setJour(j); setCreneauId(null); }}
                    className={`relative aspect-square min-h-[44px] border-2 font-etiquette font-bold text-[18px] transition-all duration-150 motion-reduce:transition-none
                      ${e === "libre" ? (actif ? "bg-rouge text-creme border-encre shadow-affiche-sm -translate-y-0.5" : "bg-moutarde text-encre border-encre hover:-translate-y-0.5 hover:shadow-affiche-sm") : ""}
                      ${e === "pris" ? "border-encre/40 text-encre/50 bg-[repeating-linear-gradient(135deg,transparent_0_5px,rgba(30,20,13,.18)_5px_7px)]" : ""}
                      ${e === "aucun" ? "border-transparent text-encre/60" : ""}
                      ${e === "passe" ? "border-transparent text-encre/25" : ""}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold text-encre">
            <li className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-encre bg-moutarde" aria-hidden="true" />Libre</li>
            <li className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-encre/40 bg-[repeating-linear-gradient(135deg,transparent_0_3px,rgba(30,20,13,.25)_3px_5px)]" aria-hidden="true" />Réservé</li>
            <li className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-encre bg-rouge" aria-hidden="true" />Votre choix</li>
            <li className="flex items-center gap-2 text-gris-brun"><span className="h-4 w-4 border-2 border-dashed border-encre/30" aria-hidden="true" />Pas offerte (chiffre pâle)</li>
          </ul>
        </div>

        {/* 3. Le créneau, puis le formulaire */}
        <div className="grid gap-6">
          {!jour && (
            <div className="border-[3px] border-dashed border-encre/50 p-6 text-[18px] text-encre">
              <p className="font-etiquette font-extrabold text-[22px] mb-1">Choisissez une date en jaune</p>
              <p className="text-gris-brun">Les dates libres sont celles que le comité a ouvertes à la réservation. Une date qui n&apos;apparaît pas? Appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p>
            </div>
          )}
          {jour && (
            <div className="anim-monter scroll-mt-28" id="heures-salle">
              <h4 className="font-affiche text-[22px] text-encre mb-3 first-letter:uppercase">{dateLisible(jour)}</h4>
              <div role="radiogroup" aria-label="Heures offertes" onKeyDown={flechesRadio} className="grid gap-3">
                {creneauxJour.map((c, i) => {
                  const p = c.prix_cents ?? salle.prix;
                  const actif = c.id === creneauId;
                  return (
                    <button key={c.id} type="button" role="radio" aria-checked={actif} disabled={!c.libre}
                      tabIndex={arretTab(actif, i === creneauxJour.findIndex((x) => x.libre), !creneauId)}
                      onClick={() => setCreneauId(c.id)}
                      className={`flex items-center justify-between gap-4 px-4 min-h-[56px] border-[3px] border-encre font-etiquette font-bold text-[19px] transition-all
                        ${!c.libre ? "opacity-50 line-through" : actif ? "bg-rouge text-creme shadow-affiche-sm" : "bg-creme hover:bg-kraft"}`}>
                      <span>{heure(c.debut)} à {heure(c.fin)}</span>
                      <span>{!c.libre ? "Réservé" : p != null ? argent(p) : "Prix sur demande"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {choisi && (
        <div className="anim-monter scroll-mt-28" id="formulaire-salle">
          {prixChoisi == null ? (
            <div className="avis-bandeau" role="note">
              <div>
                <strong>Le prix de cette salle n&apos;est pas encore en ligne</strong>
                <p>Pour réserver le {dateLisible(jour!)}, appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p>
              </div>
            </div>
          ) : (
            <FormulaireSimple action={reserverSalle} id="form-salle" className="formulaire" bouton={`Réserver et payer ${argent(prixChoisi)}`} boutonEnCours="Ouverture du paiement sécurisé…">
              <input type="hidden" name="creneau" value={choisi.id} />
              <fieldset className="etape">
                <legend className="etape__titre"><span className="etape__num" aria-hidden="true">3</span>Votre événement</legend>
                <p className="billet-ligne font-etiquette font-bold text-[18px] mb-4">
                  {salle.nom} · <span className="first-letter:uppercase">{dateLisible(jour!)}</span> · {heure(choisi.debut)} à {heure(choisi.fin)}
                </p>
                <div className="coordonnees">
                  <label className="champ"><span className="champ__etiquette">Type d&apos;événement</span>
                    <select name="type" required defaultValue="">
                      <option value="">Choisir…</option>
                      <option>Mariage</option><option>Party de famille</option><option>Anniversaire</option>
                      <option>Réunion ou formation</option><option>Souper de groupe</option><option>Autre</option>
                    </select>
                  </label>
                  <label className="champ"><span className="champ__etiquette">Nombre de personnes</span>
                    <input type="number" name="personnes" min={1} max={2000} inputMode="numeric" required data-erreur="Entrez le nombre d'invités, environ (ex. 120)." /></label>
                  <label className="champ"><span className="champ__etiquette">Nom complet</span><input type="text" name="nom" required autoComplete="name" /></label>
                  <label className="champ"><span className="champ__etiquette">Téléphone</span><input type="tel" name="telephone" required autoComplete="tel" inputMode="tel" placeholder="418 555-1234" /></label>
                  <label className="champ champ--large"><span className="champ__etiquette">Courriel (pour la confirmation)</span><input type="email" name="courriel" required autoComplete="email" /></label>
                  <label className="champ champ--large"><span className="champ__etiquette">Commentaires <span className="facultatif">(facultatif)</span></span><textarea name="message" rows={3} placeholder="Traiteur, musique, heure d'installation…" /></label>
                </div>
                <label className="consentement">
                  <input type="checkbox" name="consentement" value="oui" required />
                  <span>J&apos;accepte que l&apos;Expo St-Isidore utilise ces renseignements pour ma réservation, selon sa <Link href="/confidentialite">politique de confidentialité</Link>.</span>
                </label>
                <label className="consentement">
                  <input type="checkbox" name="conditions" value="oui" required data-erreur="Cochez cette case pour accepter les conditions de location." />
                  <span>J&apos;ai lu et j&apos;accepte les <a href="#conditions">conditions de location</a> (salle rendue propre, bris et dépassement d&apos;heure facturés) et la <a href="#annulation">politique d&apos;annulation</a>.</span>
                </label>
              </fieldset>
              <p className="note">
                <strong>Annulation :</strong> vous pouvez annuler en ligne jusqu&apos;à {delaiHeures} heures avant l&apos;événement, par le bouton de votre courriel de confirmation{fraisAnnulation ? <> (frais d&apos;annulation : {fraisAnnulation})</> : null}.
                Paiement sécurisé par Stripe. La date vous est gardée 30 minutes pendant le paiement.
              </p>
            </FormulaireSimple>
          )}
        </div>
      )}
    </div>
  );
}
