// Groupes de choix faits avec des <button role="radio"> : les flèches passent d'un choix à l'autre et le choisissent,
// comme de vrais boutons radio (motif ARIA « radiogroup »). À poser sur le conteneur role="radiogroup".
export function flechesRadio(e: React.KeyboardEvent<HTMLElement>) {
  const pas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!pas) return;
  const radios = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)')];
  if (!radios.length) return;
  e.preventDefault();
  const i = radios.indexOf(document.activeElement as HTMLButtonElement);
  const cible = radios[(i + pas + radios.length) % radios.length];
  cible.focus();
  cible.click();
}

/** Un seul arrêt de tabulation par groupe : le choix actif (ou le premier choix si rien n'est choisi). */
export const arretTab = (actif: boolean, premier: boolean, aucunChoix: boolean) => (actif || (aucunChoix && premier) ? 0 : -1);
