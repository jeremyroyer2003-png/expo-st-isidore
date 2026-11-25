"use client";

import { useEffect } from "react";

// Fond d'écran du site public : la peinture par défaut. ?fond=photo, ?fond=peinture ou ?fond=0 (aucun) pour changer;
// le choix est gardé dans ce navigateur. La classe est aussi posée avant l'affichage par le script de app/layout.tsx.
const FONDS = ["photo", "peinture"];

export default function EssaiFond() {
  useEffect(() => {
    const demande = new URLSearchParams(window.location.search).get("fond");
    if (demande !== null) localStorage.setItem("essai-fond", demande);
    const fond = localStorage.getItem("essai-fond") ?? "peinture";
    const html = document.documentElement;
    FONDS.forEach((f) => html.classList.toggle(`fond-${f}`, f === fond));
    // En quittant le site public (vers l'admin), le fond d'écran s'en va
    return () => FONDS.forEach((f) => html.classList.remove(`fond-${f}`));
  });
  return null;
}
