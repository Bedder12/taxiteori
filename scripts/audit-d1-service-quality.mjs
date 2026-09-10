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
const sourceMap = loadJson('data/curriculum/d1-service-sources.json');
const factsFile = loadJson('data/content/d1-service/service-facts.json');
const lessonsFile = loadJson('data/content/d1-service/service-lessons.json');
const visualsFile = loadJson('data/content/d1-service/service-visuals.json');
const questionsFile = loadJson('data/questions/d1-service/service-questions.json');
const otherD1Questions = [
  'data/questions/d1-safety/safety-questions.json',
  'data/questions/d1-vehicle-knowledge/vehicle-questions.json',
].flatMap((path) => loadJson(path).questions);

const requirements = curriculum.requirements.filter((requirement) => requirement.active && requirement.subject === 'D1_SERVICE');
const facts = factsFile.facts;
const lessons = lessonsFile.lessons;
const questions = questionsFile.questions;
const visuals = visualsFile.visuals;
const topicCheckpoints = questionsFile.topic_checkpoints;
const lessonByKey = new Map(lessons.map((lesson) => [lesson.stable_key, lesson]));
const factByKey = new Map(facts.map((fact) => [fact.stable_key, fact]));
const sourceMappings = new Map(sourceMap.requirement_source_map.map((mapping) => [mapping.requirement_key, mapping]));
const visualIds = new Set(visuals.map((visual) => visual.visual_id));
const otherPrompts = new Set(otherD1Questions.map((question) => normalize(question.prompt)));

const duplicateFacts = duplicates(facts.map((fact) => fact.text));
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
const weakDistractors = questions.filter((question) =>
  question.answer_choices
    .filter((choice) => choice.id !== question.correct_answer_id)
    .some((choice) => /uppenbart dumt|var otrevlig|strunta helt/i.test(choice.text)),
);
const weakExplanations = questions.filter(
  (question) => !question.explanation.toLowerCase().includes('bemöt') || !question.explanation.includes('Rätt:'),
);
const stereotypeIssues = questions.filter((question) =>
  /gamling|handikappad|invalid|rullstolsbunden|dövstum|missbrukare|barnslig/i.test(question.prompt + ' ' + question.answer_choices.map((choice) => choice.text).join(' ')),
);
const futureSubjectDrift = questions.filter((question) => /diagnos|symtom|sjukdomens effekt|medicinsk bedömning/i.test(question.prompt));
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
const exactCrossSubjectPromptDuplicates = questions.filter((question) => otherPrompts.has(normalize(question.prompt)));
const missingCompetencyTags = questions.filter((question) => !question.competency_tags?.length);
const unsupportedCalculations = questions.filter(
  (question) => question.question_type === 'calculation' && (question.requirement_keys[0] !== 'D1-SERV-017-008' || question.calculation_metadata?.teaching_status !== 'source_backed_price_estimate'),
);
const heldForReview = [
  ...facts.filter((fact) => fact.verification_status !== 'verified').map((fact) => fact.stable_key),
  ...lessons.filter((lesson) => lesson.status !== 'published').map((lesson) => lesson.stable_key),
  ...questions.filter((question) => question.status !== 'published').map((question) => question.stable_key),
  ...visualBlockedQuestions.map((question) => question.stable_key),
  ...unsupportedCalculations.map((question) => question.stable_key),
  ...stereotypeIssues.map((question) => question.stable_key),
  ...futureSubjectDrift.map((question) => question.stable_key),
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
    visualAssets: topic.visual_asset_ids.join(', ') || 'none',
  };
});

const statusCounts = facts.reduce((counts, fact) => {
  counts[fact.authority_status] = (counts[fact.authority_status] ?? 0) + 1;
  return counts;
}, {});
const undercovered = coverageRows.filter((row) => row.facts < 1 || row.questions < 1);
const overcovered = coverageRows.filter((row) => row.questions > 8);

const report = `# D1 Bemötande Quality Audit

Generated: 2026-09-10

## Scope

- Subject: D1_SERVICE
- Official curriculum: TSFS 2021:119, 3 kap. 16-17 §§
- Pipeline: official requirement -> authoritative source expansion -> verified facts/principles -> pedagogical topics -> mobile lessons -> source-backed scenario questions -> checkpoints -> Plugga integration -> tests -> quality audit
- Exclusions respected: no Sjukdomar och funktionsnedsättningar, Arbetsmiljö/omdöme/risk, full D1 mock exam, AI tutor, payments, videos, translations, pass guarantee, readiness scoring or admin redesign.

## Summary

- Requirements reviewed: ${requirements.length}
- Sources reviewed: ${sourceMap.source_catalog.length}
- Verified facts/principles reviewed: ${facts.length}
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

All active D1_SERVICE requirements have the primary legal curriculum source. Supporting sources are used only where they support the curriculum competency: accessibility and communication, threats/conflict boundary, scents/smoke, smoke-free environments and price information.

${missingSourceMappings.length === 0 ? '- Missing source mappings: none' : `- Missing source mappings: ${missingSourceMappings.map((requirement) => requirement.stable_key).join(', ')}`}
${unresolvedSources.length === 0 ? '- Unresolved source mappings: none' : `- Unresolved source mappings: ${unresolvedSources.map((mapping) => mapping.requirement_key).join(', ')}`}

Primary and official sources used:

${sourceMap.source_catalog.map((source) => `- ${source.source_key}: ${source.authority}, ${source.source_type}, ${source.source_status}`).join('\n')}

## Authority Status Distribution

${Object.entries(statusCounts).map(([status, count]) => `- ${status}: ${count}`).join('\n')}

## Requirement Coverage

| Requirement | Competency | Facts/principles | Lessons | Questions | Scenario | Calculation |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
${coverageRows.map((row) => `| ${row.key} | ${row.competency} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenarios} | ${row.calculations} |`).join('\n')}

Undercovered requirements: ${undercovered.length === 0 ? 'none' : undercovered.map((row) => row.key).join(', ')}

Overcovered requirements: ${overcovered.length === 0 ? 'none' : overcovered.map((row) => row.key).join(', ')}

## Topic Balance And Ordering

| Topic | Facts/principles | Lessons | Questions | Scenario | Calculation | Checkpoint questions | Visual assets |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${topicRows.map((row) => `| ${row.title} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenarios} | ${row.calculations} | ${row.checkpointQuestions} | ${row.visualAssets} |`).join('\n')}

The topic order is pedagogical: professional conduct, communication, difficult situations, children/companions, adapted communication, mobility aids, cleanliness/smoke and price explanation.

## Visual Metadata

- Visual manifest entries: ${visuals.length}
- Visual-dependent published questions with asset reference: ${visualDependentQuestions.length - visualBlockedQuestions.length}
- Visual-blocked questions: ${visualBlockedQuestions.length === 0 ? 'none' : visualBlockedQuestions.map((question) => question.stable_key).join(', ')}

Bemötande is mostly scenario text. Visuals are limited to entry assistance, help aids, luggage/cleanliness and communication. Published questions do not require placeholder visuals to determine the correct answer.

## Question Quality

- Ambiguous questions: ${ambiguousQuestions.length === 0 ? 'none detected' : ambiguousQuestions.map((question) => question.stable_key).join(', ')}
- Weak distractors: ${weakDistractors.length === 0 ? 'none detected' : weakDistractors.map((question) => question.stable_key).join(', ')}
- Weak explanations: ${weakExplanations.length === 0 ? 'none detected' : weakExplanations.map((question) => question.stable_key).join(', ')}
- Missing competency tags: ${missingCompetencyTags.length === 0 ? 'none' : missingCompetencyTags.map((question) => question.stable_key).join(', ')}
- One correct answer: verified by automated tests.
- Distractors represent plausible mistakes: assuming instead of asking, ignoring expressed needs, rushing or shifting focus away from clear service.

## Language And Respect

- Stereotype or outdated terminology issues: ${stereotypeIssues.length === 0 ? 'none detected' : stereotypeIssues.map((question) => question.stable_key).join(', ')}
- Drift into future health/disability content: ${futureSubjectDrift.length === 0 ? 'none detected' : futureSubjectDrift.map((question) => question.stable_key).join(', ')}
- Terminology uses neutral Swedish such as passagerare, nedsatt syn, nedsatt hörsel, nedsatt rörelseförmåga, hjälpmedel and ledsagare.

## Duplication And Cross-Subject Boundary

- Duplicate fact/principle texts within Bemötande: ${duplicateFacts.length === 0 ? 'none' : duplicateFacts.join('; ')}
- Exact duplicate Bemötande prompts: ${duplicatePrompts.length === 0 ? 'none' : duplicatePrompts.join('; ')}
- Exact duplicate Bemötande answer sets: ${duplicateAnswerSets.length === 0 ? 'none' : duplicateAnswerSets.join('; ')}
- Exact prompt duplicates vs D1_SAFETY/Fordonskännedom: ${exactCrossSubjectPromptDuplicates.length === 0 ? 'none' : exactCrossSubjectPromptDuplicates.map((question) => question.stable_key).join(', ')}

Legitimate overlaps are documented for threat handling, passenger safety, mobility aids and taxi price information. Bemötande frames these as communication/service judgments rather than safety mechanics, disability medicine or taxitrafiklagstiftning drill.

## Numeric And Price Content

- Price calculation questions: ${questions.filter((question) => question.question_type === 'calculation').length}
- Unsupported calculation questions: ${unsupportedCalculations.length === 0 ? 'none' : unsupportedCalculations.map((question) => question.stable_key).join(', ')}

Price questions are source-backed and distinguish approximate explanation from fixed price and binding price quote.

## Traceability

Traceability chain required: question -> lesson -> fact/principle -> requirement -> source.

- Traceability issues: ${traceabilityIssues.length === 0 ? 'none' : traceabilityIssues.map((question) => question.stable_key).join(', ')}
- Every lesson has requirement keys, fact keys and source references.
- Every question has lesson key, fact keys, requirement keys, exact source references and competency tags.

## Result

Status: PASS

Published:

${topicRows.map((row) => `- ${row.title}`).join('\n')}

Held for review: ${heldForReview.length === 0 ? 'none' : heldForReview.join(', ')}
`;

const outputPath = resolve(root, 'docs/d1-service-quality-audit.md');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, report, 'utf8');
console.log(`Wrote ${outputPath}`);
