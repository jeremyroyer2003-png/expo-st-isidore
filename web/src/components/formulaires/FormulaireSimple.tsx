"use client";

import { useRef, useState, useTransition } from "react";
import type { Resultat } from "@/lib/validation";
import { effacerSiValide, marquerInvalides, resumeErreur } from "@/lib/validation-client";

/**
 * Formulaire public générique : validation dans le navigateur, puis action serveur.
 * Pendant l'envoi le bouton est désactivé; après, le message de remerciement remplace le formulaire.
 * Si l'action renvoie une redirection (paiement Stripe), on y va.
 */
export default function FormulaireSimple({
  action,
  id,
  className = "formulaire formulaire--etroit",
  bouton,
  merci,
  children,
  onEnvoye,
}: {
  action: (fd: FormData) => Promise<Resultat>;
  id: string;
  className?: string;
  bouton: string;
  merci?: React.ReactNode;
  children: React.ReactNode;
  onEnvoye?: (fd: FormData) => void;
}) {
  const [erreur, setErreur] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [enCours, demarrer] = useTransition();
  const merciRef = useRef<HTMLDivElement>(null);

  const soumettre = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const invalides = marquerInvalides(form);
    if (invalides.length) {
      setErreur(resumeErreur(invalides[0]));
      invalides[0].focus();
      return;
    }
    setErreur("");
    const fd = new FormData(form);
    demarrer(async () => {
      const r = await action(fd);
      if (!r.ok) {
        setErreur(r.erreur);
        return;
      }
      if (r.redirection) {
        window.location.assign(r.redirection);
        return;
      }
      onEnvoye?.(fd);
      setEnvoye(true);
      setTimeout(() => merciRef.current?.focus(), 0);
    });
  };

  if (envoye && merci) {
    return (
      <div className="merci" tabIndex={-1} ref={merciRef}>
        {merci}
        <button type="button" className="lien-action" onClick={() => setEnvoye(false)}>Faire une autre demande</button>
      </div>
    );
  }

  return (
    <form id={id} className={className} noValidate onSubmit={soumettre} onInput={effacerSiValide} onChange={effacerSiValide}>
      <p className="visuellement-cache">
        <label>Ne pas remplir&nbsp;: <input name="champ-robot" tabIndex={-1} autoComplete="off" /></label>
      </p>
      {children}
      <p className="champ__erreur formulaire__erreur" role="alert" hidden={!erreur}>{erreur}</p>
      <div className="formulaire__envoi">
        <button type="submit" className="bouton bouton--orange bouton--grand" disabled={enCours}>
          {enCours ? "Envoi en cours…" : bouton}
        </button>
      </div>
    </form>
  );
}
