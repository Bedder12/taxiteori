import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  getRuntimeMetadataRepository,
  loadRuntimeLessonRepository,
  loadRuntimeQuestionRepository,
} from '../src/runtimeRepository';

const root = resolve(__dirname, '../../../../');

const activeRouteFiles = [
  'src/app/index.tsx',
  'src/app/plugga.tsx',
  'src/app/prov/index.tsx',
  'src/app/teoribok.tsx',
  'src/app/profil.tsx',
  'src/app/subject/[subjectId].tsx',
  'src/app/topic/[topicId].tsx',
  'src/app/lesson/[lessonId].tsx',
  'src/app/quiz/[assessmentId].tsx',
  'src/app/exam/[examId].tsx',
  'src/app/exam/[examId]/mock.tsx',
  'src/app/result/[attemptId].tsx',
  'src/app/module/[subjectId].tsx',
] as const;

function read(relativePath: string) {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

function appFiles(directory = 'src/app') {
  const result: string[] = [];
  function visit(relativeDirectory: string) {
    for (const entry of readdirSync(resolve(root, relativeDirectory), { withFileTypes: true })) {
      const relativePath = `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) visit(relativePath);
      else if (entry.name.endsWith('.tsx')) result.push(relativePath);
    }
  }
  visit(directory);
  return result;
}

export function testRealDataUiActiveRoutesAvoidMockDataDependencies() {
  const bannedImports = [
    '@/lib/learningStore',
    '../../src/lib/learningStore',
    'demoData',
    'mockData',
    'exampleData',
    'fixture',
    'packages/domain/src/vilotiderRepository',
    'loadRuntimeRepository',
  ];

  for (const file of appFiles()) {
    const source = read(file);
    for (const banned of bannedImports) {
      assert.ok(!source.includes(banned), `${file} depends on prototype or aggregate data through ${banned}.`);
    }
  }
}

export function testRealDataUiRoutesLoadOnlyRequiredContentScopes() {
  const routeLoaders: Record<string, string[]> = {
    'src/app/index.tsx': [],
    'src/app/plugga.tsx': [],
    'src/app/exam/[examId].tsx': [],
    'src/app/subject/[subjectId].tsx': [],
    'src/app/topic/[topicId].tsx': [],
    'src/app/lesson/[lessonId].tsx': ['loadRuntimeLessonRepository'],
    'src/app/module/[subjectId].tsx': ['loadRuntimeLessonRepository'],
    'src/app/quiz/[assessmentId].tsx': ['loadRuntimeQuestionRepository'],
    'src/app/exam/[examId]/mock.tsx': ['loadRuntimeQuestionRepository'],
    'src/app/result/[attemptId].tsx': ['loadRuntimeQuestionRepository'],
    'src/app/prov/index.tsx': [],
    'src/app/teoribok.tsx': [],
    'src/app/profil.tsx': [],
  };

  for (const [file, expectedLoaders] of Object.entries(routeLoaders)) {
    const source = read(file);
    for (const loader of ['loadRuntimeRepository', 'loadRuntimeQuestionRepository', 'loadRuntimeLessonRepository']) {
      assert.equal(source.includes(loader), expectedLoaders.includes(loader), `${file} must ${expectedLoaders.includes(loader) ? '' : 'not '}use ${loader}.`);
    }
    assert.ok(!source.includes('visual-manifest.json'), `${file} must not import the complete visual manifest.`);
    assert.ok(!source.includes('assets/visuals/'), `${file} must not import the complete SVG asset set.`);
  }

  const startup = read('src/app/_layout.tsx');
  assert.ok(startup.includes('void hydrateRuntimeState()'), 'App startup must hydrate progress without awaiting authored content.');
  assert.ok(!startup.includes('loadRuntimeRepository'), 'App startup must not load authored content.');

  const mockRoute = read('src/app/exam/[examId]/mock.tsx');
  assert.match(mockRoute, /useState<number>\(\)/, 'Mock timer must remain uninitialized until the active attempt has loaded.');
  assert.match(mockRoute, /if \(!attempt \|\| remainingSeconds !== 0\) return;/, 'Mock timeout must wait for the loaded attempt timer.');
}

export async function testRealDataUiQuestionAndLessonLoadersStayExamAndSubjectScoped() {
  const metadata = getRuntimeMetadataRepository();
  assert.equal(metadata.questionVersions.length, 0, 'Startup metadata must not instantiate question-bank objects.');
  assert.ok(metadata.lessons.every((lesson) => lesson.blocks.length === 0), 'Startup metadata must not instantiate lesson bodies.');
  const d1SubjectIds = metadata.subjects.filter((subject) => metadata.exams.find((exam) => exam.id === subject.examId)?.code === 'D1').map((subject) => subject.id);
  const d2SubjectIds = metadata.subjects.filter((subject) => metadata.exams.find((exam) => exam.id === subject.examId)?.code === 'D2').map((subject) => subject.id);
  const taxiSubjectId = 'subject_d2_taxitrafiklagstiftning';
  const trafficSubjectId = 'subject_d2_trafiklagstiftning';

  const [d1, d2, taxi, taxiLessons] = await Promise.all([
    loadRuntimeQuestionRepository(d1SubjectIds),
    loadRuntimeQuestionRepository(d2SubjectIds),
    loadRuntimeQuestionRepository([taxiSubjectId]),
    loadRuntimeLessonRepository([taxiSubjectId]),
  ]);

  assert.equal(d1.questionVersions.length, 503);
  assert.ok(d1.questionVersions.every((question) => d1SubjectIds.includes(question.subjectId)));
  assert.ok(d1.questionVersions.every((question) => !question.subjectId.startsWith('subject_d2_')));

  assert.equal(d2.questionVersions.length, 321);
  assert.ok(d2.questionVersions.every((question) => d2SubjectIds.includes(question.subjectId)));
  assert.ok(d2.questionVersions.every((question) => !question.subjectId.startsWith('subject_d1_')));

  assert.equal(taxi.questionVersions.length, 192);
  assert.ok(taxi.questionVersions.every((question) => question.subjectId === taxiSubjectId));
  assert.equal(taxi.lessons.every((lesson) => lesson.blocks.length === 0), true);
  assert.ok(!('visuals' in taxi));

  assert.ok(taxiLessons.lessons.length > 0);
  assert.equal(taxiLessons.questionVersions.length, 0);
  assert.ok(taxiLessons.lessons.every((lesson) => lesson.blocks.length > 0));
  assert.ok(taxiLessons.lessons.every((lesson) => taxi.topics.some((topic) => topic.id === lesson.topicId)));
  assert.ok(!('visuals' in taxiLessons));
}

export function testRealDataUiActiveRoutesAvoidPrototypeLiterals() {
  const bannedLiterals = [
    'Bedder',
    'Bedder M.',
    '68%',
    '61%',
    '43%',
    'Sparat',
    'prenumeration',
  ];

  for (const file of activeRouteFiles) {
    const source = read(file);
    for (const literal of bannedLiterals) {
      assert.ok(!source.includes(literal), `${file} contains prototype literal ${literal}.`);
    }
  }
}

export function testRealDataUiLearningPathsMatchRuntimeCurriculum() {
  const repository = getRuntimeMetadataRepository();
  const d1Exam = repository.exams.find((exam) => exam.code === 'D1');
  const d2Exam = repository.exams.find((exam) => exam.code === 'D2');
  assert.ok(d1Exam);
  assert.ok(d2Exam);

  const d1Subjects = repository.subjects
    .filter((subject) => subject.examId === d1Exam!.id && subject.status === 'published')
    .sort((left, right) => left.order - right.order)
    .map((subject) => subject.title);
  const d2Subjects = repository.subjects
    .filter((subject) => subject.examId === d2Exam!.id && subject.status === 'published')
    .sort((left, right) => left.order - right.order)
    .map((subject) => subject.title);

  assert.deepEqual(d1Subjects, [
    'Navigering',
    'Körekonomi',
    'Miljö',
    'Säkerhet',
    'Bemötande',
    'Sjukdomar och funktionsnedsättningar',
    'Arbetsmiljö, omdömesförmåga och riskmedvetenhet',
    'Fordonskännedom',
  ]);
  assert.deepEqual(d2Subjects, ['Taxitrafiklagstiftning', 'Trafiklagstiftning']);
}

export function testRealDataUiTeoribokenUsesCanonicalRuntimeContent() {
  const source = read('src/app/teoribok.tsx');
  assert.ok(source.includes('getRuntimeMetadataRepository'), 'Teoriboken must read canonical runtime metadata.');
  assert.ok(source.includes('repository.topics'), 'Teoriboken must derive chapters from canonical topics.');
  assert.ok(source.includes('repository.lessons'), 'Teoriboken must derive lesson counts from canonical lessons.');
  assert.ok(source.includes('lessonTitles'), 'Teoriboken search should use indexed lesson titles.');
  assert.ok(!source.includes('loadRuntimeLessonRepository'), 'Teoriboken search must not load lesson bodies.');
  assert.ok(!source.includes('loadRuntimeQuestionRepository'), 'Teoriboken search must not load question banks.');
  assert.ok(!source.includes('const chapters = ['), 'Teoriboken must not maintain a separate chapter copy.');
}

export function testRealDataUiExamScreensReadCanonicalBlueprints() {
  for (const file of ['src/app/prov/index.tsx', 'src/app/exam/[examId]/mock.tsx']) {
    const source = read(file);
    assert.ok(source.includes('repository.examBlueprints'), `${file} must read domain blueprints.`);
    assert.ok(!source.includes('65 scoring'), `${file} must not duplicate D1 scoring copy.`);
    assert.ok(!source.includes('46 scoring'), `${file} must not duplicate D2 scoring copy.`);
    assert.ok(!source.includes('50 min'), `${file} must not hardcode the mock duration.`);
  }
}

export function testRealDataUiResultUsesAttemptAndTraceability() {
  const source = read('src/app/result/[attemptId].tsx');
  assert.ok(source.includes('getAttemptReview'), 'Result must resolve the finalized attempt review.');
  assert.ok(source.includes('getRevisitRecommendations'), 'Result must derive revisit recommendations from wrong answers.');
  assert.ok(!source.includes('Vilotider'), 'Result must not hardcode one revisit topic.');
}
