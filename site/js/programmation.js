(function () {
  var jours = Array.prototype.slice.call(document.querySelectorAll('.jour'));
  var tablist = document.querySelector('.onglets');
  var groupeFiltres = document.querySelector('.filtres');
  var annonce = document.getElementById('annonce-filtre');
  var aucun = document.getElementById('aucun-resultat');
  if (!jours.length || !tablist) return;

  var filtre = 'tout';
  var courant = 0;
  var horaire = document.getElementById('horaire');
  var onglets = jours.map(function (jour, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'onglet';
    b.id = 'onglet-' + jour.id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', jour.id);
    b.innerHTML = '<span class="onglet__jour">' + jour.dataset.onglet + '</span><span class="onglet__date">' + jour.dataset.date + '</span>';
    jour.setAttribute('role', 'tabpanel');
    jour.setAttribute('aria-labelledby', b.id);
    jour.tabIndex = 0;
    b.addEventListener('click', function () { choisir(i, false); });
    tablist.appendChild(b);
    return b;
  });

  // « Tout » : le jour choisi. Un filtre (ex. Tire) : toute la semaine, groupée par jour.
  function appliquerFiltre() {
    var visibles = 0;
    var semaine = filtre !== 'tout';
    horaire.classList.toggle('mode-semaine', semaine);
    // En mode semaine, aucun jour n'est « l'onglet choisi » : on ne l'annonce pas comme tel
    onglets.forEach(function (b, j) { b.setAttribute('aria-selected', String(!semaine && j === courant)); });
    jours.forEach(function (jour, j) {
      var n = 0;
      jour.querySelectorAll('.evenement').forEach(function (ev) {
        var garde = !semaine || ev.dataset.cat.split(' ').indexOf(filtre) !== -1;
        ev.hidden = !garde;
        if (garde) n++;
      });
      jour.hidden = semaine ? n === 0 : j !== courant;
      if (!jour.hidden) visibles += n;
    });
    aucun.hidden = visibles > 0;
    annonce.textContent = visibles + (visibles > 1 ? ' activités affichées' : ' activité affichée') + (semaine ? ' pour la semaine' : '');
  }

  function choisirFiltre(nom) {
    filtre = nom;
    groupeFiltres.querySelectorAll('.filtre').forEach(function (f) {
      f.setAttribute('aria-pressed', String(f.dataset.filtre === nom));
    });
  }

  function choisir(i, focus, initial) {
    courant = i;
    if (!initial) choisirFiltre('tout'); // choisir un jour revient à « Tout » pour ce jour
    onglets.forEach(function (b, j) {
      var actif = i === j;
      b.setAttribute('aria-selected', String(actif));
      b.tabIndex = actif ? 0 : -1;
    });
    if (focus) onglets[i].focus();
    appliquerFiltre();
    // Au chargement, on ne touche ni au défilement ni à l'adresse : sinon le navigateur
    // saute à l'horaire et lui donne le focus (contour orange).
    if (initial) return;
    onglets[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    history.replaceState(null, '', '#' + jours[i].id);
  }

  tablist.addEventListener('keydown', function (e) {
    var i = onglets.indexOf(document.activeElement);
    if (i === -1) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); choisir((i + 1) % onglets.length, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); choisir((i - 1 + onglets.length) % onglets.length, true); }
    if (e.key === 'Home') { e.preventDefault(); choisir(0, true); }
    if (e.key === 'End') { e.preventDefault(); choisir(onglets.length - 1, true); }
  });

  groupeFiltres.addEventListener('click', function (e) {
    var b = e.target.closest('.filtre');
    if (!b) return;
    choisirFiltre(b.dataset.filtre);
    appliquerFiltre();
  });

  tablist.hidden = false;
  groupeFiltres.hidden = false;
  var demande = jours.findIndex(function (j) { return '#' + j.id === location.hash; });
  var depart = jours.findIndex(function (j) { return j.id === 'jour-jeu-16'; });
  choisir(demande !== -1 ? demande : Math.max(depart, 0), false, true);
})();
