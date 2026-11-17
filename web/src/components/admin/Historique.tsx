// Historique d'une réservation ou d'une demande : qui a fait quoi, et quand (table « journal »).
import type { EntreeJournal } from "@/lib/journal";
import { dateHeure } from "@/lib/format";

export default function Historique({ entrees = [], recue, libelleRecue = "Demande reçue", suivi }: {
  entrees?: EntreeJournal[];
  /** Date de création : toujours la première ligne. */
  recue: string;
  libelleRecue?: string;
  /** Page « Ma demande » du client, pour voir ce qu'il voit. */
  suivi?: string;
}) {
  return (
    <details className="text-[14px]">
      <summary className="cursor-pointer font-semibold underline min-h-[32px] inline-flex items-center">Historique ({entrees.length + 1})</summary>
      <ol className="mt-2 grid gap-1.5 border-l-[3px] border-encre/30 pl-3">
        <li><span className="text-gris-brun">{dateHeure(recue)}</span> · <strong>{libelleRecue}</strong></li>
        {entrees.map((e, i) => (
          <li key={i}>
            <span className="text-gris-brun">{dateHeure(e.cree_le)}</span> · <strong>{e.action}</strong>
            {e.par_nom && <> par {e.par_nom}</>}
            {e.details && <span className="block text-gris-brun">{e.details}</span>}
          </li>
        ))}
      </ol>
      {suivi && <p className="mt-2"><a href={suivi} target="_blank" rel="noopener" className="underline">Voir la page « Ma demande » du client</a></p>}
    </details>
  );
}
