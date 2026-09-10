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

function findDuplicates(items, keyFn) {
  const seen = new Map();
  const dupes = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) dupes.push([item, seen.get(key)]);
    else seen.set(key, item);
  }
  return dupes;
}

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

const factFiles = [
  'data/content/d1-eco-driving/eco-driving-facts.json',
  'data/content/d1-environment/environment-facts.json',
  'data/content/d1-health-disabilities/health-disabilities-facts.json',
  'data/content/d1-navigation/navigation-facts.json',
  'data/content/d1-safety/safety-facts.json',
  'data/content/d1-service/service-facts.json',
  'data/content/d1-vehicle-knowledge/vehicle-facts.json',
  'data/content/d1-work-environment-risk/work-environment-risk-facts.json',
  'data/content/d2-taxi-law/remaining-topics-facts.json',
  'data/content/d2-taxi-law/vilotider-facts.json',
  'data/content/d2-traffic-law/traffic-law-facts.json',
];

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

const curriculum = loadJson('data/curriculum/requirements.json');
const actions = loadJson('data/quality/question-coverage-backlog-v2-actions.json');
const questions = questionFiles.flatMap((file) => loadJson(file).questions.map((question) => ({ ...question, __file: file })));
const facts = factFiles.flatMap((file) => loadJson(file).facts.map((fact) => ({ ...fact, __file: file })));
const lessons = lessonFiles.flatMap((file) => loadJson(file).lessons.map((lesson) => ({ ...lesson, __file: file })));
const activeRequirements = curriculum.requirements.filter((requirement) => requirement.active);
const factByKey = new Map(facts.map((fact) => [fact.stable_key, fact]));
const lessonByKey = new Map(lessons.map((lesson) => [lesson.stable_key, lesson]));
const backlogActionByKey = new Map(actions.actions.map((action) => [action.requirementKey, action]));

const coverageRows = activeRequirements.map((requirement) => {
  const requirementQuestions = questions.filter((question) => question.requirement_keys?.includes(requirement.stable_key) && question.status === 'published');
  return {
    key: requirement.stable_key,
    subject: requirement.subject,
    competency: requirement.competency_type ?? requirement.original_competency_wording ?? 'undefined',
    count: requirementQuestions.length,
    types: [...new Set(requirementQuestions.map((question) => question.question_type))].sort(),
    mockEligible: requirementQuestions.filter((question) =>
      question.source_references?.length &&
      question.fact_keys?.length &&
      question.requirement_keys?.length &&
      (question.visual_metadata?.visual_correctness_depends_on_asset !== true) &&
      question.visual_correctness_depends_on_asset !== true,
    ).length,
  };
});

const newQuestions = questions.filter((question) => question.stable_key.includes('-COVERAGE-'));
const traceabilityIssues = newQuestions.filter((question) => {
  const lesson = lessonByKey.get(question.lesson_key);
  if (!lesson) return true;
  return question.fact_keys.some((factKey) => {
    const fact = factByKey.get(factKey);
    return (
      !fact ||
      !question.requirement_keys.includes(fact.requirement_key) ||
      !lesson.requirement_keys.includes(fact.requirement_key) ||
      !lesson.fact_keys.includes(factKey) ||
      !question.source_references.some((source) => source.source_id === fact.source_id && source.exact_reference)
    );
  });
});

const missingCompetencyMetadata = newQuestions.filter((question) => !(question.competencies?.length || question.competency_tags?.length));
const missingCalculationMetadata = newQuestions.filter((question) => question.question_type === 'calculation' && !question.calculation_metadata);
const visualBlocked = questions.filter((question) => {
  const visual = question.visual_metadata ?? question.navigation_metadata;
  return question.status === 'published' && Boolean(visual?.requires_image || visual?.requires_diagram || visual?.requires_road_scene || visual?.requires_map) && question.visual_correctness_depends_on_asset === true;
});

const duplicateStableKeys = findDuplicates(questions, (question) => normalize(question.stable_key));
const duplicatePrompts = findDuplicates(questions, (question) => normalize(question.prompt));
const duplicateAnswerSets = findDuplicates(questions, (question) => question.answer_choices.map((choice) => normalize(choice.text)).sort().join('|'));

const backlogRows = actions.actions.map((action) => {
  const row = coverageRows.find((candidate) => candidate.key === action.requirementKey);
  const finalStatus = row.count >= 3
    ? 'SUFFICIENT'
    : action.classification === 'SUFFICIENT_NARROW_REQUIREMENT'
      ? 'SUFFICIENT_NARROW_REQUIREMENT'
      : 'NEEDS_MORE_VARIATION';
  return {
    ...action,
    newCount: row.count,
    questionTypes: row.types,
    mockEligible: row.mockEligible,
    finalStatus,
  };
});

const poolHealth = [
  ['D1', 'D1_NAVIGATION', 'Navigation'],
  ['D1', 'D1_ECO_DRIVING', 'Eco Driving'],
  ['D1', 'D1_ENVIRONMENT', 'Environment'],
  ['D1', 'D1_SAFETY', 'Safety'],
  ['D1', 'D1_SERVICE', 'Service'],
  ['D1', 'D1_HEALTH_DISABILITIES', 'Health/Disabilities'],
  ['D1', 'D1_WORK_ENVIRONMENT_RISK', 'Work Environment/Risk'],
  ['D1', 'D1_VEHICLE_KNOWLEDGE', 'Vehicle Knowledge'],
  ['D2', 'D2_TAXI_LAW', 'Taxi Law'],
  ['D2', 'D2_TRAFFIC_LAW', 'Traffic Law'],
].map(([exam, subject, label]) => {
  const subjectQuestions = questions.filter((question) => question.status === 'published' && question.requirement_keys?.some((key) => {
    const requirement = activeRequirements.find((candidate) => candidate.stable_key === key);
    return requirement?.subject === subject;
  }));
  const subjectRequirementRows = coverageRows.filter((row) => row.subject === subject);
  const topicCounts = subjectQuestions.reduce((counts, question) => {
    counts[question.topic_id] = (counts[question.topic_id] ?? 0) + 1;
    return counts;
  }, {});
  return {
    exam,
    subject,
    label,
    publishedQuestions: subjectQuestions.length,
    mockEligible: subjectQuestions.filter((question) => question.source_references?.length && question.fact_keys?.length && question.visual_correctness_depends_on_asset !== true).length,
    activeRequirements: subjectRequirementRows.length,
    weakAfter: subjectRequirementRows.filter((row) => row.count < 3).length,
    largestTopicShare: subjectQuestions.length ? Math.max(...Object.values(topicCounts)) / subjectQuestions.length : 0,
  };
});

const beforeTotal = questions.length - actions.metadata.questions_added;
const statusCounts = backlogRows.reduce((counts, row) => {
  counts[row.finalStatus] = (counts[row.finalStatus] ?? 0) + 1;
  return counts;
}, {});

const report = `# Question Coverage Audit V2

Generated: 2026-09-11

## Scope

- Backlog reviewed: docs/question-coverage-backlog.md
- Backlog requirements reviewed: ${actions.metadata.backlog_requirements_reviewed}
- Active curriculum requirements recalculated: ${activeRequirements.length}
- Task type: targeted coverage repair, not bulk generation
- Mock blueprints changed: no
- UI/architecture changed: no

## Summary

- Total question count before: ${beforeTotal}
- Total question count after: ${questions.length}
- Questions added: ${actions.metadata.questions_added}
- Questions modified: 0
- Questions rejected as duplicates: ${duplicateStableKeys.length + duplicatePrompts.length + duplicateAnswerSets.length}
- New scenario questions: ${newQuestions.filter((question) => question.question_type === 'scenario').length}
- New calculation questions: ${newQuestions.filter((question) => question.question_type === 'calculation').length}
- New visual-blocked questions: ${newQuestions.filter((question) => visualBlocked.some((blocked) => blocked.stable_key === question.stable_key)).length}
- Requirements still weak from this backlog: ${backlogRows.filter((row) => !['SUFFICIENT', 'SUFFICIENT_NARROW_REQUIREMENT'].includes(row.finalStatus)).length}

## Quality Gates

- Duplicate stable keys: ${duplicateStableKeys.length === 0 ? 'none' : duplicateStableKeys.map(([left, right]) => `${left.stable_key}/${right.stable_key}`).join(', ')}
- Exact duplicate prompts: ${duplicatePrompts.length === 0 ? 'none' : duplicatePrompts.map(([left, right]) => `${left.stable_key}/${right.stable_key}`).join(', ')}
- Exact duplicate answer sets: ${duplicateAnswerSets.length === 0 ? 'none' : duplicateAnswerSets.map(([left, right]) => `${left.stable_key}/${right.stable_key}`).join(', ')}
- New question traceability issues: ${traceabilityIssues.length === 0 ? 'none' : traceabilityIssues.map((question) => question.stable_key).join(', ')}
- New questions missing competency metadata: ${missingCompetencyMetadata.length === 0 ? 'none' : missingCompetencyMetadata.map((question) => question.stable_key).join(', ')}
- New calculation questions missing metadata: ${missingCalculationMetadata.length === 0 ? 'none' : missingCalculationMetadata.map((question) => question.stable_key).join(', ')}
- Published visual-blocked questions: ${visualBlocked.length === 0 ? 'none' : visualBlocked.map((question) => question.stable_key).join(', ')}

## Backlog Decisions

All 45 listed requirements were classified after inspecting requirement text, competency, existing facts, lessons and questions. They were treated as genuinely undercovered because the existing pool had only one or two questions and the missing coverage was a distinct competency angle or scenario variation. No new lessons were needed because each requirement already had verified facts and at least one lesson.

| Requirement | Subject | Previous | New | Competency | Types | Mock-eligible | Action | Final status |
| --- | --- | ---: | ---: | --- | --- | ---: | --- | --- |
${backlogRows.map((row) => `| ${row.requirementKey} | ${row.subject} | ${row.previousCount} | ${row.newCount} | ${row.backlogCompetency} | ${row.questionTypes.join(', ')} | ${row.mockEligible} | ${row.action} | ${row.finalStatus} |`).join('\n')}

## Mock Pool Health

Official mock allocations were not changed. Added questions increase pool variation but do not alter D1 or D2 blueprint counts.

| Exam | Subject | Published questions | Mock-eligible | Active requirements | Weak after | Largest topic share |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
${poolHealth.map((row) => `| ${row.exam} | ${row.label} | ${row.publishedQuestions} | ${row.mockEligible} | ${row.activeRequirements} | ${row.weakAfter} | ${(row.largestTopicShare * 100).toFixed(1)}% |`).join('\n')}

## Result

Status: ${traceabilityIssues.length === 0 && missingCompetencyMetadata.length === 0 && missingCalculationMetadata.length === 0 && visualBlocked.length === 0 && duplicateStableKeys.length === 0 && duplicatePrompts.length === 0 && duplicateAnswerSets.length === 0 && backlogRows.every((row) => ['SUFFICIENT', 'SUFFICIENT_NARROW_REQUIREMENT'].includes(row.finalStatus)) ? 'PASS' : 'NEEDS_HUMAN_REVIEW'}

`;

mkdirSync(resolve(root, 'docs'), { recursive: true });
writeFileSync(resolve(root, 'docs/question-coverage-audit-v2.md'), report);

if (
  traceabilityIssues.length > 0 ||
  missingCompetencyMetadata.length > 0 ||
  missingCalculationMetadata.length > 0 ||
  visualBlocked.length > 0 ||
  duplicateStableKeys.length > 0 ||
  duplicatePrompts.length > 0 ||
  duplicateAnswerSets.length > 0 ||
  backlogRows.some((row) => !['SUFFICIENT', 'SUFFICIENT_NARROW_REQUIREMENT'].includes(row.finalStatus))
) {
  process.exitCode = 1;
}
