// Converti automatiquement depuis site/remisage.html (contenu d'origine du site statique)
import Link from "next/link";

export const meta = { titre: "Remisage intérieur d'hiver – roulottes, VR, autos, bateaux | Expo St-Isidore", description: "Remisage intérieur et assuré pour roulottes, VR, autos, pick-ups, bateaux, motos et Spyder à Saint-Isidore, en Beauce. Entrée mi-octobre, sortie mi-mai. Envoyez vos dimensions, on vous rappelle." };

import ComportementsRemisage from "@/components/remisage/ComportementsRemisage";

export default function PageRemisage({ prixParPied, depotMin }: { prixParPied: number | null; depotMin: string | null }) {
  return (
    <>
      <ComportementsRemisage />


    {/* ===== Héros ===== */}
    <section className="heros" aria-labelledby="titre-heros">
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <p className="billet"><span><span className="seulement-hiver-ligne">Entrées en cours</span><span className="seulement-ete-ligne">Entrée mi-octobre</span></span><span>Sortie mi-mai</span></p>
          <h1 id="titre-heros" className="heros__titre heros__titre--remisage">
            <span>Remisage</span>
            <span className="jaune">intérieur</span>
            <span className="contour">d&apos;hiver</span>
          </h1>
        </div>
        <div className="heros__cote">
          <p className="heros__intro">Votre roulotte, votre auto ou votre bateau à l&apos;abri de la neige tout l&apos;hiver, dans les bâtiments de l&apos;Expo à Saint-Isidore. <span className="seulement-hiver-ligne">Encore de la place cet hiver&nbsp;? Ça dépend de la taille. </span>Envoyez vos dimensions : on regarde l&apos;espace et on vous répond par courriel.</p>
          <div className="groupe-boutons">
            <a className="bouton bouton--orange" href="#demande">Envoyer mes dimensions</a>
            <a className="bouton bouton--contour" href="tel:+14188829619">Appeler le 418 882-9619</a>
          </div>
        </div>
      </div>

      <dl className="contenu chiffres chiffres--texte">
        <div><dt>Où</dt><dd>À l&apos;intérieur</dd></div>
        <div><dt>Protection</dt><dd>Assuré</dd></div>
        <div><dt>Expérience</dt><dd>Plus de 20 ans</dd></div>
        <div><dt>Prix</dt><dd className="jaune">Selon la longueur</dd></div>
      </dl>
    </section>

    {/* ===== Bandeau : ce qu'on remise ===== */}
    <div className="bandeau">
      <div className="bandeau__piste">
        <ul className="bandeau__groupe" aria-label="Véhicules acceptés">
          <li>Roulottes<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>VR<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Autos<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Pick-ups<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Bateaux<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Motos<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Spyder<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
        </ul>
        <ul className="bandeau__groupe" aria-hidden="true">
          <li>Roulottes<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>VR<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Autos<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Pick-ups<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Bateaux<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Motos<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Spyder<svg fill="#15202A"><use href="#separateur" /></svg></li>
        </ul>
      </div>
    </div>

    {/* ===== Demande en 3 étapes ===== */}
    <section id="demande" className="section-papier" aria-labelledby="titre-demande">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-demande" className="titre-affiche">Votre place<br />en 3 étapes</h2>
          <p>L&apos;espace dépend de la taille de chaque véhicule. Avec vos dimensions, l&apos;équipe vérifie l&apos;espace, puis vous répond par courriel. Comptez deux minutes, ruban à mesurer en main.</p>
        </div>

        <div className="demande">
          {/* Le tarif au pied vient de l'admin (Prix > remisage_pied); vide tant qu'il est « à confirmer » */}
          <form id="form-remisage" className="formulaire" data-prix-par-pied={prixParPied ?? ""} noValidate>
            <p className="visuellement-cache"><label>Ne pas remplir&nbsp;: <input name="champ-robot" tabIndex={-1} autoComplete="off" /></label></p>

            {/* Étape 1 */}
            <fieldset className="etape" aria-describedby="erreur-type">
              <legend className="etape__titre"><span className="etape__num" aria-hidden="true">1</span>Quel véhicule?</legend>
              <p className="champ__erreur" id="erreur-type" hidden>Choisissez le type de véhicule.</p>
              <div className="choix-grille">
                <label className="choix">
                  <input type="radio" name="type" value="Roulotte" required data-schema="roulotte" />
                  <span className="choix__carte">
                    <span className="choix__nom">Roulotte</span>
                    <span className="choix__ex">De voyage, à sellette ou tente-roulotte</span>
                  </span>
                </label>
                <label className="choix">
                  <input type="radio" name="type" value="Motorisé (VR)" data-schema="roulotte" />
                  <span className="choix__carte">
                    <span className="choix__nom">Motorisé</span>
                    <span className="choix__ex">Classe A, B ou C</span>
                  </span>
                </label>
                <label className="choix">
                  <input type="radio" name="type" value="Bateau sur remorque" data-schema="bateau" />
                  <span className="choix__carte">
                    <span className="choix__nom">Bateau</span>
                    <span className="choix__ex">Sur sa remorque</span>
                  </span>
                </label>
                <label className="choix">
                  <input type="radio" name="type" value="Auto ou pick-up" data-schema="auto" />
                  <span className="choix__carte">
                    <span className="choix__nom">Auto ou <span className="sans-coupure">pick-up</span></span>
                    <span className="choix__ex">Auto, VUS ou camionnette</span>
                  </span>
                </label>
                <label className="choix">
                  <input type="radio" name="type" value="Moto ou Spyder" data-schema="moto" />
                  <span className="choix__carte">
                    <span className="choix__nom">Moto ou Spyder</span>
                    <span className="choix__ex">Deux ou trois roues</span>
                  </span>
                </label>
                <label className="choix">
                  <input type="radio" name="type" value="Autre" data-schema="auto" />
                  <span className="choix__carte">
                    <span className="choix__nom">Autre</span>
                    <span className="choix__ex">Précisez en commentaire</span>
                  </span>
                </label>
              </div>
              <label className="champ champ--court" id="champ-modele">
                <span className="champ__etiquette">Marque et modèle <span className="facultatif">(facultatif)</span></span>
                <input type="text" name="modele" autoComplete="off" placeholder="ex. Jayco Jay Flight 28BHS" />
              </label>
            </fieldset>

            {/* Étape 2 */}
            <fieldset className="etape">
              <legend className="etape__titre"><span className="etape__num" aria-hidden="true">2</span>Ses dimensions</legend>
              <fieldset className="unites">
                <legend>Vous mesurez en&nbsp;:</legend>
                <label className="unites__choix"><input type="radio" name="unite" value="pieds" defaultChecked /><span>Pieds</span></label>
                <label className="unites__choix"><input type="radio" name="unite" value="metres" /><span>Mètres</span></label>
              </fieldset>
              <div className="dimensions">
                <div className="dimension-ligne">
                  <label className="champ" htmlFor="longueur"><span className="champ__etiquette">Longueur<span className="visuellement-cache unite-texte"> en pieds</span></span></label>
                  <span className="champ__unite"><input type="text" id="longueur" name="longueur" data-erreur="Entrez la mesure en chiffres, dans l'unité choisie (ex. 28)." data-max="60" required inputMode="decimal" autoComplete="off" className="dimension" placeholder="ex. 28" aria-describedby="aide-longueur" /><span className="unite-suffixe" aria-hidden="true">pi</span></span>
                  <p className="dimension-ligne__aide" id="aide-longueur">Du bout de l&apos;attache jusqu&apos;à l&apos;arrière, échelle et support à vélo compris.</p>
                </div>
                <div className="dimension-ligne">
                  <label className="champ" htmlFor="largeur"><span className="champ__etiquette">Largeur<span className="visuellement-cache unite-texte"> en pieds</span></span></label>
                  <span className="champ__unite"><input type="text" id="largeur" name="largeur" data-erreur="Entrez la mesure en chiffres, dans l'unité choisie (ex. 28)." data-max="20" required inputMode="decimal" autoComplete="off" className="dimension" placeholder="ex. 8" aria-describedby="aide-largeur" /><span className="unite-suffixe" aria-hidden="true">pi</span></span>
                  <p className="dimension-ligne__aide" id="aide-largeur">Au plus large, auvent replié compris.</p>
                </div>
                <div className="dimension-ligne">
                  <label className="champ" htmlFor="hauteur"><span className="champ__etiquette">Hauteur<span className="visuellement-cache unite-texte"> en pieds</span></span></label>
                  <span className="champ__unite"><input type="text" id="hauteur" name="hauteur" data-erreur="Entrez la mesure en chiffres, dans l'unité choisie (ex. 28)." data-max="20" required inputMode="decimal" autoComplete="off" className="dimension" placeholder="ex. 11" aria-describedby="aide-hauteur" /><span className="unite-suffixe" aria-hidden="true">pi</span></span>
                  <p className="dimension-ligne__aide" id="aide-hauteur">Du sol jusqu&apos;au point le plus haut&nbsp;: climatiseur, antenne.</p>
                </div>
              </div>
              <p className="note" id="note-unite">En pieds, à un demi-pied près. Pas sûr? Le manuel du propriétaire indique souvent la longueur et la hauteur.</p>
              <p className="avis-mesure"><strong>Le prix se calcule sur la longueur.</strong> Chaque véhicule est mesuré à son arrivée et le prix final se base sur cette mesure&nbsp;: mesurez bien pour éviter les surprises.</p>
            </fieldset>

            {/* Étape 3 */}
            <fieldset className="etape">
              <legend className="etape__titre"><span className="etape__num" aria-hidden="true">3</span>Vos coordonnées</legend>
              <div className="coordonnees">
                <label className="champ">
                  <span className="champ__etiquette">Nom complet</span>
                  <input type="text" name="nom" required autoComplete="name" />
                </label>
                <label className="champ">
                  <span className="champ__etiquette">Téléphone</span>
                  <input type="tel" name="telephone" required autoComplete="tel" inputMode="tel" placeholder="418 555-1234" />
                </label>
                <label className="champ champ--large">
                  <span className="champ__etiquette">Courriel</span>
                  <input type="email" name="courriel" required autoComplete="email" data-erreur="Entrez votre courriel : c'est là qu'on vous envoie le prix et le lien du dépôt." />
                </label>
                <fieldset className="champ champ--large entree-souhaitee">
                  <legend className="champ__etiquette">Entrée souhaitée</legend>
                  <label className="entree-souhaitee__choix"><input type="radio" name="entree" value="Dès que possible" defaultChecked /> Dès que possible</label>
                  <label className="entree-souhaitee__choix"><input type="radio" name="entree" value="À une date précise (voir commentaires)" /> À une date précise</label>
                </fieldset>
                <label className="champ champ--large">
                  <span className="champ__etiquette">Commentaires <span className="facultatif">(facultatif)</span></span>
                  <textarea name="message" rows={3} placeholder="Extensions, accessoires, date d'entrée si vous en avez une…"></textarea>
                </label>
              </div>
              <label className="consentement">
                <input type="checkbox" name="consentement" value="oui" required />
                <span>J&apos;accepte que l&apos;Expo St-Isidore utilise ces renseignements seulement pour répondre à ma demande de remisage, selon sa <Link href="/confidentialite">politique de confidentialité</Link>.</span>
              </label>
            </fieldset>

            {/* Mini-billet : sur téléphone, le billet complet est plus bas; ce résumé reste collé au bas de l'écran pendant la saisie */}
            <div className="mini-billet" aria-hidden="true">
              <span className="mini-billet__ligne"><span data-resume="type">—</span></span>
              <span className="mini-billet__ligne"><span data-resume="longueur">— pi</span> × <span data-resume="largeur">— pi</span></span>
              <span className="mini-billet__etat" data-etat>En attente</span>
            </div>
            <p className="champ__erreur formulaire__erreur" id="erreur-envoi" role="alert" hidden></p>
            <div className="formulaire__envoi">
              <button type="submit" className="bouton bouton--orange bouton--grand">Envoyer ma demande</button>
              <p>Vous préférez parler à quelqu&apos;un? <a href="tel:+14188829619">418 882-9619</a></p>
            </div>
          </form>

          {/* Message après l'envoi : prend la place du formulaire, à côté du billet tamponné */}
          <div className="merci" id="merci" tabIndex={-1} hidden>
            <h3>Merci, c&apos;est reçu!</h3>
            <p>On regarde l&apos;espace disponible pour votre véhicule. Si on a de la place, vous recevez par courriel le prix de la saison et le lien pour payer le dépôt{depotMin ? <> (au moins {depotMin})</> : null} qui garde votre place. On vous appelle ensuite au <strong data-resume="telephone"></strong> pour fixer la date d&apos;entrée.</p>
            <dl className="merci__recap">
              <div><dt>Véhicule</dt><dd data-resume="type">—</dd></div>
              <div><dt>Longueur</dt><dd data-resume="longueur">—</dd></div>
              <div><dt>Au nom de</dt><dd data-resume="nom">—</dd></div>
            </dl>
            <p className="merci__garder">Pas de nouvelles d&apos;ici quelques jours&nbsp;? Appelez le remisage au <a href="tel:+14188829619">418 882-9619</a>.</p>
            <button type="button" className="lien-action" id="nouvelle-demande">Faire une autre demande</button>
          </div>

          {/* Billet qui se remplit pendant la saisie */}
          <aside className="demande__cote" aria-label="Résumé de votre demande">
            <div className="billet-remisage billet-remisage--resume" id="billet">
              <div className="billet-remisage__corps">
                <p className="surtitre">Billet de remisage · hiver 2026-2027</p>
                <dl className="resume">
                  <div className="resume__ligne resume__ligne--large"><dt>Véhicule</dt><dd data-resume="type">—</dd></div>
                  <div className="resume__ligne"><dt>Longueur</dt><dd data-resume="longueur">— pi</dd></div>
                  <div className="resume__ligne"><dt>Largeur</dt><dd data-resume="largeur">— pi</dd></div>
                  <div className="resume__ligne"><dt>Hauteur</dt><dd data-resume="hauteur">— pi</dd></div>
                  <div className="resume__ligne"><dt>Espace au sol</dt><dd data-resume="surface">— pi²</dd></div>
                  <div className="resume__ligne resume__ligne--large"><dt>Entrée souhaitée</dt><dd data-resume="entree">Dès que possible</dd></div>
                  <div className="resume__ligne resume__ligne--large"><dt>Au nom de</dt><dd data-resume="nom">—</dd></div>
                  <div className="resume__ligne resume__ligne--large resume__ligne--prix"><dt>Estimation <span data-tarif-court></span></dt><dd data-resume="prix">—</dd></div>
                </dl>
                <p className="resume__avis">Prix final selon la longueur mesurée à l&apos;arrivée.</p>
                <dl className="billet-remisage__dates">
                  <div><dt>Entrée</dt><dd><span className="seulement-hiver-ligne">en cours</span><span className="seulement-ete-ligne">mi-octobre</span></dd></div>
                  <div><dt>Sortie</dt><dd>mi-mai</dd></div>
                </dl>
              </div>
              <div className="billet-remisage__talon" aria-hidden="true"><span id="talon">En attente</span></div>
              <p className="tampon" id="tampon" aria-hidden="true">Demande reçue</p>
            </div>
          </aside>
        </div>

        <aside className="ensuite ensuite--bande" aria-labelledby="titre-ensuite">
          <h3 id="titre-ensuite">Ce qui arrive ensuite</h3>
          <ol>
            <li><strong>On vérifie l&apos;espace</strong> pour votre véhicule, selon ses dimensions.</li>
            <li><strong>Vous recevez le prix par courriel</strong>, avec le lien pour payer le dépôt{depotMin ? <> (au moins {depotMin})</> : null} qui garde votre place. On vous appelle ensuite pour fixer la date d&apos;entrée.</li>
            <li><strong>Vous arrivez, on mesure</strong>, et votre véhicule dort au sec jusqu&apos;à la mi-mai.</li>
          </ol>
          <p>Pressé? Le remisage répond au <a href="tel:+14188829619">418 882-9619</a>.</p>
        </aside>

      </div>
    </section>

    {/* ===== Bon à savoir ===== */}
    <section className="section-papier-2" aria-labelledby="titre-savoir">
      <div className="contenu section-espacee savoir">
        <h2 id="titre-savoir" className="titre-affiche">Bon<br />à savoir</h2>
        <dl className="liste-questions">
          <div><dt>Combien ça coûte?</dt><dd>Le prix se calcule selon la longueur hors tout, attache comprise&nbsp;: <strong data-tarif>le tarif au pied vous est donné avec votre prix, par courriel</strong>.<span data-si-tarif hidden> Votre estimation apparaît sur le billet dès que vous entrez la longueur.</span> On mesure chaque véhicule à son arrivée et le prix final se base sur cette mesure.</dd></div>
          <div><dt>Reste-t-il de la place?</dt><dd>Ça dépend de la taille de votre véhicule&nbsp;: une moto se case plus facilement qu&apos;une roulotte de 35 pieds. Envoyez vos dimensions et on vous répond franchement.</dd></div>
          <div><dt>Quand entrer et sortir?</dt><dd>Les entrées commencent vers la mi-octobre et les sorties se font vers la mi-mai. On fixe votre date au téléphone.</dd></div>
          <div><dt>Est-ce assuré?</dt><dd>Oui. Le remisage se fait à l&apos;intérieur des bâtiments de l&apos;Expo et il est assuré. L&apos;équipe fait ça depuis plus de 20 ans.</dd></div>
        </dl>
        {/* À confirmer avec le comité : voir A-CONFIRMER.md à la racine du projet */}
      </div>
    </section>

  
    </>
  );
}
