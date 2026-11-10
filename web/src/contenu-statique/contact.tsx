// Converti automatiquement depuis site/contact.html (contenu d'origine du site statique)
import Link from "next/link";
import FormulaireSimple from "@/components/formulaires/FormulaireSimple";
import { envoyerMessage } from "@/actions/messages";

export const meta = { titre: "Infos pratiques – venir à l'Expo et nous joindre | Expo St-Isidore", description: "Venir à l'Expo St-Isidore : dates, adresse, stationnement et accès. Bureau 418 882-5649, remisage 418 882-9619, 132, route Coulombe, Saint-Isidore." };

export default function PageContact() {
  return (
    <>

    {/* ===== Héros ===== */}
    <section className="heros heros--page heros--compact" aria-labelledby="titre-heros">
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <h1 id="titre-heros" className="heros__titre">
            <span>Infos</span>
            <span className="jaune">pratiques</span>
          </h1>
        </div>
        <div className="heros__cote">
          <p className="heros__intro">Tout pour venir à l&apos;Expo et pour nous joindre. Le bureau répond au <a className="lien-clair" href="tel:+14188825649">418 882-5649</a>.</p>
          <div className="groupe-boutons">
            <a className="bouton bouton--orange" href="https://www.google.com/maps/dir/?api=1&destination=132+route+Coulombe+Saint-Isidore+QC+G0S+2S0" rel="noopener">Itinéraire</a>
            <a className="bouton bouton--contour" href="#ecrire">Écrire un message</a>
          </div>
        </div>
      </div>
    </section>

    {/* ===== Venir à l'Expo ===== */}
    <section id="visiter" className="section-papier" aria-labelledby="titre-visiter">
      <div className="contenu section-espacee bloc">
        <div className="bloc__titre">
          <h2 id="titre-visiter" className="titre-affiche">Venir<br />à l&apos;Expo</h2>
          <p>Les réponses aux questions qu&apos;on nous pose le plus souvent avant l&apos;Expo.</p>
        </div>
        <dl className="liste-questions liste-questions--grille">
          <div><dt>Quand?</dt><dd>En juillet. Les dates 2027 seront annoncées au printemps; en 2026, l&apos;Expo avait lieu du 14 au 19 juillet.</dd></div>
          <div><dt>Où?</dt><dd>132, route Coulombe, Saint-Isidore (Québec) G0S 2S0, en Beauce.</dd></div>
          <div><dt>Combien?</dt><dd>L&apos;entrée est gratuite. Certaines activités sont payantes, comme la tire de tracteurs et les soirées de danse.</dd></div>
          <div><dt>Stationnement</dt><dd>Payant, à proximité du site.</dd></div>
          <div><dt>Heures d&apos;ouverture</dt><dd>Les heures de chaque activité sont dans la <Link href="/programmation">programmation</Link>.</dd></div>
          <div><dt>Animaux de compagnie</dt><dd>Les chiens sont permis, en laisse.</dd></div>
          <div><dt>Manger sur place</dt><dd>Casse-croûte, camion de rue et aire de pique-nique. Salle de dégustation pour les produits de la région.</dd></div>
          <div><dt>Pour les enfants</dt><dd>Mini-ferme, jeux gonflables et Place de la famille Desjardins.</dd></div>
          <div><dt>Bingo</dt><dd>Pendant l&apos;Expo. L&apos;horaire est dans la <Link href="/programmation">programmation</Link>.</dd></div>
          <div><dt>Accessibilité</dt><dd>Pour l&apos;accès en fauteuil roulant ou les toilettes adaptées, appelez le bureau&nbsp;: on vous indique le meilleur trajet.</dd></div>
          <div><dt>Paiement sur place</dt><dd>Les modes de paiement varient selon le kiosque; prévoyez un peu de comptant. Le bar est réservé aux 18 ans et plus.</dd></div>
        </dl>
      </div>
      <div className="contenu carte-rangee">
        <figure className="carte">
          <iframe title="Carte : l'Expo St-Isidore au 132, route Coulombe, Saint-Isidore" src="https://www.openstreetmap.org/export/embed.html?bbox=-71.0960%2C46.5790%2C-71.0700%2C46.5915&layer=mapnik&marker=46.58529%2C-71.08294" loading="lazy"></iframe>
          <figcaption>Carte © les contributeurs d&apos;<a href="https://www.openstreetmap.org/?mlat=46.58529&mlon=-71.08294#map=16/46.58529/-71.08294" rel="noopener">OpenStreetMap</a>, sans témoin publicitaire. <a href="https://www.google.com/maps/dir/?api=1&destination=132+route+Coulombe+Saint-Isidore+QC+G0S+2S0" rel="noopener">Itinéraire dans Google Maps</a></figcaption>
        </figure>
      </div>
    </section>

    {/* ===== Coordonnées ===== */}
    <section className="section-papier-2" aria-labelledby="titre-coordonnees">
      <div className="contenu section-espacee bloc">
        <div className="bloc__titre">
          <h2 id="titre-coordonnees" className="titre-affiche">Nous<br />joindre</h2>
          <p>Laissez un message si personne ne répond&nbsp;: on vous rappelle. Pendant l&apos;Expo, l&apos;équipe est sur le terrain.</p>
        </div>
        <dl className="coord-grille">
          <div><dt>Bureau</dt><dd><a href="tel:+14188825649">418 882-5649</a></dd></div>
          <div><dt>Cellulaire</dt><dd><a href="tel:+14183860484">418 386-0484</a><small>Marjolaine Boutin, coordonnatrice</small></dd></div>
          <div><dt>Remisage d&apos;hiver</dt><dd><a href="tel:+14188829619">418 882-9619</a><small><Link href="/remisage">Envoyer mes dimensions</Link></small></dd></div>
          <div><dt>Courriel</dt><dd className="coord-grille__long"><a href="mailto:info@expobassinchaudiere.com">info@expobassinchaudiere.com</a></dd></div>
          <div><dt>Adresse</dt><dd className="coord-grille__moyen">132, route Coulombe<small>Saint-Isidore (Québec) G0S 2S0</small></dd></div>
          <div><dt>Facebook</dt><dd className="coord-grille__moyen"><a href="https://www.facebook.com/expostisidorebassinchaudiere/" rel="noopener">Expo St-Isidore</a><small>Nouvelles et albums photos</small></dd></div>
        </dl>
      </div>
    </section>

    {/* ===== Formulaire ===== */}
    <section id="ecrire" className="section-papier" aria-labelledby="titre-ecrire">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-ecrire" className="titre-affiche">Écrivez-<br />nous</h2>
          <p>Pour un kiosque, une commandite, du bénévolat ou une simple question. On répond par courriel ou par téléphone.</p>
        </div>
        <FormulaireSimple action={envoyerMessage} id="form-contact" bouton="Envoyer le message" merci={<><h3>Merci, c&apos;est reçu!</h3>
          <p>On vous répond dès que possible. Si c&apos;est pressant, appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p></>}>
          <input type="hidden" name="formulaire" value="contact" />
          <fieldset className="etape">
            <legend className="etape__titre">Votre message</legend>
            <div className="coordonnees">
              <label className="champ"><span className="champ__etiquette">Nom complet</span><input type="text" name="nom" required autoComplete="name" /></label>
              <label className="champ"><span className="champ__etiquette">Courriel</span><input type="email" name="courriel" required autoComplete="email" /></label>
              <label className="champ"><span className="champ__etiquette">Téléphone <span className="facultatif">(facultatif)</span></span><input type="tel" name="telephone" autoComplete="tel" inputMode="tel" /></label>
              <label className="champ"><span className="champ__etiquette">Sujet</span>
                <select name="sujet" required>
                  <option value="">Choisir…</option>
                  <option>Question générale</option>
                  <option>Kiosque ou exposant</option>
                  <option>Remisage d&apos;hiver</option>
                  <option>Commandite ou partenariat</option>
                  <option>Bénévolat</option>
                  <option>Tire de tracteurs</option>
                  <option>Photos ou souvenirs d&apos;époque</option>
                  <option>Autre</option>
                </select>
              </label>
              <label className="champ champ--large"><span className="champ__etiquette">Message</span><textarea name="message" rows={5} required></textarea></label>
            </div>
            <label className="consentement">
              <input type="checkbox" name="consentement" value="oui" required />
              <span>J&apos;accepte que l&apos;Expo St-Isidore utilise ces renseignements seulement pour répondre à mon message, selon sa <Link href="/confidentialite">politique de confidentialité</Link>.</span>
            </label>
          </fieldset>
        </FormulaireSimple>
        
      </div>
    </section>
  
    </>
  );
}
