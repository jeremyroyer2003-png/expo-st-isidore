// Converti automatiquement depuis site/exposants.html (contenu d'origine du site statique)
import Link from "next/link";
import FormulaireSimple from "@/components/formulaires/FormulaireSimple";
import { envoyerMessage } from "@/actions/messages";

export const meta = { titre: "Exposants – kiosques, jugements et inscription | Expo St-Isidore", description: "Exposer à l'Expo St-Isidore : kiosques intérieurs et extérieurs, agroalimentaire, artisanat et jugements Holstein. Documents et demande d'inscription." };

export default function PageExposants() {
  return (
    <>

    {/* ===== Héros ===== */}
    <section className="heros heros--page" aria-labelledby="titre-heros">
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <p className="billet"><span>Kiosques</span><span>Jugements</span></p>
          <h1 id="titre-heros" className="heros__titre">
            <span>Réservez</span>
            <span className="jaune">votre kiosque</span>
          </h1>
          <p className="heros__intro">Producteurs, concessionnaires, commerçants et artisans&nbsp;: en 2026, les kiosques étaient ouverts du jeudi au dimanche, au cœur de l&apos;Expo.</p>
          <div className="groupe-boutons">
            <a className="bouton bouton--orange" href="#inscription">Réserver un emplacement</a>
            <a className="bouton bouton--contour" href="#documents">Documents</a>
          </div>
        </div>
        <div className="heros__photo">
          <figure className="tirage">
            <img src="/images/photos/kiosques-interieurs-800.webp" alt="Allée de kiosques intérieurs animée dans le palais des commerces" width="800" height="533" />
            <figcaption>Le palais des commerces</figcaption>
          </figure>
        </div>
      </div>
    </section>

    {/* ===== Pourquoi exposer ===== */}
    <section className="section-papier" aria-labelledby="titre-pourquoi">
      <div className="contenu section-espacee bloc">
        <div className="bloc__titre">
          <h2 id="titre-pourquoi" className="titre-affiche">Pourquoi<br />exposer?</h2>
          <p>Devant les producteurs, les familles et les acheteurs de la région.</p>
        </div>
        <dl className="liste-questions">
          <div><dt>Éleveurs</dt><dd>Les jugements Holstein favorisent les échanges entre producteurs et font connaître le travail des éleveurs d&apos;ici au grand public.</dd></div>
          <div><dt>Concessionnaires et fournisseurs</dt><dd>Contact direct avec les producteurs, sur le terrain, avec votre machinerie et vos nouveautés.</dd></div>
          <div><dt>Commerçants de la région</dt><dd>Une nouvelle clientèle et la chance de montrer vos produits et services locaux.</dd></div>
          <div><dt>Producteurs agroalimentaires</dt><dd>Dégustation et vente, regroupés en petit marché public dans le palais des commerces.</dd></div>
        </dl>
      </div>
    </section>

    {/* ===== Emplacements ===== */}
    <section className="section-papier-2" aria-labelledby="titre-emplacements">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-emplacements" className="titre-affiche">Votre<br />emplacement</h2>
          <p>Les kiosques intérieurs se choisissent maintenant sur le plan du palais des commerces; les kiosques extérieurs se demandent en ligne. Pour les autres emplacements, remplissez le formulaire plus bas.</p>
          <p className="groupe-boutons"><Link className="bouton bouton--orange" href="/kiosques">Choisir un kiosque sur le plan <span className="fleche" aria-hidden="true">→</span></Link><Link className="bouton bouton--contour" href="/kiosques#exterieur">Kiosque extérieur</Link></p>
        </div>
        <dl className="liste-questions liste-questions--grille">
          <div><dt>Kiosque extérieur</dt><dd>Sur le terrain de l&apos;Expo, pour la machinerie, les concessionnaires et les fournisseurs.</dd></div>
          <div><dt>Kiosque intérieur</dt><dd>Dans le palais des commerces, à l&apos;abri.</dd></div>
          <div><dt>Agroalimentaire</dt><dd>Dans le palais des commerces, avec dégustation et vente.</dd></div>
          <div><dt>Restauration</dt><dd>Le volet restauration des kiosques agroalimentaires, coordonné par Mathieu Privé.</dd></div>
          <div><dt>Artisanat</dt><dd>Une place réservée aux artisans de la région.</dd></div>
          <div><dt>Exposant agricole</dt><dd>Jugement des bovins Holstein et jugement des jeunes éleveurs, à la tente de jugement.</dd></div>
        </dl>
        <div className="rangee-photos">
          <figure className="tirage"><img src="/images/photos/machinerie-exterieure-800.webp" alt="Allée de machinerie agricole neuve exposée à l'extérieur" width="800" height="533" loading="lazy" /><figcaption>Kiosques extérieurs</figcaption></figure>
          <figure className="tirage"><img src="/images/photos/agroalimentaire-800.webp" alt="Exposante qui présente ses produits à un kiosque agroalimentaire" width="800" height="533" loading="lazy" /><figcaption>Agroalimentaire</figcaption></figure>
          <figure className="tirage"><img src="/images/photos/holstein-jugement-800.webp" alt="Vaches Holstein alignées devant le juge dans l'arène de jugement" width="800" height="533" loading="lazy" /><figcaption>Jugement Holstein</figcaption></figure>
        </div>
      </div>
    </section>

    {/* ===== Documents ===== */}
    <section id="documents" className="section-papier" aria-labelledby="titre-documents">
      <div className="contenu section-espacee bloc">
        <div className="bloc__titre">
          <h2 id="titre-documents" className="titre-affiche">Les<br />documents</h2>
          <p>Chaque document indique son année.</p>
        </div>
        <ul className="documents">
          <li><div><strong>Formulaire de réservation de kiosque</strong><span>Édition 2027</span></div><span className="etat etat--a-venir">À venir</span></li>
          <li><div><strong>Invitation kiosques extérieurs</strong><span>Édition 2027</span></div><span className="etat etat--a-venir">À venir</span></li>
          <li><div><strong>Invitation kiosques intérieurs</strong><span>Édition 2027</span></div><span className="etat etat--a-venir">À venir</span></li>
          <li><div><strong>Invitation kiosques agroalimentaires</strong><span>Édition 2027</span></div><span className="etat etat--a-venir">À venir</span></li>
          <li><div><strong>Invitation artisanat</strong><span>Édition 2027</span></div><span className="etat etat--a-venir">À venir</span></li>
          <li><div><strong>Plan du site et des kiosques</strong><span>Édition 2027</span></div><span className="etat etat--a-venir">À venir</span></li>
          <li><div><strong>Normes des bovins laitiers</strong><span>Version 2018, la plus récente publiée</span></div><a className="etat" href="https://expobassinchaudiere.com/wp-content/uploads/2018/07/NORMES-DES-BOVINS-LAITIERS-2018.pdf" rel="noopener">PDF 2018<span className="visuellement-cache"> : normes des bovins laitiers</span></a></li>
          <li><div><strong>Règlements généraux, bovins</strong><span>Version 2018, la plus récente publiée</span></div><a className="etat" href="https://expobassinchaudiere.com/wp-content/uploads/2018/07/R%C3%A8glements-g%C3%A9n%C3%A9raux-bovin-2018.pdf" rel="noopener">PDF 2018<span className="visuellement-cache"> : règlements généraux, bovins</span></a></li>
        </ul>
      </div>
    </section>

    {/* ===== Inscription ===== */}
    <section id="inscription" className="section-papier-2" aria-labelledby="titre-inscription">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-inscription" className="titre-affiche">Agroalimentaire,<br />restauration, artisanat</h2>
          <p>Dites-nous ce que vous cherchez. Marjolaine Boutin, coordonnatrice, communique avec vous pour vous donner les disponibilités et les prix. Vous pouvez aussi l&apos;appeler au <a href="tel:+14183860484">418 386-0484</a> (cellulaire) ou au <a href="tel:+14188825649">418 882-5649</a> (bureau).</p>
        </div>

        <FormulaireSimple action={envoyerMessage} id="form-exposants" bouton="Envoyer ma demande" merci={<><h3>Merci, c&apos;est reçu!</h3>
          <p>On communique avec vous pour les disponibilités et les prix. Si c&apos;est pressant&nbsp;: <a href="tel:+14183860484">418 386-0484</a>.</p></>}>
          <input type="hidden" name="formulaire" value="exposants" />
          <fieldset className="etape">
            <legend className="etape__titre">Votre demande</legend>
            <div className="coordonnees">
              <label className="champ"><span className="champ__etiquette">Nom complet</span><input type="text" name="nom" required autoComplete="name" /></label>
              <label className="champ"><span className="champ__etiquette">Entreprise ou ferme <span className="facultatif">(facultatif)</span></span><input type="text" name="entreprise" autoComplete="organization" /></label>
              <label className="champ"><span className="champ__etiquette">Téléphone</span><input type="tel" name="telephone" required autoComplete="tel" inputMode="tel" /></label>
              <label className="champ"><span className="champ__etiquette">Courriel</span><input type="email" name="courriel" required autoComplete="email" /></label>
              <label className="champ champ--large"><span className="champ__etiquette">Type d&apos;emplacement</span>
                <select name="emplacement" required>
                  <option value="">Choisir…</option>
                  <option>Kiosque extérieur</option>
                  <option>Kiosque intérieur</option>
                  <option>Agroalimentaire</option>
                  <option>Restauration</option>
                  <option>Artisanat</option>
                  <option>Exposant agricole (jugements)</option>
                  <option>Je ne sais pas encore</option>
                </select>
              </label>
              <label className="champ champ--large"><span className="champ__etiquette">Ce que vous exposez <span className="facultatif">(facultatif)</span></span><textarea name="message" rows={4} placeholder="Produits, machinerie, espace souhaité, besoin d'électricité…"></textarea></label>
            </div>
            <label className="consentement">
              <input type="checkbox" name="consentement" value="oui" required />
              <span>J&apos;accepte que l&apos;Expo St-Isidore utilise ces renseignements seulement pour répondre à ma demande, selon sa <Link href="/confidentialite">politique de confidentialité</Link>.</span>
            </label>
          </fieldset>
        </FormulaireSimple>
        
      </div>
    </section>
  
    </>
  );
}
