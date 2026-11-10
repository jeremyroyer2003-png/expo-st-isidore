import Link from "next/link";

export default function Pied() {
  return (
    <footer className="pied">
      <div className="contenu pied__interieur">
        <div className="pied__haut">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pied__logo" src="/images/logo-expo-blanc.webp" alt="Expo St-Isidore – Bassin de la Chaudière" width={300} height={174} loading="lazy" />
          <div className="pied__colonnes">
            <address className="pied__bloc">
              <strong>Nous trouver</strong>
              <span>132, route Coulombe</span>
              <span>Saint-Isidore (Québec) G0S 2S0</span>
              <a href="https://www.google.com/maps/search/?api=1&amp;query=132+route+Coulombe+Saint-Isidore+QC+G0S+2S0" rel="noopener">Itinéraire</a>
            </address>
            <div className="pied__bloc">
              <strong>Nous joindre</strong>
              <span>Bureau&nbsp;: <a href="tel:+14188825649">418 882-5649</a></span>
              <span>Coordination (cell.)&nbsp;: <a href="tel:+14183860484">418 386-0484</a></span>
              <span>Remisage&nbsp;: <a href="tel:+14188829619">418 882-9619</a></span>
              <a href="mailto:info@expobassinchaudiere.com">info@expobassinchaudiere.com</a>
            </div>
            <div className="pied__bloc">
              <strong>Suivre l&apos;Expo</strong>
              <a href="https://www.facebook.com/expostisidorebassinchaudiere/" rel="noopener">Facebook</a>
              <Link href="/contact#visiter">Infos pratiques</Link>
              <Link href="/location">Location de salle</Link>
              <Link href="/kiosques">Réserver un kiosque</Link>
              <Link href="/remisage">Remisage d&apos;hiver</Link>
            </div>
          </div>
        </div>
        <div className="pied__bas">
          <span>© 2026 Expo St-Isidore · <Link href="/confidentialite">Politique de confidentialité</Link></span>
          <span>Maquette de démonstration – proposition de refonte</span>
        </div>
      </div>
    </footer>
  );
}
