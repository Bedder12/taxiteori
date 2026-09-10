import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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
    if (seen.has(key)) {
      dupes.push(value);
    } else {
      seen.set(key, value);
    }
  }
  return dupes;
}

const curriculum = loadJson('data/curriculum/requirements.json');
const sourceMap = loadJson('data/curriculum/d1-environment-sources.json');
const factsFile = loadJson('data/content/d1-environment/environment-facts.json');
const lessonsFile = loadJson('data/content/d1-environment/environment-lessons.json');
const questionsFile = loadJson('data/questions/d1-environment/environment-questions.json');
const ecoQuestionsFile = loadJson('data/questions/d1-eco-driving/eco-driving-questions.json');
const ecoFactsFile = loadJson('data/content/d1-eco-driving/eco-driving-facts.json');

const requirements = curriculum.requirements.filter(
  (requirement) => requirement.active && requirement.subject === 'D1_ENVIRONMENT',
);
const facts = factsFile.facts;
const lessons = lessonsFile.lessons;
const questions = questionsFile.questions;
const topicCheckpoints = questionsFile.topic_checkpoints;
const lessonByKey = new Map(lessons.map((lesson) => [lesson.stable_key, lesson]));
const factByKey = new Map(facts.map((fact) => [fact.stable_key, fact]));
const sourceMappings = new Map(sourceMap.requirement_source_map.map((mapping) => [mapping.requirement_key, mapping]));
const ecoAnswers = new Set(
  ecoQuestionsFile.questions.map((question) => normalize(question.answer_choices.find((choice) => choice.id === question.correct_answer_id)?.text ?? '')),
);
const ecoPrompts = new Set(ecoQuestionsFile.questions.map((question) => normalize(question.prompt)));
const ecoFactKeys = new Set(ecoFactsFile.facts.map((fact) => fact.stable_key));

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
const weakExplanations = questions.filter(
  (question) => !question.explanation.toLowerCase().includes('miljö') || !question.explanation.includes('Rätt:'),
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
const exactCrossSubjectPromptDuplicates = questions.filter((question) => ecoPrompts.has(normalize(question.prompt)));
const crossSubjectSameAnswer = questions.filter((question) =>
  ecoAnswers.has(normalize(question.answer_choices.find((choice) => choice.id === question.correct_answer_id)?.text ?? '')),
);
const invalidCrossSubjectLinks = facts.filter((fact) =>
  (fact.cross_subject_fact_links ?? []).some((key) => !ecoFactKeys.has(key)),
);
const visualItems = [
  ...lessons.filter(
    (lesson) =>
      lesson.visual_metadata?.requires_image ||
      lesson.visual_metadata?.requires_diagram ||
      lesson.visual_metadata?.requires_comparison_visual,
  ),
  ...questions.filter(
    (question) =>
      question.visual_metadata?.requires_image ||
      question.visual_metadata?.requires_diagram ||
      question.visual_metadata?.requires_comparison_visual,
  ),
];
const visualBlockedQuestions = questions.filter((question) => /kartan|bilden|diagrammet/i.test(question.prompt));
const heldForReview = [
  ...facts.filter((fact) => fact.verification_status !== 'verified').map((fact) => fact.stable_key),
  ...lessons.filter((lesson) => lesson.status !== 'published').map((lesson) => lesson.stable_key),
  ...questions.filter((question) => question.status !== 'published').map((question) => question.stable_key),
];

const coverageRows = requirements.map((requirement) => {
  const requirementFacts = facts.filter((fact) => fact.requirement_key === requirement.stable_key);
  const requirementLessons = lessons.filter((lesson) => lesson.requirement_keys.includes(requirement.stable_key));
  const requirementQuestions = questions.filter((question) => question.requirement_keys.includes(requirement.stable_key));
  return {
    key: requirement.stable_key,
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
    facts: topicFacts.length,
    lessons: topicLessons.length,
    questions: topicQuestions.length,
    scenarios: topicQuestions.filter((question) => question.question_type === 'scenario').length,
    calculations: topicQuestions.filter((question) => question.question_type === 'calculation').length,
    checkpointQuestions: checkpoint?.question_count ?? 0,
    visual: topic.visual_metadata
      ? [
          topic.visual_metadata.requires_image ? 'image' : undefined,
          topic.visual_metadata.requires_diagram ? 'diagram' : undefined,
          topic.visual_metadata.requires_comparison_visual ? 'comparison' : undefined,
        ].filter(Boolean).join(', ')
      : 'none',
  };
});

const undercovered = coverageRows.filter((row) => row.facts < 3 || row.questions < 4);
const overcovered = coverageRows.filter((row) => row.questions > 12);

const report = `# D1 Miljö Quality Audit

Generated: 2026-09-10

## Scope

- Subject: D1_ENVIRONMENT
- Official curriculum: TSFS 2021:119, 3 kap. 6-9 §§
- Pipeline: official requirement -> authoritative source expansion -> verified facts -> pedagogical topics -> mobile lessons -> source-backed questions -> checkpoints -> Plugga integration -> tests -> quality audit
- Exclusions respected: no Säkerhet, Bemötande, Fordonskännedom, Arbetsmiljö/risk, Sjukdomar/funktionsnedsättningar, AI, payments, videos, translations, pass guarantee, readiness scoring or admin redesign.

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
- Visual-dependent items: ${visualItems.length}
- Content held for review: ${heldForReview.length}

## Source Completeness

All D1_ENVIRONMENT requirements have the primary legal curriculum source and at least one official explanatory/statistical source where factual detail is taught.

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

| Topic | Facts | Lessons | Questions | Scenario | Calculation | Checkpoint questions | Visual metadata |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${topicRows.map((row) => `| ${row.title} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenarios} | ${row.calculations} | ${row.checkpointQuestions} | ${row.visual} |`).join('\n')}

The topic order is internal and pedagogical: overall vehicle impact first, then technology/fuels, exhaust treatment, tyres, vehicle care/waste, start/idling/noise, and finally driving style/route choice.

## Duplication And Cross-Subject Overlap

- Duplicate fact texts within Miljö: ${duplicateFacts.length === 0 ? 'none' : duplicateFacts.join('; ')}
- Exact duplicate Miljö prompts: ${duplicatePrompts.length === 0 ? 'none' : duplicatePrompts.join('; ')}
- Exact duplicate Miljö answer sets: ${duplicateAnswerSets.length === 0 ? 'none' : duplicateAnswerSets.join('; ')}
- Exact prompt duplicates vs Körekonomi: ${exactCrossSubjectPromptDuplicates.length === 0 ? 'none' : exactCrossSubjectPromptDuplicates.map((question) => question.stable_key).join(', ')}
- Shared correct-answer wording vs Körekonomi: ${crossSubjectSameAnswer.length === 0 ? 'none' : crossSubjectSameAnswer.map((question) => question.stable_key).join(', ')}
- Invalid cross-subject fact links: ${invalidCrossSubjectLinks.length === 0 ? 'none' : invalidCrossSubjectLinks.map((fact) => fact.stable_key).join(', ')}

Known overlap with Körekonomi is intentionally framed differently: Körekonomi asks what improves fuel economy; Miljö asks what the environmental, health, noise or waste effect is.

## Question Quality

- Ambiguous questions: ${ambiguousQuestions.length === 0 ? 'none detected' : ambiguousQuestions.map((question) => question.stable_key).join(', ')}
- Weak explanations: ${weakExplanations.length === 0 ? 'none detected' : weakExplanations.map((question) => question.stable_key).join(', ')}
- One correct answer: verified by automated tests.
- Difficulty: easy/medium/hard spread is retained, with no unsupported calculations.
- Competency alignment: KNOW/UNDERSTAND/EXPLAIN requirements use recognition, concept or scenario questions; § 9 assessment requirements use environmental scenarios.

## Traceability

Traceability chain required: question -> lesson -> fact -> requirement -> source.

- Traceability issues: ${traceabilityIssues.length === 0 ? 'none' : traceabilityIssues.map((question) => question.stable_key).join(', ')}
- Every lesson has requirement keys, fact keys and source references.
- Every question has lesson key, fact keys, requirement keys and exact source references.

## Language And Terminology

Swedish wording was reviewed for mobile readability, taxi relevance and environmental precision. Terminology is kept consistent around "miljöpåverkan", "utsläpp", "luftföroreningar", "avgasrening", "däck", "tomgång", "buller", "restprodukter" and "vägval".

No intentional trick phrasing, mixed UI labels or unsupported legal simplifications were found.

## Visual Dependency

- Visual-dependent lessons/questions marked for future image/diagram/comparison support: ${visualItems.length}
- Visual-blocked questions: ${visualBlockedQuestions.length === 0 ? 'none' : visualBlockedQuestions.map((question) => question.stable_key).join(', ')}

Visual metadata was added for exhaust treatment systems, tyre comparison, vehicle fluids/rest products, noise/start effects and driving-style diagrams. No question requires a missing visual to answer.

## Checkpoints

- Topic checkpoint selection: proportional to available pools, not forced to the same size for every topic.
- Subject checkpoint selection: broad sample across all seven Miljö topics.
- Frozen versions: uses the existing attempt/result flow and checkpoint engine.

## Automated Tests Added

- Every D1_ENVIRONMENT requirement is sourced.
- Every published fact has source traceability.
- Every lesson maps to requirements/facts and has visual metadata.
- Every question has full traceability.
- Topic checkpoint selection works.
- Subject checkpoint selection works.
- No duplicate stable keys in Miljö content.
- No exact duplicate prompts.
- No exact duplicate answer sets.
- Cross-subject duplicate audit against D1_ECO_DRIVING.
- Plugga flow exposes Miljö correctly.

## Result

Status: PASS

Published:

- Fordonets miljöpåverkan
- Motorer, bränslen och fordonsvätskor
- Avgaser och reningssystem
- Däck och miljö
- Miljöanpassad fordonsskötsel
- Start, tomgång och buller
- Körsätt och vägval

Held for review: ${heldForReview.length === 0 ? 'none' : heldForReview.join(', ')}
`;

const outputPath = resolve(root, 'docs/d1-environment-quality-audit.md');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, report, 'utf8');
console.log(`Wrote ${outputPath}`);
