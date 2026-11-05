// Outils de formulaire partagés par toutes les pages (aussi utilisés par remisage.js)
var Expo = (function () {
  var CHIFFRES_MIN_TELEPHONE = 10; // indicatif régional + numéro

  function verifierTelephone(champ) {
    var chiffres = champ.value.replace(/\D/g, '').length;
    // 10 chiffres (indicatif + numéro), ou 11 avec le 1 devant
    var valide = !champ.value || (chiffres >= CHIFFRES_MIN_TELEPHONE && chiffres <= CHIFFRES_MIN_TELEPHONE + 1);
    champ.setCustomValidity(valide ? '' : 'Numéro incomplet');
  }

  // Message affiché sous un champ invalide : data-erreur sur le champ, sinon selon son type
  function messagePour(el) {
    if (el.dataset.erreur) return el.dataset.erreur;
    if (el.type === 'checkbox') return 'Cochez cette case pour envoyer.';
    if (el.type === 'tel') return "Entrez un numéro complet, avec l'indicatif régional (ex. 418 555-1234).";
    if (el.type === 'email') return 'Vérifiez le courriel (ex. nom@exemple.com).';
    if (el.type === 'date') return 'Choisissez une date à venir.';
    if (el.type === 'number') return 'Entrez un nombre.';
    if (el.tagName === 'SELECT') return 'Choisissez une option dans la liste.';
    return 'Ce champ est obligatoire.';
  }

  // Le message vit à côté du champ et lui est relié (aria-describedby) pour les lecteurs d'écran
  function afficherErreur(el, visible) {
    var id = 'err-' + (el.id || el.name);
    var msg = document.getElementById(id);
    if (!visible) { if (msg) msg.hidden = true; return; }
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'champ__erreur champ__erreur--champ';
      msg.id = id;
      // Dans un bloc .champ (cellule de grille), le message va à l'intérieur pour ne pas décaler la grille
      var champ = el.closest('.champ');
      var bloc = el.closest('.dimension-ligne, .consentement');
      var groupe = el.type === 'radio' && el.closest('[role="radiogroup"]');
      if (groupe) groupe.parentNode.insertBefore(msg, groupe); // un seul message, au-dessus des cartes
      else if (champ && !bloc) champ.appendChild(msg);
      else { bloc = bloc || el.parentNode; bloc.parentNode.insertBefore(msg, bloc.nextSibling); }
      var lies = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (lies.indexOf(id) === -1) el.setAttribute('aria-describedby', lies.concat(id).join(' '));
    }
    msg.textContent = messagePour(el);
    msg.hidden = false;
  }

  // Marque les champs invalides (aria-invalid + message sous le champ) et renvoie la liste
  function marquerInvalides(champs) {
    return Array.prototype.filter.call(champs, function (el) {
      var ok = !el.willValidate || el.checkValidity();
      if (ok) el.removeAttribute('aria-invalid'); else el.setAttribute('aria-invalid', 'true');
      afficherErreur(el, !ok);
      return !ok;
    });
  }

  // Dès qu'un champ marqué invalide redevient valide, son message disparaît
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (!el.getAttribute || el.getAttribute('aria-invalid') !== 'true') return;
    if (el.type === 'tel') verifierTelephone(el);
    if (el.classList.contains('dimension')) return; // validées à l'envoi (unités)
    if (el.checkValidity()) { el.removeAttribute('aria-invalid'); afficherErreur(el, false); }
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.type === 'checkbox' && el.checked && el.getAttribute('aria-invalid') === 'true') {
      el.removeAttribute('aria-invalid'); afficherErreur(el, false);
    }
    // Un choix fait dans un groupe de cartes efface l'erreur de tout le groupe
    if (el.type === 'radio' && el.form) {
      el.form.querySelectorAll('input[type="radio"][name="' + el.name + '"]').forEach(function (r) { r.removeAttribute('aria-invalid'); });
      afficherErreur(el, false);
    }
    if (el.type === 'date' && el.getAttribute('aria-invalid') === 'true' && el.checkValidity()) {
      el.removeAttribute('aria-invalid'); afficherErreur(el, false);
    }
  });

  // Envoi à Netlify Forms. Ouvert directement sur l'ordinateur (file:), on simule l'envoi.
  function envoyer(form) {
    if (location.protocol === 'file:') return Promise.resolve();
    return fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
    });
  }

  function messageEchec(telephone) {
    return "L'envoi n'a pas fonctionné. Réessayez ou appelez-nous au <a href=\"tel:+1" +
      telephone.replace(/\D/g, '') + "\">" + telephone + '</a>.';
  }

  return { verifierTelephone: verifierTelephone, marquerInvalides: marquerInvalides, afficherErreur: afficherErreur, envoyer: envoyer, messageEchec: messageEchec };
})();

document.addEventListener('DOMContentLoaded', function () {
  // Champs de date : pas de date passée (min = aujourd'hui, heure locale)
  var auj = new Date(); auj.setMinutes(auj.getMinutes() - auj.getTimezoneOffset());
  document.querySelectorAll('input[type="date"][data-min-aujourdhui]').forEach(function (el) {
    el.min = auj.toISOString().slice(0, 10);
  });

  // Menu hamburger sur téléphone
  var bouton = document.querySelector('.menu-bouton');
  var nav = document.getElementById('nav-principale');
  if (bouton && nav) {
    bouton.addEventListener('click', function () {
      var ouvert = bouton.getAttribute('aria-expanded') === 'true';
      bouton.setAttribute('aria-expanded', String(!ouvert));
      nav.classList.toggle('est-ouvert', !ouvert);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bouton.getAttribute('aria-expanded') === 'true') {
        bouton.setAttribute('aria-expanded', 'false');
        nav.classList.remove('est-ouvert');
        bouton.focus();
      }
    });
  }

  // En-tête collant : une ombre apparaît seulement quand la page a défilé
  var entete = document.querySelector('.entete');
  if (entete) {
    var majOmbre = function () { entete.classList.toggle('est-defile', window.scrollY > 8); };
    window.addEventListener('scroll', majOmbre, { passive: true });
    majOmbre();
  }

  // Apparition au défilement : les blocs de chaque section montent l'un après l'autre.
  // Sans IntersectionObserver ou avec « réduire les animations », tout reste visible.
  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !calme) {
    var blocs = document.querySelectorAll(
      'main > section:not(.heros) > .contenu > *, .archives__haut > *, .mosaique > li, .annees > li, .venir > *'
    );
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        entree.target.classList.add('est-visible');
        observateur.unobserve(entree.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    blocs.forEach(function (bloc) {
      if (bloc.matches('.archives__haut, .mosaique, .annees, .venir, form, .formulaire, [role="tablist"]')) return;
      var freres = Array.prototype.indexOf.call(bloc.parentNode.children, bloc);
      bloc.style.setProperty('--delai', Math.min(freres, 6) * 0.07 + 's');
      bloc.classList.add('revele');
      observateur.observe(bloc);
    });
  }

  // Formulaires simples (exposants, contact)
  document.querySelectorAll('form[data-envoi-simple]').forEach(function (form) {
    var erreur = form.querySelector('.formulaire__erreur');
    var merci = document.getElementById(form.dataset.merci);

    form.addEventListener('change', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') {
        e.target.setCustomValidity('');
        if (e.target.checkValidity()) e.target.removeAttribute('aria-invalid');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelectorAll('input[type="tel"]').forEach(Expo.verifierTelephone);
      var invalides = Expo.marquerInvalides(form.elements);
      if (invalides.length) {
        var premier = invalides[0];
        erreur.textContent = premier.type === 'checkbox'
          ? 'Cochez la case de consentement pour envoyer le message.'
          : premier.type === 'tel' ? "Entrez un numéro de téléphone complet, avec l'indicatif régional."
          : premier.type === 'email' ? "Vérifiez l'adresse courriel."
          : 'Remplissez les champs obligatoires.';
        erreur.hidden = false;
        premier.focus();
        return;
      }
      erreur.hidden = true;
      // Pendant l'envoi : bouton désactivé (pas de double envoi) et état visible
      var bouton = form.querySelector('button[type="submit"]');
      var texteBouton = bouton.textContent;
      bouton.disabled = true;
      bouton.textContent = 'Envoi en cours…';
      Expo.envoyer(form).then(function () {
        form.hidden = true;
        merci.hidden = false;
        merci.focus();
      }).catch(function () {
        erreur.innerHTML = Expo.messageEchec('418 882-5649');
        erreur.hidden = false;
      }).finally(function () {
        bouton.disabled = false;
        bouton.textContent = texteBouton;
      });
    });
  });
});
