// Converti automatiquement depuis site/confidentialite.html (contenu d'origine du site statique)

export const meta = { titre: "Politique de confidentialité | Expo St-Isidore", description: "Comment l'Expo St-Isidore recueille, utilise et protège vos renseignements personnels, conformément à la Loi 25." };

export default function PageConfidentialite() {
  return (
    <>

    {/* ===== Héros ===== */}
    <section className="heros heros--page" aria-labelledby="titre-heros">
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <h1 id="titre-heros" className="heros__titre">
            <span>Vos</span>
            <span className="jaune">renseignements</span>
          </h1>
        </div>
        <div className="heros__cote">
          <p className="heros__intro">Ce qu&apos;on recueille, pourquoi, et comment on le protège. Version du 3 novembre 2026.</p>
        </div>
      </div>
    </section>

    <section className="section-papier" aria-label="Politique de confidentialité">
      <div className="contenu section-espacee">
        {/* À confirmer avec le comité : voir A-CONFIRMER.md à la racine du projet */}

        <div className="legal">
          <h2>En bref</h2>
          <ul>
            <li>On recueille seulement ce qu&apos;il faut pour vous répondre.</li>
            <li>On ne vend pas vos renseignements. Ils ne sont transmis qu&apos;à notre hébergeur, qui reçoit les formulaires.</li>
            <li>Le site n&apos;utilise ni Google Analytics, ni témoins publicitaires, ni polices Google.</li>
          </ul>

          <h2>Qui est responsable</h2>
          <p>L&apos;Exposition agricole et commerciale du Bassin de la Chaudière inc. (Expo St-Isidore), 132, route Coulombe, Saint-Isidore (Québec) G0S 2S0.</p>
          <p>Responsable de la protection des renseignements personnels&nbsp;: la présidence de l&apos;Expo, comme le prévoit la Loi 25. Pour la joindre&nbsp;: <a href="mailto:info@expobassinchaudiere.com">info@expobassinchaudiere.com</a> ou <a href="tel:+14188825649">418 882-5649</a>.</p>

          <h2>Ce qu&apos;on recueille, et pourquoi</h2>
          <ul>
            <li><strong>Demande de remisage&nbsp;:</strong> nom, téléphone, courriel (facultatif), type de véhicule, marque et modèle (facultatif), dimensions, entrée souhaitée et commentaires. Pour vérifier l&apos;espace disponible et vous rappeler.</li>
            <li><strong>Demande d&apos;exposant&nbsp;:</strong> nom, entreprise (facultatif), téléphone, courriel, type d&apos;emplacement et description. Pour vous envoyer les disponibilités et les prix.</li>
            <li><strong>Demande de location de salle&nbsp;:</strong> nom, téléphone, courriel (facultatif), type d&apos;événement, date souhaitée et date de rechange, nombre de personnes, durée et commentaires. Pour vérifier la disponibilité et vous rappeler.</li>
            <li><strong>Formulaire de contact&nbsp;:</strong> nom, courriel, téléphone (facultatif), sujet et message. Pour vous répondre.</li>
          </ul>
          <p>Chaque formulaire demande votre consentement avant l&apos;envoi. Vos renseignements servent seulement à la raison indiquée.</p>

          <h2>Qui y a accès</h2>
          <p>Seuls les membres de l&apos;équipe qui traitent votre demande&nbsp;: la coordination, l&apos;équipe du remisage, de la location ou le comité concerné.</p>

          <h2>Où sont-ils conservés</h2>
          <p>Les formulaires sont reçus par l&apos;hébergeur du site, Netlify, dont les serveurs sont situés aux États-Unis. Ils sont conservés le temps de traiter votre demande, puis supprimés.</p>

          <h2>Carte et liens externes</h2>
          <p>La carte de la page Contact vient d&apos;OpenStreetMap, qui reçoit votre adresse IP pour l&apos;afficher, sans témoin publicitaire. Les liens vers Facebook ou Google Maps vous amènent sur ces sites, qui ont leurs propres règles.</p>

          <h2>Vos droits</h2>
          <ul>
            <li>Savoir quels renseignements on détient sur vous et en recevoir une copie.</li>
            <li>Les faire corriger ou supprimer.</li>
            <li>Retirer votre consentement en tout temps.</li>
          </ul>
          <p>Écrivez au responsable ci-dessus; on vous répond dans les 30 jours. Si la réponse ne vous satisfait pas, vous pouvez porter plainte à la <a href="https://www.cai.gouv.qc.ca/" rel="noopener">Commission d&apos;accès à l&apos;information du Québec</a>.</p>

          <h2>En cas d&apos;incident</h2>
          <p>Si un incident touche vos renseignements et présente un risque de préjudice sérieux, on vous avise, ainsi que la Commission d&apos;accès à l&apos;information.</p>
        </div>
      </div>
    </section>
  
    </>
  );
}
