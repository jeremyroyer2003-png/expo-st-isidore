// Accueil : diaporama du héros, onglets « Six jours, six ambiances », moulinet au vent du défilement
document.addEventListener('DOMContentLoaded', function () {
  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Diaporama ---------- */
  var DELAI_DIAPO = 6500;
  var diapos = document.querySelectorAll('.une__diapo');
  var legende = document.querySelector('.une__legende');
  if (diapos.length > 1 && legende) {
    var texte = legende.querySelector('.une__legende-texte');
    var points = legende.querySelector('.une__points');
    var pause = legende.querySelector('.une__pause');
    var courante = 0;
    var minuterie = null;
    var arrete = calme; // avec « réduire les animations », pas de défilement automatique

    diapos.forEach(function (diapo, i) {
      var img = diapo.querySelector('img');
      var point = document.createElement('button');
      point.type = 'button';
      point.className = 'une__point';
      point.setAttribute('aria-label', 'Photo ' + (i + 1) + ' : ' + img.dataset.legende);
      point.addEventListener('click', function () { montrer(i); relancer(); });
      points.appendChild(point);
      if (i) diapo.setAttribute('aria-hidden', 'true');
    });

    function montrer(i) {
      diapos[courante].classList.remove('est-active');
      diapos[courante].setAttribute('aria-hidden', 'true');
      courante = (i + diapos.length) % diapos.length;
      var img = diapos[courante].querySelector('img');
      img.loading = 'eager';
      diapos[courante].classList.add('est-active');
      diapos[courante].removeAttribute('aria-hidden');
      texte.textContent = img.dataset.legende;
      points.querySelectorAll('.une__point').forEach(function (p, n) {
        p.setAttribute('aria-current', String(n === courante));
      });
    }
    function relancer() {
      clearInterval(minuterie);
      if (!arrete) minuterie = setInterval(function () { montrer(courante + 1); }, DELAI_DIAPO);
    }
    pause.addEventListener('click', function () {
      arrete = !arrete;
      pause.setAttribute('aria-pressed', String(arrete));
      pause.setAttribute('aria-label', arrete ? 'Reprendre le défilement des photos' : 'Arrêter le défilement des photos');
      relancer();
    });
    if (calme) {
      pause.setAttribute('aria-pressed', 'true');
      pause.setAttribute('aria-label', 'Reprendre le défilement des photos');
    }
    // Onglet caché : on ne fait pas tourner les photos pour rien
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(minuterie); else relancer();
    });

    legende.hidden = false;
    montrer(0);
    relancer();
  }

  /* ---------- Onglets des ambiances ---------- */
  var liste = document.querySelector('.choix__onglets');
  if (liste) {
    var onglets = Array.prototype.slice.call(liste.querySelectorAll('[role="tab"]'));
    var panneaux = onglets.map(function (o) { return document.getElementById(o.getAttribute('aria-controls')); });

    function choisir(n, focus) {
      onglets.forEach(function (o, i) {
        var actif = i === n;
        o.setAttribute('aria-selected', String(actif));
        o.tabIndex = actif ? 0 : -1;
        panneaux[i].hidden = !actif;
        panneaux[i].classList.toggle('vient-d-ouvrir', actif);
      });
      if (focus) onglets[n].focus();
    }
    onglets.forEach(function (o, i) {
      o.addEventListener('click', function () { choisir(i); });
      o.addEventListener('keydown', function (e) {
        var cible = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: onglets.length - 1 }[e.key];
        if (cible === undefined) return;
        e.preventDefault();
        choisir((cible + onglets.length) % onglets.length, true);
      });
    });
    liste.hidden = false;
    panneaux.forEach(function (p) { p.tabIndex = 0; });
    choisir(0);
    panneaux[0].classList.remove('vient-d-ouvrir');
  }

  /* ---------- Moulinet : il tourne plus vite quand on fait défiler ---------- */
  var pales = document.querySelector('.moulinet__pales img');
  if (pales && !calme) {
    var angle = 0, dernierY = window.scrollY, enAttente = false;
    window.addEventListener('scroll', function () {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(function () {
        angle += (window.scrollY - dernierY) * 0.6;
        dernierY = window.scrollY;
        pales.style.setProperty('--vent', angle + 'deg');
        enAttente = false;
      });
    }, { passive: true });
  }
});
