// Page Photos : un en-tête qui est déjà une galerie, des albums en vraies couvertures, puis les photos.

export const meta = { titre: "Photos – tire, jugements, spectacles et kiosques | Expo St-Isidore", description: "Les photos de l'Expo St-Isidore : tire de tracteurs, jugements Holstein, spectacles sous le chapiteau, kiosques et machinerie." };

import Galerie from "@/components/photos/Galerie";
import FormulairePhotos from "@/components/photos/FormulairePhotos";
import { ALBUMS } from "@/lib/albums";
import type { Media } from "@/lib/donnees";

// Mosaïque de l'en-tête : une photo forte par grande activité de l'Expo
const MOSAIQUE = [
  { f: "tire-bleu-nuit", alt: "Tracteur modifié bleu, roues avant levées, sous les projecteurs" },
  { f: "holstein-rosettes-rouges", alt: "Vache Holstein portant ses rosettes rouges de championne" },
  { f: "spectacle-bras-leves", alt: "Foule les bras levés devant la scène, sous les projecteurs" },
  { f: "machinerie-exterieure", alt: "Allée de machinerie agricole neuve exposée à l'extérieur" },
];

export default function PagePhotos({ medias }: { medias: Media[] }) {
  const photos = medias.filter((m) => m.type === "photo");
  const videos = medias.filter((m) => m.type === "video");
  const albums = [...new Set(photos.map((m) => m.categorie))].sort(
    (a, b) => Object.keys(ALBUMS).indexOf(a) - Object.keys(ALBUMS).indexOf(b),
  );
  // Couverture de chaque album : sa première photo (l'ordre de la médiathèque)
  const couvertures = albums.map((al) => {
    const liste = photos.filter((m) => m.categorie === al);
    return { cle: al, titre: ALBUMS[al] ?? al, nb: liste.length, photo: liste[0] };
  });

  return (
    <>

    {/* ===== Héros : une mosaïque de photos fondue dans les planches ===== */}
    <section className="heros heros--page heros--video" aria-labelledby="titre-heros">
      <div className="heros__media heros__media--mosaique" aria-hidden="true">
        {MOSAIQUE.map((m) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={m.f} src={`/images/photos/${m.f}-800.webp`} alt="" loading="eager" />
        ))}
        <span className="heros__voile" />
      </div>
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <p className="billet"><span>L&apos;Expo</span><span>en images</span></p>
          <h1 id="titre-heros" className="heros__titre"><span>Photos</span></h1>
          <p className="heros__intro">La tire sous les projecteurs, les jugements, le chapiteau plein et les kiosques. Choisissez un album, puis touchez une photo pour l&apos;agrandir.</p>
        </div>
      </div>
    </section>

    {/* ===== Les albums, en couvertures ===== */}
    <section className="section-papier" aria-labelledby="titre-albums">
      <div className="contenu section-espacee">
        <h2 id="titre-albums" className="titre-affiche espace-bas">Les albums</h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {couvertures.map((a, i) => (
            <li key={a.cle} className="anim-monter" style={{ animationDelay: `${i * 70}ms` }}>
              <a href={`#album-${a.cle}`}
                className="fiche-horaire group relative flex h-[230px] sm:h-[280px] items-end overflow-hidden border-[3px] border-encre shadow-affiche text-creme no-underline transition-transform duration-200 hover:-translate-y-1 hover:shadow-[9px_9px_0_#1E140D] motion-reduce:hover:translate-y-0">
                {a.photo && (
                  <span className="fiche-horaire__photo absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.photo.url} alt="" loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:group-hover:scale-100" />
                    <span aria-hidden="true" className="photos__voile-album absolute inset-0" />
                  </span>
                )}
                <span className="relative flex w-full items-end justify-between gap-4 p-5">
                  <span>
                    <span className="block font-etiquette font-bold uppercase tracking-[.14em] text-[14px] text-moutarde">{a.nb} photo{a.nb > 1 ? "s" : ""}</span>
                    <span className="block font-affiche text-[28px] sm:text-[32px] leading-[1.05] text-creme">{a.titre}</span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 grid h-12 w-12 place-items-center border-2 border-creme font-etiquette text-[22px] text-creme transition group-hover:bg-creme group-hover:text-encre">↓</span>
                </span>
              </a>
            </li>
          ))}
          {videos.length > 0 && (
            <li>
              <a href="#album-videos" className="fiche-horaire group flex h-full min-h-[120px] items-center justify-between gap-4 border-[3px] border-encre shadow-affiche p-5 text-creme no-underline transition-transform hover:-translate-y-1">
                <span>
                  <span className="block font-etiquette font-bold uppercase tracking-[.14em] text-[14px] text-moutarde">{videos.length} vidéo{videos.length > 1 ? "s" : ""}</span>
                  <span className="block font-affiche text-[28px] leading-[1.05] text-creme">Vidéos</span>
                </span>
                <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full border-2 border-creme text-[18px] text-creme">▶</span>
              </a>
            </li>
          )}
        </ul>
      </div>
    </section>

    {/* ===== Les photos ===== */}
    <section className="section-papier-2" aria-label="Albums photos">
      <div className="contenu section-espacee">
        <Galerie medias={medias} />
        <p className="credits">Photos&nbsp;: ELZEPHOTO, Lyse Neuville Photography, Cynthia Fillion Photographe, tirsQC.com et archives de l&apos;Expo. Certaines photos de tire ont été prises à d&apos;autres événements de l&apos;ASTTQ. Des centaines d&apos;autres photos dans les <a href="https://www.facebook.com/expostisidorebassinchaudiere/" rel="noopener">albums Facebook de l&apos;Expo</a>.</p>
      </div>
    </section>

    {/* ===== Vos photos ===== */}
    <section id="vos-photos" className="section-papier" aria-labelledby="titre-vos-photos">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-vos-photos" className="titre-affiche">Vous avez pris<br />des photos&nbsp;?</h2>
          <p>Envoyez-nous vos plus belles photos de l&apos;Expo&nbsp;: la tire, les animaux, les spectacles, les kiosques. Le comité les regarde, puis les publie dans les albums avec votre nom en crédit.</p>
        </div>
        <FormulairePhotos />
      </div>
    </section>
    </>
  );
}
