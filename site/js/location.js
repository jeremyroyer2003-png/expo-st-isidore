// Location de salle : le billet de réservation se remplit pendant la saisie (même idée que le remisage).
// L'envoi lui-même est géré par site.js (formulaire data-envoi-simple).
(function () {
  var form = document.getElementById('form-location');
  if (!form) return;
  var billet = document.getElementById('billet');
  var merci = document.getElementById('merci-location');

  var cases = {};
  document.querySelectorAll('[data-resume]').forEach(function (el) {
    (cases[el.dataset.resume] = cases[el.dataset.resume] || []).push(el);
  });
  function remplir(cle, valeur) {
    (cases[cle] || []).forEach(function (el) {
      el.textContent = valeur || '—';
      el.classList.toggle('est-rempli', !!valeur);
    });
  }
  function etat(texte, pret) {
    document.querySelectorAll('[data-etat]').forEach(function (el) {
      el.textContent = texte;
      el.classList.toggle('est-pret', !!pret);
    });
  }
  function champ(nom) { return form.elements[nom]; }
  function dateLisible(v) {
    if (!v) return '';
    var p = v.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('fr-CA', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // La date de rechange doit venir en plus de la date souhaitée, pas la répéter ni la précéder
  function verifierRechange() {
    var d = champ('date').value, r = champ('date_rechange');
    if (d) r.min = d;
    var ok = !r.value || !d || r.value > d;
    r.setCustomValidity(ok ? '' : 'Date de rechange invalide');
    r.dataset.erreur = 'Choisissez une date de rechange après la date souhaitée.';
  }

  function maj() {
    var salle = form.querySelector('input[name="salle"]:checked');
    remplir('salle', salle ? salle.value : '');
    remplir('type', champ('type').value);
    remplir('date', dateLisible(champ('date').value));
    remplir('date_rechange', dateLisible(champ('date_rechange').value));
    var n = champ('personnes').value;
    remplir('personnes', n ? n + (Number(n) > 1 ? ' personnes' : ' personne') : '');
    remplir('duree', champ('duree').value.trim());
    remplir('nom', champ('nom').value.trim());
    remplir('telephone', champ('telephone').value.trim());
    verifierRechange();
    Expo.verifierTelephone(champ('telephone'));
    // « Prêt » seulement si l'envoi passerait vraiment (champs obligatoires, téléphone, consentement)
    etat(form.checkValidity() ? 'Prêt à envoyer' : 'En attente', form.checkValidity());
  }

  form.addEventListener('input', maj);
  form.addEventListener('change', maj);

  // « Choisir cette salle » sous les photos : coche la bonne carte puis descend au formulaire
  document.querySelectorAll('[data-choisir-salle]').forEach(function (lien) {
    lien.addEventListener('click', function () {
      var radio = form.querySelector('input[name="salle"][value="' + lien.dataset.choisirSalle + '"]');
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        // Le focus suit le choix : le clavier et les lecteurs d'écran arrivent sur la bonne carte
        setTimeout(function () { radio.focus({ preventScroll: true }); }, 0);
      }
    });
  });

  // Envoi réussi (site.js cache le formulaire) : le billet reçoit son tampon
  new MutationObserver(function () {
    if (form.hidden) { billet.classList.add('est-envoye'); etat('Reçue', true); }
  }).observe(form, { attributes: true, attributeFilter: ['hidden'] });

  document.getElementById('nouvelle-demande').addEventListener('click', function () {
    var garder = ['nom', 'telephone', 'courriel'].map(function (n) { return [n, champ(n).value]; });
    form.reset();
    garder.forEach(function (p) { champ(p[0]).value = p[1]; });
    form.hidden = false;
    merci.hidden = true;
    billet.classList.remove('est-envoye');
    maj();
    form.querySelector('input[name="salle"]').focus();
  });

  maj();
})();
