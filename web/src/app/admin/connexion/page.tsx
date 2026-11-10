import type { Metadata } from "next";
import FormConnexion from "./FormConnexion";

export const metadata: Metadata = { title: "Connexion à l'administration", robots: { index: false } };

const ERREURS: Record<string, string> = {
  config: "Supabase n'est pas encore configuré : remplissez web/.env.local (voir le guide du développeur).",
  acces: "Ce compte n'a pas accès à l'administration. Demandez au super-admin de vous ajouter.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ erreur?: string; suite?: string }> }) {
  const { erreur, suite } = await searchParams;
  return (
    <main className="min-h-screen grid place-items-center bg-planche px-4 py-10">
      <div className="w-full max-w-[420px] bg-creme border-[3px] border-encre shadow-[8px_8px_0_#D9A441] p-6 sm:p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-expo.webp" alt="Expo St-Isidore" width={124} height={72} className="mb-4" />
        <h1 className="font-affiche text-[28px] text-encre leading-tight">Administration</h1>
        <p className="text-[16px] text-gris-brun mb-5">Réservé au comité de l&apos;Expo.</p>
        {erreur && ERREURS[erreur] && <p role="alert" className="mb-4 border-2 border-rouge bg-[#FBF6EC] p-3 text-[15px] text-rouge font-semibold">{ERREURS[erreur]}</p>}
        <FormConnexion suite={suite?.startsWith("/admin") ? suite : "/admin"} />
      </div>
    </main>
  );
}
