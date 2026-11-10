import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rafraîchit la session Supabase des admins et renvoie vers /admin/connexion si personne n'est connecté.
// Vérification « optimiste » seulement : chaque page et action admin revérifie le rôle,
// et la RLS de Postgres reste la vraie barrière.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let reponse = NextResponse.next({ request });
  if (!url || !anon) return reponse;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (aPoser, entetes) => {
        aPoser.forEach(({ name, value }) => request.cookies.set(name, value));
        reponse = NextResponse.next({ request });
        aPoser.forEach(({ name, value, options }) => reponse.cookies.set(name, value, options));
        Object.entries(entetes ?? {}).forEach(([k, v]) => reponse.headers.set(k, v));
      },
    },
  });
  const { data } = await supabase.auth.getUser();
  const page = request.nextUrl.pathname;
  if (!data.user && page !== "/admin/connexion") {
    const cible = request.nextUrl.clone();
    cible.pathname = "/admin/connexion";
    cible.searchParams.set("suite", page);
    return NextResponse.redirect(cible);
  }
  return reponse;
}

export const config = { matcher: ["/admin/:path*"] };
