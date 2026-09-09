import curriculum from '../../../data/curriculum/requirements.json';
import factsContent from '../../../data/content/d2-taxi-law/vilotider-facts.json';
import lessonsContent from '../../../data/content/d2-taxi-law/vilotider-lessons.json';
import questionsContent from '../../../data/questions/d2-taxi-law/vilotider-questions.json';
import remainingFactsContent from '../../../data/content/d2-taxi-law/remaining-topics-facts.json';
import remainingLessonsContent from '../../../data/content/d2-taxi-law/remaining-topics-lessons.json';
import remainingQuestionsContent from '../../../data/questions/d2-taxi-law/remaining-topics-questions.json';
import trafficFactsContent from '../../../data/content/d2-traffic-law/traffic-law-facts.json';
import trafficLessonsContent from '../../../data/content/d2-traffic-law/traffic-law-lessons.json';
import trafficQuestionsContent from '../../../data/questions/d2-traffic-law/traffic-law-questions.json';
import type {
  Assessment,
  ContentBlock,
  Course,
  Exam,
  LearningRepository,
  Lesson,
  QuestionVersion,
  Source,
  Subject,
  Topic,
} from './types';

type RawBlock = {
  type: string;
  text?: string;
  items?: string[];
  title?: string;
  timeline?: string[];
  reasoning?: string;
  final_answer?: string;
  fact_keys?: string[];
};

type RawVisualMetadata = {
  requires_image?: boolean;
  requires_diagram?: boolean;
  requires_road_scene?: boolean;
};

const createdAt = '2026-09-09T00:00:00.000Z';

const course: Course = {
  id: 'course_taxiforarlegitimation',
  title: 'Taxiförarlegitimation',
  status: 'published',
};

const exams: Exam[] = [
  {
    id: 'exam_d1_sakerhet_beteende',
    courseId: course.id,
    code: 'D1',
    title: 'Delprov 1 - Säkerhet och beteende',
    order: 1,
    status: 'published',
  },
  {
    id: 'exam_d2_lagstiftning',
    courseId: course.id,
    code: 'D2',
    title: 'Delprov 2 - Lagstiftning',
    order: 2,
    status: 'published',
  },
];

const subjects: Subject[] = [
  { id: 'subject_d1_sakerhet_beteende', examId: 'exam_d1_sakerhet_beteende', title: 'Säkerhet och beteende', officialQuestionCount: 65, order: 1, status: 'draft' },
  { id: 'subject_d2_taxitrafiklagstiftning', examId: 'exam_d2_lagstiftning', title: 'Taxitrafiklagstiftning', officialQuestionCount: 23, order: 1, status: 'published' },
  { id: 'subject_d2_trafiklagstiftning', examId: 'exam_d2_lagstiftning', title: 'Trafiklagstiftning', officialQuestionCount: 23, order: 2, status: 'published' },
];

const topics: Topic[] = [
  {
    id: 'topic_d2_taxi_taxitrafikens_grunder',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Taxitrafikens grunder',
    order: 1,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_taxiforarlegitimation',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'TaxifÃ¶rarlegitimation',
    order: 2,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_aterkallelse',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Ã…terkallelse',
    order: 3,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_begrepp_definitioner',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Begrepp och definitioner',
    order: 4,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_handlingar_kontroller',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Handlingar och kontroller',
    order: 5,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_taxitrafiktillstand',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'TaxitrafiktillstÃ¥nd',
    order: 6,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_taxameter_sarskild_utrustning',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Taxameter och sÃ¤rskild utrustning',
    order: 7,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_prisinformation',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Prisinformation',
    order: 8,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_vilotider',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Vilotider',
    order: 9,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_arbetstid_ansvar',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Arbetstid och ansvar',
    order: 10,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_skolskjuts',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Skolskjuts',
    order: 11,
    status: 'published',
  },
  {
    id: 'topic_d2_taxi_sanktioner_pafoljder',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Sanktioner och pÃ¥fÃ¶ljder',
    order: 12,
    status: 'published',
  },
  ...trafficLessonsContent.lessons.map((lesson, index) => ({
    id: lesson.topic_id,
    subjectId: 'subject_d2_trafiklagstiftning',
    title: lesson.title,
    order: index + 1,
    status: lesson.status as Topic['status'],
  })),
];

function toBlock(block: RawBlock): ContentBlock {
  const factKeys = block.fact_keys;

  if (block.type === 'bullet_list') {
    return { type: 'bullet_list', items: block.items ?? [], factKeys };
  }

  if (block.type === 'worked_example') {
    return {
      type: 'worked_example',
      title: block.title ?? 'Räkneexempel',
      timeline: block.timeline ?? [],
      reasoning: block.reasoning ?? '',
      finalAnswer: block.final_answer ?? '',
      factKeys,
    };
  }

  if (block.type === 'checkpoint') {
    return { type: 'checkpoint', text: block.text ?? '', factKeys };
  }

  if (
    block.type === 'heading' ||
    block.type === 'paragraph' ||
    block.type === 'info' ||
    block.type === 'warning' ||
    block.type === 'example'
  ) {
    return { type: block.type, text: block.text ?? '', factKeys };
  }

  return { type: 'paragraph', text: block.text ?? '', factKeys };
}

function toVisualMetadata(metadata?: RawVisualMetadata) {
  if (!metadata) {
    return undefined;
  }

  return {
    requiresImage: metadata.requires_image,
    requiresDiagram: metadata.requires_diagram,
    requiresRoadScene: metadata.requires_road_scene,
  };
}

function readVisualMetadata(value: unknown) {
  return toVisualMetadata(value as RawVisualMetadata | undefined);
}

const allRawSources = [...factsContent.sources, ...remainingFactsContent.sources, ...trafficFactsContent.sources];
const sources: Source[] = [...new Map(allRawSources.map((source) => [source.source_id, source])).values()].map((source) => ({
  id: source.source_id,
  title: source.source_title,
  organization: source.authority,
  url: source.url,
  documentReference: source.current_validity,
  retrievedAt: factsContent.metadata.verified_at,
  status: 'published',
}));

type RawLesson =
  | (typeof lessonsContent.lessons)[number]
  | (typeof remainingLessonsContent.lessons)[number]
  | (typeof trafficLessonsContent.lessons)[number];

function inferTopicIdFromLesson(lesson: RawLesson) {
  if ('topic_id' in lesson && lesson.topic_id) {
    return lesson.topic_id;
  }

  return 'topic_d2_taxi_vilotider';
}

const allRawLessons = [...remainingLessonsContent.lessons, ...lessonsContent.lessons, ...trafficLessonsContent.lessons];
const lessonOrderByTopic = new Map<string, number>();

const lessons: Lesson[] = allRawLessons.map((lesson) => {
  const topicId = inferTopicIdFromLesson(lesson);
  const order = (lessonOrderByTopic.get(topicId) ?? 0) + 1;
  lessonOrderByTopic.set(topicId, order);

  return {
    id: lesson.stable_key,
    topicId,
    title: lesson.title,
    order,
    status: lesson.status as Lesson['status'],
    blocks: lesson.content_blocks.map(toBlock),
    sourceIds: lesson.source_references.map((source) => source.source_id),
    requirementKeys: lesson.requirement_keys,
    factKeys: lesson.fact_keys,
    estimatedStudyTimeMinutes: lesson.estimated_study_time_minutes,
    visualMetadata: readVisualMetadata('visual_metadata' in lesson ? lesson.visual_metadata : undefined),
  };
});

type RawQuestion =
  | (typeof questionsContent.questions)[number]
  | (typeof remainingQuestionsContent.questions)[number]
  | (typeof trafficQuestionsContent.questions)[number];

function inferTopicIdFromQuestion(question: RawQuestion) {
  if ('topic_id' in question && question.topic_id) {
    return question.topic_id;
  }

  return 'topic_d2_taxi_vilotider';
}

function inferSubjectIdFromQuestion(question: RawQuestion) {
  return inferTopicIdFromQuestion(question).startsWith('topic_d2_traffic_')
    ? 'subject_d2_trafiklagstiftning'
    : 'subject_d2_taxitrafiklagstiftning';
}

const questions: RawQuestion[] = [...remainingQuestionsContent.questions, ...questionsContent.questions, ...trafficQuestionsContent.questions];

const questionVersions: QuestionVersion[] = questions.map((question) => ({
  id: `${question.stable_key.toLowerCase()}_v${question.version}`,
  questionId: question.stable_key.toLowerCase(),
  stableKey: question.stable_key,
  version: question.version,
  examId: 'exam_d2_lagstiftning',
  subjectId: inferSubjectIdFromQuestion(question),
  topicId: inferTopicIdFromQuestion(question),
  lessonId: question.lesson_key,
  type: question.question_type as QuestionVersion['type'],
  contexts: ['checkpoint', 'practice', 'assessment'],
  prompt: question.prompt,
  choices: question.answer_choices,
  correctChoiceId: question.correct_answer_id,
  explanation: question.explanation,
  difficulty: question.difficulty as QuestionVersion['difficulty'],
  sourceIds: question.source_references.map((source) => source.source_id),
  requirementKeys: question.requirement_keys,
  factKeys: question.fact_keys,
  sourceReferences: question.source_references.map((source) => ({
    sourceId: source.source_id,
    exactReference: source.exact_reference,
  })),
  visualMetadata: readVisualMetadata('visual_metadata' in question ? question.visual_metadata : undefined),
  status: question.status as QuestionVersion['status'],
  createdAt,
  reviewedAt: questionsContent.metadata.reviewed_at,
}));

const checkpointExams = [
  ...remainingQuestionsContent.checkpoint_exams,
  questionsContent.checkpoint_exam,
  ...trafficQuestionsContent.topic_checkpoints,
];

const topicAssessments: Assessment[] = checkpointExams.map((checkpoint) => ({
  id: checkpoint.stable_key,
  type: 'checkpoint',
  title: checkpoint.title,
  subjectId: checkpoint.topic?.startsWith('topic_d2_traffic_') ? 'subject_d2_trafiklagstiftning' : 'subject_d2_taxitrafiklagstiftning',
  topicId: checkpoint.topic?.startsWith('topic_') ? checkpoint.topic : 'topic_d2_taxi_vilotider',
  questionCount: checkpoint.question_count,
  passThreshold: checkpoint.pass_threshold,
  status: checkpoint.status as Assessment['status'],
}));

const assessments: Assessment[] = topicAssessments.concat({
  id: trafficQuestionsContent.subject_checkpoint.stable_key,
  type: 'checkpoint',
  title: trafficQuestionsContent.subject_checkpoint.title,
  subjectId: 'subject_d2_trafiklagstiftning',
  questionCount: trafficQuestionsContent.subject_checkpoint.question_count,
  passThreshold: trafficQuestionsContent.subject_checkpoint.pass_threshold,
  status: trafficQuestionsContent.subject_checkpoint.status as Assessment['status'],
});

export const d2TaxiLawRepository: LearningRepository = {
  course,
  exams,
  subjects,
  topics,
  lessons,
  sources,
  questionVersions,
  examBlueprints: [
    {
      id: 'blueprint_d2_realistic_full_mock_v1',
      examId: 'exam_d2_lagstiftning',
      name: 'Realistiskt D2 mockprov',
      type: 'mock_exam',
      passThreshold: 34 / 46,
      passingScore: 34,
      scoringQuestionCount: 46,
      nonScoringTestQuestionCount: 4,
      totalDisplayedQuestionCount: 50,
      timeLimitSeconds: 3000,
      label: 'Realistic mock exam, not an official Trafikverket exam',
      active: true,
      subjects: [
        {
          id: 'blueprint_d2_realistic_full_mock_taxitrafiklagstiftning',
          examBlueprintId: 'blueprint_d2_realistic_full_mock_v1',
          subjectId: 'subject_d2_taxitrafiklagstiftning',
          questionCount: 23,
        },
        {
          id: 'blueprint_d2_realistic_full_mock_trafiklagstiftning',
          examBlueprintId: 'blueprint_d2_realistic_full_mock_v1',
          subjectId: 'subject_d2_trafiklagstiftning',
          questionCount: 23,
        },
      ],
    },
  ],
  assessments,
};

export const vilotiderRepository = d2TaxiLawRepository;

export const vilotiderFactRecords = factsContent.facts;
export const d2TaxiLawFactRecords = [...remainingFactsContent.facts, ...factsContent.facts];
export const d2TrafficLawFactRecords = trafficFactsContent.facts;
export const officialCurriculumRequirements = curriculum.requirements;
