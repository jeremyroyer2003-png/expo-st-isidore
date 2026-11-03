// Outils de formulaire partagés par toutes les pages (aussi utilisés par remisage.js)
var Expo = (function () {
  var CHIFFRES_MIN_TELEPHONE = 10; // indicatif régional + numéro

  function verifierTelephone(champ) {
    var valide = !champ.value || champ.value.replace(/\D/g, '').length >= CHIFFRES_MIN_TELEPHONE;
    champ.setCustomValidity(valide ? '' : 'Numéro incomplet');
  }

  // Marque les champs invalides (aria-invalid) et renvoie la liste
  function marquerInvalides(champs) {
    return Array.prototype.filter.call(champs, function (el) {
      var ok = !el.willValidate || el.checkValidity();
      if (ok) el.removeAttribute('aria-invalid'); else el.setAttribute('aria-invalid', 'true');
      return !ok;
    });
  }

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

  return { verifierTelephone: verifierTelephone, marquerInvalides: marquerInvalides, envoyer: envoyer, messageEchec: messageEchec };
})();

document.addEventListener('DOMContentLoaded', function () {
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
      Expo.envoyer(form).then(function () {
        form.hidden = true;
        merci.hidden = false;
        merci.focus();
      }).catch(function () {
        erreur.innerHTML = Expo.messageEchec('418 882-5649');
        erreur.hidden = false;
      });
    });
  });
});
