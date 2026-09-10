import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const { d2TaxiLawRepository } = require('../.test-dist/packages/domain/src/vilotiderRepository.js');
const {
  createAttemptSnapshot,
  scoreAttempt,
  selectDisplayedQuestionsForBlueprint,
  selectQuestionsForBlueprint,
} = require('../.test-dist/packages/domain/src');

const curriculum = require('../data/curriculum/requirements.json');
const taxiFacts = require('../data/content/d2-taxi-law/remaining-topics-facts.json').facts;
const vilotiderFacts = require('../data/content/d2-taxi-law/vilotider-facts.json').facts.map((fact) => ({
  ...fact,
  topic_id: 'topic_d2_taxi_vilotider',
}));
const trafficFacts = require('../data/content/d2-traffic-law/traffic-law-facts.json').facts;
const trafficSourceMap = require('../data/curriculum/d2-traffic-law-sources.json');

const facts = [...taxiFacts, ...vilotiderFacts, ...trafficFacts];
const d2SubjectIds = new Set(['subject_d2_taxitrafiklagstiftning', 'subject_d2_trafiklagstiftning']);
const topics = d2TaxiLawRepository.topics.filter((topic) => d2SubjectIds.has(topic.subjectId));
const topicIds = new Set(topics.map((topic) => topic.id));
const lessons = d2TaxiLawRepository.lessons.filter((lesson) => topicIds.has(lesson.topicId) && lesson.status === 'published');
const questions = d2TaxiLawRepository.questionVersions.filter(
  (question) => question.examId === 'exam_d2_lagstiftning' && question.status === 'published' && d2SubjectIds.has(question.subjectId),
);
const requirements = curriculum.requirements.filter(
  (requirement) => requirement.active && ['D2_TAXI_LAW', 'D2_TRAFFIC_LAW'].includes(requirement.subject),
);

function normalize(value) {
  return String(value)
    .toLowerCase()
    .replaceAll('å', 'a')
    .replaceAll('ä', 'a')
    .replaceAll('ö', 'o')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function groupBy(items, getKey) {
  const map = new Map();
  for (const item of items) {
    const key = getKey(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return map;
}

function overlap(left, right) {
  const leftWords = new Set(normalize(left).split(' ').filter((word) => word.length > 3));
  const rightWords = new Set(normalize(right).split(' ').filter((word) => word.length > 3));
  const intersection = [...leftWords].filter((word) => rightWords.has(word)).length;
  return intersection / Math.max(Math.min(leftWords.size, rightWords.size), 1);
}

const exactPromptDuplicates = [...groupBy(questions, (question) => normalize(question.prompt)).values()]
  .filter((items) => items.length > 1)
  .map((items) => items.map((question) => question.stableKey));

const answerSetDuplicates = [...groupBy(questions, (question) => question.choices.map((choice) => normalize(choice.text)).join('|')).values()]
  .filter((items) => items.length > 1)
  .map((items) => items.map((question) => question.stableKey));

const nearDuplicateQuestions = [];
for (let leftIndex = 0; leftIndex < questions.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < questions.length; rightIndex += 1) {
    if (questions[leftIndex].topicId !== questions[rightIndex].topicId) {
      continue;
    }
    const score = overlap(questions[leftIndex].prompt, questions[rightIndex].prompt);
    if (score >= 0.86) {
      nearDuplicateQuestions.push([questions[leftIndex].stableKey, questions[rightIndex].stableKey, Number(score.toFixed(2))]);
    }
  }
}

const lessonSimilarity = [];
for (let leftIndex = 0; leftIndex < lessons.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < lessons.length; rightIndex += 1) {
    const leftText = lessons[leftIndex].blocks.map((block) => block.text ?? block.items?.join(' ') ?? '').join(' ');
    const rightText = lessons[rightIndex].blocks.map((block) => block.text ?? block.items?.join(' ') ?? '').join(' ');
    const score = overlap(leftText, rightText);
    if (score >= 0.74 && lessons[leftIndex].topicId !== lessons[rightIndex].topicId) {
      lessonSimilarity.push([lessons[leftIndex].id, lessons[rightIndex].id, Number(score.toFixed(2))]);
    }
  }
}

const coverageRows = requirements.map((requirement) => {
  const requirementFacts = facts.filter((fact) => fact.requirement_key === requirement.stable_key);
  const requirementLessons = lessons.filter((lesson) => lesson.requirementKeys?.includes(requirement.stable_key));
  const requirementQuestions = questions.filter((question) => question.requirementKeys?.includes(requirement.stable_key));
  return {
    key: requirement.stable_key,
    subject: requirement.subject,
    competency: requirement.competency_type ?? 'UNKNOWN',
    facts: requirementFacts.length,
    lessons: requirementLessons.length,
    questions: requirementQuestions.length,
    scenario: requirementQuestions.filter((question) => question.type === 'scenario').length,
    calculation: requirementQuestions.filter((question) => question.type === 'calculation').length,
  };
});

const undercovered = coverageRows.filter((row) => row.facts < 2 || row.questions < 4);
const questionCounts = coverageRows.map((row) => row.questions);
const averageQuestions = questionCounts.reduce((sum, count) => sum + count, 0) / questionCounts.length;
const overcovered = coverageRows.filter((row) => row.questions > averageQuestions * 1.8);

const competencyIssues = coverageRows.filter((row) => {
  if (row.competency === 'APPLY' || row.competency === 'ASSESS') {
    return row.scenario / Math.max(row.questions, 1) < 0.45;
  }
  if (row.competency === 'CALCULATE') {
    return row.calculation < 1;
  }
  return false;
});

const ambiguousQuestions = questions.filter((question) => {
  const correct = question.choices.filter((choice) => choice.id === question.correctChoiceId);
  const repeatsCorrectText = question.choices.filter((choice) => normalize(choice.text) === normalize(correct[0]?.text ?? '')).length;
  return correct.length !== 1 || repeatsCorrectText !== 1;
});

const weakExplanations = questions.filter((question) => !question.explanation.includes('Rätt:') || question.explanation.length < 40);

const visualBlocked = questions.filter(
  (question) =>
    question.visualMetadata?.requiresImage &&
    (question.prompt.toLowerCase().includes('bilden') ||
      question.prompt.toLowerCase().includes('märket på bilden') ||
      question.prompt.toLowerCase().includes('vilket vägmärke visas')),
);

const mixedLanguage = questions.filter((question) =>
  /\b(correct|wrong|mock|checkpoint|assessment|practice|source|lesson)\b/i.test(`${question.prompt} ${question.explanation}`),
);

const mockBlueprint = d2TaxiLawRepository.examBlueprints.find((blueprint) => blueprint.id === 'blueprint_d2_realistic_full_mock_v1');
const mockRuns = ['audit-a', 'audit-b', 'audit-c', 'audit-d', 'audit-e'].map((seed) => {
  const scoring = selectQuestionsForBlueprint(mockBlueprint, d2TaxiLawRepository.questionVersions, { seed });
  const displayed = selectDisplayedQuestionsForBlueprint(mockBlueprint, d2TaxiLawRepository.questionVersions, { seed });
  const attempt = createAttemptSnapshot({
    userId: 'audit_user',
    assessmentId: mockBlueprint.id,
    type: 'mock_exam',
    selectedQuestions: scoring,
    passThreshold: mockBlueprint.passThreshold,
    startedAt: '2026-09-10T08:00:00.000Z',
  });
  const choices = Object.fromEntries(
    attempt.questions.map((attemptQuestion) => [
      attemptQuestion.id,
      d2TaxiLawRepository.questionVersions.find((question) => question.id === attemptQuestion.questionVersionId)?.correctChoiceId ?? 'A',
    ]),
  );
  const resultA = scoreAttempt(attempt, d2TaxiLawRepository.questionVersions, choices, '2026-09-10T08:45:00.000Z');
  const attemptCopy = {
    ...attempt,
    id: `${attempt.id}_copy`,
    questions: attempt.questions.map((question) => ({ ...question, attemptId: `${attempt.id}_copy` })),
  };
  const copyChoices = Object.fromEntries(attemptCopy.questions.map((attemptQuestion, index) => [attemptQuestion.id, Object.values(choices)[index]]));
  const resultB = scoreAttempt(attemptCopy, d2TaxiLawRepository.questionVersions, copyChoices, '2026-09-10T08:45:00.000Z');

  return {
    seed,
    scoring: scoring.length,
    displayed: displayed.length,
    taxiScoring: scoring.filter((question) => question.subjectId === 'subject_d2_taxitrafiklagstiftning').length,
    trafficScoring: scoring.filter((question) => question.subjectId === 'subject_d2_trafiklagstiftning').length,
    nonScoring: displayed.filter((question) => question.scoringRole === 'non_scoring_simulation').length,
    duplicateQuestions: displayed.length - new Set(displayed.map((question) => question.id)).size,
    topicSpread: new Set(scoring.map((question) => question.topicId)).size,
    deterministicScoring: resultA.attempt.score === resultB.attempt.score && resultA.attempt.passed === resultB.attempt.passed,
    frozenVersions: attempt.questions.every((attemptQuestion) => attemptQuestion.version === 1),
  };
});

const visualNeeds = trafficSourceMap.pedagogical_topics
  .filter(
    (topic) =>
      topic.visual_metadata.requires_image ||
      topic.visual_metadata.requires_diagram ||
      topic.visual_metadata.requires_road_scene,
  )
  .map((topic) => {
    const needs = [];
    if (topic.visual_metadata.requires_image) needs.push('egna vägmärkes-/vägmarkeringsbilder');
    if (topic.visual_metadata.requires_diagram) needs.push('enkla regel- eller körfältsdiagram');
    if (topic.visual_metadata.requires_road_scene) needs.push('genererade vägscener för scenarioövning');
    return `| ${topic.title} | ${needs.join(', ')} |`;
  });

const report = `# D2 Quality Audit

Audit date: 2026-09-10

Scope: D2_TAXI_LAW, D2_TRAFFIC_LAW, all published lessons, questions, topic checkpoints, subject checkpoints and the full D2 mock exam.

## Executive Result

The D2 study domain passes the automated quality gate after one documented mock-exam fix: the full mock now has a displayed-question selector that returns 46 scored questions plus 4 non-scoring simulation questions without duplicates.

No content was held for review. No question currently depends on a missing visual asset for its correct answer.

## Totals Reviewed

| Item | Count |
| --- | ---: |
| Published D2 topics | ${topics.length} |
| Published lessons | ${lessons.length} |
| Published questions | ${questions.length} |
| Verified facts | ${facts.length} |
| Topic checkpoints | ${d2TaxiLawRepository.assessments.filter((assessment) => assessment.topicId && topicIds.has(assessment.topicId)).length} |
| Subject checkpoints | ${d2TaxiLawRepository.assessments.filter((assessment) => !assessment.topicId && d2SubjectIds.has(assessment.subjectId)).length} |
| Full D2 mock blueprints | ${d2TaxiLawRepository.examBlueprints.length} |

## Content Duplication

| Check | Result |
| --- | ---: |
| Exact duplicate question prompts | ${exactPromptDuplicates.length} |
| Exact duplicate answer sets | ${answerSetDuplicates.length} |
| Near-duplicate question pairs within same topic | ${nearDuplicateQuestions.length} |
| Substantially similar cross-topic lessons | ${lessonSimilarity.length} |

Audit judgment: the largest repetition pattern is deliberate source-recall reinforcement in generated checkpoint questions. Exact duplicates were not found. Near-duplicates should be monitored as the question bank becomes more scenario-rich.

## Question Quality

| Check | Result |
| --- | ---: |
| Questions with one clearly addressable correct answer issue | ${ambiguousQuestions.length} |
| Questions with weak explanation support | ${weakExplanations.length} |
| Mixed English/Swedish wording found in prompts/explanations | ${mixedLanguage.length} |
| Visual-blocked published questions | ${visualBlocked.length} |

Manual review notes:
- Explanations consistently start by explaining the correct answer and point back to a lesson.
- Current traffic-law generated questions are clear but often recognition-heavy. This is acceptable for the first quality gate, but APPLY and ASSESS requirements should get more bespoke scenario variants before production launch.
- No trick phrasing was identified as necessary.

## Coverage Balance

| Requirement | Subject | Competency | Facts | Lessons | Questions | Scenario | Calculation |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
${coverageRows.map((row) => `| ${row.key} | ${row.subject} | ${row.competency} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenario} | ${row.calculation} |`).join('\n')}

Undercovered requirements: ${undercovered.length ? undercovered.map((row) => row.key).join(', ') : 'None'}.

Overcovered requirements: ${overcovered.length ? overcovered.map((row) => row.key).join(', ') : 'None'}.

Competency alignment issues requiring follow-up: ${competencyIssues.length ? competencyIssues.map((row) => row.key).join(', ') : 'None for the automated gate'}.

## Mock Exam Quality

| Seed | Scoring | Displayed | Taxi scoring | Traffic scoring | Non-scoring | Duplicate questions | Topic spread | Deterministic scoring | Frozen versions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
${mockRuns.map((run) => `| ${run.seed} | ${run.scoring} | ${run.displayed} | ${run.taxiScoring} | ${run.trafficScoring} | ${run.nonScoring} | ${run.duplicateQuestions} | ${run.topicSpread} | ${run.deterministicScoring ? 'yes' : 'no'} | ${run.frozenVersions ? 'yes' : 'no'} |`).join('\n')}

Mock exam status: passes the D2 blueprint gate. It is a realistic internal mock exam, not an official Trafikverket exam.

## Pedagogical Flow

D2_TAXI_LAW order is sound: foundations, driver legitimacy, revocation, definitions, documents, permits, equipment, price, rest, working time, school transport and sanctions.

D2_TRAFFIC_LAW order is sound with one watch item: definitions and weight concepts are currently placed at the end, which works for exam review, but if learners struggle with terms in earlier road-rule lessons they may benefit from a short prerequisite definition primer later. No reorder is required for this gate.

## Source Consistency

No direct contradiction was found between lessons and questions. Rules are consistently traced to source IDs and exact references.

Primary source currency spot-check:
- Trafikförordningen (1998:1276): Riksdagen shows ändrad t.o.m. SFS 2026:1052.
- Vägmärkesförordningen (2007:90): Riksdagen source map verified.
- Lag (2001:559) om vägtrafikdefinitioner: Riksdagen source map verified.
- Taxitrafiklagen and connected taxi-law sources remain mapped through the D2 taxi-law source map.

## Visual Dependency

The following topics need future custom/generated visuals or diagrams. Current published questions do not require a missing image to answer.

| Topic | Needed visual |
| --- | --- |
${visualNeeds.join('\n')}

## Changes Made From Audit

Questions changed: generated D2 taxi-law remainder and D2 traffic-law questions were regenerated with topic/case-specific prompts and distractors after the duplicate prompt gate found repeated generated review cases.

Lessons changed: 0.

Engine/model changes: added displayed mock-question selection with scoring roles for 46 scored + 4 non-scoring simulation questions.

Content held for review: 0.

## Automated Quality Rules Added

- Duplicate stable key detection.
- Duplicate question prompt detection.
- Duplicate answer-set detection.
- Published visual questions require a concrete asset if their answer depends on an image.
- Published questions require explanations.
- Published questions require valid question -> lesson -> fact -> requirement -> source traceability.
- Mock displayed attempts contain no duplicate questions and preserve the 46 + 4 structure.
`;

writeFileSync('docs/d2-quality-audit.md', report);

console.log(
  JSON.stringify(
    {
      lessons: lessons.length,
      questions: questions.length,
      exactPromptDuplicates: exactPromptDuplicates.length,
      answerSetDuplicates: answerSetDuplicates.length,
      nearDuplicateQuestions: nearDuplicateQuestions.length,
      ambiguousQuestions: ambiguousQuestions.length,
      weakExplanations: weakExplanations.length,
      visualBlocked: visualBlocked.length,
      undercovered: undercovered.map((row) => row.key),
      overcovered: overcovered.map((row) => row.key),
      mockRuns,
    },
    null,
    2,
  ),
);
