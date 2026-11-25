// Converti automatiquement depuis site/histoire.html (contenu d'origine du site statique)
import Link from "next/link";
import CompteurAnnees from "@/components/site/CompteurAnnees";

export const meta = { titre: "Notre histoire – 28 producteurs, une expo depuis 1982 | Expo St-Isidore", description: "L'histoire de l'Expo St-Isidore : fondée en 1982 par 28 producteurs de la Beauce, de Lévis et de Dorchester. Ligne du temps, bâtisseurs, distinctions et activités d'autrefois." };

export type PhotoComite = { url: string; annee: number; noms: string; credit: string };

export default function PageHistoire({ photoComite }: { photoComite?: PhotoComite | null }) {
  return (
    <>

    {/* ===== Héros ===== */}
    <section className="heros heros--page heros--video" aria-labelledby="titre-heros">
      {/* La photo d'archive du Beauce Média, en sépia, fondue dans les planches */}
      <figure className="heros__media heros__media--archive">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/archive_holstein2009.webp" alt="Jugement Holstein 2009 : éleveurs en blanc avec deux vaches primées, rubans et trophées" width={1041} height={865} fetchPriority="high" />
        <span className="heros__voile" aria-hidden="true" />
        <figcaption className="heros__credit">Archives Beauce Média, 15 juillet 2010</figcaption>
      </figure>
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <p className="billet"><span>Fondée en</span><span>1982</span></p>
          <h1 id="titre-heros" className="heros__titre">
            <span>«&nbsp;Créée par</span>
            <span className="jaune">28 producteurs</span>
            <span>visionnaires&nbsp;»</span>
          </h1>
          <p className="heros__intro">À l&apos;automne 1982, des producteurs de la Beauce, de Lévis et de Dorchester veulent comparer leur bétail. Ils imaginent un «&nbsp;party agricole&nbsp;» ouvert à tous. Plus de 40 ans plus tard, l&apos;Expo est toujours gratuite et toujours portée par des bénévoles. Le titre reprend celui du Beauce Média en 2010.</p>
        </div>
      </div>
    </section>

    {/* ===== Ligne du temps ===== */}
    <section className="section-papier" aria-labelledby="titre-temps">
      <div className="contenu section-espacee bloc">
        <div className="bloc__titre bloc__titre--collant">
          <h2 id="titre-temps" className="titre-affiche">D&apos;un party<br />à une expo</h2>
          <p>Les grandes étapes, d&apos;après le cahier spécial du Beauce Média de 2010 et le site de l&apos;Expo.</p>
          {/* La grande année suit la lecture de la ligne du temps */}
          <CompteurAnnees cible="ligne-histoire" depart="1982" detail="L&apos;idée d&apos;un party agricole" />
        </div>
        <ol className="ligne-temps" id="ligne-histoire">
          <li>
            <span className="ligne-temps__date">1982<small>Automne</small></span>
            <div><h3>L&apos;idée d&apos;un party agricole</h3><p>28 producteurs et productrices de la Beauce, de Lévis et de Dorchester se réunissent pour comparer leur bétail. Plus de 120 têtes Holstein sont prévues. Les municipalités de Saint-Isidore (Village et Paroisse, à l&apos;époque) offrent la location et les terrains à coût dérisoire, en plus de personnel.</p></div>
          </li>
          <li>
            <span className="ligne-temps__date">1983<small>11 février</small></span>
            <div><h3>Lettres patentes</h3><p>Naissance de l&apos;«&nbsp;Exposition agricole et commerciale du Bassin de la Chaudière inc.&nbsp;». Le premier bureau de direction est présidé par Odilon Pelchat.</p></div>
          </li>
          <li>
            <span className="ligne-temps__date">1983</span>
            <div><h3>La première édition</h3><p>J.N. Brochu (aujourd&apos;hui Agri-Marché) commandite la première grange. Les stalles, prêtées par l&apos;Exposition de Chicoutimi, sont montées dans une partie de l&apos;aréna.</p></div>
          </li>
          <li>
            <span className="ligne-temps__date">1984</span>
            <div><h3>Quatre nouvelles étables</h3><p>Une subvention de 150 000&nbsp;$, obtenue avec l&apos;aide du député fédéral Gaston Gourde, permet de construire quatre étables. L&apos;aréna accueille les jugements et les kiosques commerciaux.</p></div>
          </li>
          <li>
            <span className="ligne-temps__date">1985</span>
            <div><h3>Reconnue par le MAPAQ</h3><p>Plus d&apos;exposants agricoles, une sixième étable et la reconnaissance du ministère de l&apos;Agriculture.</p></div>
          </li>
          <li>
            <span className="ligne-temps__date">1989</span>
            <div><h3>Écurie et paddock</h3><p>Deux nouvelles granges, dont une écurie et un paddock.</p></div>
          </li>
          <li>
            <span className="ligne-temps__date">1991</span>
            <div><h3>Le palais des commerces</h3><p>Construction du bâtiment qui abrite encore aujourd&apos;hui les kiosques intérieurs. Suivront le stationnement, l&apos;asphalte et un salon de traite.</p></div>
          </li>
          <li>
            <span className="ligne-temps__date">2010</span>
            <div><h3>Les premiers manèges</h3><p>Pour sa 28<sup>e</sup> édition, l&apos;Expo accueille pour la première fois des manèges, et présente un tracteur New Holland guidé par GPS.</p></div>
          </li>
          <li>
            <span className="ligne-temps__date">2026</span>
            <div><h3>44<sup>e</sup> édition</h3><p>Du 14 au 19 juillet, toujours gratuite. Nouveautés&nbsp;: cinéma extérieur familial, Agriculture 4.0 avec le Cégep de Lévis et présentations de chiens de berger.</p></div>
          </li>
        </ol>
      </div>
    </section>

    {/* ===== Bâtisseurs ===== */}
    <section className="section-papier-2" aria-labelledby="titre-batisseurs">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-batisseurs" className="titre-affiche">Le comité<br />aujourd&apos;hui</h2>
          <p>Quatorze membres au comité et une cinquantaine de bénévoles sur le terrain en juillet&nbsp;: ce sont eux qui font l&apos;Expo, année après année. Une idée, une question pour le comité&nbsp;? <a href="/contact#ecrire">Écrivez-nous</a>.</p>
        </div>
        {/* La photo du comité et les noms, côte à côte et de la même hauteur */}
        <div className={photoComite ? "comite" : ""}>
          {photoComite && (
            <figure className="tirage comite-photo">
              <a href={photoComite.url} target="_blank" rel="noopener">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoComite.url} alt={`Le comité de l'Expo en ${photoComite.annee}. ${photoComite.noms}`} loading="lazy" />
              </a>
            </figure>
          )}
            <ul className="personnes comite__noms">
              <li><strong>Vanessa Plante</strong><span>Présidente, relations d&apos;affaires</span></li>
              <li><strong>Dominik Laterreur</strong><span>1<sup>er</sup> vice-président, tire de tracteurs</span></li>
              <li><strong>Roxanne Larochelle</strong><span>2<sup>e</sup> vice-présidente</span></li>
              <li><strong>Marjolaine Boutin</strong><span>Coordonnatrice</span></li>
              <li><strong>Jimmy Royer</strong><span>Infrastructures et location</span></li>
              <li><strong>Anne-Sophie Jacques</strong><span>Médias sociaux</span></li>
              <li><strong>Jonathan Lehoux</strong><span>Jugements</span></li>
              <li><strong>Raphael Plante</strong><span>Volet artistique</span></li>
              <li><strong>Daniel Blais</strong><span>Liaison avec la municipalité</span></li>
              <li><strong>Raphaëlle Sénéchal</strong><span>Activités familiales</span></li>
              <li><strong>André Labonté</strong><span>Directeur</span></li>
              <li><strong>Tommy Royer</strong><span>Directeur</span></li>
              <li><strong>Sarah-Ève Hallé</strong><span>Directrice</span></li>
              <li><strong>Sébastien Gagné</strong><span>Directeur</span></li>
            </ul>
        </div>
      </div>
    </section>

    {/* ===== Activités d'autrefois ===== */}
    <section className="section-nuit" aria-labelledby="titre-souvenirs">
      <div className="contenu section-espacee bloc">
        <div className="bloc__titre">
          <h2 id="titre-souvenirs" className="titre-affiche">Vous vous<br />en souvenez?</h2>
          <p>Des activités qui ont marqué l&apos;Expo au fil des ans, tirées du programme de 2010.</p>
        </div>
        <div>
          <ul className="mur-mots">
            <li>Super Rodéo de cochons</li>
            <li>Course de cochons d&apos;Inde</li>
            <li>Parade de mode de lapins</li>
            <li>Le chant du coq</li>
            <li>Salon des curiosités et son lama</li>
            <li>La Petite ferme</li>
            <li>Bête de Scène</li>
            <li>Expo-Banquet</li>
            <li>Atchoum le clown</li>
            <li>Jeux loufoques de pirates</li>
          </ul>
          <p className="mur-mots__note">Toujours là&nbsp;: l&apos;entrée gratuite, le Beach Party, la tire de tracteurs, les jugements Holstein, les feux d&apos;artifice et la messe du dimanche.</p>
          <p className="espace-haut"><Link className="bouton bouton--orange" href="/contact#ecrire">Vous avez des photos d&apos;époque? Écrivez-nous</Link></p>
        </div>
      </div>
    </section>

    {/* ===== Sources ===== */}
    <section className="section-papier-2" aria-labelledby="titre-sources">
      <div className="contenu sources">
        <h2 id="titre-sources" className="surtitre surtitre--orange">Sources</h2>
        <p className="credits">«&nbsp;L&apos;Expo&nbsp;: une histoire remplie de gens passionnés&nbsp;», cahier spécial du Beauce Média, 15 juillet 2010, p. 18 (archives BAnQ; une copie du cahier est conservée dans les archives de l&apos;Expo). Site de l&apos;Expo, section À propos. Publications Facebook de l&apos;Expo (octobre 2026). Une correction ou un souvenir à ajouter? <Link href="/contact#ecrire">Écrivez-nous</Link>.</p>
      </div>
    </section>
  
    </>
  );
}
