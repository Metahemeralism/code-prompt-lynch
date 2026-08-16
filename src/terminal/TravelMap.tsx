import { COUNTRY_POINTS, COUNTRY_SHAPES, WORLD_VIEWBOX } from './worldMap';

/**
 * Lazily loaded: the baked country geometry is ~120KB, so it is only
 * fetched when someone actually opens the map.
 */


/**
 * Countries visited. Names are matched loosely — case, punctuation, accents
 * and the common informal names ("UK", "USA", "Czech Republic") all work,
 * so you can just write them the way you'd say them.
 *
 * Anything that can't be matched is listed under the map rather than
 * silently dropped, so a typo is obvious.
 */
export const visitedCountries: string[] = [
  'United Kingdom',
  'South Africa',
];

const normalise = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Informal name -> Natural Earth name. */
const COUNTRY_ALIASES: Record<string, string> = {
  uk: 'United Kingdom',
  'great britain': 'United Kingdom',
  britain: 'United Kingdom',
  england: 'United Kingdom',
  scotland: 'United Kingdom',
  wales: 'United Kingdom',
  'northern ireland': 'United Kingdom',
  usa: 'United States of America',
  us: 'United States of America',
  'united states': 'United States of America',
  america: 'United States of America',
  uae: 'United Arab Emirates',
  emirates: 'United Arab Emirates',
  'czech republic': 'Czechia',
  'bosnia and herzegovina': 'Bosnia and Herz.',
  bosnia: 'Bosnia and Herz.',
  'democratic republic of the congo': 'Dem. Rep. Congo',
  'dr congo': 'Dem. Rep. Congo',
  drc: 'Dem. Rep. Congo',
  'republic of the congo': 'Congo',
  'dominican republic': 'Dominican Rep.',
  'equatorial guinea': 'Eq. Guinea',
  'central african republic': 'Central African Rep.',
  'south sudan': 'S. Sudan',
  'western sahara': 'W. Sahara',
  'solomon islands': 'Solomon Is.',
  'ivory coast': "Côte d'Ivoire",
  swaziland: 'eSwatini',
  'north macedonia': 'Macedonia',
  'east timor': 'Timor-Leste',
  burma: 'Myanmar',
  holland: 'Netherlands',
  korea: 'South Korea',
  'vatican city': 'Vatican',
  'cape verde': 'Cabo Verde',
  trinidad: 'Trinidad and Tobago',
};

const COUNTRY_INDEX: Map<string, string> = (() => {
  const index = new Map<string, string>();
  for (const shape of COUNTRY_SHAPES) index.set(normalise(shape.name), shape.name);
  for (const name of Object.keys(COUNTRY_POINTS)) {
    if (!index.has(normalise(name))) index.set(normalise(name), name);
  }
  // Aliases only resolve if their target actually exists in the data.
  for (const [alias, target] of Object.entries(COUNTRY_ALIASES)) {
    if (index.has(normalise(target))) index.set(normalise(alias), index.get(normalise(target))!);
  }
  return index;
})();

const resolveCountry = (value: string) => COUNTRY_INDEX.get(normalise(value));

/** Below this projected area a country reads as a speck, so it gets a dot. */
const TINY_AREA = 30;

const TravelMap = () => {
  const resolved = visitedCountries.map((input) => ({ input, name: resolveCountry(input) }));
  const matched = resolved.filter((r) => r.name) as { input: string; name: string }[];
  const unmatched = resolved.filter((r) => !r.name);

  const visitedNames = new Set(matched.map((r) => r.name));
  const shapeByName = new Map(COUNTRY_SHAPES.map((s) => [s.name, s]));

  // Dot for anything too small to see as a filled shape.
  const markers = matched
    .map(({ name }) => {
      const shape = shapeByName.get(name);
      if (shape && shape.a >= TINY_AREA) return null;
      const point = COUNTRY_POINTS[name];
      return point ? { name, x: point[0], y: point[1] } : null;
    })
    .filter(Boolean) as { name: string; x: number; y: number }[];

  return (
    <div className="mt-3">
      <div className="border border-gray-800 rounded-md bg-gray-950/60 p-2">
        <svg
          viewBox={WORLD_VIEWBOX}
          className="w-full h-auto"
          role="img"
          aria-label={`World map with ${matched.length} visited countries highlighted`}
        >
          <g>
            {COUNTRY_SHAPES.map((shape) => {
              const isVisited = visitedNames.has(shape.name);
              return (
                <path
                  key={shape.id + shape.name}
                  d={shape.d}
                  fill={isVisited ? 'rgb(74 222 128 / 0.75)' : 'rgb(31 41 55 / 0.75)'}
                  stroke={isVisited ? 'rgb(134 239 172)' : 'rgb(55 65 81)'}
                  strokeWidth={isVisited ? 0.8 : 0.4}
                  vectorEffect="non-scaling-stroke"
                >
                  {isVisited && <title>{shape.name}</title>}
                </path>
              );
            })}
          </g>

          {markers.map((marker) => (
            <g key={marker.name}>
              <circle
                cx={marker.x}
                cy={marker.y}
                r={5}
                fill="rgb(74 222 128 / 0.25)"
                stroke="rgb(134 239 172)"
                strokeWidth={0.8}
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={marker.x} cy={marker.y} r={1.8} fill="rgb(134 239 172)">
                <title>{marker.name}</title>
              </circle>
            </g>
          ))}
        </svg>
      </div>

      <p className="text-gray-500 text-sm mt-2">
        <span className="text-green-400">{matched.length}</span>{' '}
        {matched.length === 1 ? 'country' : 'countries'} so far —{' '}
        <span className="text-gray-400">
          {matched
            .map((r) => r.name)
            .sort((a, b) => a.localeCompare(b))
            .join(', ')}
        </span>
      </p>

      {unmatched.length > 0 && (
        <p className="text-amber-400/80 text-sm mt-1">
          Not found on the map: {unmatched.map((r) => r.input).join(', ')}
        </p>
      )}
    </div>
  );
};

export default TravelMap;
