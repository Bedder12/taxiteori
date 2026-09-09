import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Curriculum = {
  requirements: {
    stable_key: string;
    subject: string;
    active: boolean;
  }[];
};

type SourceType = 'primary_legal_source' | 'official_explanatory_source' | 'optional_secondary_learning_reference';
type SourceStatus = 'VERIFIED' | 'PARTIAL' | 'NEEDS_HUMAN_REVIEW';
type MappingStatus = 'FULLY_SOURCED' | 'PARTIALLY_SOURCED' | 'NEEDS_HUMAN_REVIEW';

type Source = {
  source_title: string;
  source_type: SourceType;
  authority: string;
  legal_reference: string;
  url?: string;
  relevant_chapter_section: string;
  source_status: SourceStatus;
  last_verified_at: string;
  notes: string;
};

type SourceMap = {
  source_catalog: (Source & { source_key: string })[];
  requirement_source_map: {
    requirement_key: string;
    official_requirement_reference: string;
    sources: Source[];
    overall_status: MappingStatus;
  }[];
  lesson_outlines: {
    topic: string;
    lesson_title: string;
    requirement_keys: string[];
    learning_objective: string;
    authoritative_sources: string[];
    facts_rules_that_need_to_be_taught: string[];
    scenario_opportunities: string[];
    calculation_opportunities: string[];
    content_status: string;
  }[];
};

const allowedOfficialHosts = [
  'data.riksdagen.se',
  'riksdagen.se',
  'www.riksdagen.se',
  'transportstyrelsen.se',
  'www.transportstyrelsen.se',
  'trafikverket.se',
  'www.trafikverket.se',
  'skolverket.se',
  'www.skolverket.se',
];

function loadJson<T>(relativePath: string) {
  const path = resolve(__dirname, '../../../../', relativePath);
  return JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, '')) as T;
}

function loadCurriculum() {
  return loadJson<Curriculum>('data/curriculum/requirements.json');
}

function loadSourceMap() {
  return loadJson<SourceMap>('data/curriculum/d2-taxi-law-sources.json');
}

function getActiveD2TaxiLawRequirementKeys() {
  return loadCurriculum()
    .requirements.filter((requirement) => requirement.active && requirement.subject === 'D2_TAXI_LAW')
    .map((requirement) => requirement.stable_key);
}

function assertSourceHasRequiredFields(source: Source) {
  assert.ok(source.source_title.trim().length > 0, 'Source title is required.');
  assert.ok(source.authority.trim().length > 0, `${source.source_title} has no authority.`);
  assert.ok(source.relevant_chapter_section.trim().length > 0, `${source.source_title} has no relevant section.`);
  assert.ok(source.last_verified_at.trim().length > 0, `${source.source_title} has no verification date.`);

  if (source.source_type === 'primary_legal_source') {
    assert.ok(source.legal_reference.trim().length > 0, `${source.source_title} has no legal reference.`);
  }

  if (source.source_status === 'NEEDS_HUMAN_REVIEW') {
    assert.ok(source.notes.trim().length > 0, `${source.source_title} needs human review but has no reason.`);
  }

  if (source.url) {
    const host = new URL(source.url).host;
    assert.ok(
      allowedOfficialHosts.includes(host),
      `${source.source_title} uses a non-official source host: ${host}`,
    );
  }
}

export function testEveryD2TaxiLawRequirementHasSourceMapping() {
  const requirementKeys = getActiveD2TaxiLawRequirementKeys();
  const sourceMap = loadSourceMap();
  const mappedKeys = new Set(sourceMap.requirement_source_map.map((mapping) => mapping.requirement_key));

  assert.equal(requirementKeys.length, 14);

  for (const key of requirementKeys) {
    assert.ok(mappedKeys.has(key), `D2_TAXI_LAW requirement ${key} has no source mapping.`);
  }
}

export function testD2TaxiLawSourceMappingsAreExplicitAndLegal() {
  const sourceMap = loadSourceMap();

  for (const catalogSource of sourceMap.source_catalog) {
    assertSourceHasRequiredFields(catalogSource);
  }

  for (const mapping of sourceMap.requirement_source_map) {
    assert.ok(mapping.official_requirement_reference.trim().length > 0, `${mapping.requirement_key} has no official requirement reference.`);
    assert.ok(mapping.sources.length > 0, `${mapping.requirement_key} has no mapped sources.`);

    for (const source of mapping.sources) {
      assertSourceHasRequiredFields(source);
    }
  }
}

export function testD2TaxiLawUnresolvedMappingsAreMarked() {
  const sourceMap = loadSourceMap();

  for (const mapping of sourceMap.requirement_source_map) {
    if (mapping.overall_status === 'NEEDS_HUMAN_REVIEW') {
      assert.ok(
        mapping.sources.some((source) => source.source_status === 'NEEDS_HUMAN_REVIEW'),
        `${mapping.requirement_key} is unresolved but has no unresolved source entry.`,
      );
    }

    if (mapping.sources.some((source) => source.source_status === 'NEEDS_HUMAN_REVIEW')) {
      assert.equal(
        mapping.overall_status,
        'NEEDS_HUMAN_REVIEW',
        `${mapping.requirement_key} has an unresolved source but is not marked unresolved.`,
      );
    }
  }
}

export function testD2TaxiLawLessonOutlinesCoverRequestedTopics() {
  const sourceMap = loadSourceMap();
  const requestedTopics = [
    'Taxiförarlegitimation',
    'Återkallelse',
    'Begrepp och definitioner',
    'Handlingar och kontroller',
    'Taxitrafiktillstånd',
    'Taxameter och särskild utrustning',
    'Prisinformation',
    'Vilotider',
    'Arbetstid och ansvar',
    'Skolskjuts',
    'Sanktioner och påföljder',
  ];
  const outlineTopics = new Set(sourceMap.lesson_outlines.map((outline) => outline.topic));
  const catalogKeys = new Set(sourceMap.source_catalog.map((source) => source.source_key));
  const requirementKeys = new Set(getActiveD2TaxiLawRequirementKeys());

  assert.equal(sourceMap.lesson_outlines.length, requestedTopics.length);

  for (const topic of requestedTopics) {
    assert.ok(outlineTopics.has(topic), `Missing lesson outline topic: ${topic}`);
  }

  for (const outline of sourceMap.lesson_outlines) {
    assert.ok(outline.lesson_title.trim().length > 0, `${outline.topic} has no lesson title.`);
    assert.ok(outline.learning_objective.trim().length > 0, `${outline.topic} has no learning objective.`);
    assert.ok(outline.facts_rules_that_need_to_be_taught.length > 0, `${outline.topic} has no fact/rule checklist.`);
    assert.match(outline.content_status, /^outline_only/, `${outline.topic} appears to be more than an outline.`);

    for (const key of outline.requirement_keys) {
      assert.ok(requirementKeys.has(key), `${outline.topic} references unknown D2_TAXI_LAW requirement ${key}.`);
    }

    for (const sourceKey of outline.authoritative_sources) {
      assert.ok(catalogKeys.has(sourceKey), `${outline.topic} references unknown source ${sourceKey}.`);
    }
  }
}
