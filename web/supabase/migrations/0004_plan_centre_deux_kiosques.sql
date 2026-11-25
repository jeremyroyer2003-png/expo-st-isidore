-- Plan du palais des commerces : 2 kiosques de plus au centre de l'îlot du milieu (3e rangée),
-- à la place du passage (précision de Jérémy, 25 novembre 2026). Numéros 52 et 53 en attendant
-- la vraie numérotation du comité.
insert into public.emplacements_kiosque (code, x, y, largeur, hauteur, dimensions, note) values
  ('52', 9, 8, 2, 2, 'Dimensions à confirmer', ''),
  ('53', 11, 8, 2, 2, 'Dimensions à confirmer', '')
on conflict (code) do update set x = excluded.x, y = excluded.y;
