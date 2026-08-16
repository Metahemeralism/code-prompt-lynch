/**
 * Bakes Natural Earth country boundaries into static SVG paths so the site
 * ships no mapping libraries at runtime.
 *
 *   node scripts/generate-world-map.mjs
 *
 * Outputs src/terminal/worldMap.ts containing:
 *   - COUNTRY_SHAPES: 1:110m polygons, enough detail for a world map
 *   - COUNTRY_POINTS: centroids from the finer 1:50m set, so micro-states
 *     (Singapore, Malta, Mauritius…) that have no visible polygon can still
 *     be marked with a dot
 */
import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import * as topojson from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';

const require = createRequire(import.meta.url);

const load = (res) => {
  const topology = JSON.parse(
    readFileSync(require.resolve(`world-atlas/countries-${res}.json`), 'utf8')
  );
  return topojson.feature(topology, topology.objects.countries).features;
};

// Antarctica dominates the frame and adds nothing here.
const drop = (features) => features.filter((f) => f.properties.name !== 'Antarctica');

const coarse = drop(load('110m'));
const fine = drop(load('50m'));

const WIDTH = 1000;
const HEIGHT = 480;

const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], {
  type: 'FeatureCollection',
  features: coarse,
});
const path = geoPath(projection);

// Trim coordinate precision — at this size one decimal is imperceptible
// and roughly halves the payload.
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));
const r1 = (n) => Math.round(n * 10) / 10;

const shapes = coarse
  .map((f) => {
    const d = path(f);
    if (!d) return null;
    const [[x0, y0], [x1, y1]] = path.bounds(f);
    return {
      id: String(f.id),
      name: f.properties.name,
      d: round(d),
      // Projected bounding-box area, used to decide whether a country is
      // large enough to read as a filled shape.
      a: Math.round((x1 - x0) * (y1 - y0)),
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));

// Centroids for every country in the finer set, including the ones with no
// coarse polygon at all.
const points = {};
for (const f of fine) {
  const [x, y] = path.centroid(f);
  if (Number.isFinite(x) && Number.isFinite(y)) {
    points[f.properties.name] = [r1(x), r1(y)];
  }
}

const coarseNames = new Set(shapes.map((s) => s.name));
const onlyFine = Object.keys(points).filter((n) => !coarseNames.has(n));

const out = `// GENERATED FILE — do not edit by hand.
// Natural Earth country boundaries projected with d3-geo's Natural Earth I
// projection and baked to static SVG paths, so the site ships no mapping
// libraries at runtime.
//
// Regenerate with: node scripts/generate-world-map.mjs

export const WORLD_VIEWBOX = '0 0 ${WIDTH} ${HEIGHT}';

export interface CountryShape {
  /** ISO 3166-1 numeric code */
  id: string;
  /** Natural Earth country name */
  name: string;
  /** SVG path data */
  d: string;
  /** Projected bounding-box area, in square units of the viewBox */
  a: number;
}

export const COUNTRY_SHAPES: CountryShape[] = ${JSON.stringify(shapes)};

/** Centroids for every country, including micro-states with no polygon. */
export const COUNTRY_POINTS: Record<string, [number, number]> = ${JSON.stringify(points)};
`;

writeFileSync(new URL('../src/terminal/worldMap.ts', import.meta.url), out);

console.log('polygons:', shapes.length);
console.log('centroids:', Object.keys(points).length);
console.log('centroid-only (no polygon):', onlyFine.length);
console.log('  e.g.', onlyFine.slice(0, 12).join(', '));
console.log('file KB:', Math.round(Buffer.byteLength(out) / 1024));
