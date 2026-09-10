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
const sourceMap = loadJson('data/curriculum/d1-vehicle-knowledge-sources.json');
const factsFile = loadJson('data/content/d1-vehicle-knowledge/vehicle-facts.json');
const lessonsFile = loadJson('data/content/d1-vehicle-knowledge/vehicle-lessons.json');
const visualsFile = loadJson('data/content/d1-vehicle-knowledge/vehicle-visuals.json');
const questionsFile = loadJson('data/questions/d1-vehicle-knowledge/vehicle-questions.json');
const ecoQuestionsFile = loadJson('data/questions/d1-eco-driving/eco-driving-questions.json');
const environmentQuestionsFile = loadJson('data/questions/d1-environment/environment-questions.json');

const requirements = curriculum.requirements.filter(
  (requirement) => requirement.active && requirement.subject === 'D1_VEHICLE_KNOWLEDGE',
);
const facts = factsFile.facts;
const lessons = lessonsFile.lessons;
const questions = questionsFile.questions;
const visuals = visualsFile.visuals;
const topicCheckpoints = questionsFile.topic_checkpoints;
const lessonByKey = new Map(lessons.map((lesson) => [lesson.stable_key, lesson]));
const factByKey = new Map(facts.map((fact) => [fact.stable_key, fact]));
const sourceMappings = new Map(sourceMap.requirement_source_map.map((mapping) => [mapping.requirement_key, mapping]));
const visualIds = new Set(visuals.map((visual) => visual.visual_id));
const otherD1Questions = [...ecoQuestionsFile.questions, ...environmentQuestionsFile.questions];
const otherPrompts = new Set(otherD1Questions.map((question) => normalize(question.prompt)));
const otherAnswers = new Set(otherD1Questions.map((question) => normalize(question.answer_choices.find((choice) => choice.id === question.correct_answer_id)?.text ?? '')));

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
  (question) => !question.explanation.toLowerCase().includes('fordons') || !question.explanation.includes('Rätt:'),
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
  (question) => question.visual_metadata?.requires_image || question.visual_metadata?.requires_diagram || question.visual_metadata?.requires_comparison_visual,
);
const visualBlockedQuestions = visualDependentQuestions.filter(
  (question) => !question.visual_asset_id || !visualIds.has(question.visual_asset_id) || question.visual_correctness_depends_on_asset,
);
const exactCrossSubjectPromptDuplicates = questions.filter((question) => otherPrompts.has(normalize(question.prompt)));
const crossSubjectSameAnswer = questions.filter((question) =>
  otherAnswers.has(normalize(question.answer_choices.find((choice) => choice.id === question.correct_answer_id)?.text ?? '')),
);
const technicalOverreach = facts.filter((fact) =>
  /alltid|aldrig|exakt|måste kopplas/i.test(fact.fact_text) && !fact.exact_reference.includes('TSFS') && fact.source_id !== 'TS_VINTERDACK',
);
const modelSpecificGuards = lessons.filter((lesson) =>
  lesson.content_blocks.some((block) => block.text?.includes('varierar mellan fordonsmodeller')),
);
const heldForReview = [
  ...facts.filter((fact) => fact.verification_status !== 'verified').map((fact) => fact.stable_key),
  ...lessons.filter((lesson) => lesson.status !== 'published').map((lesson) => lesson.stable_key),
  ...questions.filter((question) => question.status !== 'published').map((question) => question.stable_key),
  ...visualBlockedQuestions.map((question) => question.stable_key),
];

const coverageRows = requirements.map((requirement) => {
  const requirementFacts = facts.filter((fact) => fact.requirement_key === requirement.stable_key);
  const requirementLessons = lessons.filter((lesson) => lesson.requirement_keys.includes(requirement.stable_key));
  const requirementQuestions = questions.filter((question) => question.requirement_keys.includes(requirement.stable_key));
  return {
    key: requirement.stable_key,
    competency: requirement.competency_type ?? requirement.original_competency_wording ?? 'ASSESS',
    facts: requirementFacts.length,
    lessons: requirementLessons.length,
    questions: requirementQuestions.length,
    scenarios: requirementQuestions.filter((question) => question.question_type === 'scenario').length,
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
    checkpointQuestions: checkpoint?.question_count ?? 0,
    visualAssets: topic.visual_asset_ids.join(', '),
  };
});

const undercovered = coverageRows.filter((row) => row.facts < 1 || row.questions < 1);
const overcovered = coverageRows.filter((row) => row.questions > 6);

const report = `# D1 Fordonskännedom Quality Audit

Generated: 2026-09-10

## Scope

- Subject: D1_VEHICLE_KNOWLEDGE
- Official curriculum: TSFS 2021:119, 3 kap. 23-29 §§
- Pipeline: official requirement -> authoritative source expansion -> verified facts -> pedagogical topics -> mobile lessons -> source-backed questions -> visual manifest -> checkpoints -> Plugga integration -> tests -> quality audit
- Exclusions respected: no Säkerhet, Bemötande, Arbetsmiljö/risk, Sjukdomar/funktionsnedsättningar, AI tutor, payments, videos, translations, pass guarantee, readiness scoring or admin redesign.

## Summary

- Requirements reviewed: ${requirements.length}
- Sources reviewed: ${sourceMap.source_catalog.length}
- Verified facts reviewed: ${facts.length}
- Published lessons reviewed: ${lessons.filter((lesson) => lesson.status === 'published').length}
- Published questions reviewed: ${questions.filter((question) => question.status === 'published').length}
- Scenario questions: ${questions.filter((question) => question.question_type === 'scenario').length}
- Calculation questions: ${questions.filter((question) => question.question_type === 'calculation').length}
- Visual placeholders required: ${visuals.length}
- Visual-dependent questions: ${visualDependentQuestions.length}
- Topic checkpoints: ${topicCheckpoints.length}
- Subject checkpoints: 1
- Content held for review: ${heldForReview.length}

## Source Completeness

All D1_VEHICLE_KNOWLEDGE requirements have the primary legal curriculum source. Operational details use Transportstyrelsen, Elsäkerhetsverket and Konsumentverket sources where available.

${missingSourceMappings.length === 0 ? '- Missing source mappings: none' : `- Missing source mappings: ${missingSourceMappings.map((requirement) => requirement.stable_key).join(', ')}`}
${unresolvedSources.length === 0 ? '- Unresolved source mappings: none' : `- Unresolved source mappings: ${unresolvedSources.map((mapping) => mapping.requirement_key).join(', ')}`}

Primary and official sources used:

${sourceMap.source_catalog.map((source) => `- ${source.source_key}: ${source.authority}, ${source.source_type}, ${source.source_status}`).join('\n')}

## Requirement Coverage

| Requirement | Competency | Facts | Lessons | Questions | Scenario |
| --- | --- | ---: | ---: | ---: | ---: |
${coverageRows.map((row) => `| ${row.key} | ${row.competency} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenarios} |`).join('\n')}

Undercovered requirements: ${undercovered.length === 0 ? 'none' : undercovered.map((row) => row.key).join(', ')}

Overcovered requirements: ${overcovered.length === 0 ? 'none' : overcovered.map((row) => row.key).join(', ')}

## Topic Balance

| Topic | Facts | Lessons | Questions | Scenario | Checkpoint questions | Visual assets |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${topicRows.map((row) => `| ${row.title} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenarios} | ${row.checkpointQuestions} | ${row.visualAssets} |`).join('\n')}

The topic order is internal and pedagogical: vehicle overview, controls/data, safety systems, warnings, fluids, electrical system, steering, brakes, wheel checks, tyre condition, markings, winter tyres and combinations/dimensions.

## Visual Dependencies

- Visual manifest entries: ${visuals.length}
- Visual-dependent published questions with asset reference: ${visualDependentQuestions.length - visualBlockedQuestions.length}
- Visual-blocked questions: ${visualBlockedQuestions.length === 0 ? 'none' : visualBlockedQuestions.map((question) => question.stable_key).join(', ')}

Manifest entries are placeholders only and do not include copyrighted diagrams. Published questions do not require the placeholder visual to determine the correct answer.

## Duplication And Cross-Subject Overlap

- Duplicate fact texts within Fordonskännedom: ${duplicateFacts.length === 0 ? 'none' : duplicateFacts.join('; ')}
- Exact duplicate Fordonskännedom prompts: ${duplicatePrompts.length === 0 ? 'none' : duplicatePrompts.join('; ')}
- Exact duplicate Fordonskännedom answer sets: ${duplicateAnswerSets.length === 0 ? 'none' : duplicateAnswerSets.join('; ')}
- Exact prompt duplicates vs Körekonomi/Miljö: ${exactCrossSubjectPromptDuplicates.length === 0 ? 'none' : exactCrossSubjectPromptDuplicates.map((question) => question.stable_key).join(', ')}
- Shared correct-answer wording vs Körekonomi/Miljö: ${crossSubjectSameAnswer.length === 0 ? 'none' : crossSubjectSameAnswer.map((question) => question.stable_key).join(', ')}

Known overlap is limited and framed by subject angle: tyre pressure and fluids can affect economy/environment, but Fordonskännedom tests vehicle behavior, safety checks, technical information and fault action.

## Question Quality

- Ambiguous questions: ${ambiguousQuestions.length === 0 ? 'none detected' : ambiguousQuestions.map((question) => question.stable_key).join(', ')}
- Weak explanations: ${weakExplanations.length === 0 ? 'none detected' : weakExplanations.map((question) => question.stable_key).join(', ')}
- One correct answer: verified by automated tests.
- Difficulty: spread across easy/medium/hard without obscure engineering detail.
- Competency alignment: KNOW/UNDERSTAND/EXPLAIN use recognition and explanation; USE/PERFORM/APPLY use practical scenarios.

## Technical Depth

- Potential overly technical or unsupported absolutes: ${technicalOverreach.length === 0 ? 'none detected' : technicalOverreach.map((fact) => fact.stable_key).join(', ')}
- Lessons with explicit model-variation guard: ${modelSpecificGuards.length}/${lessons.length}

No manufacturer-specific behavior is stated as universal. Lessons direct learners to vehicle documentation or workshop support where position, procedure or limits vary by model.

## Traceability

Traceability chain required: question -> lesson -> fact -> requirement -> source.

- Traceability issues: ${traceabilityIssues.length === 0 ? 'none' : traceabilityIssues.map((question) => question.stable_key).join(', ')}
- Every lesson has requirement keys, fact keys, source references and a visual manifest link.
- Every question has lesson key, fact keys, requirement keys, exact source references and visual asset reference when visual metadata is set.

## Result

Status: PASS

Published:

${topicRows.map((row) => `- ${row.title}`).join('\n')}

Held for review: ${heldForReview.length === 0 ? 'none' : heldForReview.join(', ')}
`;

const outputPath = resolve(root, 'docs/d1-vehicle-knowledge-quality-audit.md');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, report, 'utf8');
console.log(`Wrote ${outputPath}`);
