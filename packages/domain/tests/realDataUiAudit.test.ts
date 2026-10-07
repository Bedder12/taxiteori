import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getRuntimeMetadataRepository } from '../src/runtimeRepository';

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
  ];

  for (const file of appFiles()) {
    const source = read(file);
    for (const banned of bannedImports) {
      assert.ok(!source.includes(banned), `${file} depends on prototype or aggregate data through ${banned}.`);
    }
  }
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
