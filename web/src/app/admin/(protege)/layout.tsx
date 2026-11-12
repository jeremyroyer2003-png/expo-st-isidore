import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin, NOMS_ROLES } from "@/lib/admin";
import NavAdmin from "@/components/admin/NavAdmin";
import { deconnexion } from "@/actions/admin/comptes";

export const metadata: Metadata = { title: { default: "Administration", template: "%s · Admin Expo" }, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const { sb, profil } = await exigerAdmin();
  // Pastilles du menu : ce qui attend une action dans chaque section
  const nb = { count: "exact", head: true } as const;
  const [kiosques, remisage, messages] = await Promise.all([
    sb.from("demandes_kiosque").select("id", nb).in("statut", ["en_attente", "entente"]).then((r) => r.count ?? 0),
    sb.from("demandes_remisage").select("id", nb).eq("statut", "en_attente").then((r) => r.count ?? 0),
    sb.from("messages").select("id", nb).eq("traite", false).then((r) => r.count ?? 0),
  ]);
  const aFaire = { "/admin/kiosques": kiosques, "/admin/remisage": remisage, "/admin/messages": messages };

  return (
    <div className="min-h-screen bg-kraft text-encre font-corps lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="bg-planche text-creme lg:min-h-screen lg:sticky lg:top-0 lg:self-start print:hidden">
        <div className="p-4 border-b-2 border-creme/20 flex items-center justify-between gap-3">
          <Link href="/admin" className="no-underline">
            <span className="block font-affiche text-[20px] leading-tight text-creme">Expo St-Isidore</span>
            <span className="block font-etiquette font-bold uppercase tracking-widest text-[13px] text-moutarde">Administration</span>
          </Link>
          <Link href="/" className="text-[13px] text-creme/80 underline">Voir le site</Link>
        </div>
        <NavAdmin role={profil.role} aFaire={aFaire}>
          <div className="p-4 border-t-2 border-creme/20 text-[14px]">
            <p className="font-semibold truncate">{profil.nom || profil.courriel}</p>
            <p className="text-moutarde font-etiquette font-bold uppercase tracking-wide text-[13px]">{NOMS_ROLES[profil.role]}</p>
            <form action={deconnexion} className="mt-2">
              <button type="submit" className="underline text-creme/90 min-h-[40px]">Se déconnecter</button>
            </form>
          </div>
        </NavAdmin>
      </aside>
      <main id="contenu" className="p-4 sm:p-6 lg:p-8 min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="inline-block border-2 border-encre bg-moutarde px-2 py-0.5 font-etiquette font-bold uppercase text-[13px]">Mode test · Stripe test · courriels simulés</p>
          <form action="/admin/recherche" method="get" role="search" className="flex grow sm:grow-0 gap-2">
            <label className="grow">
              <span className="sr-only">Trouver un client : nom, entreprise, courriel ou téléphone</span>
              <input type="search" name="q" placeholder="Trouver un client…" className="w-full sm:w-[260px] min-h-[40px] border-2 border-encre bg-white px-2 py-1 text-[15px] text-encre" />
            </label>
            <button type="submit" className="min-h-[40px] px-3 border-2 border-encre bg-encre text-creme font-etiquette font-bold uppercase tracking-wide text-[14px] hover:bg-planche-2">Chercher</button>
          </form>
        </div>
        {children}
      </main>
    </div>
  );
}
