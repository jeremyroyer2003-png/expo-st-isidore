// Gabarits de courriels (français). Chaque fonction renvoie { sujet, html, texte, gabarit }.
// Mise en page simple en tableaux et styles en ligne : c'est ce que les logiciels de courriel lisent le mieux.
import { env } from "@/lib/env";
import { argent } from "@/lib/format";

type Ligne = [string, string];
export type Gabarit = { sujet: string; html: string; texte: string; gabarit: string };

const BUREAU = "418 882-5649";
const REMISAGE = "418 882-9619";

function echapper(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function mise_en_page(o: {
  gabarit: string;
  sujet: string;
  titre: string;
  intro: string[];
  lignes?: Ligne[];
  bouton?: { texte: string; url: string };
  fin?: string[];
  /** Page « Ma demande » du client : bouton principal s'il n'y en a pas d'autre, sinon petit lien sous le bouton. */
  suivi?: string;
}): Gabarit {
  if (o.suivi && !o.bouton) o = { ...o, bouton: { texte: "Suivre ma demande", url: o.suivi }, suivi: undefined };
  const lignesHtml = (o.lignes ?? [])
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5C4A39;font-size:14px;white-space:nowrap;vertical-align:top">${echapper(k)}</td><td style="padding:6px 0;color:#1E140D;font-size:15px;font-weight:600">${echapper(v)}</td></tr>`)
    .join("");
  const para = (p: string) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1E140D">${echapper(p)}</p>`;
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#E8D9BA;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E8D9BA;padding:24px 0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#F3EAD8;border:3px solid #1E140D">
<tr><td style="background:#2A1D14;padding:18px 24px;color:#F3EAD8;font-size:20px;font-weight:bold;letter-spacing:.5px">EXPO ST-ISIDORE <span style="color:#D9A441">· Bassin de la Chaudière</span></td></tr>
<tr><td style="padding:28px 24px 8px">
<h1 style="margin:0 0 16px;font-size:24px;color:#8E2A1E">${echapper(o.titre)}</h1>
${o.intro.map(para).join("")}
${lignesHtml ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 18px;border-top:2px dashed #1E140D;border-bottom:2px dashed #1E140D;width:100%">${lignesHtml}</table>` : ""}
${o.bouton ? `<p style="margin:8px 0 22px"><a href="${echapper(o.bouton.url)}" style="display:inline-block;background:#8E2A1E;color:#F3EAD8;text-decoration:none;font-weight:bold;padding:14px 22px;border:3px solid #1E140D">${echapper(o.bouton.texte)}</a></p>` : ""}
${o.suivi ? `<p style="margin:0 0 14px;font-size:14px;color:#5C4A39">Voir où en est votre demande en tout temps : <a href="${echapper(o.suivi)}" style="color:#8E2A1E;font-weight:bold">Ma demande</a></p>` : ""}
${(o.fin ?? []).map(para).join("")}
</td></tr>
<tr><td style="padding:16px 24px;border-top:3px solid #1E140D;font-size:13px;color:#5C4A39;line-height:1.5">Expo St-Isidore · 132, route Coulombe, Saint-Isidore (Québec) G0S 2S0<br>Bureau : ${BUREAU} · Remisage : ${REMISAGE} · info@expobassinchaudiere.com</td></tr>
</table></td></tr></table></body></html>`;
  const texte = [
    o.titre,
    "",
    ...o.intro,
    "",
    ...(o.lignes ?? []).map(([k, v]) => `${k} : ${v}`),
    ...(o.bouton ? ["", `${o.bouton.texte} : ${o.bouton.url}`] : []),
    ...(o.suivi ? ["", `Ma demande (où en est votre demande) : ${o.suivi}`] : []),
    "",
    ...(o.fin ?? []),
    "",
    `Expo St-Isidore · Bureau : ${BUREAU} · Remisage : ${REMISAGE}`,
  ].join("\n");
  return { sujet: o.sujet, html, texte, gabarit: o.gabarit };
}

const lienAdmin = (chemin: string) => `${env.urlSite}/admin${chemin}`;

// ---------- Contact / exposants ----------
export const messageRecu = (formulaire: string, lignes: Ligne[]) =>
  mise_en_page({
    gabarit: "message_admin",
    sujet: `Nouveau message (${formulaire})`,
    titre: `Nouveau message : ${formulaire}`,
    intro: ["Un message vient d'arriver par le site."],
    lignes,
    bouton: { texte: "Ouvrir dans l'admin", url: lienAdmin("/messages") },
  });

export const accuseMessage = (nom: string) =>
  mise_en_page({
    gabarit: "message_accuse",
    sujet: "On a bien reçu votre message",
    titre: `Merci, ${nom}!`,
    intro: ["On a bien reçu votre message et on vous répond dès que possible."],
    fin: [`Si c'est pressant, appelez le bureau au ${BUREAU}.`],
  });

// ---------- Salles ----------
export const salleConfirmee = (o: { nom: string; salle: string; date: string; heures: string; montant: number; lienAnnulation: string; frais: number; delaiHeures: number }) =>
  mise_en_page({
    gabarit: "salle_confirmee",
    sujet: `Réservation confirmée : ${o.salle}, ${o.date}`,
    titre: "Votre salle est réservée",
    intro: [`Merci, ${o.nom}. Votre paiement est reçu et la date est à vous.`],
    lignes: [["Salle", o.salle], ["Date", o.date], ["Heures", o.heures], ["Payé", argent(o.montant)]],
    fin: [
      "Tables, chaises et ambiance sont comprises. On vous appelle avant l'événement pour les derniers détails.",
      `Besoin d'annuler? Faites-le vous-même avec le bouton « Gérer ou annuler ma réservation », jusqu'à ${o.delaiHeures} heures avant l'événement. ` +
        (o.frais > 0 ? `On vous rembourse le montant payé, moins ${argent(o.frais)} de frais d'annulation.` : "On vous rembourse au complet.") +
        ` Pour changer de date, ou à moins de ${o.delaiHeures} heures : ${BUREAU}.`,
    ],
    bouton: { texte: "Gérer ou annuler ma réservation", url: o.lienAnnulation },
  });

export const salleConfirmeeAdmin = (o: { nom: string; courriel: string; telephone: string; salle: string; date: string; heures: string; montant: number; type: string; personnes: string }) =>
  mise_en_page({
    gabarit: "salle_confirmee_admin",
    sujet: `Salle réservée et payée : ${o.salle}, ${o.date}`,
    titre: "Nouvelle réservation de salle",
    intro: ["Un client vient de réserver et de payer un créneau. La date est maintenant verrouillée."],
    lignes: [["Salle", o.salle], ["Date", o.date], ["Heures", o.heures], ["Événement", o.type], ["Invités", o.personnes], ["Client", o.nom], ["Courriel", o.courriel], ["Téléphone", o.telephone], ["Payé", argent(o.montant)]],
    bouton: { texte: "Voir dans l'admin", url: lienAdmin("/reservations") },
  });

// ---------- Kiosques ----------
export const kiosqueRecu = (o: { nom: string; type: "interieur" | "exterieur"; emplacement?: string; suivi?: string }) =>
  mise_en_page({
    suivi: o.suivi,
    gabarit: "kiosque_recu",
    sujet: "Demande de kiosque reçue",
    titre: "On a bien reçu votre demande de kiosque",
    intro: [
      `Merci, ${o.nom}.`,
      o.type === "interieur"
        ? `Vous avez demandé l'emplacement ${o.emplacement} au palais des commerces. Il n'est pas encore confirmé : le comité approuve chaque demande, puis vous envoie un lien de paiement.`
        : "Le comité vous appelle pour préparer l'entente, puis vous envoie la facture.",
    ],
    fin: [`Une question? Appelez la coordination au 418 386-0484.`],
  });

export const kiosqueRecuAdmin = (lignes: Ligne[]) =>
  mise_en_page({
    gabarit: "kiosque_recu_admin",
    sujet: "Nouvelle demande de kiosque",
    titre: "Nouvelle demande de kiosque à traiter",
    intro: ["Une demande attend votre approbation."],
    lignes,
    bouton: { texte: "Traiter la demande", url: lienAdmin("/kiosques") },
  });

export const kiosqueApprouve = (o: { nom: string; emplacement: string; montant: number; lien: string; suivi?: string }) =>
  mise_en_page({
    suivi: o.suivi,
    gabarit: "kiosque_approuve",
    sujet: `Kiosque ${o.emplacement} approuvé : il reste à payer`,
    titre: "Votre demande est approuvée",
    intro: [`Bonne nouvelle, ${o.nom} : l'emplacement ${o.emplacement} vous est réservé. Le paiement confirme votre place.`],
    lignes: [["Emplacement", o.emplacement], ["Montant", argent(o.montant)]],
    bouton: { texte: "Payer mon kiosque", url: o.lien },
    fin: ["Le lien reste valide tant que la demande est approuvée."],
  });

export const kiosqueFacture = (o: { nom: string; montant: number; lien: string; suivi?: string }) =>
  mise_en_page({
    suivi: o.suivi,
    gabarit: "kiosque_facture",
    sujet: "Votre facture de kiosque extérieur",
    titre: "Votre facture est prête",
    intro: [`Bonjour ${o.nom}, voici la facture pour votre kiosque extérieur, selon l'entente avec le comité.`],
    lignes: [["Montant", argent(o.montant)]],
    bouton: { texte: "Voir et payer la facture", url: o.lien },
  });

export const kiosqueConfirme = (o: { nom: string; quoi: string; montant: number; suivi?: string }) =>
  mise_en_page({
    suivi: o.suivi,
    gabarit: "kiosque_confirme",
    sujet: "Kiosque confirmé",
    titre: "Votre kiosque est confirmé",
    intro: [`Merci, ${o.nom}. Le paiement est reçu : ${o.quoi} est à vous pour l'Expo.`],
    lignes: [["Payé", argent(o.montant)]],
    fin: ["Le comité communique avec vous pour l'installation."],
  });

export const kiosqueRefuse = (o: { nom: string; raison: string }) =>
  mise_en_page({
    gabarit: "kiosque_refuse",
    sujet: "Votre demande de kiosque",
    titre: "On ne peut pas accepter votre demande",
    intro: [`Bonjour ${o.nom}, malheureusement on ne peut pas donner suite à votre demande de kiosque.`, ...(o.raison ? [o.raison] : [])],
    fin: [`Pour en parler, appelez la coordination au 418 386-0484.`],
  });

// ---------- Danse ----------
export const danseConfirmee = (o: { nom: string; forfait: string; personnes: number; montant: number }) =>
  mise_en_page({
    gabarit: "danse_confirmee",
    sujet: "Inscription à la danse country confirmée",
    titre: "À bientôt sur le plancher de danse!",
    intro: [`Merci, ${o.nom}. Votre paiement est reçu.`],
    lignes: [["Forfait", o.forfait], ["Personnes", String(o.personnes)], ["Payé", argent(o.montant)], ["Où", "Grange 2, de 19 h à 21 h"]],
    fin: [`Les dates sont annoncées sur Facebook et au bureau, au ${BUREAU}.`],
  });

export const danseAdmin = (lignes: Ligne[]) =>
  mise_en_page({
    gabarit: "danse_admin",
    sujet: "Nouvelle inscription à la danse",
    titre: "Nouvelle inscription payée",
    intro: ["Une inscription à la danse country vient d'être payée."],
    lignes,
    bouton: { texte: "Voir dans l'admin", url: lienAdmin("/danse") },
  });

// ---------- Remisage ----------
export const remisageRecu = (o: { nom: string; vehicule: string; longueur: string; suivi?: string }) =>
  mise_en_page({
    suivi: o.suivi,
    gabarit: "remisage_recu",
    sujet: "Demande de remisage reçue",
    titre: "On a bien reçu vos dimensions",
    intro: [`Merci, ${o.nom}. On regarde l'espace disponible et on vous revient avec le prix.`],
    lignes: [["Véhicule", o.vehicule], ["Longueur", o.longueur]],
    fin: [`Pas de nouvelles d'ici quelques jours? Appelez le remisage au ${REMISAGE}.`],
  });

export const remisageRecuAdmin = (lignes: Ligne[]) =>
  mise_en_page({
    gabarit: "remisage_recu_admin",
    sujet: "Nouvelle demande de remisage",
    titre: "Nouvelle demande de remisage à approuver",
    intro: ["Une demande attend votre approbation."],
    lignes,
    bouton: { texte: "Traiter la demande", url: lienAdmin("/remisage") },
  });

export const remisageApprouve = (o: { nom: string; vehicule: string; total: number; depot: number; lien: string; suivi?: string }) =>
  mise_en_page({
    suivi: o.suivi,
    gabarit: "remisage_approuve",
    sujet: "Remisage approuvé : dépôt pour garder votre place",
    titre: "On a de la place pour vous",
    intro: [`Bonne nouvelle, ${o.nom}! Votre demande de remisage est approuvée. Le dépôt garde votre place. Pour le solde, le comité vous explique les modalités en vous appelant.`],
    lignes: [["Véhicule", o.vehicule], ["Prix de la saison", argent(o.total)], ["Dépôt à payer maintenant", argent(o.depot)]],
    bouton: { texte: "Payer le dépôt", url: o.lien },
    fin: ["Chaque véhicule est mesuré à l'arrivée; le prix final se base sur cette mesure.", `Questions : ${REMISAGE}.`],
  });

export const remisageDepotPaye = (o: { nom: string; depot: number; suivi?: string }) =>
  mise_en_page({
    suivi: o.suivi,
    gabarit: "remisage_depot_paye",
    sujet: "Dépôt reçu : votre place de remisage est gardée",
    titre: "Votre place est gardée",
    intro: [`Merci, ${o.nom}. Le dépôt est reçu et votre place est réservée pour l'hiver.`],
    lignes: [["Dépôt payé", argent(o.depot)]],
    fin: [`On vous appelle pour fixer la date d'entrée. Remisage : ${REMISAGE}.`],
  });

export const remisageRefuse = (o: { nom: string; raison: string }) =>
  mise_en_page({
    gabarit: "remisage_refuse",
    sujet: "Votre demande de remisage",
    titre: "On n'a pas de place cette fois-ci",
    intro: [`Bonjour ${o.nom}, malheureusement on ne peut pas accepter votre véhicule cet hiver.`, ...(o.raison ? [o.raison] : [])],
    fin: [`Pour en parler : ${REMISAGE}.`],
  });

// ---------- Rappel : lien de paiement envoyé, toujours impayé ----------
export const rappelPaiement = (o: { nom: string; quoi: string; montant: number; lien: string; telephone: string; suivi?: string }) =>
  mise_en_page({
    gabarit: "rappel_paiement",
    suivi: o.suivi,
    sujet: `Rappel : ${o.quoi}, il reste à payer`,
    titre: "Petit rappel",
    intro: [`Bonjour ${o.nom}, votre demande est approuvée, mais le paiement n'est pas encore fait. Votre place n'est confirmée qu'une fois payée.`],
    lignes: [["Pour", o.quoi], ["Montant", argent(o.montant)]],
    bouton: { texte: "Payer maintenant", url: o.lien },
    fin: [`Déjà payé, ou vous avez changé d'idée? Dites-le-nous au ${o.telephone} et on met votre dossier à jour.`],
  });

// ---------- Paiement reçu (admin), annulation et remboursement ----------
export const paiementRecuAdmin = (quoi: string, lignes: Ligne[]) =>
  mise_en_page({
    gabarit: "paiement_admin",
    sujet: `Paiement reçu : ${quoi}`,
    titre: `Paiement reçu : ${quoi}`,
    intro: ["Un paiement vient d'être confirmé par Stripe (mode test)."],
    lignes,
    bouton: { texte: "Ouvrir l'admin", url: lienAdmin("") },
  });

export const annulation = (o: { nom: string; quoi: string; paye: number; frais: number; rembourse: number; parQui: "client" | "expo" }) =>
  mise_en_page({
    gabarit: "annulation",
    sujet: `Annulation : ${o.quoi}`,
    titre: o.parQui === "expo" ? "Nous devons annuler votre réservation" : "Votre réservation est annulée",
    intro: o.parQui === "expo"
      ? [`Bonjour ${o.nom}, nous sommes désolés : l'Expo doit annuler votre réservation (${o.quoi}).`, "Comme l'annulation vient de nous, vous êtes remboursé au complet, sans aucuns frais."]
      : [`Bonjour ${o.nom}, votre réservation (${o.quoi}) est annulée.`],
    lignes: [
      ["Montant payé", argent(o.paye)],
      ["Frais d'annulation", argent(o.frais)],
      ["Remboursé", argent(o.rembourse)],
    ],
    fin: [o.rembourse > 0 ? "Le remboursement apparaît sur votre carte d'ici 5 à 10 jours ouvrables." : "Aucun montant n'est remboursé.", `Questions : ${BUREAU}.`],
  });

export const annulationAdmin = (lignes: Ligne[]) =>
  mise_en_page({
    gabarit: "annulation_admin",
    sujet: "Annulation d'une réservation",
    titre: "Une réservation vient d'être annulée",
    intro: ["Le remboursement Stripe est déjà fait et la date est de nouveau libre."],
    lignes,
    bouton: { texte: "Voir dans l'admin", url: lienAdmin("/reservations") },
  });
