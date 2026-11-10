// Crée (ou met à jour) un compte admin. Sert surtout à créer le premier super-admin.
// Usage : npm run creer-admin -- courriel@exemple.com "MotDePasse" super_admin "Jérémy Royer"
// Rôles : super_admin | editeur | lecteur. Lit .env.local (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).
import { createClient } from "@supabase/supabase-js";

const [courriel, motDePasse, role = "lecteur", nom = ""] = process.argv.slice(2);
if (!courriel || !motDePasse || !["super_admin", "editeur", "lecteur"].includes(role)) {
  console.error('Usage : npm run creer-admin -- courriel "mot de passe" super_admin|editeur|lecteur "Nom"');
  process.exit(1);
}
if (motDePasse.length < 10) {
  console.error("Le mot de passe doit avoir au moins 10 caractères.");
  process.exit(1);
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

let id;
const cree = await sb.auth.admin.createUser({ email: courriel, password: motDePasse, email_confirm: true });
if (cree.error) {
  // Déjà existant : on le retrouve et on met son mot de passe à jour
  const liste = await sb.auth.admin.listUsers({ perPage: 1000 });
  const u = liste.data?.users.find((x) => x.email?.toLowerCase() === courriel.toLowerCase());
  if (!u) {
    console.error("Erreur :", cree.error.message);
    process.exit(1);
  }
  id = u.id;
  await sb.auth.admin.updateUserById(id, { password: motDePasse });
} else {
  id = cree.data.user.id;
}

const { error } = await sb.from("profils").upsert({ id, courriel, nom, role });
if (error) {
  console.error("Erreur profil :", error.message);
  process.exit(1);
}
console.log(`Compte prêt : ${courriel} (${role})`);
