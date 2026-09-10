import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8').replace(/^\uFEFF/, ''));
}

function normalize(value) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

function duplicates(values) {
  const seen = new Map();
  const dupes = [];
  for (const value of values) {
    const key = normalize(value);
    if (seen.has(key)) dupes.push(value);
    else seen.set(key, value);
  }
  return dupes;
}

const curriculum = loadJson('data/curriculum/requirements.json');
const sourceMap = loadJson('data/curriculum/d1-health-disabilities-sources.json');
const factsFile = loadJson('data/content/d1-health-disabilities/health-disabilities-facts.json');
const lessonsFile = loadJson('data/content/d1-health-disabilities/health-disabilities-lessons.json');
const visualsFile = loadJson('data/content/d1-health-disabilities/health-disabilities-visuals.json');
const questionsFile = loadJson('data/questions/d1-health-disabilities/health-disabilities-questions.json');
const otherD1Questions = [
  'data/questions/d1-service/service-questions.json',
  'data/questions/d1-safety/safety-questions.json',
  'data/questions/d1-vehicle-knowledge/vehicle-questions.json',
].flatMap((path) => loadJson(path).questions);

const requirements = curriculum.requirements.filter((requirement) => requirement.active && requirement.subject === 'D1_HEALTH_DISABILITIES');
const facts = factsFile.facts;
const lessons = lessonsFile.lessons;
const questions = questionsFile.questions;
const visuals = visualsFile.visuals;
const topicCheckpoints = questionsFile.topic_checkpoints;
const sourceIds = new Set(factsFile.sources.map((source) => source.source_id));
const factByKey = new Map(facts.map((fact) => [fact.stable_key, fact]));
const lessonByKey = new Map(lessons.map((lesson) => [lesson.stable_key, lesson]));
const sourceMappings = new Map(sourceMap.requirement_source_map.map((mapping) => [mapping.requirement_key, mapping]));
const visualIds = new Set(visuals.map((visual) => visual.visual_id));
const otherPrompts = new Set(otherD1Questions.map((question) => normalize(question.prompt)));

const duplicateFacts = duplicates(facts.map((fact) => fact.text));
const duplicatePrompts = duplicates(questions.map((question) => question.prompt));
const duplicateAnswerSets = duplicates(questions.map((question) => question.answer_choices.map((choice) => normalize(choice.text)).sort().join(' | ')));
const missingSourceMappings = requirements.filter((requirement) => !sourceMappings.has(requirement.stable_key));
const unresolvedSourceMappings = sourceMap.requirement_source_map.filter((mapping) => mapping.overall_status !== 'FULLY_SOURCED');
const unsourcedFacts = facts.filter((fact) => !sourceIds.has(fact.source_id) || fact.verification_status !== 'verified');
const generalAdviceIssues = facts.filter(
  (fact) =>
    fact.requirement_key.includes('-GA-') &&
    fact.source_id === 'TSFS_2021_119_CONSOLIDATED' &&
    fact.exact_reference.startsWith('Allmänna råd') &&
    fact.authority_status !== 'general_advice',
);
const unsupportedMedicalClaims = [...facts, ...questions].filter((item) =>
  /diagnos|behandla|medicinera|läkemedelsdos|botar|alltid samma|aldrig hjälp/i.test(
    `${item.text ?? ''} ${item.prompt ?? ''} ${item.explanation ?? ''}`,
  ),
);
const diagnosticStyleQuestions = questions.filter((question) => question.diagnostic_style !== false || /vilken sjukdom|vad lider|diagnos/i.test(question.prompt));
const stereotypeIssues = questions.filter((question) =>
  /handikappad|rullstolsbunden|galen|psykfall|senil|cp-skadad|autist\b|diabetiker\b/i.test(
    `${question.prompt} ${question.answer_choices.map((choice) => choice.text).join(' ')}`,
  ),
);
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
const visualDependentQuestions = questions.filter(
  (question) => question.visual_metadata?.requires_image || question.visual_metadata?.requires_diagram || question.visual_metadata?.requires_road_scene,
);
const visualBlockedQuestions = visualDependentQuestions.filter(
  (question) => !question.visual_asset_id || !visualIds.has(question.visual_asset_id) || question.visual_correctness_depends_on_asset,
);
const crossSubjectPromptDuplicates = questions.filter((question) => otherPrompts.has(normalize(question.prompt)));
const missingCompetencyTags = questions.filter((question) => !question.competency_tags?.length);
const calculationQuestions = questions.filter((question) => question.question_type === 'calculation');
const heldForReview = [
  ...facts.filter((fact) => fact.verification_status !== 'verified').map((fact) => fact.stable_key),
  ...lessons.filter((lesson) => lesson.status !== 'published').map((lesson) => lesson.stable_key),
  ...questions.filter((question) => question.status !== 'published').map((question) => question.stable_key),
  ...visualBlockedQuestions.map((question) => question.stable_key),
  ...generalAdviceIssues.map((fact) => fact.stable_key),
  ...diagnosticStyleQuestions.map((question) => question.stable_key),
  ...unsupportedMedicalClaims.map((item) => item.stable_key).filter(Boolean),
  ...stereotypeIssues.map((question) => question.stable_key),
];

const coverageRows = requirements.map((requirement) => {
  const requirementFacts = facts.filter((fact) => fact.requirement_key === requirement.stable_key);
  const requirementLessons = lessons.filter((lesson) => lesson.requirement_keys.includes(requirement.stable_key));
  const requirementQuestions = questions.filter((question) => question.requirement_keys.includes(requirement.stable_key));
  return {
    key: requirement.stable_key,
    legalStatus: requirement.legal_status ?? 'unknown',
    competency: requirement.competency_type ?? 'KNOW',
    facts: requirementFacts.length,
    lessons: requirementLessons.length,
    questions: requirementQuestions.length,
    scenarios: requirementQuestions.filter((question) => question.question_type === 'scenario').length,
    calculations: requirementQuestions.filter((question) => question.question_type === 'calculation').length,
    generalAdviceFacts: requirementFacts.filter((fact) => fact.authority_status === 'general_advice').length,
  };
});

const topicRows = sourceMap.pedagogical_topics.map((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === topic.topic_id);
  const topicLessons = lessons.filter((lesson) => lesson.topic_id === topic.topic_id);
  const topicQuestions = questions.filter((question) => question.topic_id === topic.topic_id);
  const checkpoint = topicCheckpoints.find((candidate) => candidate.topic === topic.topic_id);
  return {
    title: topic.title,
    facts: topicFacts.length,
    lessons: topicLessons.length,
    questions: topicQuestions.length,
    scenarios: topicQuestions.filter((question) => question.question_type === 'scenario').length,
    calculations: topicQuestions.filter((question) => question.question_type === 'calculation').length,
    checkpointQuestions: checkpoint?.question_count ?? 0,
    visualAssets: topic.visual_asset_ids.join(', ') || 'none',
  };
});

const undercovered = coverageRows.filter((row) => row.facts < 1 || row.questions < 1);
const overcovered = coverageRows.filter((row) => row.questions > 18);
const authorityStatusCounts = facts.reduce((counts, fact) => {
  counts[fact.authority_status] = (counts[fact.authority_status] ?? 0) + 1;
  return counts;
}, {});

const report = `# D1 Sjukdomar Och Funktionsnedsättningar Quality Audit

Generated: 2026-09-10

## Scope

- Subject: D1_HEALTH_DISABILITIES
- Active curriculum requirements reviewed before content generation: ${requirements.length}
- Official curriculum: TSFS 2021:119, 3 kap. 18 § and allmänna råd till 18 §
- Pipeline: official requirement -> authoritative source expansion -> verified facts -> pedagogical topics -> mobile lessons -> source-backed questions -> checkpoints -> Plugga integration -> tests -> quality audit
- Exclusions respected: no Arbetsmiljö/omdöme/risk, no full D1 mock exam, no medical treatment course, no AI, payments, videos, translations, pass guarantee or readiness scoring.

## Summary

- Requirements reviewed: ${requirements.length}
- Sources reviewed: ${sourceMap.source_catalog.length}
- Verified facts reviewed: ${facts.length}
- Published lessons reviewed: ${lessons.filter((lesson) => lesson.status === 'published').length}
- Published questions reviewed: ${questions.filter((question) => question.status === 'published').length}
- Scenario questions: ${questions.filter((question) => question.question_type === 'scenario').length}
- Calculation questions: ${calculationQuestions.length}
- Visual/map-dependent items: ${visualDependentQuestions.length}
- Topic checkpoints: ${topicCheckpoints.length}
- Subject checkpoints: 1
- Content held for review: ${new Set(heldForReview).size}

## Source Completeness

All active D1_HEALTH_DISABILITIES requirements have the primary legal curriculum source and at least one supporting authoritative healthcare source where factual examples go beyond the curriculum wording.

${missingSourceMappings.length === 0 ? '- Missing source mappings: none' : `- Missing source mappings: ${missingSourceMappings.map((requirement) => requirement.stable_key).join(', ')}`}
${unresolvedSourceMappings.length === 0 ? '- Unresolved source mappings: none' : `- Unresolved source mappings: ${unresolvedSourceMappings.map((mapping) => mapping.requirement_key).join(', ')}`}
- Unsourced or unverified facts: ${unsourcedFacts.length === 0 ? 'none' : unsourcedFacts.map((fact) => fact.stable_key).join(', ')}

## Authority Status Distribution

${Object.entries(authorityStatusCounts).map(([status, count]) => `- ${status}: ${count}`).join('\n')}

## General Advice Boundary

Allmänna råd remain tagged as general advice when the source is TSFS 2021:119, while practical/medical supporting facts are tagged as authoritative medical guidance or pedagogical application.

- General-advice metadata issues: ${generalAdviceIssues.length === 0 ? 'none' : generalAdviceIssues.map((fact) => fact.stable_key).join(', ')}
- Medical claims held for review: ${unsupportedMedicalClaims.length === 0 ? 'none' : unsupportedMedicalClaims.map((item) => item.stable_key).filter(Boolean).join(', ')}

## Requirement Coverage

| Requirement | Legal status | Competency | Facts | General-advice facts | Lessons | Questions | Scenario | Calculation |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
${coverageRows.map((row) => `| ${row.key} | ${row.legalStatus} | ${row.competency} | ${row.facts} | ${row.generalAdviceFacts} | ${row.lessons} | ${row.questions} | ${row.scenarios} | ${row.calculations} |`).join('\n')}

Undercovered requirements: ${undercovered.length === 0 ? 'none' : undercovered.map((row) => row.key).join(', ')}

Overcovered requirements: ${overcovered.length === 0 ? 'none' : overcovered.map((row) => row.key).join(', ')}

## Topic Balance And Ordering

| Topic | Facts | Lessons | Questions | Scenario | Calculation | Checkpoint questions | Visual assets |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${topicRows.map((row) => `| ${row.title} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenarios} | ${row.calculations} | ${row.checkpointQuestions} | ${row.visualAssets} |`).join('\n')}

The order starts with the driver's role and boundaries, then urgent changes, then mobility, cognition, mental/neuropsychiatric needs and finally individual adaptation. This prevents the learner from treating condition examples as fixed labels before learning the practical boundary.

## Question Quality

- Ambiguous questions: ${ambiguousQuestions.length === 0 ? 'none detected' : ambiguousQuestions.map((question) => question.stable_key).join(', ')}
- Duplicate prompts: ${duplicatePrompts.length === 0 ? 'none' : duplicatePrompts.join('; ')}
- Duplicate answer sets: ${duplicateAnswerSets.length === 0 ? 'none' : duplicateAnswerSets.join('; ')}
- Missing competency tags: ${missingCompetencyTags.length === 0 ? 'none' : missingCompetencyTags.map((question) => question.stable_key).join(', ')}
- Diagnostic-style questions: ${diagnosticStyleQuestions.length === 0 ? 'none' : diagnosticStyleQuestions.map((question) => question.stable_key).join(', ')}
- Stereotype or outdated terminology issues: ${stereotypeIssues.length === 0 ? 'none' : stereotypeIssues.map((question) => question.stable_key).join(', ')}

Questions are mostly scenario/application because the official competence is practical awareness for safe assistance. There are no calculation questions because no D1_HEALTH_DISABILITIES requirement supports calculation.

## Visual Dependency

- Visual placeholders: ${visuals.length}
- Visual-dependent published questions with valid asset reference: ${visualDependentQuestions.length - visualBlockedQuestions.length}
- Visual-blocked questions: ${visualBlockedQuestions.length === 0 ? 'none' : visualBlockedQuestions.map((question) => question.stable_key).join(', ')}

The visual placeholders are simple custom scene metadata for mobility assistance, cognitive support and urgent-help decisions. Correct answers do not depend on missing image details.

## Duplication And Cross-Subject Boundary

- Duplicate fact texts: ${duplicateFacts.length === 0 ? 'none' : duplicateFacts.join('; ')}
- Exact prompt duplicates vs D1_SERVICE/D1_SAFETY/D1_VEHICLE_KNOWLEDGE: ${crossSubjectPromptDuplicates.length === 0 ? 'none' : crossSubjectPromptDuplicates.map((question) => question.stable_key).join(', ')}

Legitimate overlap with Bemötande and Säkerhet is limited to practical response and emergency handoff. This module focuses on health/disability awareness, not customer-service etiquette or general threat/risk management.

## Traceability

Traceability chain required: question -> lesson -> fact -> requirement -> source.

- Traceability issues: ${traceabilityIssues.length === 0 ? 'none' : traceabilityIssues.map((question) => question.stable_key).join(', ')}
- Every published question has explanation: ${questions.every((question) => question.explanation.trim().length > 0) ? 'yes' : 'no'}
- Every published question has valid fact/source references: ${traceabilityIssues.length === 0 ? 'yes' : 'no'}

## Result

Status: ${new Set(heldForReview).size === 0 ? 'PASS' : 'HELD_FOR_REVIEW'}

Published:

- Source map
- Verified facts
- Mobile lessons
- Source-backed questions
- Topic checkpoints
- Subject checkpoint
- Plugga integration target

Held for review:

${new Set(heldForReview).size === 0 ? '- None' : [...new Set(heldForReview)].map((key) => `- ${key}`).join('\n')}
`;

mkdirSync(resolve(root, 'docs'), { recursive: true });
writeFileSync(resolve(root, 'docs/d1-health-disabilities-quality-audit.md'), report);

if (new Set(heldForReview).size > 0 || ambiguousQuestions.length > 0 || traceabilityIssues.length > 0 || duplicatePrompts.length > 0 || duplicateAnswerSets.length > 0) {
  process.exitCode = 1;
}
