// Noms des albums de la médiathèque (clé = colonne « categorie » de la table medias)
export const ALBUMS: Record<string, string> = {
  tire: "Tire de tracteurs",
  animaux: "Jugements et animaux",
  soirees: "Spectacles et soirées",
  kiosques: "Kiosques et machinerie",
  galerie: "Autres photos",
  // Photos envoyées par les visiteurs (page Photos) : elles arrivent ici, non publiées, à classer dans le bon album
  visiteurs: "Photos des visiteurs",
  // Page Notre histoire, « Le comité aujourd'hui » (pas dans la galerie Photos) : la plus récente est montrée. « Ordre » = année.
  comites: "Photo du comité",
};
