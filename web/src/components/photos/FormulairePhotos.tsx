"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { confirmerEnvoiPhotos, preparerEnvoiPhotos } from "@/actions/photos-visiteurs";
import { effacerSiValide, marquerInvalides, resumeErreur } from "@/lib/validation-client";

const MAX = 10;
const COTE_MAX = 2400; // les photos de cellulaire sont réduites avant l'envoi (plus rapide, assez net pour le site)

/** Réduit une photo à 2400 px de côté au plus, en JPEG. Si le navigateur ne sait pas la lire, on envoie l'original. */
async function reduire(f: File): Promise<Blob> {
  try {
    const img = await createImageBitmap(f);
    const r = Math.min(1, COTE_MAX / Math.max(img.width, img.height));
    if (r === 1 && f.type === "image/jpeg" && f.size < 2.5e6) return f;
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * r);
    c.height = Math.round(img.height * r);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise<Blob>((ok, non) => c.toBlob((b) => (b ? ok(b) : non(new Error("toBlob"))), "image/jpeg", 0.86));
  } catch {
    return f;
  }
}

export default function FormulairePhotos() {
  const [fichiers, setFichiers] = useState<File[]>([]);
  const [etat, setEtat] = useState<"saisie" | "envoi" | "merci">("saisie");
  const [progres, setProgres] = useState("");
  const [erreur, setErreur] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const apercus = useMemo(() => fichiers.map((f) => URL.createObjectURL(f)), [fichiers]);
  useEffect(() => () => apercus.forEach((u) => URL.revokeObjectURL(u)), [apercus]);

  const choisir = (liste: FileList | null) => {
    const nouvelles = Array.from(liste ?? []).filter((f) => f.type.startsWith("image/"));
    setFichiers((l) => [...l, ...nouvelles].slice(0, MAX));
    setErreur(nouvelles.length + fichiers.length > MAX ? `${MAX} photos au plus par envoi : les autres pourront suivre dans un deuxième envoi.` : "");
  };

  const envoyer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const invalides = marquerInvalides(f);
    if (invalides.length) { setErreur(resumeErreur(invalides[0])); invalides[0].focus(); return; }
    if (!fichiers.length) { setErreur("Choisissez au moins une photo."); return; }
    setErreur("");
    setEtat("envoi");
    try {
      setProgres("Préparation des photos…");
      const blobs = await Promise.all(fichiers.map(reduire));
      const fd = new FormData(f);
      blobs.forEach((b) => fd.append("types", b.type || "image/jpeg"));
      const p = await preparerEnvoiPhotos(fd);
      if (!p.ok) throw new Error(p.erreur);
      const liste = p.televersements ?? [];
      let faits = 0;
      for (let i = 0; i < liste.length; i++) {
        setProgres(`Envoi de la photo ${i + 1} sur ${liste.length}…`);
        const r = await fetch(liste[i].url, { method: "PUT", body: blobs[i], headers: { "content-type": blobs[i].type || "image/jpeg", "x-upsert": "false" } });
        if (r.ok) faits++;
      }
      if (liste.length && !faits) throw new Error("Les photos ne sont pas passées. Vérifiez votre connexion et réessayez.");
      setProgres("Presque fini…");
      fd.set("lot", p.lot ?? "");
      const c = await confirmerEnvoiPhotos(fd);
      if (!c.ok) throw new Error(c.erreur);
      setEtat("merci");
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "L'envoi n'a pas fonctionné. Réessayez.");
      setEtat("saisie");
    }
  };

  if (etat === "merci") {
    return (
      <div className="merci" role="status">
        <h3>Merci, vos photos sont arrivées!</h3>
        <p>Le comité les regarde avant de les publier dans les albums, avec votre nom en crédit. Vous recevez une confirmation par courriel.</p>
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={envoyer} noValidate onInput={effacerSiValide} onChange={effacerSiValide} className="formulaire formulaire--etroit" id="form-photos">
      <p className="visuellement-cache">
        <label>Ne pas remplir&nbsp;: <input name="champ-robot" tabIndex={-1} autoComplete="off" /></label>
      </p>
      <fieldset className="etape">
        <legend className="etape__titre">Vos photos</legend>
        <label className="depot-photos">
          <input type="file" accept="image/*" multiple className="visuellement-cache" onChange={(e) => { choisir(e.target.files); e.target.value = ""; }} />
          <span className="depot-photos__zone">
            <strong>Choisir des photos</strong>
            <span>Jusqu&apos;à {MAX} photos par envoi, directement de votre cellulaire ou de votre ordi.</span>
          </span>
        </label>
        {fichiers.length > 0 && (
          <ul className="depot-photos__liste" aria-label="Photos choisies">
            {fichiers.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={apercus[i]} alt="" />
                <button type="button" onClick={() => setFichiers((l) => l.filter((_, j) => j !== i))} aria-label={`Retirer la photo ${i + 1}`}>×</button>
              </li>
            ))}
          </ul>
        )}
        <div className="coordonnees">
          <label className="champ"><span className="champ__etiquette">Votre nom (pour le crédit)</span><input type="text" name="nom" required autoComplete="name" /></label>
          <label className="champ"><span className="champ__etiquette">Courriel</span><input type="email" name="courriel" required autoComplete="email" /></label>
          <label className="champ champ--large"><span className="champ__etiquette">Un mot sur vos photos <span className="facultatif">(facultatif)</span></span><textarea name="message" rows={2} placeholder="Ex. : tire du samedi soir, jugement Holstein…" /></label>
        </div>
        <label className="consentement">
          <input type="checkbox" name="autorisation" value="oui" required />
          <span>J&apos;ai pris ces photos et j&apos;autorise l&apos;Expo St-Isidore à les publier sur son site et sa page Facebook, avec mon nom comme crédit.</span>
        </label>
        <label className="consentement">
          <input type="checkbox" name="consentement" value="oui" required />
          <span>J&apos;accepte que l&apos;Expo utilise mon nom et mon courriel pour traiter cet envoi, selon sa <Link href="/confidentialite">politique de confidentialité</Link>.</span>
        </label>
      </fieldset>
      <p className="note">Le comité regarde chaque photo avant de la publier. Les photos où un enfant est reconnaissable ne sont pas publiées.</p>
      <p className="champ__erreur formulaire__erreur" role="alert" hidden={!erreur}>{erreur}</p>
      <div className="formulaire__envoi">
        <button type="submit" className="bouton bouton--orange bouton--grand" disabled={etat === "envoi"} aria-busy={etat === "envoi"}>
          {etat === "envoi" ? progres || "Envoi en cours…" : `Envoyer ${fichiers.length > 1 ? `mes ${fichiers.length} photos` : "mes photos"}`}
        </button>
      </div>
    </form>
  );
}
