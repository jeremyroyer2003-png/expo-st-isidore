import FormAction from "@/components/admin/FormAction";
import { annulerEtRembourser } from "@/actions/admin/gestion";
import { champCls, etiquetteCls } from "@/components/admin/ui";

/**
 * Bloc « Annuler et rembourser ». Qui annule décide des frais :
 * le client paie les frais d'annulation (pré-remplis, modifiables); l'Expo rembourse au complet.
 */
export default function Annulation({ type, id, fraisCents, paye }: { type: "salle" | "kiosque" | "remisage" | "danse"; id: string; fraisCents: number; paye: boolean }) {
  return (
    <details className="mt-1">
      <summary className="cursor-pointer text-[14px] font-semibold text-rouge underline">Annuler{paye ? " et rembourser" : ""}</summary>
      <FormAction action={annulerEtRembourser} bouton={paye ? "Annuler et rembourser" : "Annuler"} style="danger" className="mt-2 grid gap-2"
        confirmer={paye ? "Annuler cette réservation et rembourser le client? Le remboursement Stripe est immédiat." : "Annuler cette réservation?"}>
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="id" value={id} />
        <fieldset className="grid gap-1">
          <legend className={etiquetteCls}>Qui annule?</legend>
          <label className="flex items-start gap-2 min-h-[40px] text-[14px]">
            <input type="radio" name="par" value="client" defaultChecked className="mt-1" />
            <span><strong>Le client</strong>{paye ? " : les frais d'annulation ci-dessous sont retenus" : ""}</span>
          </label>
          <label className="flex items-start gap-2 min-h-[40px] text-[14px]">
            <input type="radio" name="par" value="expo" className="mt-1" />
            <span><strong>L&apos;Expo</strong>{paye ? " : remboursement complet, aucuns frais, courriel d'excuse" : ""}</span>
          </label>
        </fieldset>
        {paye && (
          <label>
            <span className={etiquetteCls}>Frais retenus si le client annule ($)</span>
            <input name="frais" type="number" min={0} step="0.01" defaultValue={(fraisCents / 100).toFixed(2)} className={`${champCls} w-[110px]`} />
          </label>
        )}
        <label className="flex items-center gap-2 min-h-[40px] text-[14px]"><input type="checkbox" name="aviser" value="oui" defaultChecked /> Aviser le client par courriel</label>
      </FormAction>
    </details>
  );
}
