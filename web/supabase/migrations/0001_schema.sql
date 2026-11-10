-- =====================================================================
-- Expo St-Isidore : schéma, fonctions et sécurité au niveau des lignes (RLS)
-- À exécuter une fois dans Supabase > SQL Editor (ou `supabase db push`).
--
-- Principe de sécurité
--   * Le public (rôle anon) ne lit que le contenu publié : programmation, prix validés,
--     salles, créneaux, emplacements, médias publiés, contenus. Il n'écrit RIEN directement :
--     les demandes passent par les actions serveur de Next.js, qui valident puis écrivent
--     avec la clé service (côté serveur seulement).
--   * Les admins (rôle authenticated + ligne dans profils) :
--       lecteur      : lecture seule de tout le tableau de bord
--       editeur      : lecture + écriture (calendrier, prix, contenu, médias, demandes)
--       super_admin  : tout, y compris la gestion des comptes admin
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Comptes admin ----------
create table public.profils (
  id uuid primary key references auth.users (id) on delete cascade,
  courriel text not null,
  nom text not null default '',
  role text not null check (role in ('super_admin', 'editeur', 'lecteur')),
  cree_le timestamptz not null default now()
);

create or replace function public.role_admin() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profils where id = auth.uid()
$$;

create or replace function public.est_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profils where id = auth.uid())
$$;

create or replace function public.peut_editer() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profils where id = auth.uid() and role in ('editeur', 'super_admin'))
$$;

create or replace function public.est_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profils where id = auth.uid() and role = 'super_admin')
$$;

-- ---------- Prix (tous modifiables dans l'admin) ----------
-- a_confirmer = valeur de départ fictive : jamais montrée au public (« Prix sur demande »)
create table public.prix (
  cle text primary key,
  categorie text not null check (categorie in ('salle', 'kiosque', 'danse', 'remisage', 'frais')),
  libelle text not null,
  description text not null default '',
  montant_cents integer not null check (montant_cents >= 0),
  unite text not null default 'unité',
  a_confirmer boolean not null default true,
  actif boolean not null default true,
  ordre integer not null default 0,
  maj_le timestamptz not null default now()
);

-- ---------- Salles et créneaux (flux 4a : réservation libre-service) ----------
create table public.salles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nom text not null,
  description text not null default '',
  cle_prix text references public.prix (cle),
  capacite integer,
  ordre integer not null default 0
);

create table public.creneaux_salle (
  id uuid primary key default gen_random_uuid(),
  salle_id uuid not null references public.salles (id) on delete cascade,
  debut timestamptz not null,
  fin timestamptz not null,
  -- ouvert : réservable · retenu : paiement en cours · reserve : payé · verrouille : bloqué par l'admin
  statut text not null default 'ouvert' check (statut in ('ouvert', 'retenu', 'reserve', 'verrouille')),
  retenu_jusqua timestamptz,
  prix_cents integer check (prix_cents >= 0),
  note text not null default '',
  cree_le timestamptz not null default now(),
  check (fin > debut)
);
create index on public.creneaux_salle (salle_id, debut);

-- Date verrouillée : bloque tous les créneaux de la date (toutes les salles si salle_id est vide)
create table public.dates_verrouillees (
  id uuid primary key default gen_random_uuid(),
  jour date not null,
  salle_id uuid references public.salles (id) on delete cascade,
  raison text not null default '',
  cree_le timestamptz not null default now(),
  unique (jour, salle_id)
);

create table public.reservations_salle (
  id uuid primary key default gen_random_uuid(),
  creneau_id uuid not null references public.creneaux_salle (id),
  nom text not null,
  courriel text not null,
  telephone text not null,
  type_evenement text not null default '',
  personnes integer,
  commentaires text not null default '',
  montant_cents integer not null,
  statut text not null default 'en_paiement' check (statut in ('en_paiement', 'confirmee', 'annulee', 'expiree')),
  cree_le timestamptz not null default now()
);
-- Une seule réservation active par créneau : impossible de vendre deux fois le même
create unique index reservation_unique_par_creneau on public.reservations_salle (creneau_id)
  where statut in ('en_paiement', 'confirmee');

-- ---------- Kiosques (4b intérieur sur plan, 4c extérieur géré par l'admin) ----------
create table public.emplacements_kiosque (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  zone text not null default 'palais' check (zone in ('palais')),
  -- position sur le plan, en unités de grille (1 unité = 1 case du plan)
  x integer not null, y integer not null,
  largeur integer not null default 1, hauteur integer not null default 1,
  dimensions text not null default '10 pi × 10 pi',
  prix_cents integer check (prix_cents >= 0),
  actif boolean not null default true,
  note text not null default ''
);

create table public.demandes_kiosque (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('interieur', 'exterieur')),
  annee integer not null default extract(year from now())::int,
  emplacement_id uuid references public.emplacements_kiosque (id),
  entreprise text not null,
  nom text not null,
  courriel text not null,
  telephone text not null,
  description text not null default '',
  besoins text not null default '',
  -- intérieur : en_attente -> approuvee (lien de paiement) -> confirmee (payée)
  -- extérieur : en_attente -> entente (affaire notée) -> facturee -> confirmee (facture payée)
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'approuvee', 'entente', 'facturee', 'confirmee', 'refusee', 'annulee')),
  montant_cents integer check (montant_cents >= 0),
  jeton_paiement uuid unique default gen_random_uuid(),
  stripe_facture_id text,
  url_facture text,
  notes_admin text not null default '',
  cree_le timestamptz not null default now(),
  maj_le timestamptz not null default now(),
  check (type = 'exterieur' or emplacement_id is not null)
);
-- Un emplacement ne peut être tenu (approuvé ou confirmé) que par une seule demande par année
create unique index emplacement_unique_par_annee on public.demandes_kiosque (emplacement_id, annee)
  where statut in ('approuvee', 'confirmee');

-- ---------- Danse country (4d : forfaits à paliers) ----------
create table public.inscriptions_danse (
  id uuid primary key default gen_random_uuid(),
  cle_prix text not null references public.prix (cle),
  nom text not null,
  courriel text not null,
  telephone text not null,
  personnes integer not null default 1 check (personnes between 1 and 10),
  montant_cents integer not null,
  statut text not null default 'en_paiement' check (statut in ('en_paiement', 'payee', 'annulee', 'expiree')),
  cree_le timestamptz not null default now()
);

-- ---------- Remisage d'hiver (4e : approbation puis dépôt) ----------
create table public.demandes_remisage (
  id uuid primary key default gen_random_uuid(),
  saison text not null,
  type_vehicule text not null,
  marque_modele text not null default '',
  longueur_pi numeric(6,2) not null check (longueur_pi > 0),
  largeur_pi numeric(6,2) check (largeur_pi > 0),
  hauteur_pi numeric(6,2) check (hauteur_pi > 0),
  entree_souhaitee text not null default '',
  nom text not null,
  courriel text not null,
  telephone text not null,
  commentaires text not null default '',
  -- en_attente -> approuvee (lien de dépôt) -> depot_paye ; ou refusee / annulee
  statut text not null default 'en_attente' check (statut in ('en_attente', 'approuvee', 'depot_paye', 'refusee', 'annulee')),
  prix_total_cents integer check (prix_total_cents >= 0),
  depot_cents integer check (depot_cents >= 0),
  jeton_paiement uuid unique default gen_random_uuid(),
  notes_admin text not null default '',
  cree_le timestamptz not null default now(),
  maj_le timestamptz not null default now()
);

-- ---------- Paiements Stripe (tous les flux) ----------
create table public.paiements (
  id uuid primary key default gen_random_uuid(),
  objet_type text not null check (objet_type in ('salle', 'kiosque', 'danse', 'remisage')),
  objet_id uuid not null,
  stripe_session_id text unique,
  stripe_payment_intent text,
  stripe_facture_id text,
  montant_cents integer not null,
  frais_annulation_cents integer not null default 0,
  rembourse_cents integer not null default 0,
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'paye', 'rembourse', 'rembourse_partiel', 'expire', 'echec')),
  courriel text not null default '',
  cree_le timestamptz not null default now(),
  maj_le timestamptz not null default now()
);
create index on public.paiements (objet_type, objet_id);

-- ---------- Programmation (calendrier d'événements) ----------
create table public.evenements (
  id uuid primary key default gen_random_uuid(),
  annee integer not null,
  jour date not null,
  heure text not null default '',
  titre text not null,
  lieu text not null default '',
  prix text not null default '',
  description text not null default '',
  categories text[] not null default '{}',
  photo text not null default '',
  publie boolean not null default true,
  ordre integer not null default 0,
  cree_le timestamptz not null default now()
);
create index on public.evenements (annee, jour, ordre);

-- ---------- Contenu éditable et médiathèque ----------
create table public.contenus (
  cle text primary key,
  libelle text not null,
  valeur text not null,
  maj_le timestamptz not null default now()
);

create table public.medias (
  id uuid primary key default gen_random_uuid(),
  chemin text not null unique,
  type text not null default 'photo' check (type in ('photo', 'video')),
  -- photo : url de l'image; vidéo : lien YouTube ou Facebook (vignette = image d'aperçu)
  url text not null,
  vignette text not null default '',
  alt text not null,
  credit text not null default '',
  categorie text not null default 'galerie',
  publie boolean not null default true,
  ordre integer not null default 0,
  cree_le timestamptz not null default now()
);

-- ---------- Messages (contact) et boîte d'envoi (courriels simulés) ----------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  formulaire text not null,
  nom text not null,
  courriel text not null,
  telephone text not null default '',
  sujet text not null default '',
  message text not null default '',
  donnees jsonb not null default '{}',
  traite boolean not null default false,
  cree_le timestamptz not null default now()
);

create table public.courriels_sortants (
  id uuid primary key default gen_random_uuid(),
  destinataire text not null,
  sujet text not null,
  html text not null,
  texte text not null,
  gabarit text not null,
  fournisseur text not null,
  statut text not null check (statut in ('journalise', 'envoye', 'echec')),
  erreur text,
  cree_le timestamptz not null default now()
);

-- =====================================================================
-- Fonctions transactionnelles (appelées par le serveur avec la clé service)
-- =====================================================================

-- Retient un créneau pour 30 minutes pendant le paiement. Renvoie false s'il n'est plus libre.
-- Un créneau « retenu » dont le délai est passé redevient libre.
create or replace function public.retenir_creneau(p_creneau uuid, p_minutes integer default 30)
returns boolean language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  update public.creneaux_salle c
     set statut = 'retenu', retenu_jusqua = now() + make_interval(mins => p_minutes)
   where c.id = p_creneau
     and c.debut > now()
     and (c.statut = 'ouvert' or (c.statut = 'retenu' and c.retenu_jusqua < now()))
     and not exists (
       select 1 from public.dates_verrouillees d
        where d.jour = (c.debut at time zone 'America/Toronto')::date
          and (d.salle_id is null or d.salle_id = c.salle_id));
  get diagnostics n = row_count;
  if n = 1 then
    -- une réservation restée « en paiement » sur ce créneau est expirée
    update public.reservations_salle set statut = 'expiree'
     where creneau_id = p_creneau and statut = 'en_paiement';
  end if;
  return n = 1;
end $$;

revoke all on function public.retenir_creneau(uuid, integer) from public, anon, authenticated;

-- Vue publique de l'état des emplacements : occupé ou libre, sans aucun renseignement personnel
create or replace function public.etat_emplacements(p_annee integer)
returns table (id uuid, occupe boolean) language sql stable security definer set search_path = public as $$
  select e.id,
         exists (select 1 from public.demandes_kiosque d
                  where d.emplacement_id = e.id and d.annee = p_annee
                    and d.statut in ('approuvee', 'confirmee'))
    from public.emplacements_kiosque e
$$;
grant execute on function public.etat_emplacements(integer) to anon, authenticated;

-- maj_le automatique
create or replace function public.toucher_maj() returns trigger language plpgsql as $$
begin new.maj_le = now(); return new; end $$;
create trigger t_maj before update on public.demandes_kiosque for each row execute function public.toucher_maj();
create trigger t_maj before update on public.demandes_remisage for each row execute function public.toucher_maj();
create trigger t_maj before update on public.paiements for each row execute function public.toucher_maj();
create trigger t_maj before update on public.prix for each row execute function public.toucher_maj();
create trigger t_maj before update on public.contenus for each row execute function public.toucher_maj();

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.profils enable row level security;
alter table public.prix enable row level security;
alter table public.salles enable row level security;
alter table public.creneaux_salle enable row level security;
alter table public.dates_verrouillees enable row level security;
alter table public.reservations_salle enable row level security;
alter table public.emplacements_kiosque enable row level security;
alter table public.demandes_kiosque enable row level security;
alter table public.inscriptions_danse enable row level security;
alter table public.demandes_remisage enable row level security;
alter table public.paiements enable row level security;
alter table public.evenements enable row level security;
alter table public.contenus enable row level security;
alter table public.medias enable row level security;
alter table public.messages enable row level security;
alter table public.courriels_sortants enable row level security;

-- Profils : chaque admin voit le sien; le super-admin voit et gère tout
create policy profils_soi on public.profils for select to authenticated using (id = auth.uid() or public.est_admin());
create policy profils_super on public.profils for all to authenticated
  using (public.est_super_admin()) with check (public.est_super_admin());

-- Contenu public en lecture
create policy prix_public on public.prix for select to anon, authenticated using (actif and not a_confirmer);
create policy salles_public on public.salles for select to anon, authenticated using (true);
create policy creneaux_public on public.creneaux_salle for select to anon, authenticated using (true);
create policy verrous_public on public.dates_verrouillees for select to anon, authenticated using (true);
create policy emplacements_public on public.emplacements_kiosque for select to anon, authenticated using (actif);
create policy evenements_public on public.evenements for select to anon, authenticated using (publie);
create policy contenus_public on public.contenus for select to anon, authenticated using (true);
create policy medias_public on public.medias for select to anon, authenticated using (publie);

-- Admins : lecture de tout (y compris prix fictifs, médias non publiés, événements brouillons)
do $$
declare t text;
begin
  foreach t in array array['prix','salles','creneaux_salle','dates_verrouillees','reservations_salle',
    'emplacements_kiosque','demandes_kiosque','inscriptions_danse','demandes_remisage','paiements',
    'evenements','contenus','medias','messages','courriels_sortants'] loop
    execute format('create policy %I on public.%I for select to authenticated using (public.est_admin())', t || '_admin_lecture', t);
  end loop;
  -- Éditeurs et super-admin : écriture. Les lecteurs n'ont aucune politique d'écriture.
  foreach t in array array['prix','salles','creneaux_salle','dates_verrouillees','reservations_salle',
    'emplacements_kiosque','demandes_kiosque','inscriptions_danse','demandes_remisage','paiements',
    'evenements','contenus','medias','messages'] loop
    execute format('create policy %I on public.%I for insert to authenticated with check (public.peut_editer())', t || '_edit_ins', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.peut_editer()) with check (public.peut_editer())', t || '_edit_maj', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.peut_editer())', t || '_edit_sup', t);
  end loop;
end $$;
-- La boîte d'envoi est en lecture seule pour tout le monde (seul le serveur y écrit)

-- =====================================================================
-- Stockage : médiathèque (lecture publique, écriture par les éditeurs)
-- =====================================================================
insert into storage.buckets (id, name, public) values ('medias', 'medias', true)
  on conflict (id) do nothing;

create policy medias_lecture on storage.objects for select to anon, authenticated using (bucket_id = 'medias');
create policy medias_ajout on storage.objects for insert to authenticated
  with check (bucket_id = 'medias' and public.peut_editer());
create policy medias_maj on storage.objects for update to authenticated
  using (bucket_id = 'medias' and public.peut_editer());
create policy medias_suppression on storage.objects for delete to authenticated
  using (bucket_id = 'medias' and public.peut_editer());
