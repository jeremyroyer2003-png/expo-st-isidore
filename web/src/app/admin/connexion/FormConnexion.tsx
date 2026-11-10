"use client";

import { useState } from "react";
import { supabaseNavigateur } from "@/lib/supabase/navigateur";

export default function FormConnexion({ suite }: { suite: string }) {
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const soumettre = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setEnCours(true);
    setErreur("");
    try {
      const { error } = await supabaseNavigateur().auth.signInWithPassword({
        email: String(fd.get("courriel")),
        password: String(fd.get("motdepasse")),
      });
      if (error) {
        setErreur("Courriel ou mot de passe incorrect.");
        return;
      }
      window.location.assign(suite);
    } catch {
      setErreur("Connexion impossible. Vérifiez la configuration de Supabase.");
    } finally {
      setEnCours(false);
    }
  };

  const champ = "w-full min-h-[44px] border-2 border-encre bg-white px-3 text-[17px]";
  return (
    <form onSubmit={soumettre} className="grid gap-4">
      <label className="grid gap-1">
        <span className="font-etiquette font-bold uppercase text-[14px] tracking-wide">Courriel</span>
        <input className={champ} type="email" name="courriel" required autoComplete="username" />
      </label>
      <label className="grid gap-1">
        <span className="font-etiquette font-bold uppercase text-[14px] tracking-wide">Mot de passe</span>
        <input className={champ} type="password" name="motdepasse" required autoComplete="current-password" />
      </label>
      {erreur && <p role="alert" className="text-rouge font-semibold">{erreur}</p>}
      <button type="submit" disabled={enCours} className="min-h-[48px] bg-rouge text-creme border-[3px] border-encre font-etiquette font-bold uppercase tracking-wide text-[17px] shadow-affiche-sm disabled:opacity-60">
        {enCours ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
