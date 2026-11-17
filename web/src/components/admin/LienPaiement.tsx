"use client";

import { useState } from "react";
import FormAction from "@/components/admin/FormAction";
import { renvoyerLien } from "@/actions/admin/gestion";

/**
 * Lien de paiement d'une demande approuvée : le copier (pour le texter ou le coller dans un courriel)
 * ou renvoyer au client le courriel qui le contient.
 */
export default function LienPaiement({ url, type, id, edition }: { url: string; type: "kiosque" | "remisage"; id: string; edition: boolean }) {
  const [copie, setCopie] = useState(false);
  const copier = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    } catch {
      // Presse-papiers refusé (vieux navigateur) : le lien reste sélectionnable dans le champ
    }
  };
  return (
    <div className="grid gap-2">
      <label className="block">
        <span className="block font-etiquette font-bold text-[14px] uppercase tracking-wide text-gris-brun mb-1">Lien de paiement du client</span>
        <input readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="w-full min-h-[40px] border-2 border-encre/40 bg-white px-2 py-1 text-[13px] text-encre" />
      </label>
      <div className="flex flex-wrap items-start gap-2">
        <button type="button" onClick={copier}
          className="min-h-[40px] px-4 border-2 border-encre bg-[#FBF6EC] hover:bg-kraft font-etiquette font-bold uppercase tracking-wide text-[14px]">
          {copie ? "Copié" : "Copier le lien"}
        </button>
        {edition && (
          <FormAction action={renvoyerLien} bouton="Renvoyer le courriel" style="secondaire" enLigne>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="type" value={type} />
          </FormAction>
        )}
        {edition && (
          <FormAction action={renvoyerLien} bouton="Envoyer un rappel" style="secondaire" enLigne confirmer="Envoyer au client un courriel de rappel de paiement?">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="rappel" value="oui" />
          </FormAction>
        )}
        <span role="status" className="sr-only">{copie ? "Lien copié" : ""}</span>
      </div>
    </div>
  );
}
