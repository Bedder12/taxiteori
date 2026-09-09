import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Curriculum = {
  sources: { stable_key: string; document_reference: string }[];
  exams: {
    stable_key: string;
    scoring_question_count: number;
    passing_score: number;
    non_scoring_test_question_count: number;
    total_displayed_question_count: number;
    time_limit_seconds: number;
  }[];
  subjects: {
    stable_key: string;
    exam: string;
    official_question_count: number;
    source_reference: string;
    active: boolean;
  }[];
  topics: { stable_key: string; subject: string; source_sections: string[] }[];
  requirements: {
    stable_key: string;
    subject: string;
    source: string;
    official_reference: string;
    legal_status: string;
    topic: string;
    active: boolean;
  }[];
};

function loadCurriculum() {
  const path = resolve(__dirname, '../../../../data/curriculum/requirements.json');
  return JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, '')) as Curriculum;
}

export function testTwoMainExamsExist() {
  const curriculum = loadCurriculum();
  assert.equal(curriculum.exams.length, 2);
}

export function testOfficialSubjectCounts() {
  const curriculum = loadCurriculum();
  assert.equal(curriculum.subjects.length, 10);
  assert.equal(curriculum.subjects.filter((subject) => subject.exam === 'D1').length, 8);
  assert.equal(curriculum.subjects.filter((subject) => subject.exam === 'D2').length, 2);
}

export function testBlueprintSums() {
  const curriculum = loadCurriculum();
  const d1 = curriculum.exams.find((exam) => exam.stable_key === 'D1');
  const d2 = curriculum.exams.find((exam) => exam.stable_key === 'D2');
  assert.ok(d1);
  assert.ok(d2);
  assert.equal(curriculum.subjects.filter((subject) => subject.exam === 'D1').reduce((sum, subject) => sum + subject.official_question_count, 0), 65);
  assert.equal(curriculum.subjects.filter((subject) => subject.exam === 'D2').reduce((sum, subject) => sum + subject.official_question_count, 0), 46);
  assert.equal(d1!.scoring_question_count + d1!.non_scoring_test_question_count, d1!.total_displayed_question_count);
  assert.equal(d2!.scoring_question_count + d2!.non_scoring_test_question_count, d2!.total_displayed_question_count);
  assert.equal(d1!.time_limit_seconds, 3000);
  assert.equal(d2!.time_limit_seconds, 3000);
}

export function testActiveSubjectsHaveRequirements() {
  const curriculum = loadCurriculum();
  for (const subject of curriculum.subjects.filter((candidate) => candidate.active)) {
    assert.ok(
      curriculum.requirements.some((requirement) => requirement.active && requirement.subject === subject.stable_key),
      `Active subject ${subject.stable_key} has no active requirement.`,
    );
  }
}

export function testRequirementsHaveSourceSubjectTopicAndReference() {
  const curriculum = loadCurriculum();
  const sourceKeys = new Set(curriculum.sources.map((source) => source.stable_key));
  const subjectKeys = new Set(curriculum.subjects.map((subject) => subject.stable_key));
  const topicKeys = new Set(curriculum.topics.map((topic) => topic.stable_key));

  for (const requirement of curriculum.requirements.filter((candidate) => candidate.active)) {
    assert.ok(sourceKeys.has(requirement.source), `Requirement ${requirement.stable_key} has unknown source.`);
    assert.ok(subjectKeys.has(requirement.subject), `Requirement ${requirement.stable_key} has unknown subject.`);
    assert.ok(topicKeys.has(requirement.topic), `Requirement ${requirement.stable_key} has unknown topic.`);
    assert.ok(requirement.official_reference.trim().length > 0, `Requirement ${requirement.stable_key} has no official reference.`);
  }
}

export function testLawAndGeneralAdviceAreDistinguishable() {
  const curriculum = loadCurriculum();
  assert.ok(curriculum.requirements.some((requirement) => requirement.legal_status === 'binding_rule'));
  assert.ok(curriculum.requirements.some((requirement) => requirement.legal_status === 'general_advice'));
}

export function testStableKeysAreUnique() {
  const curriculum = loadCurriculum();
  const requirementKeys = curriculum.requirements.map((requirement) => requirement.stable_key);
  const topicKeys = curriculum.topics.map((topic) => topic.stable_key);
  assert.equal(new Set(requirementKeys).size, requirementKeys.length, 'Requirement stable keys must be unique.');
  assert.equal(new Set(topicKeys).size, topicKeys.length, 'Topic stable keys must be unique.');
}

export function testChapterThreeSectionsAreRepresented() {
  const curriculum = loadCurriculum();
  const references = curriculum.requirements.map((requirement) => requirement.official_reference).join('\n');
  for (let section = 2; section <= 35; section += 1) {
    assert.match(references, new RegExp(`3 kap\\. ${section} §`), `3 kap. ${section} § is not represented.`);
  }
}
