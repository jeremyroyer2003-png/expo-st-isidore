// Classes de <html> posées avant l'affichage (script en ligne de app/layout.tsx) et remises après
// l'hydratation (components/site/ClassesHtml.tsx) :
// - « js » : le JavaScript est actif (le menu du cellulaire est caché tant qu'on ne l'ouvre pas);
// - « saison-hiver » / « saison-ete » : hiver du 15 octobre au 14 mai (?saison=ete|hiver pour essayer);
// - « fond-peinture » / « fond-photo » : fond d'écran du site public (?fond=photo|peinture|0, gardé dans le navigateur).
export const SCRIPT_CLASSES = `(function(){var h=document.documentElement;h.classList.add('js');var d=new Date(),m=d.getMonth()+1,j=d.getDate();var hiver=m>10||m<5||(m===10&&j>=15)||(m===5&&j<15);var q=/[?&]saison=(ete|hiver)/.exec(location.search);if(q)hiver=q[1]==='hiver';h.classList.add(hiver?'saison-hiver':'saison-ete');if(location.pathname.indexOf('/admin')!==0){var f='peinture';try{var u=/[?&]fond=([a-z0-9]+)/.exec(location.search);if(u)localStorage.setItem('essai-fond',u[1]);f=localStorage.getItem('essai-fond')||'peinture';}catch(e){}if(f==='photo'||f==='peinture')h.classList.add('fond-'+f);}})();`;
