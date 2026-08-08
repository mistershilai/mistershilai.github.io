// Countries to outline in accent color on the globes, by ISO 3166-1 numeric
// code (matching the ids in the world-atlas topojson).
//
// Shared by the homepage globe and the /photos globe so the two can't drift
// apart. Add a country here once and both pick it up.
//
// Bahrain (048) is deliberately absent: the only photo of it was taken from
// the air, so it doesn't count as visited.
export const VISITED_IDS = new Set([
  '076', // Brazil
  '604', // Peru
  '222', // El Salvador
  '044', // Bahamas
  '840', // United States
  '124', // Canada
  '352', // Iceland
  '792', // Türkiye
  '634', // Qatar
  '356', // India
  '156', // China
  '392', // Japan
  '710', // South Africa
  '426', // Lesotho
  '072', // Botswana
  '516', // Namibia
  '716', // Zimbabwe
  '894', // Zambia
]);
