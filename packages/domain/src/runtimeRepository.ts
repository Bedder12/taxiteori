import metadata from '../../../data/runtime-learning-metadata.json';
import { loadSubjectContent } from './contentLoader';
import type { Assessment, ContentBlock, Course, ExamBlueprint, LearningRepository, Lesson, QuestionVersion, Source, Subject, Topic } from './types';

type Raw = any;

const subjectKeyById: Record<string, string> = {
  subject_d1_navigation: 'D1_NAVIGATION',
  subject_d1_korekonomi: 'D1_ECO_DRIVING',
  subject_d1_miljo: 'D1_ENVIRONMENT',
  subject_d1_fordonskannedom: 'D1_VEHICLE_KNOWLEDGE',
  subject_d1_sakerhet: 'D1_SAFETY',
  subject_d1_bemotande: 'D1_SERVICE',
  subject_d1_sjukdomar: 'D1_HEALTH_DISABILITIES',
  subject_d1_arbetsmiljo: 'D1_WORK_ENVIRONMENT_RISK',
  subject_d2_taxitrafiklagstiftning: 'D2_TAXI_LAW',
  subject_d2_trafiklagstiftning: 'D2_TRAFFIC_LAW',
};

const subjects = metadata.subjects as Subject[];
const topics = metadata.topics as Topic[];
const assessments = metadata.assessments as Assessment[];
const course = metadata.course as Course;
const exams = metadata.exams as LearningRepository['exams'];
const metadataLessons: Lesson[] = (metadata.lessons as any[]).map((lesson) => ({ id: lesson.stableKey, topicId: lesson.topicId, title: lesson.title, order: lesson.order, status: lesson.status, blocks: [], sourceIds: lesson.sourceIds, requirementKeys: lesson.requirementKeys, factKeys: lesson.factKeys, estimatedStudyTimeMinutes: lesson.estimatedStudyTimeMinutes, summary: lesson.summary, prerequisiteLessonKeys: lesson.prerequisiteLessonKeys }));

function toBlock(block: Raw): ContentBlock {
  if (block.type === 'bullet_list') return { type: 'bullet_list', items: block.items ?? [], factKeys: block.fact_keys };
  if (block.type === 'image') return { type: 'image', mediaId: block.media_id ?? block.visual_asset_id ?? '', alt: block.alt ?? '', factKeys: block.fact_keys };
  if (block.type === 'video_ref') return { type: 'video_ref', mediaId: block.media_id ?? '', factKeys: block.fact_keys };
  if (block.type === 'worked_example') return { type: 'worked_example', title: block.title ?? '', timeline: block.timeline ?? [], reasoning: block.reasoning ?? '', finalAnswer: block.final_answer ?? '', factKeys: block.fact_keys };
  return { type: block.type as ContentBlock['type'], text: block.text ?? '', factKeys: block.fact_keys } as ContentBlock;
}

function toLesson(raw: Raw, subjectLessonOrder: number): Lesson {
  return {
    id: raw.stable_key,
    topicId: raw.topic_id,
    title: raw.title,
    order: subjectLessonOrder,
    status: raw.status,
    blocks: (raw.content_blocks ?? []).map(toBlock),
    sourceIds: (raw.source_references ?? []).map((source: Raw) => source.source_id),
    requirementKeys: raw.requirement_keys,
    factKeys: raw.fact_keys,
    estimatedStudyTimeMinutes: raw.estimated_study_time_minutes,
    summary: raw.summary,
    prerequisiteLessonKeys: raw.prerequisite_lesson_keys,
    visualMetadata: raw.visual_metadata,
  };
}

function toQuestion(raw: Raw, reviewedAt?: string): QuestionVersion {
  return {
    id: raw.stable_key.toLowerCase() + `_v${raw.version}`,
    questionId: raw.stable_key.toLowerCase(),
    stableKey: raw.stable_key,
    version: raw.version,
    examId: raw.topic_id.startsWith('topic_d1_') ? 'exam_d1_sakerhet_beteende' : 'exam_d2_lagstiftning',
    subjectId: subjectIdForTopic(raw.topic_id),
    topicId: raw.topic_id,
    lessonId: raw.lesson_key,
    type: raw.question_type,
    contexts: ['checkpoint', 'practice', 'assessment'],
    prompt: raw.prompt,
    choices: raw.answer_choices,
    correctChoiceId: raw.correct_answer_id,
    explanation: raw.explanation,
    difficulty: raw.difficulty,
    sourceIds: (raw.source_references ?? []).map((source: Raw) => source.source_id),
    requirementKeys: raw.requirement_keys,
    factKeys: raw.fact_keys,
    sourceReferences: raw.source_references?.map((source: Raw) => ({ sourceId: source.source_id, exactReference: source.exact_reference })),
    visualMetadata: raw.visual_metadata,
    status: raw.status,
    createdAt: raw.created_at ?? '2026-09-10T00:00:00.000Z',
    reviewedAt,
  };
}

function subjectIdForTopic(topicId: string) {
  const topic = topics.find((candidate) => candidate.id === topicId);
  return topic?.subjectId ?? (topicId.startsWith('topic_d1_') ? 'subject_d1_navigation' : 'subject_d2_taxitrafiklagstiftning');
}

function blueprints(): ExamBlueprint[] {
  const d1Subjects: [string, number][] = [['subject_d1_navigation', 10], ['subject_d1_korekonomi', 6], ['subject_d1_miljo', 6], ['subject_d1_sakerhet', 10], ['subject_d1_bemotande', 12], ['subject_d1_sjukdomar', 8], ['subject_d1_arbetsmiljo', 6], ['subject_d1_fordonskannedom', 7]];
  const d2Subjects: [string, number][] = [['subject_d2_taxitrafiklagstiftning', 23], ['subject_d2_trafiklagstiftning', 23]];
  const make = (id: string, examId: string, subjectsForBlueprint: [string, number][], scoring: number, passing: number, simulations: number, label: string): ExamBlueprint => ({
    id, examId, name: label, type: 'mock_exam', version: 1, status: 'published', passThreshold: passing / scoring, passingScore: passing, scoringQuestionCount: scoring, nonScoringTestQuestionCount: simulations, totalDisplayedQuestionCount: scoring + simulations, timeLimitSeconds: 3000, label, disclaimer: 'Internal training questions, not an official Trafikverket question bank.', active: true,
    subjects: subjectsForBlueprint.map(([subjectId, questionCount]) => ({ id: `${id}_${subjectId}`, examBlueprintId: id, subjectId, questionCount: Number(questionCount) })),
  });
  return [make('blueprint_d1_realistic_full_mock_v1', 'exam_d1_sakerhet_beteende', d1Subjects, 65, 48, 5, 'Realistiskt D1 övningsprov'), make('blueprint_d2_realistic_full_mock_v1', 'exam_d2_lagstiftning', d2Subjects, 46, 34, 4, 'Realistiskt D2 övningsprov')];
}

export function getRuntimeMetadataRepository(): LearningRepository {
  return { course, exams, subjects, topics, lessons: metadataLessons, sources: [], questionVersions: [], examBlueprints: blueprints(), assessments, };
}

export async function loadRuntimeRepository(subjectIds: string[] = []) {
  const selectedSubjects = subjectIds.length ? subjectIds : subjects.map((subject) => subject.id);
  const selectedKeys = selectedSubjects.map((subjectId) => subjectKeyById[subjectId]).filter(Boolean);
  const loaded = await Promise.all(selectedKeys.map(async (key) => [key, await loadSubjectContent(key)] as const));
  const contentByKey = new Map(loaded);
  const selected = new Set(selectedSubjects);
  const lessons: Lesson[] = [];
  const questionVersions: QuestionVersion[] = [];
  const sources: Source[] = [];

  for (const subjectId of selectedSubjects) {
    const key = subjectKeyById[subjectId];
    const content = contentByKey.get(key) as Raw | undefined;
    if (!content) continue;
    const subjectLessons = (content.lessons.lessons ?? []).map((lesson: Raw, index: number) => toLesson(lesson, index + 1));
    lessons.push(...subjectLessons);
    questionVersions.push(...(content.questions.questions ?? []).map((question: Raw) => toQuestion(question, content.questions.metadata?.reviewed_at)));
    for (const source of content.facts.sources ?? []) sources.push({ id: source.source_id, title: source.source_title, organization: source.authority, url: source.url, documentReference: source.current_validity, status: 'published' });
  }
  const selectedTopics = topics.filter((topic) => selected.has(topic.subjectId));
  const selectedAssessments = assessments.filter((assessment) => selected.has(assessment.subjectId ?? ''));
  return { course, exams, subjects, topics: selectedTopics, lessons, sources: [...new Map(sources.map((source) => [source.id, source])).values()], questionVersions, examBlueprints: blueprints(), assessments: selectedAssessments } satisfies LearningRepository;
}

export function subjectIdForKey(key: string) {
  return Object.entries(subjectKeyById).find(([, value]) => value === key)?.[0];
}