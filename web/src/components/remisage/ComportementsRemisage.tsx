"use client";

import { useEffect } from "react";
import { demanderRemisage } from "@/actions/reservations";
import { afficherErreur, marquerChamps, verifierTelephone } from "@/lib/validation-client";

// Reprise fidèle de site/js/remisage.js (billet qui se remplit, pieds ou mètres, validation),
// branchée sur l'action serveur demanderRemisage au lieu de Netlify Forms.
const DIMENSIONS = ["longueur", "largeur", "hauteur"] as const;
const PIED = 0.3048;
const CONSEILS: Record<string, Record<string, string> & { exemples?: never }> = {
  roulotte: {
    longueur: "Du bout de l'attache jusqu'à l'arrière, échelle et support à vélo compris.",
    largeur: "Au plus large, auvent replié compris.",
    hauteur: "Du sol jusqu'au point le plus haut : climatiseur, antenne.",
  },
  bateau: {
    longueur: "Du bout de la flèche de la remorque jusqu'au moteur relevé.",
    largeur: "Au plus large, coque ou remorque.",
    hauteur: "Du sol jusqu'au point le plus haut : pare-brise, toit ou tour.",
  },
  auto: {
    longueur: "D'un pare-chocs à l'autre, attache-remorque comprise.",
    largeur: "Rétroviseurs compris.",
    hauteur: "Porte-bagages ou boîte compris. La fiche du fabricant donne ces mesures.",
  },
  moto: {
    longueur: "De la roue avant à l'arrière. Une mesure approximative suffit.",
    largeur: "Guidon compris.",
    hauteur: "Du sol au point le plus haut : pare-brise ou rétroviseurs.",
  },
};
const EXEMPLES: Record<string, string[]> = {
  roulotte: ["28", "8", "11"], bateau: ["22", "8,5", "7"], auto: ["19", "7", "6,5"], moto: ["8", "5", "4,5"],
};

function nombre(v: string): number | null {
  const t = String(v).trim();
  if (!/^\d+([.,]\d+)?$/.test(t)) return null;
  const n = parseFloat(t.replace(",", "."));
  return isFinite(n) && n > 0 ? n : null;
}
const format = (n: number) => n.toLocaleString("fr-CA", { maximumFractionDigits: 1 });
const argent = (n: number) => n.toLocaleString("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: n % 1 ? 2 : 0 });
const calme = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ComportementsRemisage() {
  useEffect(() => {
    const form = document.getElementById("form-remisage") as HTMLFormElement | null;
    if (!form) return;
    const billet = document.getElementById("billet")!;
    const talon = document.getElementById("talon");
    const merci = document.getElementById("merci")!;
    const erreurType = document.getElementById("erreur-type")!;
    const erreurEnvoi = document.getElementById("erreur-envoi")!;
    const champ = (n: string) => form.elements.namedItem(n) as HTMLInputElement;

    const cases: Record<string, HTMLElement[]> = {};
    document.querySelectorAll<HTMLElement>("[data-resume]").forEach((el) => {
      (cases[el.dataset.resume!] ??= []).push(el);
    });
    const typeChoisi = () => form.querySelector<HTMLInputElement>('input[name="type"]:checked');
    const enMetres = () => form.querySelector<HTMLInputElement>('input[name="unite"]:checked')?.value === "metres";
    const versPieds = (n: number) => (enMetres() ? n / PIED : n);
    const symbole = () => (enMetres() ? "m" : "pi");

    const tarif = nombre(form.dataset.prixParPied || "");
    document.querySelectorAll("[data-tarif]").forEach((el) => { if (tarif) el.textContent = argent(tarif) + " le pied"; });
    document.querySelectorAll<HTMLElement>("[data-si-tarif]").forEach((el) => { el.hidden = !tarif; });
    document.querySelectorAll<HTMLElement>(".resume__ligne--prix").forEach((el) => { el.hidden = !tarif; });
    document.querySelectorAll("[data-tarif-court]").forEach((el) => { el.textContent = tarif ? `(${argent(tarif)} / pi)` : ""; });

    const remplir = (cle: string, valeur: string, rempli: boolean) =>
      (cases[cle] ?? []).forEach((el) => { el.textContent = valeur; el.classList.toggle("est-rempli", rempli); });

    const etat = (texte: string, pret: boolean) => {
      if (talon) talon.textContent = texte;
      document.querySelectorAll("[data-etat]").forEach((el) => { el.textContent = texte; el.classList.toggle("est-pret", pret); });
    };

    const majBillet = () => {
      const type = typeChoisi();
      const modele = champ("modele").value.trim();
      if (type) remplir("type", type.value + (modele ? " · " + modele : ""), true);
      else remplir("type", "—", false);
      const dims: Record<string, number | null> = {};
      DIMENSIONS.forEach((d) => {
        dims[d] = nombre(champ(d).value);
        if (dims[d]) remplir(d, `${format(dims[d]!)} ${symbole()}`, true);
        else remplir(d, `— ${symbole()}`, false);
      });
      if (dims.longueur && dims.largeur) {
        const s = dims.longueur * dims.largeur;
        remplir("surface", `${format(enMetres() ? Math.round(s * 10) / 10 : Math.round(s))} ${symbole()}²`, true);
      } else remplir("surface", `— ${symbole()}²`, false);
      if (!dims.longueur) remplir("prix", "—", false);
      else if (tarif) remplir("prix", argent(Math.round(versPieds(dims.longueur) * tarif * 100) / 100), true);
      else remplir("prix", "Prix donné avec l'approbation", false);
      const entree = form.querySelector<HTMLInputElement>('input[name="entree"]:checked');
      remplir("entree", entree ? entree.value.replace(" (voir commentaires)", "") : "—", !!entree);
      const nom = champ("nom").value.trim();
      const tel = champ("telephone").value.trim();
      remplir("nom", nom || "—", !!nom);
      remplir("telephone", tel, true);
      const dimsOk = DIMENSIONS.every((d) => dims[d] && versPieds(dims[d]!) <= Number(champ(d).dataset.max));
      const telOk = tel.replace(/\D/g, "").length >= 10;
      const pret = !!(type && dimsOk && nom && telOk && champ("courriel").checkValidity() && champ("courriel").value && (champ("consentement") as HTMLInputElement).checked);
      etat(pret ? "Prêt à envoyer" : "En attente", pret);
    };

    const majConseils = () => {
      const type = typeChoisi();
      const cle = type?.dataset.schema ?? "roulotte";
      DIMENSIONS.forEach((d, i) => {
        const aide = document.getElementById("aide-" + d);
        if (aide) aide.textContent = CONSEILS[cle][d];
        const ex = nombre(EXEMPLES[cle][i])!;
        const exemple = format(enMetres() ? Math.round(ex * PIED * 10) / 10 : ex);
        champ(d).placeholder = "ex. " + exemple;
        champ(d).dataset.erreur = `Entrez la ${d} en chiffres, en ${enMetres() ? "mètres" : "pieds"} (ex. ${exemple}).`;
      });
      if (type) erreurType.hidden = true;
    };

    const majUnite = (ancienEnMetres: boolean) => {
      const facteur = ancienEnMetres === enMetres() ? 1 : enMetres() ? PIED : 1 / PIED;
      DIMENSIONS.forEach((d) => {
        const n = nombre(champ(d).value);
        if (n && facteur !== 1) champ(d).value = format(Math.round(n * facteur * 10) / 10);
      });
      document.querySelectorAll(".unite-suffixe").forEach((el) => { el.textContent = symbole(); });
      document.querySelectorAll(".unite-texte").forEach((el) => { el.textContent = enMetres() ? " en mètres" : " en pieds"; });
      const note = document.getElementById("note-unite");
      if (note) note.textContent = enMetres()
        ? "En mètres, à 10 centimètres près. Pas sûr? Le manuel du propriétaire indique souvent la longueur et la hauteur."
        : "En pieds, à un demi-pied près. Pas sûr? Le manuel du propriétaire indique souvent la longueur et la hauteur.";
      majConseils();
    };

    const surSaisie = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (el.classList?.contains("dimension") && el.getAttribute("aria-invalid") === "true") {
        const v = nombre(el.value);
        if (v && versPieds(v) <= Number(el.dataset.max)) {
          el.setCustomValidity(""); el.removeAttribute("aria-invalid"); afficherErreur(el, false);
        }
      } else if (el.getAttribute?.("aria-invalid") === "true") {
        if (el.type === "tel") verifierTelephone(el);
        if (el.checkValidity()) { el.removeAttribute("aria-invalid"); afficherErreur(el, false); }
      }
      majBillet();
    };
    const surChangement = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (el.name === "type") { majConseils(); majBillet(); return; }
      if (el.name === "unite") { majUnite(el.value !== "metres"); majBillet(); return; }
      el.setCustomValidity?.("");
      if (el.getAttribute("aria-invalid") === "true" && el.checkValidity()) { el.removeAttribute("aria-invalid"); afficherErreur(el, false); }
      majBillet();
    };

    const valider = () => {
      const type = typeChoisi();
      erreurType.hidden = !!type;
      verifierTelephone(champ("telephone"));
      majConseils();
      form.querySelectorAll<HTMLInputElement>(".dimension").forEach((el) => {
        const v = nombre(el.value);
        const max = Number(el.dataset.max);
        const tropGrand = !!v && versPieds(v) > max;
        if (tropGrand) {
          const maxAffiche = format(enMetres() ? Math.round(max * PIED * 10) / 10 : max);
          el.dataset.erreur = `Au plus ${maxAffiche} ${symbole()}. Plus grand? Appelez-nous au 418 882-9619.`;
        }
        el.setCustomValidity(v && !tropGrand ? "" : "Dimension invalide");
      });
      const invalides = marquerChamps(form.querySelectorAll('input[required]:not([type="radio"]), textarea[required]'));
      const premier = type ? invalides[0] : form.querySelector<HTMLInputElement>('input[name="type"]');
      if (!type) erreurType.scrollIntoView({ block: "center", behavior: calme() ? "auto" : "smooth" });
      if (!premier) { erreurEnvoi.hidden = true; return true; }
      erreurEnvoi.textContent = !type ? "Choisissez le type de véhicule (étape 1)."
        : premier.name === "consentement" ? "Cochez la case de consentement pour envoyer la demande."
        : premier.classList.contains("dimension") ? `Entrez les trois dimensions, en ${enMetres() ? "mètres." : "pieds."}`
        : premier.name === "telephone" ? "Entrez un numéro de téléphone complet, avec l'indicatif régional."
        : premier.name === "courriel" ? "Entrez votre courriel : c'est là qu'on vous envoie le prix et le lien du dépôt."
        : "Remplissez votre nom et votre téléphone.";
      erreurEnvoi.hidden = false;
      premier.focus({ preventScroll: !type });
      return false;
    };

    const surEnvoi = async (e: Event) => {
      e.preventDefault();
      if (!valider()) return;
      const bouton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
      bouton.disabled = true;
      bouton.textContent = "Envoi en cours…";
      try {
        const r = await demanderRemisage(new FormData(form));
        if (!r.ok) {
          erreurEnvoi.textContent = r.erreur;
          erreurEnvoi.hidden = false;
          return;
        }
        billet.classList.add("est-envoye");
        etat("Reçue", true);
        form.hidden = true;
        merci.hidden = false;
        merci.focus({ preventScroll: true });
        merci.scrollIntoView({ behavior: calme() ? "auto" : "smooth", block: "center" });
      } catch {
        erreurEnvoi.textContent = "L'envoi n'a pas fonctionné. Réessayez ou appelez-nous au 418 882-9619.";
        erreurEnvoi.hidden = false;
      } finally {
        bouton.disabled = false;
        bouton.textContent = "Envoyer ma demande";
      }
    };

    const nouvelle = () => {
      const garder = ["nom", "telephone", "courriel"].map((n) => [n, champ(n)?.value ?? ""] as const);
      form.reset();
      garder.forEach(([n, v]) => { if (champ(n)) champ(n).value = v; });
      form.hidden = false;
      merci.hidden = true;
      billet.classList.remove("est-envoye");
      majUnite(false);
      majBillet();
      form.querySelector<HTMLInputElement>('input[name="type"]')?.focus();
    };
    const boutonNouvelle = document.getElementById("nouvelle-demande");

    form.addEventListener("input", surSaisie);
    form.addEventListener("change", surChangement);
    form.addEventListener("submit", surEnvoi);
    boutonNouvelle?.addEventListener("click", nouvelle);
    majConseils();
    majBillet();
    return () => {
      form.removeEventListener("input", surSaisie);
      form.removeEventListener("change", surChangement);
      form.removeEventListener("submit", surEnvoi);
      boutonNouvelle?.removeEventListener("click", nouvelle);
    };
  }, []);
  return null;
}
