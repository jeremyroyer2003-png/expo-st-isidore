"""Importe dans la médiathèque les photos retenues de la page Facebook de l'Expo.

Usage (depuis web/) :
    python -I scripts/importer-photos-fb.py <dossier>

<dossier> contient les photos téléchargées (octets d'origine) et un fichier selection.json :
    [{"fichier": "012_123456789.jpg", "fbid": "123456789", "alt": "…", "categorie": "tire",
      "credit": "ELZEPHOTO", "ordre": 100}, …]

Ce que fait le script, pour chaque photo :
  - deux versions WebP : 1600 px (visionneuse) et 800 px (vignette de la galerie), comme
    l'action « Téléverser » de l'admin (url + vignette);
  - téléversement dans le bucket « medias » sous facebook/<fbid>.webp et facebook/<fbid>-800.webp;
  - une ligne dans la table medias, NON PUBLIÉE : un éditeur la publie dans Admin > Médiathèque
    après avoir vérifié les droits et qu'aucun enfant n'est reconnaissable.

Relancer le script ne crée pas de doublon : une photo dont le chemin existe déjà est sautée.
Lit NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local (jamais affichées).
"""

import io
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

CATEGORIES = {"tire", "animaux", "soirees", "kiosques", "galerie"}
CREDIT_DEFAUT = "Page Facebook de l'Expo (droits à confirmer)"
TAILLES = {"": 1600, "-800": 800}


def lire_env(chemin: Path) -> dict:
    env = {}
    for ligne in chemin.read_text(encoding="utf-8").splitlines():
        ligne = ligne.strip()
        if ligne and not ligne.startswith("#") and "=" in ligne:
            k, v = ligne.split("=", 1)
            env[k.strip()] = v.strip().strip('"')
    return env


ENV = lire_env(Path(__file__).resolve().parent.parent / ".env.local")
URL = ENV["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
CLE = ENV["SUPABASE_SERVICE_ROLE_KEY"]
ENTETES = {"apikey": CLE, "Authorization": f"Bearer {CLE}"}


def requete(methode: str, chemin: str, corps: bytes | None = None, entetes: dict | None = None):
    req = urllib.request.Request(URL + chemin, data=corps, method=methode, headers={**ENTETES, **(entetes or {})})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            texte = r.read().decode("utf-8")
            return json.loads(texte) if texte else None
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{methode} {chemin.split('?')[0]} : {e.code} {e.read().decode('utf-8')[:300]}") from None


def webp(image: Image.Image, largeur: int) -> bytes:
    copie = image.copy()
    copie.thumbnail((largeur, largeur * 4))  # ne grossit jamais une photo plus petite
    tampon = io.BytesIO()
    copie.save(tampon, "WEBP", quality=82, method=6)
    return tampon.getvalue()


def televerser(chemin: str, octets: bytes) -> str:
    requete("POST", f"/storage/v1/object/medias/{chemin}", octets, {"Content-Type": "image/webp", "x-upsert": "true"})
    return f"{URL}/storage/v1/object/public/medias/{chemin}"


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    dossier = Path(sys.argv[1])
    selection = json.loads((dossier / "selection.json").read_text(encoding="utf-8"))

    deja = requete("GET", "/rest/v1/medias?select=chemin&chemin=like.facebook/*")
    existants = {m["chemin"] for m in deja or []}
    ajoutees = sautees = 0

    for p in selection:
        chemin = f"facebook/{p['fbid']}"
        if chemin in existants:
            sautees += 1
            continue
        if p["categorie"] not in CATEGORIES:
            raise SystemExit(f"Album inconnu pour {p['fichier']} : {p['categorie']}")
        if not p.get("alt", "").strip():
            raise SystemExit(f"Description (alt) manquante pour {p['fichier']}")

        image = ImageOps.exif_transpose(Image.open(dossier / p["fichier"])).convert("RGB")
        urls = {suffixe: televerser(f"{chemin}{suffixe}.webp", webp(image, l)) for suffixe, l in TAILLES.items()}
        requete(
            "POST",
            "/rest/v1/medias?on_conflict=chemin",
            json.dumps({
                "chemin": chemin, "type": "photo", "url": urls[""], "vignette": urls["-800"],
                "alt": p["alt"].strip(), "credit": (p.get("credit") or CREDIT_DEFAUT).strip(),
                "categorie": p["categorie"], "publie": False, "ordre": int(p.get("ordre", 999)),
            }).encode("utf-8"),
            {"Content-Type": "application/json", "Prefer": "resolution=ignore-duplicates,return=minimal"},
        )
        ajoutees += 1
        print(f"  + {p['fichier']} -> {p['categorie']}")

    print(f"Terminé : {ajoutees} photo(s) ajoutée(s) (non publiées), {sautees} déjà présente(s).")


if __name__ == "__main__":
    main()
