import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { getLoadedSubjectKeys, loadSubjectContent } from '../src/contentLoader';
import { d2TaxiLawRepository } from '../src/vilotiderRepository';

type Json = any;

const root = resolve(__dirname, '../../../../');

const lessonFiles = [
  'data/content/d1-eco-driving/eco-driving-lessons.json',
  'data/content/d1-environment/environment-lessons.json',
  'data/content/d1-health-disabilities/health-disabilities-lessons.json',
  'data/content/d1-navigation/navigation-lessons.json',
  'data/content/d1-safety/safety-lessons.json',
  'data/content/d1-service/service-lessons.json',
  'data/content/d1-vehicle-knowledge/vehicle-lessons.json',
  'data/content/d1-work-environment-risk/work-environment-risk-lessons.json',
  'data/content/d2-taxi-law/remaining-topics-lessons.json',
  'data/content/d2-taxi-law/vilotider-lessons.json',
  'data/content/d2-traffic-law/traffic-law-lessons.json',
];

const questionFiles = [
  'data/questions/d1-eco-driving/eco-driving-questions.json',
  'data/questions/d1-environment/environment-questions.json',
  'data/questions/d1-health-disabilities/health-disabilities-questions.json',
  'data/questions/d1-navigation/navigation-questions.json',
  'data/questions/d1-safety/safety-questions.json',
  'data/questions/d1-service/service-questions.json',
  'data/questions/d1-vehicle-knowledge/vehicle-questions.json',
  'data/questions/d1-work-environment-risk/work-environment-risk-questions.json',
  'data/questions/d2-taxi-law/remaining-topics-questions.json',
  'data/questions/d2-taxi-law/vilotider-questions.json',
  'data/questions/d2-traffic-law/traffic-law-questions.json',
];

function loadJson(relativePath: string): Json {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8').replace(/^\uFEFF/, ''));
}

function collectVisualRefs() {
  return lessonFiles.concat(questionFiles).flatMap((file) => {
    const parsed = loadJson(file);
    const rows = parsed.lessons ?? parsed.questions ?? [];
    return rows
      .map((item: Json) => ({
        key: item.stable_key,
        status: item.status,
        visualId: item.visual_metadata?.visual_asset_id ?? item.navigation_metadata?.visual_asset_id ?? item.visual_asset_id ?? item.map_metadata?.visual_id ?? item.map_metadata?.id,
        visual: item.visual_metadata ?? item.navigation_metadata,
        directDepends: item.visual_correctness_depends_on_asset,
      }))
      .filter((item: Json) => item.visualId);
  });
}

export function testVisualProductionManifestHasUniqueResolvableAssets() {
  const manifest = loadJson('data/visuals/visual-manifest.json');
  const ids = new Set<string>();

  assert.equal(manifest.metadata.status, 'production_ready');
  assert.ok(manifest.visuals.length > 0);

  for (const visual of manifest.visuals) {
    assert.ok(!ids.has(visual.visual_id), `${visual.visual_id} is duplicated.`);
    ids.add(visual.visual_id);
    assert.equal(visual.status, 'production_ready', `${visual.visual_id} is not production-ready.`);
    assert.ok(visual.asset_path.endsWith('.svg'), `${visual.visual_id} is not an SVG asset.`);
    assert.ok(existsSync(resolve(root, visual.asset_path)), `${visual.visual_id} asset is missing.`);
    assert.ok(visual.accessibility.alt_text.trim().length > 20, `${visual.visual_id} has weak alt text.`);
    assert.equal(visual.licensing.prohibited_sources_used, false, `${visual.visual_id} has a prohibited source dependency.`);
  }
}

export function testVisualProductionEveryVisualReferenceResolves() {
  const manifestIds = new Set(loadJson('data/visuals/visual-manifest.json').visuals.map((visual: Json) => visual.visual_id));

  for (const reference of collectVisualRefs()) {
    assert.ok(manifestIds.has(reference.visualId), `${reference.key} references missing visual ${reference.visualId}.`);
  }
}

export function testVisualProductionRequiredQuestionsHaveAssets() {
  const manifest = new Map(loadJson('data/visuals/visual-manifest.json').visuals.map((visual: Json) => [visual.visual_id, visual] as [string, Json]));

  for (const reference of collectVisualRefs().filter((item) => item.status === 'published')) {
    const depends = reference.directDepends === true || reference.visual?.visual_correctness_depends_on_asset === true;
    if (!depends) continue;
    const visual = manifest.get(reference.visualId) as Json | undefined;
    assert.ok(visual, `${reference.key} visual-required item has no manifest record.`);
    assert.ok(existsSync(resolve(root, visual.asset_path)), `${reference.key} visual-required asset is missing.`);
    assert.equal(visual.usage_classification, 'visual_required');
  }
}

export function testVisualProductionHasNoOrphanAssets() {
  const manifestAssetNames = new Set<string>(
    loadJson('data/visuals/visual-manifest.json').visuals.map((visual: Json) => String(visual.asset_path.split('/').at(-1))),
  );
  const assetNames = new Set(readdirSync(resolve(root, 'assets/visuals')).filter((name) => name.endsWith('.svg')));

  for (const name of assetNames) {
    assert.ok(manifestAssetNames.has(name), `${name} is not listed in visual manifest.`);
  }

  for (const name of manifestAssetNames) {
    assert.ok(assetNames.has(name), `${name} is listed in manifest but missing from assets/visuals.`);
  }
}

export async function testVisualProductionLazyLoadingStillWorks() {
  const visualSubjects = new Set(['D1_NAVIGATION', 'D1_SAFETY', 'D1_SERVICE', 'D1_HEALTH_DISABILITIES', 'D1_WORK_ENVIRONMENT_RISK', 'D1_VEHICLE_KNOWLEDGE']);

  for (const subject of getLoadedSubjectKeys()) {
    const content = await loadSubjectContent(subject);
    assert.ok(content.facts && content.lessons && content.questions, `${subject} loader returned incomplete content.`);
    if (visualSubjects.has(subject)) {
      assert.ok(content.visuals, `${subject} should lazy-load production visuals.`);
    }
  }
}

export function testVisualProductionMockBlueprintsAreUnchanged() {
  const d1 = d2TaxiLawRepository.examBlueprints.find((blueprint) => blueprint.id === 'blueprint_d1_realistic_full_mock_v1');
  const d2 = d2TaxiLawRepository.examBlueprints.find((blueprint) => blueprint.id === 'blueprint_d2_realistic_full_mock_v1');

  assert.equal(d1?.scoringQuestionCount, 65);
  assert.equal(d1?.nonScoringTestQuestionCount, 5);
  assert.equal(d1?.totalDisplayedQuestionCount, 70);
  assert.equal(d2?.scoringQuestionCount, 46);
  assert.equal(d2?.nonScoringTestQuestionCount, 4);
  assert.equal(d2?.totalDisplayedQuestionCount, 50);
}
