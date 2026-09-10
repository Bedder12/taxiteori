import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const subjectDirectories = [
  ['D1_NAVIGATION', 'exam_d1_sakerhet_beteende', 'subject_d1_navigation', 'd1-navigation'],
  ['D1_ECO_DRIVING', 'exam_d1_sakerhet_beteende', 'subject_d1_korekonomi', 'd1-eco-driving'],
  ['D1_ENVIRONMENT', 'exam_d1_sakerhet_beteende', 'subject_d1_miljo', 'd1-environment'],
  ['D1_VEHICLE_KNOWLEDGE', 'exam_d1_sakerhet_beteende', 'subject_d1_fordonskannedom', 'd1-vehicle-knowledge'],
  ['D1_SAFETY', 'exam_d1_sakerhet_beteende', 'subject_d1_sakerhet', 'd1-safety'],
  ['D1_SERVICE', 'exam_d1_sakerhet_beteende', 'subject_d1_bemotande', 'd1-service'],
  ['D1_HEALTH_DISABILITIES', 'exam_d1_sakerhet_beteende', 'subject_d1_sjukdomar', 'd1-health-disabilities'],
  ['D1_WORK_ENVIRONMENT_RISK', 'exam_d1_sakerhet_beteende', 'subject_d1_arbetsmiljo', 'd1-work-environment-risk'],
  ['D2_TAXI_LAW', 'exam_d2_lagstiftning', 'subject_d2_taxitrafiklagstiftning', 'd2-taxi-law'],
  ['D2_TRAFFIC_LAW', 'exam_d2_lagstiftning', 'subject_d2_trafiklagstiftning', 'd2-traffic-law'],
];

const files = (directory, pattern) => readdirSync(directory).filter((name) => name.endsWith(pattern));
const lessonsFor = (directory) => files(join('data/content', directory), '-lessons.json').flatMap((name) => JSON.parse(readFileSync(join('data/content', directory, name), 'utf8')).lessons);
const questionDocsFor = (directory) => files(join('data/questions', directory), '-questions.json').map((name) => JSON.parse(readFileSync(join('data/questions', directory, name), 'utf8')));

const titles = { D1_NAVIGATION: 'Navigering', D1_ECO_DRIVING: 'Körekonomi', D1_ENVIRONMENT: 'Miljö', D1_VEHICLE_KNOWLEDGE: 'Fordonskännedom', D1_SAFETY: 'Säkerhet', D1_SERVICE: 'Bemötande', D1_HEALTH_DISABILITIES: 'Sjukdomar och funktionsnedsättningar', D1_WORK_ENVIRONMENT_RISK: 'Arbetsmiljö, omdöme och riskmedvetenhet', D2_TAXI_LAW: 'Taxitrafiklagstiftning', D2_TRAFFIC_LAW: 'Trafiklagstiftning' };
const subjects = subjectDirectories.map(([key, examId, subjectId], index) => ({ id: subjectId, examId, title: titles[key], officialQuestionCount: { D1_NAVIGATION: 10, D1_ECO_DRIVING: 6, D1_ENVIRONMENT: 6, D1_VEHICLE_KNOWLEDGE: 7, D1_SAFETY: 10, D1_SERVICE: 12, D1_HEALTH_DISABILITIES: 8, D1_WORK_ENVIRONMENT_RISK: 6, D2_TAXI_LAW: 23, D2_TRAFFIC_LAW: 23 }[key], order: index + 1, status: 'published' }));
const topics = [];
const lessons = [];
const assessments = [];
for (const [key, examId, subjectId, directory] of subjectDirectories) {
  const subjectLessons = lessonsFor(directory);
  subjectLessons.forEach((lesson, index) => {
    topics.push({ id: lesson.topic_id, subjectId, title: lesson.title, order: index + 1, status: lesson.status });
    lessons.push({ stableKey: lesson.stable_key, topicId: lesson.topic_id, title: lesson.title, order: index + 1, status: lesson.status, sourceIds: lesson.source_references?.map((source) => source.source_id) ?? [], requirementKeys: lesson.requirement_keys ?? [], factKeys: lesson.fact_keys ?? [], estimatedStudyTimeMinutes: lesson.estimated_study_time_minutes, summary: lesson.summary, prerequisiteLessonKeys: lesson.prerequisite_lesson_keys });
  });
  for (const document of questionDocsFor(directory)) {
    for (const checkpoint of document.topic_checkpoints ?? []) assessments.push({ id: checkpoint.stable_key, type: 'checkpoint', title: checkpoint.title, subjectId, topicId: checkpoint.topic, questionCount: checkpoint.question_count, passThreshold: checkpoint.pass_threshold, status: checkpoint.status });
    if (document.subject_checkpoint) assessments.push({ id: document.subject_checkpoint.stable_key, type: 'checkpoint', title: document.subject_checkpoint.title, subjectId, questionCount: document.subject_checkpoint.question_count, passThreshold: document.subject_checkpoint.pass_threshold, status: document.subject_checkpoint.status });
  }
}

writeFileSync('data/runtime-learning-metadata.json', `${JSON.stringify({ course: { id: 'course_taxiforarlegitimation', title: 'Taxiförarlegitimation', status: 'published' }, exams: [{ id: 'exam_d1_sakerhet_beteende', courseId: 'course_taxiforarlegitimation', code: 'D1', title: 'Delprov 1 - Säkerhet och beteende', order: 1, status: 'published' }, { id: 'exam_d2_lagstiftning', courseId: 'course_taxiforarlegitimation', code: 'D2', title: 'Delprov 2 - Lagstiftning', order: 2, status: 'published' }], subjects, topics, lessons, assessments }, null, 2)}\n`);
console.log(`Wrote metadata for ${subjects.length} subjects, ${topics.length} topics and ${lessons.length} lessons.`);