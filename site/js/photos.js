(function () {
  var dialog = document.getElementById('visionneuse');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var liens = Array.prototype.slice.call(document.querySelectorAll('.galerie a'));
  var img = dialog.querySelector('img');
  var legende = dialog.querySelector('figcaption');
  var courant = 0;
  var declencheur = null;

  function afficher(i) {
    courant = (i + liens.length) % liens.length;
    var vignette = liens[courant].querySelector('img');
    img.src = liens[courant].href;
    img.alt = vignette.alt;
    legende.textContent = vignette.alt + ' (' + (courant + 1) + ' de ' + liens.length + ')';
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('.galerie a');
    if (!a) return;
    e.preventDefault();
    declencheur = a;
    afficher(liens.indexOf(a));
    dialog.showModal();
  });

  dialog.addEventListener('click', function (e) {
    var action = e.target.closest('button') && e.target.closest('button').dataset.action;
    if (action === 'precedente') afficher(courant - 1);
    else if (action === 'suivante') afficher(courant + 1);
    else if (action === 'fermer' || e.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') afficher(courant - 1);
    if (e.key === 'ArrowRight') afficher(courant + 1);
  });

  dialog.addEventListener('close', function () {
    if (declencheur) declencheur.focus();
  });
})();
