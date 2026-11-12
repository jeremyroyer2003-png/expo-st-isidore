"use client";

/** Bouton « Imprimer » : ouvre la boîte d'impression du navigateur. */
export default function BoutonImprimer({ className = "bouton bouton--contour-fonce", children = "Imprimer" }: { className?: string; children?: React.ReactNode }) {
  return <button type="button" className={className} onClick={() => window.print()}>{children}</button>;
}
