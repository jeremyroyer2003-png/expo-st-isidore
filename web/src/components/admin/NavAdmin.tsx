"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function NavAdmin({ role }: { role: Role }) {
  const chemin = usePathname();
  return (
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
                return (
                  <li key={l.href}>
                    <Link href={l.href} aria-current={actif ? "page" : undefined}
                      className={`block px-2 py-1.5 no-underline text-[16px] border-l-4 ${actif ? "border-moutarde bg-creme/10 text-creme font-semibold" : "border-transparent text-creme/85 hover:bg-creme/5"}`}>
                      {l.texte}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
