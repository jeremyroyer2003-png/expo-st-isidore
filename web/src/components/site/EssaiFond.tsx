"use client";

import { useEffect } from "react";

// Essai de fonds pour les sections claires : ?fond=1 (lumière dorée), ?fond=4 (rangs de champs), ?fond=0 pour revenir.
// Le choix est gardé pendant la visite (sessionStorage) pour comparer page par page. À retirer une fois le fond choisi.
const FONDS = ["1", "4"];

export default function EssaiFond() {
  useEffect(() => {
    const demande = new URLSearchParams(window.location.search).get("fond");
    if (demande !== null) sessionStorage.setItem("essai-fond", demande);
    const fond = sessionStorage.getItem("essai-fond");
    const html = document.documentElement;
    FONDS.forEach((f) => html.classList.toggle(`fond-${f}`, f === fond));
  });
  return null;
}
