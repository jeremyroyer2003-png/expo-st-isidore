-- Une demande de kiosque intérieur peut tenir plusieurs emplacements (souvent deux voisins).
-- emplacement_id reste l'emplacement principal; les autres vont dans emplacements_lies.
-- Une seule demande, un seul montant, un seul lien de paiement.

alter table public.demandes_kiosque
  add column if not exists emplacements_lies uuid[] not null default '{}';

-- État public du plan : un emplacement lié à une demande approuvée ou payée est occupé
create or replace function public.etat_emplacements(p_annee integer)
returns table (id uuid, occupe boolean) language sql stable security definer set search_path = public as $$
  select e.id,
         exists (select 1 from public.demandes_kiosque d
                  where (d.emplacement_id = e.id or e.id = any (d.emplacements_lies))
                    and d.annee = p_annee
                    and d.statut in ('approuvee', 'confirmee'))
    from public.emplacements_kiosque e
$$;
grant execute on function public.etat_emplacements(integer) to anon, authenticated;

-- Aucun emplacement (principal ou lié) tenu par deux demandes approuvées ou payées la même année.
-- L'index unique existant couvre l'emplacement principal; ce déclencheur couvre aussi les emplacements liés.
create or replace function public.verifier_emplacements_libres() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  tous uuid[] := array_remove(array_prepend(new.emplacement_id, coalesce(new.emplacements_lies, '{}')), null);
begin
  if new.statut in ('approuvee', 'confirmee') and exists (
    select 1 from public.demandes_kiosque d
     where d.id <> new.id and d.annee = new.annee and d.statut in ('approuvee', 'confirmee')
       and (d.emplacement_id = any (tous) or d.emplacements_lies && tous)
  ) then
    raise exception 'Emplacement déjà attribué' using errcode = '23505';
  end if;
  return new;
end $$;

drop trigger if exists t_emplacements_libres on public.demandes_kiosque;
create trigger t_emplacements_libres before insert or update on public.demandes_kiosque
  for each row execute function public.verifier_emplacements_libres();
