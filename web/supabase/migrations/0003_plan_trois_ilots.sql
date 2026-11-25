-- Plan du palais des commerces : le centre forme 3 îlots verticaux de 2 colonnes (sur la longueur),
-- avec une allée entre chacun (correction de Jérémy, 25 novembre 2026). Les 28 numéros (7 à 34) restent,
-- renumérotés de gauche à droite, rangée par rangée. L'îlot du milieu a un passage à la 3e rangée.
-- Îlot A : x = 3 et 5 · îlot B : x = 9 et 11 · îlot C : x = 15 et 17 · rangées y = 4, 6, 8, 10, 12.
update public.emplacements_kiosque as e set x = v.x, y = v.y
from (values
  ('7', 3, 4), ('8', 5, 4), ('9', 9, 4), ('10', 11, 4), ('11', 15, 4), ('12', 17, 4),
  ('13', 3, 6), ('14', 5, 6), ('15', 9, 6), ('16', 11, 6), ('17', 15, 6), ('18', 17, 6),
  ('19', 3, 8), ('20', 5, 8), ('21', 15, 8), ('22', 17, 8),
  ('23', 3, 10), ('24', 5, 10), ('25', 9, 10), ('26', 11, 10), ('27', 15, 10), ('28', 17, 10),
  ('29', 3, 12), ('30', 5, 12), ('31', 9, 12), ('32', 11, 12), ('33', 15, 12), ('34', 17, 12)
) as v(code, x, y)
where e.code = v.code;
