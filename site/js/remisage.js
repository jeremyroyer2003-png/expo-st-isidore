(function () {
  var form = document.getElementById('form-remisage');
  if (!form) return;

  var billet = document.getElementById('billet');
  var talon = document.getElementById('talon');
  var merci = document.getElementById('merci');
  var erreurType = document.getElementById('erreur-type');
  var erreurEnvoi = document.getElementById('erreur-envoi');
  var DIMENSIONS = ['longueur', 'largeur', 'hauteur'];
  var PIED = 0.3048;

  // Les exemples et les maximums (data-max) sont exprimés en pieds
  var CONSEILS_EN_PIEDS = {
    roulotte: {
      longueur: "Du bout de l'attache jusqu'à l'arrière, échelle et support à vélo compris.",
      largeur: "Au plus large, auvent replié compris.",
      hauteur: "Du sol jusqu'au point le plus haut : climatiseur, antenne.",
      exemples: ['28', '8', '11']
    },
    bateau: {
      longueur: "Du bout de la flèche de la remorque jusqu'au moteur relevé.",
      largeur: "Au plus large, coque ou remorque.",
      hauteur: "Du sol jusqu'au point le plus haut : pare-brise, toit ou tour.",
      exemples: ['22', '8,5', '7']
    },
    auto: {
      longueur: "D'un pare-chocs à l'autre, attache-remorque comprise.",
      largeur: "Rétroviseurs compris.",
      hauteur: "Porte-bagages ou boîte compris. La fiche du fabricant donne ces mesures.",
      exemples: ['19', '7', '6,5']
    },
    moto: {
      longueur: "De la roue avant à l'arrière. Une mesure approximative suffit.",
      largeur: "Guidon compris.",
      hauteur: "Du sol au point le plus haut : pare-brise ou rétroviseurs.",
      exemples: ['8', '5', '4,5']
    }
  };

  // Cases du billet, repérées une seule fois
  var cases = {};
  document.querySelectorAll('[data-resume]').forEach(function (el) {
    (cases[el.dataset.resume] = cases[el.dataset.resume] || []).push(el);
  });

  function champ(nom) { return form.elements[nom]; }
  function typeChoisi() { return form.querySelector('input[name="type"]:checked'); }
  function enMetres() { return form.querySelector('input[name="unite"]:checked').value === 'metres'; }
  function versPieds(n) { return enMetres() ? n / PIED : n; }
  function symbole() { return enMetres() ? 'm' : 'pi'; }

  function nombre(v) {
    var n = parseFloat(String(v).replace(',', '.'));
    return isFinite(n) && n > 0 ? n : null;
  }
  function format(n) { return n.toLocaleString('fr-CA', { maximumFractionDigits: 1 }); }
  function argent(n) {
    return n.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: n % 1 ? 2 : 0 });
  }

  // Tarif au pied : un seul endroit à modifier, l'attribut data-prix-par-pied du formulaire
  var tarif = nombre(form.dataset.prixParPied || '');
  document.querySelectorAll('[data-tarif]').forEach(function (el) {
    if (tarif) el.textContent = argent(tarif) + ' le pied';
  });
  // Sans tarif inscrit, on ne promet pas d'estimation : la ligne disparaît du billet
  document.querySelectorAll('[data-si-tarif]').forEach(function (el) { el.hidden = !tarif; });
  document.querySelectorAll('.resume__ligne--prix').forEach(function (el) { el.hidden = !tarif; });
  document.querySelectorAll('[data-tarif-court]').forEach(function (el) {
    el.textContent = tarif ? '(' + argent(tarif) + ' / pi)' : '';
  });

  function remplir(cle, valeur, rempli) {
    (cases[cle] || []).forEach(function (el) {
      el.textContent = valeur;
      el.classList.toggle('est-rempli', rempli);
    });
  }

  function majBillet() {
    var type = typeChoisi();
    var modele = champ('modele').value.trim();
    if (type) remplir('type', type.value + (modele ? ' · ' + modele : ''), true);
    else remplir('type', '—', false);

    var dims = {};
    DIMENSIONS.forEach(function (d) {
      dims[d] = nombre(champ(d).value);
      if (dims[d]) remplir(d, format(dims[d]) + ' ' + symbole(), true);
      else remplir(d, '— ' + symbole(), false);
    });

    if (dims.longueur && dims.largeur) {
      var surface = dims.longueur * dims.largeur;
      remplir('surface', format(enMetres() ? Math.round(surface * 10) / 10 : Math.round(surface)) + ' ' + symbole() + '²', true);
    } else {
      remplir('surface', '— ' + symbole() + '²', false);
    }

    if (!dims.longueur) remplir('prix', '—', false);
    else if (tarif) remplir('prix', argent(Math.round(versPieds(dims.longueur) * tarif * 100) / 100), true);
    else remplir('prix', 'Tarif donné au téléphone', false);

    var nom = champ('nom').value.trim();
    var telephone = champ('telephone').value.trim();
    remplir('nom', nom || '—', !!nom);
    remplir('telephone', telephone, true);

    var pret = type && dims.longueur && dims.largeur && dims.hauteur && nom && telephone;
    talon.textContent = pret ? 'Prêt à envoyer' : 'En attente';
    document.querySelectorAll('[data-etat]').forEach(function (el) {
      el.textContent = talon.textContent;
      el.classList.toggle('est-pret', !!pret);
    });
  }

  function majConseils() {
    var type = typeChoisi();
    var c = CONSEILS_EN_PIEDS[type ? type.dataset.schema : 'roulotte'];
    DIMENSIONS.forEach(function (d, i) {
      document.getElementById('aide-' + d).textContent = c[d];
      var ex = nombre(c.exemples[i]);
      champ(d).placeholder = 'ex. ' + format(enMetres() ? Math.round(ex * PIED * 10) / 10 : ex);
    });
    if (type) erreurType.hidden = true;
  }

  // Convertit ce qui est déjà tapé quand on change d'unité
  function majUnite(ancienEnMetres) {
    var facteur = ancienEnMetres === enMetres() ? 1 : (enMetres() ? PIED : 1 / PIED);
    DIMENSIONS.forEach(function (d) {
      var n = nombre(champ(d).value);
      if (n && facteur !== 1) champ(d).value = format(Math.round(n * facteur * 10) / 10);
    });
    document.querySelectorAll('.unite-suffixe').forEach(function (el) { el.textContent = symbole(); });
    document.querySelectorAll('.unite-texte').forEach(function (el) { el.textContent = enMetres() ? ' en mètres' : ' en pieds'; });
    document.getElementById('note-unite').textContent = enMetres()
      ? 'En mètres, à 10 centimètres près. Pas sûr? Le manuel du propriétaire indique souvent la longueur et la hauteur.'
      : 'En pieds, à un demi-pied près. Pas sûr? Le manuel du propriétaire indique souvent la longueur et la hauteur.';
    majConseils();
  }

  form.addEventListener('input', majBillet);
  form.addEventListener('change', function (e) {
    var nom = e.target.name;
    if (nom === 'type') { majConseils(); majBillet(); return; }
    if (nom === 'unite') { majUnite(e.target.value !== 'metres'); majBillet(); return; }
    // setCustomValidity reste actif tant qu'on ne l'efface pas
    e.target.setCustomValidity('');
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) {
      e.target.removeAttribute('aria-invalid');
      Expo.afficherErreur(e.target, false);
    }
  });

  function valider() {
    var type = typeChoisi();
    erreurType.hidden = !!type;

    Expo.verifierTelephone(champ('telephone'));
    form.querySelectorAll('.dimension').forEach(function (el) {
      var v = nombre(el.value);
      el.setCustomValidity(v && versPieds(v) <= Number(el.dataset.max) ? '' : 'Dimension invalide');
    });
    var invalides = Expo.marquerInvalides(form.querySelectorAll('input[required]:not([type="radio"]), textarea[required]'));
    var premier = type ? invalides[0] : form.querySelector('input[name="type"]');
    if (!premier) {
      erreurEnvoi.hidden = true;
      return true;
    }

    erreurEnvoi.textContent = !type ? "Choisissez d'abord le type de véhicule."
      : premier.name === 'consentement' ? 'Cochez la case de consentement pour envoyer la demande.'
      : premier.classList.contains('dimension') ? 'Entrez les trois dimensions, en ' + (enMetres() ? 'mètres.' : 'pieds.')
      : premier.name === 'telephone' ? "Entrez un numéro de téléphone complet, avec l'indicatif régional."
      : 'Remplissez votre nom et votre téléphone.';
    erreurEnvoi.hidden = false;
    premier.focus();
    return false;
  }

  function confirmer() {
    billet.classList.add('est-envoye');
    talon.textContent = 'Admis';
    document.querySelectorAll('[data-etat]').forEach(function (el) { el.textContent = 'Admis'; });
    form.hidden = true;
    merci.hidden = false;
    merci.focus({ preventScroll: true });
    merci.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valider()) return;
    var bouton = form.querySelector('button[type="submit"]');
    bouton.disabled = true;
    bouton.textContent = 'Envoi en cours…';
    Expo.envoyer(form).then(confirmer).catch(function () {
      erreurEnvoi.innerHTML = Expo.messageEchec('418 882-9619');
      erreurEnvoi.hidden = false;
    }).finally(function () {
      bouton.disabled = false;
      bouton.textContent = 'Envoyer ma demande';
    });
  });

  document.getElementById('nouvelle-demande').addEventListener('click', function () {
    form.reset();
    form.hidden = false;
    merci.hidden = true;
    billet.classList.remove('est-envoye');
    majUnite(false);
    majBillet();
    form.querySelector('input[name="type"]').focus();
  });

  majConseils();
  majBillet();
})();
