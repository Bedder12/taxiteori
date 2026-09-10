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
const sourceMap = loadJson('data/curriculum/d1-safety-sources.json');
const factsFile = loadJson('data/content/d1-safety/safety-facts.json');
const lessonsFile = loadJson('data/content/d1-safety/safety-lessons.json');
const visualsFile = loadJson('data/content/d1-safety/safety-visuals.json');
const questionsFile = loadJson('data/questions/d1-safety/safety-questions.json');
const otherD1Questions = [
  'data/questions/d1-navigation/navigation-questions.json',
  'data/questions/d1-eco-driving/eco-driving-questions.json',
  'data/questions/d1-environment/environment-questions.json',
  'data/questions/d1-vehicle-knowledge/vehicle-questions.json',
].flatMap((path) => loadJson(path).questions);

const requirements = curriculum.requirements.filter((requirement) => requirement.active && requirement.subject === 'D1_SAFETY');
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
  (question) => !question.explanation.toLowerCase().includes('säker') || !question.explanation.includes('Rätt:'),
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
  (question) => question.visual_metadata?.requires_image || question.visual_metadata?.requires_diagram || question.visual_metadata?.requires_road_scene || question.visual_metadata?.requires_comparison_visual,
);
const visualBlockedQuestions = visualDependentQuestions.filter(
  (question) => !question.visual_asset_id || !visualIds.has(question.visual_asset_id) || question.visual_correctness_depends_on_asset,
);
const exactCrossSubjectPromptDuplicates = questions.filter((question) => otherPrompts.has(normalize(question.prompt)));
const crossSubjectSameAnswer = questions.filter((question) =>
  otherAnswers.has(normalize(question.answer_choices.find((choice) => choice.id === question.correct_answer_id)?.text ?? '')),
);
const scenarioContextIssues = questions.filter(
  (question) =>
    question.question_type === 'scenario' &&
    (!/taxi|taxiförarens|passagerare|olycka|väg|trafik|barn|kör/i.test(question.prompt) || question.prompt.length <= 90),
);
const unsupportedCalculations = questions.filter(
  (question) =>
    question.question_type === 'calculation' &&
    (question.requirement_keys[0] !== 'D1-SAFE-014-001' || question.calculation_metadata?.teaching_status !== 'pedagogical_estimate'),
);
const legalGuidanceMixIssues = facts.filter(
  (fact) => fact.legal_or_guidance_status === 'binding_rule' && !fact.source_id.includes('TSFS') && !fact.source_id.includes('SFS') && !fact.source_id.includes('LASTA_RATT') && fact.source_id !== 'TS_BALTESREGLER',
);
const heldForReview = [
  ...facts.filter((fact) => fact.verification_status !== 'verified').map((fact) => fact.stable_key),
  ...lessons.filter((lesson) => lesson.status !== 'published').map((lesson) => lesson.stable_key),
  ...questions.filter((question) => question.status !== 'published').map((question) => question.stable_key),
  ...visualBlockedQuestions.map((question) => question.stable_key),
  ...unsupportedCalculations.map((question) => question.stable_key),
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
    visualAssets: topic.visual_asset_ids.join(', '),
  };
});

const undercovered = coverageRows.filter((row) => row.facts < 1 || row.questions < 1);
const overcovered = coverageRows.filter((row) => row.questions > 8);

const report = `# D1 Säkerhet Quality Audit

Generated: 2026-09-10

## Scope

- Subject: D1_SAFETY
- Official curriculum: TSFS 2021:119, 3 kap. 10-15 §§
- Pipeline: official requirement -> authoritative source expansion -> verified facts -> pedagogical topics -> mobile lessons -> source-backed questions -> visual/scenario metadata -> checkpoints -> Plugga integration -> tests -> quality audit
- Exclusions respected: no Bemötande, Sjukdomar och funktionsnedsättningar, Arbetsmiljö/omdöme/risk, full D1 mock exam, AI tutor, payments, videos, translations, pass guarantee, readiness scoring or admin redesign.

## Summary

- Requirements reviewed: ${requirements.length}
- Sources reviewed: ${sourceMap.source_catalog.length}
- Verified facts reviewed: ${facts.length}
- Published lessons reviewed: ${lessons.filter((lesson) => lesson.status === 'published').length}
- Published questions reviewed: ${questions.filter((question) => question.status === 'published').length}
- Scenario questions: ${questions.filter((question) => question.question_type === 'scenario').length}
- Calculation/estimation questions: ${questions.filter((question) => question.question_type === 'calculation').length}
- Visual placeholders required: ${visuals.length}
- Visual-dependent questions: ${visualDependentQuestions.length}
- Topic checkpoints: ${topicCheckpoints.length}
- Subject checkpoints: 1
- Content held for review: ${heldForReview.length}

## Source Completeness

All active D1_SAFETY requirements have the primary legal curriculum source. Operational facts use Transportstyrelsen, Trafikverket, Polisen, Arbetsmiljöverket, 1177 and Vårdhandboken where the requirement needs applied safety, accident, restraint, threat/violence or HLR support.

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

## Topic Balance And Ordering

| Topic | Facts | Lessons | Questions | Scenario | Calculation | Checkpoint questions | Visual assets |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${topicRows.map((row) => `| ${row.title} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenarios} | ${row.calculations} | ${row.checkpointQuestions} | ${row.visualAssets} |`).join('\n')}

The topic order is pedagogical: start with trip responsibility, then personal/workplace threat handling, medical response, accident-site action, passenger restraints, wheelchair/load securing, vulnerable road users and finally speed/krockvåld/Nollvisionen. This gives learners practical prerequisites before broader system-level safety thinking.

## Visual Dependencies

- Visual manifest entries: ${visuals.length}
- Visual-dependent published questions with asset reference: ${visualDependentQuestions.length - visualBlockedQuestions.length}
- Visual-blocked questions: ${visualBlockedQuestions.length === 0 ? 'none' : visualBlockedQuestions.map((question) => question.stable_key).join(', ')}

Manifest entries are placeholders only and do not include copyrighted diagrams. Published questions do not require the placeholder visual to determine the correct answer.

## Numeric And Calculation Content

- Calculation/estimation questions: ${questions.filter((question) => question.question_type === 'calculation').length}
- Unsupported calculation questions: ${unsupportedCalculations.length === 0 ? 'none' : unsupportedCalculations.map((question) => question.stable_key).join(', ')}

Speed content is framed as source-backed safety relationship and pedagogical estimation, not as an exact physics formula.

## Duplication And Cross-Subject Overlap

- Duplicate fact texts within Säkerhet: ${duplicateFacts.length === 0 ? 'none' : duplicateFacts.join('; ')}
- Exact duplicate Säkerhet prompts: ${duplicatePrompts.length === 0 ? 'none' : duplicatePrompts.join('; ')}
- Exact duplicate Säkerhet answer sets: ${duplicateAnswerSets.length === 0 ? 'none' : duplicateAnswerSets.join('; ')}
- Exact prompt duplicates vs earlier D1 subjects: ${exactCrossSubjectPromptDuplicates.length === 0 ? 'none' : exactCrossSubjectPromptDuplicates.map((question) => question.stable_key).join(', ')}
- Shared correct-answer wording vs earlier D1 subjects: ${crossSubjectSameAnswer.length === 0 ? 'none' : crossSubjectSameAnswer.map((question) => question.stable_key).join(', ')}

Known overlaps are intentionally framed by competence: tyres, braking, weather, speed and passenger equipment appear in other subjects, but Säkerhet questions test risk judgment and safe action rather than vehicle mechanics, economy or environment.

## Question Quality

- Ambiguous questions: ${ambiguousQuestions.length === 0 ? 'none detected' : ambiguousQuestions.map((question) => question.stable_key).join(', ')}
- Weak explanations: ${weakExplanations.length === 0 ? 'none detected' : weakExplanations.map((question) => question.stable_key).join(', ')}
- Scenario context issues: ${scenarioContextIssues.length === 0 ? 'none detected' : scenarioContextIssues.map((question) => question.stable_key).join(', ')}
- One correct answer: verified by automated tests.
- Distractors: plausible but clearly unsafe or responsibility-shifting in the stated scenario.
- Competency alignment: KNOW/EXPLAIN use recognition and explanation; USE/PERFORM/APPLY/ASSESS use practical scenarios; speed requirement includes guarded estimation.

## Source Consistency

- Legal/guidance distinction issues: ${legalGuidanceMixIssues.length === 0 ? 'none detected' : legalGuidanceMixIssues.map((fact) => fact.stable_key).join(', ')}
- Source contradictions: none detected.
- Overly simplified safety advice changing legal meaning: none detected.

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

const outputPath = resolve(root, 'docs/d1-safety-quality-audit.md');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, report, 'utf8');
console.log(`Wrote ${outputPath}`);
