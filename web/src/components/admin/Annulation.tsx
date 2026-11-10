import FormAction from "@/components/admin/FormAction";
import { annulerEtRembourser } from "@/actions/admin/gestion";
import { champCls, etiquetteCls } from "@/components/admin/ui";

/** Bloc « Annuler et rembourser » : frais d'annulation pré-remplis, modifiables. */
export default function Annulation({ type, id, fraisCents, paye }: { type: "salle" | "kiosque" | "remisage" | "danse"; id: string; fraisCents: number; paye: boolean }) {
  return (
    <details className="mt-1">
      <summary className="cursor-pointer text-[14px] font-semibold text-rouge underline">Annuler{paye ? " et rembourser" : ""}</summary>
      <FormAction action={annulerEtRembourser} bouton={paye ? "Annuler et rembourser" : "Annuler"} style="danger" enLigne className="mt-2"
        confirmer={paye ? "Annuler cette réservation et rembourser le client (moins les frais)? Le remboursement Stripe est immédiat." : "Annuler cette réservation?"}>
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="id" value={id} />
        {paye && (
          <label>
            <span className={etiquetteCls}>Frais retenus ($)</span>
            <input name="frais" type="number" min={0} step="0.01" defaultValue={(fraisCents / 100).toFixed(2)} className={`${champCls} w-[110px]`} />
          </label>
        )}
        <label className="flex items-center gap-2 min-h-[40px] text-[14px]"><input type="checkbox" name="aviser" value="oui" defaultChecked /> Aviser le client</label>
      </FormAction>
    </details>
  );
}
