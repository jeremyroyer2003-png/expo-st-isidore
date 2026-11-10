import { redirect } from "next/navigation";
import FormAction from "@/components/admin/FormAction";
import { changerRole, creerCompte, supprimerCompte } from "@/actions/admin/comptes";
import { Carte, champCls, etiquetteCls, Tableau, Titre } from "@/components/admin/ui";
import { exigerAdmin, NOMS_ROLES, type Role } from "@/lib/admin";

export const metadata = { title: "Utilisateurs" };

const DESCRIPTIONS: Record<Role, string> = {
  super_admin: "Tout, y compris les comptes.",
  editeur: "Calendrier, prix, contenu, photos, approbations et remboursements.",
  lecteur: "Tableaux de bord en lecture seule.",
};

export default async function Page() {
  const { sb, profil } = await exigerAdmin();
  if (profil.role !== "super_admin") redirect("/admin");
  const { data } = await sb.from("profils").select("*").order("cree_le");

  return (
    <>
      <Titre sous="Prévu : un super-admin, trois éditeurs et quelques lecteurs. Les admins se connectent avec leur courriel et un mot de passe.">Utilisateurs</Titre>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] items-start">
        <Carte>
          <Tableau entetes={["Nom", "Courriel", "Rôle", ""]}>
            {(data ?? []).map((u) => (
              <tr key={u.id}>
                <td className="font-semibold">{u.nom}</td>
                <td>{u.courriel}</td>
                <td>
                  {u.id === profil.id ? <span>{NOMS_ROLES[u.role as Role]} (vous)</span> : (
                    <FormAction action={changerRole} bouton="Changer" style="secondaire" enLigne>
                      <input type="hidden" name="id" value={u.id} />
                      <select name="role" defaultValue={u.role} aria-label={`Rôle de ${u.nom}`} className={`${champCls} w-auto`}>
                        {(Object.keys(NOMS_ROLES) as Role[]).map((r) => <option key={r} value={r}>{NOMS_ROLES[r]}</option>)}
                      </select>
                    </FormAction>
                  )}
                </td>
                <td>{u.id !== profil.id && <FormAction action={supprimerCompte} bouton="Supprimer" style="danger" enLigne confirmer={`Supprimer le compte de ${u.nom}?`}><input type="hidden" name="id" value={u.id} /></FormAction>}</td>
              </tr>
            ))}
          </Tableau>
          <ul className="mt-4 grid gap-1 text-[14px] text-gris-brun">
            {(Object.keys(DESCRIPTIONS) as Role[]).map((r) => <li key={r}><strong className="text-encre">{NOMS_ROLES[r]}</strong> : {DESCRIPTIONS[r]}</li>)}
          </ul>
        </Carte>
        <Carte titre="Ajouter un admin">
          <FormAction action={creerCompte} bouton="Créer le compte">
            <label><span className={etiquetteCls}>Nom</span><input name="nom" required className={champCls} /></label>
            <label><span className={etiquetteCls}>Courriel</span><input name="courriel" type="email" required className={champCls} /></label>
            <label><span className={etiquetteCls}>Rôle</span>
              <select name="role" defaultValue="editeur" className={champCls}>{(Object.keys(NOMS_ROLES) as Role[]).map((r) => <option key={r} value={r}>{NOMS_ROLES[r]}</option>)}</select>
            </label>
            <label><span className={etiquetteCls}>Mot de passe temporaire (10 caractères ou plus)</span><input name="motdepasse" type="text" minLength={10} required autoComplete="off" className={champCls} /></label>
            <p className="text-[14px] text-gris-brun">Transmettez-le de vive voix, jamais par courriel.</p>
          </FormAction>
        </Carte>
      </div>
    </>
  );
}
