// Page « Ma demande » : lien signé qui laisse le client voir où en est sa demande de kiosque ou de remisage
// sans appeler le bureau. Même principe que le lien d'annulation de salle (lib/jeton.ts) : rien à ajouter dans la base.
import { env } from "@/lib/env";
import { lireJeton, signerJeton } from "@/lib/jeton";

export type TypeSuivi = "kiosque" | "remisage";

export const cheminSuivi = (type: TypeSuivi, id: string) => `/ma-demande/${type}/${signerJeton(`suivi-${type}`, id)}`;
export const lienSuivi = (type: TypeSuivi, id: string) => `${env.urlSite}${cheminSuivi(type, id)}`;
export const lireSuivi = (type: TypeSuivi, jeton: string) => lireJeton(`suivi-${type}`, jeton);
