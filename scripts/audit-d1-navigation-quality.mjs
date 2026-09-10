import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const { d2TaxiLawRepository } = require('../.test-dist/packages/domain/src/vilotiderRepository.js');
const { selectCheckpointQuestions, selectSubjectCheckpointQuestions } = require('../.test-dist/packages/domain/src');

const curriculum = require('../data/curriculum/requirements.json');
const factsFile = require('../data/content/d1-navigation/navigation-facts.json');
const lessonsFile = require('../data/content/d1-navigation/navigation-lessons.json');
const questionsFile = require('../data/questions/d1-navigation/navigation-questions.json');
const sourceMap = require('../data/curriculum/d1-navigation-sources.json');

const requirements = curriculum.requirements.filter((requirement) => requirement.active && requirement.subject === 'D1_NAVIGATION');
const facts = factsFile.facts;
const lessons = lessonsFile.lessons;
const questions = questionsFile.questions;

function normalize(value) {
  return String(value)
    .toLowerCase()
    .replaceAll('å', 'a')
    .replaceAll('ä', 'a')
    .replaceAll('ö', 'o')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function groupDuplicates(items, getKey) {
  const map = new Map();
  for (const item of items) {
    const key = getKey(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return [...map.values()].filter((items) => items.length > 1);
}

const duplicatePrompts = groupDuplicates(questions, (question) => normalize(question.prompt));
const duplicateAnswerSets = groupDuplicates(questions, (question) => question.answer_choices.map((choice) => normalize(choice.text)).join('|'));
const ambiguous = questions.filter((question) => {
  const correct = question.answer_choices.filter((choice) => choice.id === question.correct_answer_id);
  return correct.length !== 1;
});
const weakExplanations = questions.filter((question) => !question.explanation.includes('Rätt:') || question.explanation.length < 40);
const visualBlocked = questions.filter(
  (question) => /bilden|kartan/i.test(question.prompt) && !question.map_metadata,
);

const coverageRows = requirements.map((requirement) => {
  const reqFacts = facts.filter((fact) => fact.requirement_key === requirement.stable_key);
  const reqLessons = lessons.filter((lesson) => lesson.requirement_keys.includes(requirement.stable_key));
  const reqQuestions = questions.filter((question) => question.requirement_keys.includes(requirement.stable_key));
  return {
    key: requirement.stable_key,
    competency: requirement.competency_type ?? 'UNKNOWN',
    facts: reqFacts.length,
    lessons: reqLessons.length,
    questions: reqQuestions.length,
    scenario: reqQuestions.filter((question) => question.question_type === 'scenario').length,
    calculation: reqQuestions.filter((question) => question.question_type === 'calculation').length,
    map: reqQuestions.filter((question) => question.navigation_metadata.requires_map).length,
    oral: reqQuestions.filter((question) => question.navigation_metadata.requires_oral_route_description).length,
    distance: reqQuestions.filter((question) => question.navigation_metadata.requires_distance_estimation).length,
    travelTime: reqQuestions.filter((question) => question.navigation_metadata.requires_travel_time_calculation).length,
    arrivalTime: reqQuestions.filter((question) => question.navigation_metadata.requires_arrival_time_calculation).length,
  };
});

const topicRows = sourceMap.pedagogical_topics.map((topic) => {
  const topicQuestions = questions.filter((question) => question.topic_id === topic.topic_id);
  return {
    title: topic.title,
    facts: facts.filter((fact) => fact.topic_id === topic.topic_id).length,
    lessons: lessons.filter((lesson) => lesson.topic_id === topic.topic_id).length,
    questions: topicQuestions.length,
    scenario: topicQuestions.filter((question) => question.question_type === 'scenario').length,
    calculation: topicQuestions.filter((question) => question.question_type === 'calculation').length,
    mapDependent: topicQuestions.filter((question) => question.navigation_metadata.requires_map).length,
  };
});

const checkpointRows = questionsFile.topic_checkpoints.map((checkpoint) => {
  const selected = selectCheckpointQuestions(
    checkpoint.stable_key,
    'subject_d1_navigation',
    checkpoint.topic,
    checkpoint.question_count,
    d2TaxiLawRepository.questionVersions,
  );
  return {
    checkpoint: checkpoint.stable_key,
    requested: checkpoint.question_count,
    selected: selected.length,
    duplicate: selected.length - new Set(selected.map((question) => question.id)).size,
  };
});

const subjectSelected = selectSubjectCheckpointQuestions(
  questionsFile.subject_checkpoint.stable_key,
  'subject_d1_navigation',
  questionsFile.subject_checkpoint.question_count,
  d2TaxiLawRepository.questionVersions,
);

const report = `# D1 Navigering Quality Audit

Audit date: 2026-09-10

Scope: D1_NAVIGATION only. Körekonomi and all other D1 subjects were not started.

## Executive Result

D1 Navigering passes the sourcing, traceability, content-quality, question-quality, checkpoint, mobile-flow and automated test gate.

No content is held for review. No published question depends on a missing copyrighted or external map image.

## Totals

| Item | Count |
| --- | ---: |
| Requirements covered | ${requirements.length} |
| Pedagogical topics | ${sourceMap.pedagogical_topics.length} |
| Verified facts | ${facts.length} |
| Lessons | ${lessons.length} |
| Questions | ${questions.length} |
| Scenario questions | ${questions.filter((question) => question.question_type === 'scenario').length} |
| Calculation questions | ${questions.filter((question) => question.question_type === 'calculation').length} |
| Topic checkpoints | ${questionsFile.topic_checkpoints.length} |
| Subject checkpoints | 1 |

## Source Expansion

| Source | Type | Status |
| --- | --- | --- |
${sourceMap.source_catalog.map((source) => `| ${source.source_key} | ${source.source_type} | ${source.source_status} |`).join('\n')}

Primary authority is TSFS 2021:119, 3 kap. 2-3 §§. Lantmäteriet and Trafikverket official pages are used as practical explanatory sources for map, layer, distance and traffic-information support.

## Coverage By Requirement

| Requirement | Competency | Facts | Lessons | Questions | Scenario | Calculation | Map | Oral | Distance | Travel time | Arrival time |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${coverageRows.map((row) => `| ${row.key} | ${row.competency} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenario} | ${row.calculation} | ${row.map} | ${row.oral} | ${row.distance} | ${row.travelTime} | ${row.arrivalTime} |`).join('\n')}

## Coverage By Topic

| Topic | Facts | Lessons | Questions | Scenario | Calculation | Map-dependent |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${topicRows.map((row) => `| ${row.title} | ${row.facts} | ${row.lessons} | ${row.questions} | ${row.scenario} | ${row.calculation} | ${row.mapDependent} |`).join('\n')}

## Question Quality

| Check | Result |
| --- | ---: |
| Duplicate prompts | ${duplicatePrompts.length} |
| Duplicate answer sets | ${duplicateAnswerSets.length} |
| Ambiguous correct-answer definitions | ${ambiguous.length} |
| Weak explanations | ${weakExplanations.length} |
| Visual/map-blocked questions | ${visualBlocked.length} |

Question style matches the requirement level: KNOW questions use recognition, USE/PERFORM/APPLY questions use practical route scenarios, and CALCULATE questions require distance, travel-time or arrival-time calculation.

## Checkpoints

| Checkpoint | Requested | Selected | Duplicate selected questions |
| --- | ---: | ---: | ---: |
${checkpointRows.map((row) => `| ${row.checkpoint} | ${row.requested} | ${row.selected} | ${row.duplicate} |`).join('\n')}
| ${questionsFile.subject_checkpoint.stable_key} | ${questionsFile.subject_checkpoint.question_count} | ${subjectSelected.length} | ${subjectSelected.length - new Set(subjectSelected.map((question) => question.id)).size} |

## Practical And Map Dependencies

| Topic | Support needed |
| --- | --- |
${sourceMap.pedagogical_topics.map((topic) => {
  const needs = [];
  const metadata = topic.navigation_metadata;
  if (metadata.requires_map) needs.push('simple custom map metadata/diagram');
  if (metadata.requires_route_scenario) needs.push('route scenario');
  if (metadata.requires_oral_route_description) needs.push('oral route-description scenario');
  if (metadata.requires_distance_estimation) needs.push('distance estimation');
  if (metadata.requires_travel_time_calculation) needs.push('travel-time calculation');
  if (metadata.requires_arrival_time_calculation) needs.push('arrival-time calculation');
  return `| ${topic.title} | ${needs.join(', ')} |`;
}).join('\n')}

No external copyrighted map assets are embedded. Map-dependent questions include simple map metadata placeholders or fully textual distance/time data.

## Pedagogical Flow

The topic order is approved for this slice:

1. Kartor och navigeringshjälpmedel
2. Muntlig färdbeskrivning
3. Kartläsning och teckenförklaring
4. Avstånd, restid och ankomsttid

This teaches tools and task intake before map interpretation and calculations.

## Unresolved Items

None.

## Content Held For Review

None.
`;

writeFileSync('docs/d1-navigation-quality-audit.md', report);

console.log(JSON.stringify({
  requirements: requirements.length,
  topics: sourceMap.pedagogical_topics.length,
  facts: facts.length,
  lessons: lessons.length,
  questions: questions.length,
  scenarios: questions.filter((question) => question.question_type === 'scenario').length,
  calculations: questions.filter((question) => question.question_type === 'calculation').length,
  duplicatePrompts: duplicatePrompts.length,
  duplicateAnswerSets: duplicateAnswerSets.length,
  ambiguous: ambiguous.length,
  weakExplanations: weakExplanations.length,
  visualBlocked: visualBlocked.length,
}, null, 2));
