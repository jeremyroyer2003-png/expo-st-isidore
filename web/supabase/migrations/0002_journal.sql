-- =====================================================================
-- 0002 : journal (historique) des réservations et demandes
-- Qui a approuvé, refusé, relancé, annulé ou remboursé, et quand.
-- À exécuter une fois dans Supabase > SQL Editor, après 0001_schema.sql.
-- Sans cette table, le site fonctionne quand même : l'historique est simplement vide.
-- =====================================================================
create table if not exists public.journal (
  id uuid primary key default gen_random_uuid(),
  objet_type text not null check (objet_type in ('salle', 'kiosque', 'danse', 'remisage')),
  objet_id uuid not null,
  action text not null,
  details text not null default '',
  -- Admin qui a fait l'action (vide pour le client, Stripe ou le système)
  par_id uuid references public.profils (id) on delete set null,
  par_nom text not null default '',
  cree_le timestamptz not null default now()
);
create index if not exists journal_objet on public.journal (objet_id, cree_le);

alter table public.journal enable row level security;

-- Tous les admins lisent l'historique. Les éditeurs y ajoutent des lignes en leur propre nom seulement.
-- Aucune modification ni suppression : le journal ne se réécrit pas.
-- Le serveur (clé service) ajoute les événements du client et de Stripe.
drop policy if exists journal_admin_lecture on public.journal;
create policy journal_admin_lecture on public.journal for select to authenticated using (public.est_admin());
drop policy if exists journal_edit_ins on public.journal;
create policy journal_edit_ins on public.journal for insert to authenticated
  with check (public.peut_editer() and par_id = auth.uid());
