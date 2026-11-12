/** Lien « Exporter (Excel) » : télécharge la liste en CSV pour la comptabilité. */
export default function Exporter({ type, texte = "Exporter (Excel)" }: { type: "salles" | "kiosques" | "remisage" | "danse" | "paiements"; texte?: string }) {
  return (
    <a href={`/admin/export/${type}`} download
      className="px-3 min-h-[40px] inline-flex items-center border-2 border-encre bg-[#FBF6EC] text-encre font-etiquette font-bold no-underline hover:bg-kraft print:hidden">
      {texte} <span aria-hidden="true" className="ml-1">↓</span>
    </a>
  );
}
