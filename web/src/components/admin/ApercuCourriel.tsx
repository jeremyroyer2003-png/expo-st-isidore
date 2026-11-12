"use client";

import { useState } from "react";
import { apercuCourriel } from "@/actions/admin/courriels";

/**
 * Une ligne de la boîte d'envoi. L'aperçu du courriel n'est chargé qu'à l'ouverture :
 * la page reste légère même avec des centaines de courriels.
 */
export default function ApercuCourriel({ id, sujet, children }: { id: string; sujet: string; children: React.ReactNode }) {
  const [etat, setEtat] = useState<"ferme" | "charge" | "pret" | "erreur">("ferme");
  const [html, setHtml] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);

  const ouvrir = async (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (!e.currentTarget.open || etat !== "ferme") return;
    setEtat("charge");
    const r = await apercuCourriel(id);
    if (!r) return setEtat("erreur");
    setHtml(r.html);
    setErreur(r.erreur);
    setEtat("pret");
  };

  return (
    <details onToggle={ouvrir}>
      <summary className="cursor-pointer grid gap-1 sm:grid-cols-[1fr_auto] items-center min-h-[44px]">{children}</summary>
      {etat === "charge" && <p className="mt-3 text-gris-brun">Chargement de l&apos;aperçu…</p>}
      {etat === "erreur" && <p className="mt-3 text-rouge">L&apos;aperçu n&apos;a pas pu être chargé.</p>}
      {erreur && <p className="mt-2 text-rouge text-[14px]">Erreur d&apos;envoi : {erreur}</p>}
      {/* Aperçu isolé (sandbox) : le HTML du courriel ne peut rien exécuter dans l'admin */}
      {etat === "pret" && <iframe title={`Aperçu : ${sujet}`} srcDoc={html} sandbox="" className="mt-3 w-full h-[520px] border-2 border-encre bg-white" />}
    </details>
  );
}
