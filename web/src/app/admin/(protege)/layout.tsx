import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin, NOMS_ROLES } from "@/lib/admin";
import NavAdmin from "@/components/admin/NavAdmin";
import { deconnexion } from "@/actions/admin/comptes";

export const metadata: Metadata = { title: { default: "Administration", template: "%s · Admin Expo" }, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const { profil } = await exigerAdmin();
  return (
    <div className="min-h-screen bg-kraft text-encre font-corps lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="bg-planche text-creme lg:min-h-screen lg:sticky lg:top-0 lg:self-start">
        <div className="p-4 border-b-2 border-creme/20 flex items-center justify-between gap-3">
          <Link href="/admin" className="no-underline">
            <span className="block font-affiche text-[20px] leading-tight text-creme">Expo St-Isidore</span>
            <span className="block font-etiquette font-bold uppercase tracking-widest text-[13px] text-moutarde">Administration</span>
          </Link>
          <Link href="/" className="text-[13px] text-creme/80 underline">Voir le site</Link>
        </div>
        <NavAdmin role={profil.role} />
        <div className="p-4 border-t-2 border-creme/20 text-[14px]">
          <p className="font-semibold truncate">{profil.nom || profil.courriel}</p>
          <p className="text-moutarde font-etiquette font-bold uppercase tracking-wide text-[13px]">{NOMS_ROLES[profil.role]}</p>
          <form action={deconnexion} className="mt-2">
            <button type="submit" className="underline text-creme/90">Se déconnecter</button>
          </form>
        </div>
      </aside>
      <main id="contenu" className="p-4 sm:p-6 lg:p-8 min-w-0">
        <p className="mb-4 inline-block border-2 border-encre bg-moutarde px-2 py-0.5 font-etiquette font-bold uppercase text-[13px]">Mode test · Stripe test · courriels simulés</p>
        {children}
      </main>
    </div>
  );
}
