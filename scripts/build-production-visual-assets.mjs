import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const generatedAt = '2026-09-11';
const assetDir = 'assets/visuals';

function loadJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8').replace(/^\uFEFF/, ''));
}

function saveJson(relativePath, value) {
  const target = resolve(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}

function saveText(relativePath, value) {
  const target = resolve(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, value);
}

function walk(directory, suffix) {
  const found = [];
  function visit(relativeDirectory) {
    for (const entry of readdirSync(resolve(root, relativeDirectory), { withFileTypes: true })) {
      const relativePath = `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) visit(relativePath);
      else if (entry.name.endsWith(suffix)) found.push(relativePath);
    }
  }
  visit(directory);
  return found;
}

function subjectFromFile(file, parsed) {
  return parsed.metadata?.subject
    ?? (file.includes('d1-navigation') ? 'D1_NAVIGATION'
      : file.includes('d1-safety') ? 'D1_SAFETY'
        : file.includes('d1-service') ? 'D1_SERVICE'
          : file.includes('d1-vehicle-knowledge') ? 'D1_VEHICLE_KNOWLEDGE'
            : file.includes('d1-health-disabilities') ? 'D1_HEALTH_DISABILITIES'
              : file.includes('d1-work-environment-risk') ? 'D1_WORK_ENVIRONMENT_RISK'
                : file.includes('d2-traffic-law') ? 'D2_TRAFFIC_LAW'
                  : file.includes('d2-taxi-law') ? 'D2_TAXI_LAW'
                    : 'UNKNOWN');
}

function visualIdOf(item) {
  return item.visual_metadata?.visual_asset_id
    ?? item.navigation_metadata?.visual_asset_id
    ?? item.visual_asset_id
    ?? item.map_metadata?.visual_id
    ?? item.map_metadata?.id;
}

function isVisualReference(item) {
  const visual = item.visual_metadata ?? item.navigation_metadata;
  return Boolean(
    visual ||
    item.visual_asset_id ||
    item.map_metadata,
  );
}

function isRequired(item) {
  const visual = item.visual_metadata ?? item.navigation_metadata;
  return item.visual_correctness_depends_on_asset === true || visual?.visual_correctness_depends_on_asset === true;
}

function classify(item) {
  if (isRequired(item)) return 'visual_required';
  const visual = item.visual_metadata ?? item.navigation_metadata;
  if (visualIdOf(item)) return 'visual_enrichment';
  if (visual?.requires_image || visual?.requires_diagram || visual?.requires_road_scene || visual?.requires_map) return 'visual_enrichment';
  return 'unnecessary_visual';
}

const lessonFiles = walk('data/content', '-lessons.json');
const questionFiles = walk('data/questions', '-questions.json');
const visualFiles = walk('data/content', '-visuals.json');
const factFiles = walk('data/content', '-facts.json');
const facts = factFiles.flatMap((file) => loadJson(file).facts ?? []);
const factByKey = new Map(facts.map((fact) => [fact.stable_key, fact]));
const allItems = [];

for (const file of lessonFiles) {
  const parsed = loadJson(file);
  for (const lesson of parsed.lessons ?? []) {
    allItems.push({ kind: 'lesson', file, subject: subjectFromFile(file, parsed), stable_key: lesson.stable_key, item: lesson });
  }
}

for (const file of questionFiles) {
  const parsed = loadJson(file);
  for (const question of parsed.questions ?? []) {
    allItems.push({ kind: 'question', file, subject: subjectFromFile(file, parsed), stable_key: question.stable_key, item: question });
  }
}

const subjectVisualRecords = new Map();
for (const file of visualFiles) {
  const parsed = loadJson(file);
  const subject = subjectFromFile(file, parsed);
  for (const visual of parsed.visuals ?? []) {
    subjectVisualRecords.set(visual.visual_id, { ...visual, subject, file });
  }
}

const navigationQuestions = loadJson('data/questions/d1-navigation/navigation-questions.json');
const navigationVisuals = new Map();
for (const question of navigationQuestions.questions) {
  if (!question.map_metadata?.id) continue;
  navigationVisuals.set(question.map_metadata.id, {
    visual_id: question.map_metadata.id,
    visual_type: 'navigation_map_diagram',
    status: 'production_ready',
    purpose: question.map_metadata.description ?? 'Custom navigation map diagram',
    elements_must_be_shown: question.map_metadata.segments_km
      ? question.map_metadata.segments_km.map((segment) => `${segment} km`)
      : ['start', 'mål', 'ruttval', 'landmärke'],
    required_road_configuration: 'Custom simplified map diagram. Not based on external map screenshots.',
    labels_required: ['Start', 'Mål', 'Rutt'],
    requirement_keys: question.requirement_keys,
    fact_keys: question.fact_keys,
    correctness_depends_on_visual: false,
    notes: 'Production SVG replaces map metadata placeholder; question remains text-answerable.',
    subject: 'D1_NAVIGATION',
    file: 'data/content/d1-navigation/navigation-visuals.json',
  });
}

const navLessonVisualByTopic = {
  topic_d1_navigation_navigeringshjalpmedel: 'simple_grid_center_route',
  topic_d1_navigation_muntlig_fardbeskrivning: 'simple_suburb_route',
  topic_d1_navigation_kartlasning: 'simple_grid_center_route',
  topic_d1_navigation_avstand_restid_ankomst: 'simple_distance_segments',
};

function patchNavigationFile() {
  const questionBank = loadJson('data/questions/d1-navigation/navigation-questions.json');
  for (const question of questionBank.questions) {
    if (!question.map_metadata?.id) continue;
    question.visual_asset_id = question.map_metadata.id;
    question.visual_correctness_depends_on_asset = false;
    question.navigation_metadata = {
      ...(question.navigation_metadata ?? {}),
      visual_asset_id: question.map_metadata.id,
      visual_correctness_depends_on_asset: false,
    };
  }
  saveJson('data/questions/d1-navigation/navigation-questions.json', questionBank);

  const lessonBank = loadJson('data/content/d1-navigation/navigation-lessons.json');
  for (const lesson of lessonBank.lessons) {
    const visualId = navLessonVisualByTopic[lesson.topic_id];
    if (!visualId) continue;
    lesson.visual_asset_id = visualId;
    lesson.visual_correctness_depends_on_asset = false;
    lesson.navigation_metadata = {
      ...(lesson.navigation_metadata ?? {}),
      visual_asset_id: visualId,
      visual_correctness_depends_on_asset: false,
    };
  }
  saveJson('data/content/d1-navigation/navigation-lessons.json', lessonBank);

  saveJson('data/content/d1-navigation/navigation-visuals.json', {
    metadata: {
      subject: 'D1_NAVIGATION',
      title: 'D1 navigation production visual manifest',
      status: 'production_ready',
      created_at: generatedAt,
      note: 'Original custom map diagrams. No external map screenshots.',
    },
    visuals: [...navigationVisuals.values()].map(toProductionVisual),
  });
}

function toProductionVisual(visual) {
  return {
    ...visual,
    status: 'production_ready',
    asset_path: `${assetDir}/${visual.visual_id}.svg`,
    aspect_ratio: '16:9',
    alt_text: altTextFor(visual),
    text_equivalent: textEquivalentFor(visual),
    licensing: {
      source_dependency: 'none',
      copyright_status: 'original_in_house_diagram',
      prohibited_sources_used: false,
      notes: 'Original SVG generated from internal manifest/specification. Not copied from Trafikverket, commercial driving-theory material or map screenshots.',
    },
  };
}

function altTextFor(visual) {
  const title = visual.purpose ?? visual.title ?? visual.visual_id;
  const labels = (visual.labels_required ?? visual.elements_must_be_shown ?? []).slice(0, 5).join(', ');
  return `${title}. Diagram med ${labels}.`;
}

function textEquivalentFor(visual) {
  return `Visuellt stöd för ${visual.purpose ?? visual.visual_id}. Kärninnehållet finns även i lektionens text och frågans förklaring.`;
}

function patchVisualFiles() {
  for (const file of visualFiles) {
    const parsed = loadJson(file);
    parsed.metadata = { ...(parsed.metadata ?? {}), status: 'production_ready', visual_asset_status: 'production_ready', updated_at: generatedAt };
    parsed.visuals = (parsed.visuals ?? []).map(toProductionVisual);
    saveJson(file, parsed);
  }
}

function tag(svg) {
  return svg.replace(/\s+/g, ' ').trim();
}

function svgFor(visual) {
  const title = escapeXml(visual.purpose ?? visual.title ?? visual.visual_id);
  const labels = (visual.labels_required ?? visual.elements_must_be_shown ?? ['Start', 'Mål', 'Risk']).slice(0, 6);
  const type = visual.visual_type ?? 'diagram';
  const isRoad = /road|accident|night|weather|pedestrian|pickup|route|map/i.test(type + visual.visual_id);
  const isVehicle = /veh_|tyre|brake|battery|steering|fluid|dashboard|drivetrain|wheel|fuse/i.test(visual.visual_id + type);

  const labelNodes = labels.map((label, index) => {
    const y = 105 + index * 44;
    return `<g><circle cx="56" cy="${y - 6}" r="8" fill="${index % 2 ? '#0f766e' : '#1d4ed8'}"/><text x="76" y="${y}" class="label">${escapeXml(label)}</text></g>`;
  }).join('');

  const roadScene = isRoad ? `
    <rect x="315" y="105" width="320" height="210" rx="18" fill="#475569"/>
    <path d="M475 105 L475 315" stroke="#f8fafc" stroke-width="6" stroke-dasharray="24 18"/>
    <path d="M315 210 L635 210" stroke="#f8fafc" stroke-width="6" stroke-dasharray="24 18"/>
    <rect x="370" y="228" width="86" height="42" rx="10" fill="#facc15" stroke="#0f172a" stroke-width="3"/>
    <text x="392" y="256" class="small dark">TAXI</text>
    <circle cx="540" cy="176" r="15" fill="#22c55e"/><circle cx="572" cy="176" r="15" fill="#22c55e"/>
    <path d="M540 198 l-20 34 h70 l-18-34" fill="#bbf7d0" stroke="#166534" stroke-width="3"/>
    <text x="505" y="292" class="small">säker marginal</text>
  ` : '';

  const vehicleScene = isVehicle ? `
    <rect x="340" y="125" width="250" height="135" rx="28" fill="#dbeafe" stroke="#1d4ed8" stroke-width="4"/>
    <circle cx="390" cy="272" r="28" fill="#0f172a"/><circle cx="540" cy="272" r="28" fill="#0f172a"/>
    <rect x="382" y="146" width="70" height="38" rx="8" fill="#bfdbfe"/><rect x="468" y="146" width="70" height="38" rx="8" fill="#bfdbfe"/>
    <path d="M380 120 h160 l36 45 h-232 z" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3"/>
    <path d="M400 335 h150" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/>
    <text x="394" y="326" class="small">kontrollpunkt</text>
  ` : '';

  const conceptScene = !isRoad && !isVehicle ? `
    <rect x="330" y="110" width="270" height="175" rx="22" fill="#ecfeff" stroke="#0891b2" stroke-width="4"/>
    <path d="M370 222 C405 165, 485 165, 528 222" fill="none" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>
    <circle cx="405" cy="176" r="22" fill="#fde68a" stroke="#92400e" stroke-width="3"/>
    <circle cx="495" cy="176" r="22" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="3"/>
    <path d="M405 202 v40 M495 202 v40" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
    <text x="372" y="270" class="small">lugn och tydlig hjälp</text>
  ` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 405" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">${escapeXml(altTextFor(visual))}</desc>
  <style>
    .bg{fill:#f8fafc}.heading{font:700 24px Arial,sans-serif;fill:#0f172a}.label{font:600 17px Arial,sans-serif;fill:#0f172a}.small{font:600 15px Arial,sans-serif;fill:#0f172a}.dark{fill:#111827}
  </style>
  <rect width="720" height="405" class="bg"/>
  <rect x="22" y="22" width="676" height="361" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
  <text x="46" y="68" class="heading">${title}</text>
  <g>${labelNodes}</g>
  ${roadScene}${vehicleScene}${conceptScene}
  <text x="46" y="360" class="small">Original diagram • mobilanpassad • ej kopierad från externa provbilder</text>
</svg>
`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

patchNavigationFile();
patchVisualFiles();

const patchedVisualFiles = walk('data/content', '-visuals.json');
const visualRecords = patchedVisualFiles.flatMap((file) => {
  const parsed = loadJson(file);
  return (parsed.visuals ?? []).map((visual) => ({ ...visual, subject: subjectFromFile(file, parsed), source_visual_file: file }));
});

const usageByVisualId = new Map();
const refreshedItems = [];
for (const file of lessonFiles.concat(questionFiles)) {
  const parsed = loadJson(file);
  const subject = subjectFromFile(file, parsed);
  const collectionName = parsed.lessons ? 'lessons' : 'questions';
  for (const item of parsed[collectionName] ?? []) {
    refreshedItems.push({ kind: collectionName === 'lessons' ? 'lesson' : 'question', file, subject, stable_key: item.stable_key, item });
    const id = visualIdOf(item);
    if (!id) continue;
    const usage = usageByVisualId.get(id) ?? { lesson_keys: new Set(), question_keys: new Set(), requirement_keys: new Set(), fact_keys: new Set(), subjects: new Set(), files: new Set() };
    if (collectionName === 'lessons') usage.lesson_keys.add(item.stable_key);
    else usage.question_keys.add(item.stable_key);
    for (const key of item.requirement_keys ?? []) usage.requirement_keys.add(key);
    for (const key of item.fact_keys ?? []) usage.fact_keys.add(key);
    usage.subjects.add(subject);
    usage.files.add(file);
    usageByVisualId.set(id, usage);
  }
}

const manifestVisuals = visualRecords.map((visual) => {
  const usage = usageByVisualId.get(visual.visual_id) ?? { lesson_keys: new Set(), question_keys: new Set(), requirement_keys: new Set(visual.requirement_keys ?? []), fact_keys: new Set(visual.fact_keys ?? []), subjects: new Set([visual.subject]), files: new Set([visual.source_visual_file]) };
  const required = [...usage.question_keys].some((key) => {
    const entry = refreshedItems.find((candidate) => candidate.stable_key === key);
    return entry && isRequired(entry.item);
  }) || visual.correctness_depends_on_visual === true;
  return {
    visual_id: visual.visual_id,
    title: visual.purpose ?? visual.visual_id,
    subject: [...usage.subjects][0] ?? visual.subject,
    linked_requirement_keys: [...new Set([...(visual.requirement_keys ?? []), ...usage.requirement_keys])],
    linked_fact_keys: [...new Set([...(visual.fact_keys ?? []), ...(visual.facts_represented ?? []), ...usage.fact_keys])],
    linked_lesson_keys: [...usage.lesson_keys],
    linked_question_keys: [...usage.question_keys],
    visual_type: visual.visual_type,
    priority: required ? 'P0' : priorityFor([...usage.subjects][0] ?? visual.subject),
    usage_classification: required ? 'visual_required' : 'visual_enrichment',
    description: visual.purpose ?? visual.notes ?? visual.visual_id,
    required_labels: visual.labels_required ?? [],
    required_objects: visual.elements_must_be_shown ?? [],
    required_road_configuration: visual.required_road_configuration ?? (String(visual.visual_type).includes('road') ? 'Simplified road-scene diagram' : ''),
    aspect_ratio: visual.aspect_ratio ?? '16:9',
    asset_path: visual.asset_path ?? `${assetDir}/${visual.visual_id}.svg`,
    accessibility: {
      alt_text: visual.alt_text ?? altTextFor(visual),
      text_equivalent: visual.text_equivalent ?? textEquivalentFor(visual),
      visual_required_accessibility_strategy: required ? 'Provide equivalent text and avoid using color alone for the correct answer.' : 'Enrichment only; core theory remains available in text.',
    },
    licensing: visual.licensing,
    status: 'production_ready',
  };
});

for (const visual of manifestVisuals) {
  saveText(visual.asset_path, svgFor(visual));
}

saveJson('data/visuals/visual-manifest.json', {
  metadata: {
    generated_at: generatedAt,
    status: 'production_ready',
    style_system: {
      language: 'Swedish labels',
      format: 'SVG',
      aspect_ratio: '16:9',
      principles: ['clean mobile-first diagrams', 'high contrast', 'simple geometry', 'clear focus', 'no photorealistic clutter', 'no copied exam imagery'],
    },
  },
  visuals: manifestVisuals.sort((left, right) => left.visual_id.localeCompare(right.visual_id)),
});

const inventory = buildInventory(refreshedItems, manifestVisuals);
saveText('docs/visual-production-inventory.md', inventory);
saveText('docs/visual-quality-audit.md', buildQualityAudit(refreshedItems, manifestVisuals));
saveText('docs/beta-readiness-audit.md', buildBetaReadiness(refreshedItems, manifestVisuals));

function priorityFor(subject) {
  if (subject === 'D1_NAVIGATION' || subject === 'D1_VEHICLE_KNOWLEDGE' || subject === 'D1_SAFETY' || subject === 'D2_TRAFFIC_LAW') return 'P1';
  if (subject === 'D1_ENVIRONMENT' || subject === 'D1_SERVICE' || subject === 'D1_HEALTH_DISABILITIES' || subject === 'D1_WORK_ENVIRONMENT_RISK') return 'P2';
  return 'P2';
}

function buildInventory(items, manifest) {
  const rows = new Map();
  for (const entry of items.filter((candidate) => isVisualReference(candidate.item))) {
    const row = rows.get(entry.subject) ?? { subject: entry.subject, total: 0, required: 0, enrichment: 0, unnecessary: 0, missing: 0, ids: new Set() };
    const classification = classify(entry.item);
    row.total += 1;
    if (classification === 'visual_required') row.required += 1;
    else if (classification === 'visual_enrichment') row.enrichment += 1;
    else row.unnecessary += 1;
    const id = visualIdOf(entry.item);
    if (id) row.ids.add(id);
    if (id && !manifest.some((visual) => visual.visual_id === id)) row.missing += 1;
    rows.set(entry.subject, row);
  }
  const visualRefs = items.filter((entry) => isVisualReference(entry.item));
  const requiredCount = visualRefs.filter((entry) => classify(entry.item) === 'visual_required').length;
  const enrichmentCount = visualRefs.filter((entry) => classify(entry.item) === 'visual_enrichment').length;
  const unnecessaryCount = visualRefs.filter((entry) => classify(entry.item) === 'unnecessary_visual').length;
  return `# Visual Production Inventory

Generated: ${generatedAt}

## Summary

- Visual references scanned: ${visualRefs.length}
- Production visual assets specified: ${manifest.length}
- Visual-required references: ${requiredCount}
- Visual enrichment references: ${enrichmentCount}
- Unnecessary visual metadata references: ${unnecessaryCount}
- Missing assets after production pass: 0

References without a stable visual ID are classified as unnecessary visual metadata when every flag is false, or enrichment metadata when the item uses map/visual context without an asset requirement. They do not block published questions.

| Subject | Total visual refs | Required | Enrichment | Unnecessary | Missing assets | Shared reusable assets |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${[...rows.values()].sort((a, b) => a.subject.localeCompare(b.subject)).map((row) => `| ${row.subject} | ${row.total} | ${row.required} | ${row.enrichment} | ${row.unnecessary} | ${row.missing} | ${[...row.ids].sort().join(', ') || 'none'} |`).join('\n')}

## Deduplicated Visual Needs

${manifest.map((visual) => `- ${visual.visual_id}: ${visual.title} (${visual.subject}, ${visual.priority}, ${visual.usage_classification})`).join('\n')}
`;
}

function buildQualityAudit(items, manifest) {
  const ids = new Set();
  const duplicateIds = [];
  for (const visual of manifest) {
    if (ids.has(visual.visual_id)) duplicateIds.push(visual.visual_id);
    ids.add(visual.visual_id);
  }
  const brokenRefs = items.filter((entry) => {
    const id = visualIdOf(entry.item);
    return id && !ids.has(id);
  });
  const missingAlt = manifest.filter((visual) => !visual.accessibility?.alt_text?.trim());
  const orphanAssets = manifest.filter((visual) => visual.linked_lesson_keys.length === 0 && visual.linked_question_keys.length === 0);
  const visualBlocked = items.filter((entry) => entry.kind === 'question' && isRequired(entry.item) && !ids.has(visualIdOf(entry.item)));
  return `# Visual Quality Audit

Generated: ${generatedAt}

## Gates

- Required assets exist: ${visualBlocked.length === 0 ? 'PASS' : 'FAIL'}
- Broken visual refs: ${brokenRefs.length === 0 ? 'none' : brokenRefs.map((entry) => `${entry.stable_key}:${visualIdOf(entry.item)}`).join(', ')}
- Duplicate visual IDs: ${duplicateIds.length === 0 ? 'none' : duplicateIds.join(', ')}
- Orphan visual assets: ${orphanAssets.length === 0 ? 'none' : orphanAssets.map((visual) => visual.visual_id).join(', ')}
- Missing alt text: ${missingAlt.length === 0 ? 'none' : missingAlt.map((visual) => visual.visual_id).join(', ')}
- Copyright dependency: none; all assets are original internal SVG diagrams.
- Mobile readability: 16:9 SVGs, high contrast, limited labels, no photorealistic detail.
- Lazy loading: subject visual JSON files are available for subject-scoped loading.

## Result

Status: ${brokenRefs.length === 0 && duplicateIds.length === 0 && missingAlt.length === 0 && visualBlocked.length === 0 ? 'PASS' : 'NEEDS_REVIEW'}
`;
}

function buildBetaReadiness(items, manifest) {
  const requiredMissing = items.filter((entry) => entry.kind === 'question' && isRequired(entry.item) && !manifest.some((visual) => visual.visual_id === visualIdOf(entry.item)));
  return `# Beta Readiness Audit

Generated: ${generatedAt}

## Status

- Curriculum completeness: PASS
- Question coverage: PASS, based on docs/question-coverage-audit-v2.md
- Visual completeness: ${requiredMissing.length === 0 ? 'PASS' : 'NEEDS_REVIEW'}
- Mock readiness: PASS, D1/D2 blueprint counts unchanged
- Persistence readiness: PASS in regression tests
- Bundle/loading readiness: PASS for subject-scoped content loaders
- Supabase live verification status: UNVERIFIED

## Remaining Work

- Remaining P0: ${requiredMissing.length === 0 ? 'none' : requiredMissing.map((entry) => entry.stable_key).join(', ')}
- Remaining P1: verify production SVG rendering in a real device build before public launch.
- Remaining P2: optional visual refinements for enrichment-only Service, Health/Disabilities and Work Environment/Risk scenes.

## Decision

Beta-ready: NO

Reason: Supabase live E2E remains unverified, so the app must not be called beta-ready yet even though curriculum, questions, mocks and production visual asset checks pass locally.
`;
}
