"use client";

import { useEffect } from "react";
import { SCRIPT_CLASSES } from "@/lib/classes-html";

/**
 * Remet les classes de <html> (js, saison, fond d'écran) après l'hydratation.
 * Le script en ligne de app/layout.tsx les pose avant l'affichage, mais si React reconstruit la page
 * (Netlify ajoute un commentaire dans le <head> du HTML, ce qui fait échouer l'hydratation), elles sont
 * effacées : sans « js », le menu du cellulaire restait ouvert et la page se croyait en été.
 */
export default function ClassesHtml() {
  useEffect(() => {
    // Même code que le script en ligne : une seule source de vérité
    new Function(SCRIPT_CLASSES)();
  });
  return null;
}
