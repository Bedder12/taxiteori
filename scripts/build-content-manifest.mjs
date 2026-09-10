import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function files(directory, suffix) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path, suffix) : entry.name.endsWith(suffix) ? [path] : [];
  });
}

const entries = [
  ['D1_NAVIGATION', 'd1-navigation'],
  ['D1_ECO_DRIVING', 'd1-eco-driving'],
  ['D1_ENVIRONMENT', 'd1-environment'],
  ['D1_SAFETY', 'd1-safety'],
  ['D1_SERVICE', 'd1-service'],
  ['D1_HEALTH_DISABILITIES', 'd1-health-disabilities'],
  ['D1_WORK_ENVIRONMENT_RISK', 'd1-work-environment-risk'],
  ['D1_VEHICLE_KNOWLEDGE', 'd1-vehicle-knowledge'],
  ['D2_TAXI_LAW', 'd2-taxi-law'],
  ['D2_TRAFFIC_LAW', 'd2-traffic-law'],
].map(([subject, directory]) => {
  const paths = files(join('data/content', directory), '.json').concat(files(join('data/questions', directory), '.json'));
  return {
    subject,
    directory,
    files: paths.map((path) => ({ path, bytes: statSync(path).size })),
    total_bytes: paths.reduce((sum, path) => sum + statSync(path).size, 0),
  };
});

writeFileSync('data/content-manifest.json', `${JSON.stringify({ generated_at: '2026-09-10', entries }, null, 2)}\n`);
console.log(`Wrote content manifest for ${entries.length} subjects.`);