// Slovak Cities Database
// Comprehensive list of cities and towns in Slovakia grouped by regions (kraje)
// Used for location picker in listing forms

export interface SlovakCity {
  name: string
  nameSk: string
  district: string // okres
}

export interface SlovakRegion {
  name: string
  nameSk: string
  slug: string
  cities: SlovakCity[]
}

// All 8 Slovak regions with major cities
export const SLOVAK_REGIONS: SlovakRegion[] = [
  {
    name: 'Bratislava Region',
    nameSk: 'Bratislavský kraj',
    slug: 'bratislava',
    cities: [
      { name: 'Bratislava', nameSk: 'Bratislava', district: 'Bratislava' },
      { name: 'Malacky', nameSk: 'Malacky', district: 'Malacky' },
      { name: 'Pezinok', nameSk: 'Pezinok', district: 'Pezinok' },
      { name: 'Senec', nameSk: 'Senec', district: 'Senec' },
      { name: 'Stupava', nameSk: 'Stupava', district: 'Malacky' },
      { name: 'Svätý Jur', nameSk: 'Svätý Jur', district: 'Pezinok' },
      { name: 'Modra', nameSk: 'Modra', district: 'Pezinok' },
      { name: 'Bernolákovo', nameSk: 'Bernolákovo', district: 'Senec' },
      {
        name: 'Ivanka pri Dunaji',
        nameSk: 'Ivanka pri Dunaji',
        district: 'Senec',
      },
    ],
  },
  {
    name: 'Trnava Region',
    nameSk: 'Trnavský kraj',
    slug: 'trnava',
    cities: [
      { name: 'Trnava', nameSk: 'Trnava', district: 'Trnava' },
      {
        name: 'Dunajská Streda',
        nameSk: 'Dunajská Streda',
        district: 'Dunajská Streda',
      },
      { name: 'Galanta', nameSk: 'Galanta', district: 'Galanta' },
      { name: 'Hlohovec', nameSk: 'Hlohovec', district: 'Hlohovec' },
      { name: 'Piešťany', nameSk: 'Piešťany', district: 'Piešťany' },
      { name: 'Senica', nameSk: 'Senica', district: 'Senica' },
      { name: 'Skalica', nameSk: 'Skalica', district: 'Skalica' },
      { name: 'Sereď', nameSk: 'Sereď', district: 'Galanta' },
      { name: 'Šamorín', nameSk: 'Šamorín', district: 'Dunajská Streda' },
      { name: 'Leopoldov', nameSk: 'Leopoldov', district: 'Hlohovec' },
    ],
  },
  {
    name: 'Trenčín Region',
    nameSk: 'Trenčiansky kraj',
    slug: 'trencin',
    cities: [
      { name: 'Trenčín', nameSk: 'Trenčín', district: 'Trenčín' },
      {
        name: 'Považská Bystrica',
        nameSk: 'Považská Bystrica',
        district: 'Považská Bystrica',
      },
      { name: 'Prievidza', nameSk: 'Prievidza', district: 'Prievidza' },
      { name: 'Partizánske', nameSk: 'Partizánske', district: 'Partizánske' },
      {
        name: 'Dubnica nad Váhom',
        nameSk: 'Dubnica nad Váhom',
        district: 'Ilava',
      },
      {
        name: 'Nové Mesto nad Váhom',
        nameSk: 'Nové Mesto nad Váhom',
        district: 'Nové Mesto nad Váhom',
      },
      { name: 'Púchov', nameSk: 'Púchov', district: 'Púchov' },
      { name: 'Handlová', nameSk: 'Handlová', district: 'Prievidza' },
      {
        name: 'Bánovce nad Bebravou',
        nameSk: 'Bánovce nad Bebravou',
        district: 'Bánovce nad Bebravou',
      },
      { name: 'Myjava', nameSk: 'Myjava', district: 'Myjava' },
    ],
  },
  {
    name: 'Nitra Region',
    nameSk: 'Nitriansky kraj',
    slug: 'nitra',
    cities: [
      { name: 'Nitra', nameSk: 'Nitra', district: 'Nitra' },
      { name: 'Komárno', nameSk: 'Komárno', district: 'Komárno' },
      { name: 'Levice', nameSk: 'Levice', district: 'Levice' },
      { name: 'Nové Zámky', nameSk: 'Nové Zámky', district: 'Nové Zámky' },
      { name: 'Topoľčany', nameSk: 'Topoľčany', district: 'Topoľčany' },
      { name: 'Šaľa', nameSk: 'Šaľa', district: 'Šaľa' },
      {
        name: 'Zlaté Moravce',
        nameSk: 'Zlaté Moravce',
        district: 'Zlaté Moravce',
      },
      { name: 'Štúrovo', nameSk: 'Štúrovo', district: 'Nové Zámky' },
      { name: 'Hurbanovo', nameSk: 'Hurbanovo', district: 'Komárno' },
      { name: 'Šurany', nameSk: 'Šurany', district: 'Nové Zámky' },
    ],
  },
  {
    name: 'Žilina Region',
    nameSk: 'Žilinský kraj',
    slug: 'zilina',
    cities: [
      { name: 'Žilina', nameSk: 'Žilina', district: 'Žilina' },
      { name: 'Martin', nameSk: 'Martin', district: 'Martin' },
      { name: 'Čadca', nameSk: 'Čadca', district: 'Čadca' },
      { name: 'Dolný Kubín', nameSk: 'Dolný Kubín', district: 'Dolný Kubín' },
      {
        name: 'Liptovský Mikuláš',
        nameSk: 'Liptovský Mikuláš',
        district: 'Liptovský Mikuláš',
      },
      { name: 'Ružomberok', nameSk: 'Ružomberok', district: 'Ružomberok' },
      {
        name: 'Kysucké Nové Mesto',
        nameSk: 'Kysucké Nové Mesto',
        district: 'Kysucké Nové Mesto',
      },
      { name: 'Bytča', nameSk: 'Bytča', district: 'Bytča' },
      { name: 'Námestovo', nameSk: 'Námestovo', district: 'Námestovo' },
      {
        name: 'Turčianske Teplice',
        nameSk: 'Turčianske Teplice',
        district: 'Turčianske Teplice',
      },
    ],
  },
  {
    name: 'Banská Bystrica Region',
    nameSk: 'Banskobystrický kraj',
    slug: 'banska-bystrica',
    cities: [
      {
        name: 'Banská Bystrica',
        nameSk: 'Banská Bystrica',
        district: 'Banská Bystrica',
      },
      { name: 'Zvolen', nameSk: 'Zvolen', district: 'Zvolen' },
      { name: 'Lučenec', nameSk: 'Lučenec', district: 'Lučenec' },
      {
        name: 'Rimavská Sobota',
        nameSk: 'Rimavská Sobota',
        district: 'Rimavská Sobota',
      },
      { name: 'Brezno', nameSk: 'Brezno', district: 'Brezno' },
      {
        name: 'Žiar nad Hronom',
        nameSk: 'Žiar nad Hronom',
        district: 'Žiar nad Hronom',
      },
      { name: 'Veľký Krtíš', nameSk: 'Veľký Krtíš', district: 'Veľký Krtíš' },
      { name: 'Detva', nameSk: 'Detva', district: 'Detva' },
      { name: 'Krupina', nameSk: 'Krupina', district: 'Krupina' },
      { name: 'Revúca', nameSk: 'Revúca', district: 'Revúca' },
    ],
  },
  {
    name: 'Prešov Region',
    nameSk: 'Prešovský kraj',
    slug: 'presov',
    cities: [
      { name: 'Prešov', nameSk: 'Prešov', district: 'Prešov' },
      { name: 'Poprad', nameSk: 'Poprad', district: 'Poprad' },
      { name: 'Humenné', nameSk: 'Humenné', district: 'Humenné' },
      { name: 'Bardejov', nameSk: 'Bardejov', district: 'Bardejov' },
      {
        name: 'Vranov nad Topľou',
        nameSk: 'Vranov nad Topľou',
        district: 'Vranov nad Topľou',
      },
      { name: 'Snina', nameSk: 'Snina', district: 'Snina' },
      { name: 'Svidník', nameSk: 'Svidník', district: 'Svidník' },
      {
        name: 'Stará Ľubovňa',
        nameSk: 'Stará Ľubovňa',
        district: 'Stará Ľubovňa',
      },
      { name: 'Kežmarok', nameSk: 'Kežmarok', district: 'Kežmarok' },
      { name: 'Levoča', nameSk: 'Levoča', district: 'Levoča' },
      { name: 'Svit', nameSk: 'Svit', district: 'Poprad' },
      {
        name: 'Medzilaborce',
        nameSk: 'Medzilaborce',
        district: 'Medzilaborce',
      },
    ],
  },
  {
    name: 'Košice Region',
    nameSk: 'Košický kraj',
    slug: 'kosice',
    cities: [
      { name: 'Košice', nameSk: 'Košice', district: 'Košice' },
      { name: 'Michalovce', nameSk: 'Michalovce', district: 'Michalovce' },
      {
        name: 'Spišská Nová Ves',
        nameSk: 'Spišská Nová Ves',
        district: 'Spišská Nová Ves',
      },
      { name: 'Trebišov', nameSk: 'Trebišov', district: 'Trebišov' },
      { name: 'Rožňava', nameSk: 'Rožňava', district: 'Rožňava' },
      {
        name: 'Moldava nad Bodvou',
        nameSk: 'Moldava nad Bodvou',
        district: 'Košice-okolie',
      },
      { name: 'Gelnica', nameSk: 'Gelnica', district: 'Gelnica' },
      { name: 'Sobrance', nameSk: 'Sobrance', district: 'Sobrance' },
      {
        name: 'Kráľovský Chlmec',
        nameSk: 'Kráľovský Chlmec',
        district: 'Trebišov',
      },
      { name: 'Sečovce', nameSk: 'Sečovce', district: 'Trebišov' },
    ],
  },
]

// Flat list of all cities for autocomplete
export const ALL_SLOVAK_CITIES: SlovakCity[] = SLOVAK_REGIONS.flatMap(
  (region) => region.cities
)

// Get city names for autocomplete (sorted alphabetically)
export function getSlovakCityNames(): string[] {
  return ALL_SLOVAK_CITIES.map((city) => city.nameSk).sort((a, b) =>
    a.localeCompare(b, 'sk')
  )
}

// Check if a location is a valid Slovak city
export function isValidSlovakLocation(location: string): boolean {
  const normalizedLocation = location.toLowerCase().trim()
  return ALL_SLOVAK_CITIES.some(
    (city) =>
      city.name.toLowerCase() === normalizedLocation ||
      city.nameSk.toLowerCase() === normalizedLocation
  )
}

// Get region for a city
export function getRegionForCity(cityName: string): SlovakRegion | undefined {
  const normalizedCity = cityName.toLowerCase().trim()
  return SLOVAK_REGIONS.find((region) =>
    region.cities.some(
      (city) =>
        city.name.toLowerCase() === normalizedCity ||
        city.nameSk.toLowerCase() === normalizedCity
    )
  )
}

// Search cities with fuzzy matching for autocomplete
export function searchSlovakCities(
  query: string,
  limit: number = 10
): SlovakCity[] {
  if (!query || query.length < 2) return []

  const normalizedQuery = query.toLowerCase().trim()

  return ALL_SLOVAK_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(normalizedQuery) ||
      city.nameSk.toLowerCase().includes(normalizedQuery)
  ).slice(0, limit)
}
