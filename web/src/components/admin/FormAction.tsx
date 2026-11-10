"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Resultat } from "@/lib/validation";

const STYLES = {
  principal: "bg-rouge text-creme hover:bg-rouge-fonce",
  secondaire: "bg-[#FBF6EC] text-encre hover:bg-kraft",
  danger: "bg-encre text-creme hover:bg-planche-2",
  succes: "bg-olive text-encre hover:brightness-95",
};

/**
 * Formulaire d'action admin : appelle une action serveur, affiche le résultat, rafraîchit la page.
 * `confirmer` demande une confirmation avant les gestes lourds (annulation, remboursement, suppression).
 */
export default function FormAction({
  action, bouton, children, confirmer, style = "principal", className = "", enLigne = false,
}: {
  action: (fd: FormData) => Promise<Resultat>;
  bouton: string;
  children?: React.ReactNode;
  confirmer?: string;
  style?: keyof typeof STYLES;
  className?: string;
  enLigne?: boolean;
}) {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; texte: string } | null>(null);

  const soumettre = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (confirmer && !window.confirm(confirmer)) return;
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;
    demarrer(async () => {
      const r = await action(fd);
      setMsg(r.ok ? { ok: true, texte: r.message ?? "C'est fait." } : { ok: false, texte: r.erreur });
      if (r.ok) {
        if (!enLigne) form.reset();
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={soumettre} className={`${enLigne ? "inline-flex flex-wrap items-end gap-2" : "grid gap-3"} ${className}`}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={enCours}
          className={`min-h-[40px] px-4 border-2 border-encre font-etiquette font-bold uppercase tracking-wide text-[14px] disabled:opacity-50 ${STYLES[style]}`}>
          {enCours ? "Un instant…" : bouton}
        </button>
        {msg && <span role="status" className={`text-[14px] font-semibold ${msg.ok ? "text-olive-fonce" : "text-rouge"}`}>{msg.texte}</span>}
      </div>
    </form>
  );
}
