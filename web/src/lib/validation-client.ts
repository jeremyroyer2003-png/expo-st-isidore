// Validation des formulaires dans le navigateur (reprise de site/js/site.js) :
// message sous chaque champ invalide, relié par aria-describedby, effacé dès que le champ redevient valide.
// Le serveur revalide toujours tout (lib/validation.ts) : ceci n'est que du confort.

const CHIFFRES_TEL = 10;

export function verifierTelephone(champ: HTMLInputElement) {
  const n = champ.value.replace(/\D/g, "").length;
  const ok = !champ.value || (n >= CHIFFRES_TEL && n <= CHIFFRES_TEL + 1);
  champ.setCustomValidity(ok ? "" : "Numéro incomplet");
}

type Champ = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function messagePour(el: Champ): string {
  if (el.dataset.erreur) return el.dataset.erreur;
  if (el.type === "checkbox") return "Cochez cette case pour envoyer.";
  if (el.type === "radio") return "Choisissez une option.";
  if (el.type === "tel") return "Entrez un numéro complet, avec l'indicatif régional (ex. 418 555-1234).";
  if (el.type === "email") return "Vérifiez le courriel (ex. nom@exemple.com).";
  if (el.type === "date") return "Choisissez une date à venir.";
  if (el.type === "number") return "Entrez un nombre valide.";
  if (el.tagName === "SELECT") return "Choisissez une option dans la liste.";
  return "Ce champ est obligatoire.";
}

export function afficherErreur(el: Champ, visible: boolean) {
  const id = "err-" + (el.id || el.name);
  let msg = document.getElementById(id);
  if (!visible) {
    if (msg) msg.hidden = true;
    return;
  }
  if (!msg) {
    msg = document.createElement("p");
    msg.className = "champ__erreur champ__erreur--champ";
    msg.id = id;
    const champ = el.closest(".champ");
    const bloc = el.closest(".dimension-ligne, .consentement");
    const groupe = el.type === "radio" ? el.closest('[role="radiogroup"]') : null;
    if (groupe) groupe.parentNode!.insertBefore(msg, groupe);
    else if (champ && !bloc) champ.appendChild(msg);
    else {
      const b = (bloc || el.parentNode) as HTMLElement;
      b.parentNode!.insertBefore(msg, b.nextSibling);
    }
    const lies = (el.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
    if (!lies.includes(id)) el.setAttribute("aria-describedby", [...lies, id].join(" "));
  }
  msg.textContent = messagePour(el);
  msg.hidden = false;
}

/** Marque les champs invalides et renvoie la liste (le premier reçoit le focus). */
export function marquerInvalides(form: HTMLFormElement): Champ[] {
  form.querySelectorAll<HTMLInputElement>('input[type="tel"]').forEach(verifierTelephone);
  return marquerChamps(Array.from(form.elements));
}

export function marquerChamps(liste: Iterable<Element>): Champ[] {
  const champs = Array.from(liste).filter(
    (e): e is Champ => e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement,
  );
  return champs.filter((el) => {
    const ok = !el.willValidate || el.checkValidity();
    if (ok) el.removeAttribute("aria-invalid");
    else el.setAttribute("aria-invalid", "true");
    afficherErreur(el, !ok);
    return !ok;
  });
}

/** Efface le message d'un champ dès qu'il redevient valide (à brancher sur onInput/onChange du formulaire). */
export function effacerSiValide(e: React.FormEvent<HTMLFormElement>) {
  const el = e.target as Champ;
  if (!el.getAttribute || el.getAttribute("aria-invalid") !== "true") return;
  if (el.type === "tel") verifierTelephone(el as HTMLInputElement);
  if (el.type === "radio" && el.form) {
    el.form.querySelectorAll(`input[type="radio"][name="${el.name}"]`).forEach((r) => r.removeAttribute("aria-invalid"));
    afficherErreur(el, false);
    return;
  }
  if (el.checkValidity()) {
    el.removeAttribute("aria-invalid");
    afficherErreur(el, false);
  }
}

export function resumeErreur(premier: Champ): string {
  if (premier.type === "checkbox") return premier.dataset.erreur || "Cochez la case de consentement pour envoyer.";
  if (premier.type === "tel") return "Entrez un numéro de téléphone complet, avec l'indicatif régional.";
  if (premier.type === "email") return "Vérifiez l'adresse courriel.";
  return "Remplissez les champs obligatoires.";
}
