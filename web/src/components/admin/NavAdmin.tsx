"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Role } from "@/lib/admin";

const GROUPES: { titre: string; liens: { href: string; texte: string; superAdmin?: boolean }[] }[] = [
  { titre: "Suivi", liens: [{ href: "/admin", texte: "Tableau de bord" }, { href: "/admin/messages", texte: "Messages" }, { href: "/admin/boite-envoi", texte: "Boîte d'envoi" }] },
  {
    titre: "Réservations",
    liens: [
      { href: "/admin/reservations", texte: "Salles" },
      { href: "/admin/kiosques", texte: "Kiosques" },
      { href: "/admin/remisage", texte: "Remisage" },
      { href: "/admin/danse", texte: "Danse" },
    ],
  },
  {
    titre: "Contenu",
    liens: [
      { href: "/admin/calendrier", texte: "Calendrier des salles" },
      { href: "/admin/programmation", texte: "Programmation" },
      { href: "/admin/prix", texte: "Prix" },
      { href: "/admin/medias", texte: "Médiathèque" },
      { href: "/admin/contenu", texte: "Textes du site" },
    ],
  },
  { titre: "Comptes", liens: [{ href: "/admin/utilisateurs", texte: "Utilisateurs", superAdmin: true }] },
];

/**
 * Menu de l'admin. Sur téléphone et tablette, il est replié derrière un bouton « Menu »
 * pour que le contenu de la page soit visible tout de suite.
 * `aFaire` : nombre d'éléments à traiter par section (pastille à côté du lien).
 */
export default function NavAdmin({ role, aFaire = {}, children }: { role: Role; aFaire?: Record<string, number>; children?: React.ReactNode }) {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const [cheminVu, setCheminVu] = useState(chemin);
  // Changement de page : le menu se referme
  if (cheminVu !== chemin) {
    setCheminVu(chemin);
    setOuvert(false);
  }
  const total = Object.values(aFaire).reduce((s, n) => s + n, 0);

  return (
    <>
      <div className="lg:hidden px-3 py-2 border-b-2 border-creme/20">
        <button type="button" aria-expanded={ouvert} aria-controls="menu-admin" onClick={() => setOuvert(!ouvert)}
          className="w-full min-h-[44px] flex items-center justify-between gap-3 px-3 border-2 border-creme/60 font-etiquette font-bold uppercase tracking-wide text-[15px] text-creme">
          <span>{ouvert ? "Fermer le menu" : "Menu"}</span>
          {total > 0 && !ouvert && <span className="bg-moutarde text-encre px-2 py-0.5 text-[13px] normal-case tracking-normal">{total} à traiter</span>}
        </button>
      </div>
      <div id="menu-admin" className={`${ouvert ? "block" : "hidden"} lg:block`}>
        <nav aria-label="Administration" className="p-3 grid gap-4">
          {GROUPES.map((g) => {
            const liens = g.liens.filter((l) => !l.superAdmin || role === "super_admin");
            if (!liens.length) return null;
            return (
              <div key={g.titre}>
                <p className="px-2 mb-1 font-etiquette font-bold uppercase tracking-widest text-[12px] text-creme/60">{g.titre}</p>
                <ul className="grid gap-0.5">
                  {liens.map((l) => {
                    const actif = l.href === "/admin" ? chemin === "/admin" : chemin.startsWith(l.href);
                    const n = aFaire[l.href] ?? 0;
                    return (
                      <li key={l.href}>
                        <Link href={l.href} aria-current={actif ? "page" : undefined}
                          className={`flex items-center justify-between gap-2 px-2 py-2 lg:py-1.5 no-underline text-[16px] border-l-4 ${actif ? "border-moutarde bg-creme/10 text-creme font-semibold" : "border-transparent text-creme/85 hover:bg-creme/5"}`}>
                          <span>{l.texte}</span>
                          {n > 0 && (
                            <span className="min-w-[24px] text-center bg-moutarde text-encre px-1.5 font-etiquette font-bold text-[14px]">
                              {n}<span className="sr-only"> à traiter</span>
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
        {children}
      </div>
    </>
  );
}
