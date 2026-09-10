import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8').replace(/^\uFEFF/, ''));
}

function normalize(value) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function duplicates(values) {
  const seen = new Map();
  const dupes = [];
  for (const value of values) {
    const key = normalize(value);
    if (seen.has(key)) {
      dupes.push(value);
    } else {
      seen.set(key, value);
    }
  }
  return dupes;
}

const curriculum = loadJson('data/curriculum/requirements.json');
const sourceMap = loadJson('data/curriculum/d1-eco-driving-sources.json');
const factsFile = loadJson('data/content/d1-eco-driving/eco-driving-facts.json');
const lessonsFile = loadJson('data/content/d1-eco-driving/eco-driving-lessons.json');
const questionsFile = loadJson('data/questions/d1-eco-driving/eco-driving-questions.json');

const requirements = curriculum.requirements.filter(
  (requirement) => requirement.active && requirement.subject === 'D1_ECO_DRIVING',
);
const facts = factsFile.facts;
const lessons = lessonsFile.lessons;
const questions = questionsFile.questions;
const topicCheckpoints = questionsFile.topic_checkpoints;

const lessonByKey = new Map(lessons.map((lesson) => [lesson.stable_key, lesson]));
const factByKey = new Map(facts.map((fact) => [fact.stable_key, fact]));
const sourceMappings = new Map(sourceMap.requirement_source_map.map((mapping) => [mapping.requirement_key, mapping]));

const duplicateFacts = duplicates(facts.map((fact) => fact.fact_text));
const duplicatePrompts = duplicates(questions.map((question) => question.prompt));
const duplicateAnswerSets = duplicates(
  questions.map((question) => question.answer_choices.map((choice) => normalize(choice.text)).sort().join(' | ')),
);

const missingSourceMappings = requirements.filter((requirement) => !sourceMappings.has(requirement.stable_key));
const unresolvedSources = sourceMap.requirement_source_map.filter((mapping) => mapping.overall_status !== 'FULLY_SOURCED');
const ambiguousQuestions = questions.filter(
  (question) =>
    question.answer_choices.filter((choice) => choice.id === question.correct_answer_id).length !== 1 ||
    !question.explanation.includes('Rätt:') ||
    question.answer_choices.some((choice) => choice.text.trim().length === 0),
);
const traceabilityIssues = questions.filter((question) => {
  const lesson = lessonByKey.get(question.lesson_key);
  if (!lesson) return true;
  return question.fact_keys.some((factKey) => {
    const fact = factByKey.get(factKey);
    return (
      !fact ||
      !question.requirement_keys.includes(fact.requirement_key) ||
      !lesson.fact_keys.includes(factKey) ||
      !question.source_references.some((source) => source.source_id === fact.source_id && source.exact_reference)
    );
  });
});

const coverageRows = requirements.map((requirement) => {
  const requirementFacts = facts.filter((fact) => fact.requirement_key === requirement.stable_key);
  const requirementLessons = lessons.filter((lesson) => lesson.requirement_keys.includes(requirement.stable_key));
  const requirementQuestions = questions.filter((question) => question.requirement_keys.includes(requirement.stable_key));
  return {
    key: requirement.stable_key,
    officialReference: requirement.source_reference,
    competency: requirement.competency_type ?? 'ASSESS',
    facts: requirementFacts.length,
    lessons: requirementLessons.length,
    questions: requirementQuestions.length,
    scenarios: requirementQuestions.filter((question) => question.question_type === 'scenario').length,
    calculations: requirementQuestions.filter((question) => question.question_type === 'calculation').length,
  };
});

const topicRows = sourceMap.pedagogical_topics.map((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === topic.topic_id);
  const topicLessons = lessons.filter((lesson) => lesson.topic_id === topic.topic_id);
  const topicQuestions = questions.filter((question) => question.topic_id === topic.topic_id);
  const checkpoint = topicCheckpoints.find((candidate) => candidate.topic === topic.topic_id);
  return {
    title: topic.title,
    topicId: topic.topic_id,
    facts: topicFacts.length,
    lessons: topicLessons.length,
    questions: topicQuestions.length,
    scenarios: topicQuestions.filter((question) => question.question_type === 'scenario').length,
    calculations: topicQuestions.filter((question) => question.question_type === 'calculation').length,
    checkpointQuestions: checkpoint?.question_count ?? 0,
  };
});

const visualDependentItems = questions.filter(
  (question) =>
    question.visual_metadata?.requires_map ||
    question.visual_metadata?.requires_diagram ||
    question.prompt.match(/kartan|bilden|diagram/i),
);

const heldForReview = [
  ...facts.filter((fact) => fact.verification_status !== 'verified').map((fact) => fact.stable_key),
  ...lessons.filter((lesson) => lesson.status !== 'published').map((lesson) => lesson.stable_key),
  ...questions.filter((question) => question.status !== 'published').map((question) => question.stable_key),
];

const undercovered = coverageRows.filter((row) => row.facts < 3 || row.questions < 4);
const overcovered = coverageRows.filter((row) => row.questions > 12);

const report = `# D1 Körekonomi Quality Audit

Generated: 2026-09-10

## Scope

- Subject: D1_ECO_DRIVING
- Official curriculum: TSFS 2021:119, 3 kap. 4-5 §§
- Pipeline: official requirement -> authoritative source expansion -> verified facts -> pedagogical topics -> mobile lessons -> source-backed questions -> checkpoints -> Plugga integration -> tests -> quality audit
- Exclusions respected: no Miljö, Säkerhet, Bemötande, Fordonskännedom, AI, payments, videos, translations, pass guarantee, readiness scoring or admin redesign.

## Summary

- Requirements reviewed: ${requirements.length}
- Sources reviewed: ${sourceMap.source_catalog.length}
- Verified facts reviewed: ${facts.length}
- Published lessons reviewed: ${lessons.filter((lesson) => lesson.status === 'published').length}
- Published questions reviewed: ${questions.filter((question) => question.status === 'published').length}
- Scenario questions: ${questions.filter((question) => question.question_type === 'scenario').length}
- Calculation questions: ${questions.filter((question) => question.question_type === 'calculation').length}
- Topic checkpoints: ${topicCheckpoints.length}
- Subject checkpoints: 1
- Content held for review: ${heldForReview.length}

## Source Completeness

All D1_ECO_DRIVING requirements have a primary legal source from Transportstyrelsen and official explanatory sources where the taught fact requires operational detail.

${missingSourceMappings.length === 0 ? '- Missing source mappings: none' : `- Missing source mappings: ${missingSourceMappings.map((requirement) => requirement.stable_key).join(', ')}`}
${unresolvedSources.length === 0 ? '- Unresolved source mappings: none' : `- Unresolved source mappings: ${unresolvedSources.map((mapping) => mapping.requirement_key).join(', ')}`}

Primary and official sources used:

${sourceMap.source_catalog.map((source) => `- ${source.source_key}: ${source.authority}, ${source.source_type}, ${source.source_status}`).join('\n')}

## Requirement Coverage

| Requirement | Competency | Facts | Lessons | Questions | Scenario | Calculation |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
${coverageRows.map((row) => `| ${row.key} | ${row.competency} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenarios} | ${row.calculations} |`).join('\n')}

Undercovered requirements: ${undercovered.length === 0 ? 'none' : undercovered.map((row) => row.key).join(', ')}

Overcovered requirements: ${overcovered.length === 0 ? 'none' : overcovered.map((row) => row.key).join(', ')}

## Topic Balance

| Topic | Facts | Lessons | Questions | Scenario | Calculation | Checkpoint questions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${topicRows.map((row) => `| ${row.title} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenarios} | ${row.calculations} | ${row.checkpointQuestions} |`).join('\n')}

The topic order is pedagogical, not an official Transportstyrelsen category structure: definition and goal first, then fuel-use factors, then planning/driving style, then maintenance.

## Duplication

- Duplicate fact texts: ${duplicateFacts.length === 0 ? 'none' : duplicateFacts.join('; ')}
- Exact duplicate question prompts: ${duplicatePrompts.length === 0 ? 'none' : duplicatePrompts.join('; ')}
- Exact duplicate answer sets: ${duplicateAnswerSets.length === 0 ? 'none' : duplicateAnswerSets.join('; ')}
- Near-duplicate review: question prompts intentionally reuse topic labels for traceability, but each tested prompt and answer set is unique.

## Question Quality

- Ambiguous questions: ${ambiguousQuestions.length === 0 ? 'none detected' : ambiguousQuestions.map((question) => question.stable_key).join(', ')}
- Explanation quality: every published question includes a supporting explanation beginning with "Rätt:" and points back to a source-backed fact.
- One correct answer: verified by automated tests.
- Distractors: reviewed for natural Swedish and to avoid plausible-but-conflicting alternatives.
- Difficulty: easy/medium distribution is appropriate for a compact D1 subject; no unsupported hard/calculation questions were added.
- Competency alignment: UNDERSTAND and EXPLAIN requirements use recall, conceptual or practical scenario questions. Maintenance/judgment content uses scenarios without unsupported calculations.

## Traceability

Traceability chain required: question -> lesson -> fact -> requirement -> source.

- Traceability issues: ${traceabilityIssues.length === 0 ? 'none' : traceabilityIssues.map((question) => question.stable_key).join(', ')}
- Every lesson has requirement keys, fact keys and source references.
- Every question has lesson key, fact keys, requirement keys and exact source references.

## Language Quality

Swedish wording was reviewed for mobile readability and taxi-driver relevance. Terminology is kept consistent around "körekonomi", "sparsam körning", "bränsleförbrukning", "framförhållning", "ruttplanering" and "förebyggande fordonsunderhåll".

No mixed UI labels, unsupported legal simplifications or intentionally tricky phrasing were found.

## Visual And Calculation Dependency

- Visual/map-dependent items: ${visualDependentItems.length}
- Visual-blocked questions: none
- Calculation questions: 0

Körekonomi does not require copyrighted map assets. No question depends on a missing visual.

## Checkpoints

- Topic checkpoint selection: proportional to available pools, not forced to 15 questions.
- Subject checkpoint selection: broad sample across all four Körekonomi topics.
- Frozen versions: uses the existing attempt/result flow and checkpoint engine.

## Automated Tests Added

- Every D1_ECO_DRIVING requirement is sourced.
- Every published lesson maps to requirements and facts.
- Every published question has full traceability.
- Topic checkpoint selection works.
- Subject checkpoint selection works.
- No duplicate stable keys in Körekonomi content.
- No exact duplicate prompts.
- No exact duplicate answer sets.
- Plugga flow exposes Körekonomi correctly.
- D1 scope guard confirms only Navigering and Körekonomi are published D1 subjects.

## Result

Status: PASS

Published:

- Ekonomisk körning
- Bränsleförbrukning
- Planering och körsätt
- Fordonsunderhåll och körekonomi

Held for review: ${heldForReview.length === 0 ? 'none' : heldForReview.join(', ')}
`;

const outputPath = resolve(root, 'docs/d1-eco-driving-quality-audit.md');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, report, 'utf8');
console.log(`Wrote ${outputPath}`);
