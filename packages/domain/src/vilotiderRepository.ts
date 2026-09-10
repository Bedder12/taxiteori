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
import navigationFactsContent from '../../../data/content/d1-navigation/navigation-facts.json';
import navigationLessonsContent from '../../../data/content/d1-navigation/navigation-lessons.json';
import navigationQuestionsContent from '../../../data/questions/d1-navigation/navigation-questions.json';
import ecoFactsContent from '../../../data/content/d1-eco-driving/eco-driving-facts.json';
import ecoLessonsContent from '../../../data/content/d1-eco-driving/eco-driving-lessons.json';
import ecoQuestionsContent from '../../../data/questions/d1-eco-driving/eco-driving-questions.json';
import environmentFactsContent from '../../../data/content/d1-environment/environment-facts.json';
import environmentLessonsContent from '../../../data/content/d1-environment/environment-lessons.json';
import environmentQuestionsContent from '../../../data/questions/d1-environment/environment-questions.json';
import vehicleFactsContent from '../../../data/content/d1-vehicle-knowledge/vehicle-facts.json';
import vehicleLessonsContent from '../../../data/content/d1-vehicle-knowledge/vehicle-lessons.json';
import vehicleQuestionsContent from '../../../data/questions/d1-vehicle-knowledge/vehicle-questions.json';
import safetyFactsContent from '../../../data/content/d1-safety/safety-facts.json';
import safetyLessonsContent from '../../../data/content/d1-safety/safety-lessons.json';
import safetyQuestionsContent from '../../../data/questions/d1-safety/safety-questions.json';
import serviceFactsContent from '../../../data/content/d1-service/service-facts.json';
import serviceLessonsContent from '../../../data/content/d1-service/service-lessons.json';
import serviceQuestionsContent from '../../../data/questions/d1-service/service-questions.json';
import healthFactsContent from '../../../data/content/d1-health-disabilities/health-disabilities-facts.json';
import healthLessonsContent from '../../../data/content/d1-health-disabilities/health-disabilities-lessons.json';
import healthQuestionsContent from '../../../data/questions/d1-health-disabilities/health-disabilities-questions.json';
import workFactsContent from '../../../data/content/d1-work-environment-risk/work-environment-risk-facts.json';
import workLessonsContent from '../../../data/content/d1-work-environment-risk/work-environment-risk-lessons.json';
import workQuestionsContent from '../../../data/questions/d1-work-environment-risk/work-environment-risk-questions.json';
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
  requires_map?: boolean;
  requires_route_scenario?: boolean;
  requires_oral_route_description?: boolean;
  requires_distance_estimation?: boolean;
  requires_travel_time_calculation?: boolean;
  requires_arrival_time_calculation?: boolean;
  requires_comparison_visual?: boolean;
  visual_asset_id?: string;
  visual_correctness_depends_on_asset?: boolean;
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
  { id: 'subject_d1_navigation', examId: 'exam_d1_sakerhet_beteende', title: 'Navigering', officialQuestionCount: 10, order: 1, status: 'published' },
  { id: 'subject_d1_korekonomi', examId: 'exam_d1_sakerhet_beteende', title: 'Körekonomi', officialQuestionCount: 6, order: 2, status: 'published' },
  { id: 'subject_d1_miljo', examId: 'exam_d1_sakerhet_beteende', title: 'Miljö', officialQuestionCount: 6, order: 3, status: 'published' },
  { id: 'subject_d1_fordonskannedom', examId: 'exam_d1_sakerhet_beteende', title: 'Fordonskännedom', officialQuestionCount: 7, order: 4, status: 'published' },
  { id: 'subject_d1_sakerhet', examId: 'exam_d1_sakerhet_beteende', title: 'Säkerhet', officialQuestionCount: 10, order: 5, status: 'published' },
  { id: 'subject_d1_bemotande', examId: 'exam_d1_sakerhet_beteende', title: 'Bemötande', officialQuestionCount: 12, order: 6, status: 'published' },
  { id: 'subject_d1_sjukdomar', examId: 'exam_d1_sakerhet_beteende', title: 'Sjukdomar och funktionsnedsättningar', officialQuestionCount: 8, order: 7, status: 'published' },
  { id: 'subject_d1_arbetsmiljo', examId: 'exam_d1_sakerhet_beteende', title: 'Arbetsmiljö, omdöme och riskmedvetenhet', officialQuestionCount: 6, order: 8, status: 'published' },
  { id: 'subject_d2_taxitrafiklagstiftning', examId: 'exam_d2_lagstiftning', title: 'Taxitrafiklagstiftning', officialQuestionCount: 23, order: 1, status: 'published' },
  { id: 'subject_d2_trafiklagstiftning', examId: 'exam_d2_lagstiftning', title: 'Trafiklagstiftning', officialQuestionCount: 23, order: 2, status: 'published' },
];

const topics: Topic[] = [
  ...navigationLessonsContent.lessons.map((lesson, index) => ({
    id: lesson.topic_id,
    subjectId: 'subject_d1_navigation',
    title: lesson.title,
    order: index + 1,
    status: lesson.status as Topic['status'],
  })),
  ...ecoLessonsContent.lessons.map((lesson, index) => ({
    id: lesson.topic_id,
    subjectId: 'subject_d1_korekonomi',
    title: lesson.title,
    order: index + 1,
    status: lesson.status as Topic['status'],
  })),
  ...environmentLessonsContent.lessons.map((lesson, index) => ({
    id: lesson.topic_id,
    subjectId: 'subject_d1_miljo',
    title: lesson.title,
    order: index + 1,
    status: lesson.status as Topic['status'],
  })),
  ...vehicleLessonsContent.lessons.map((lesson, index) => ({
    id: lesson.topic_id,
    subjectId: 'subject_d1_fordonskannedom',
    title: lesson.title,
    order: index + 1,
    status: lesson.status as Topic['status'],
  })),
  ...safetyLessonsContent.lessons.map((lesson, index) => ({
    id: lesson.topic_id,
    subjectId: 'subject_d1_sakerhet',
    title: lesson.title,
    order: index + 1,
    status: lesson.status as Topic['status'],
  })),
  ...serviceLessonsContent.lessons.map((lesson, index) => ({
    id: lesson.topic_id,
    subjectId: 'subject_d1_bemotande',
    title: lesson.title,
    order: index + 1,
    status: lesson.status as Topic['status'],
  })),
  ...healthLessonsContent.lessons.map((lesson, index) => ({
    id: lesson.topic_id,
    subjectId: 'subject_d1_sjukdomar',
    title: lesson.title,
    order: index + 1,
    status: lesson.status as Topic['status'],
  })),
  ...workLessonsContent.lessons.map((lesson, index) => ({
    id: lesson.topic_id,
    subjectId: 'subject_d1_arbetsmiljo',
    title: lesson.title,
    order: index + 1,
    status: lesson.status as Topic['status'],
  })),
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
    requiresMap: metadata.requires_map,
    requiresRouteScenario: metadata.requires_route_scenario,
    requiresOralRouteDescription: metadata.requires_oral_route_description,
    requiresDistanceEstimation: metadata.requires_distance_estimation,
    requiresTravelTimeCalculation: metadata.requires_travel_time_calculation,
    requiresArrivalTimeCalculation: metadata.requires_arrival_time_calculation,
    requiresComparisonVisual: metadata.requires_comparison_visual,
    visualAssetId: metadata.visual_asset_id,
    visualCorrectnessDependsOnAsset: metadata.visual_correctness_depends_on_asset,
  };
}

function readVisualMetadata(value: unknown) {
  return toVisualMetadata(value as RawVisualMetadata | undefined);
}

function readAnyMetadata(value: unknown) {
  return readVisualMetadata(value);
}

const allRawSources = [
  ...factsContent.sources,
  ...remainingFactsContent.sources,
  ...trafficFactsContent.sources,
  ...navigationFactsContent.sources,
  ...ecoFactsContent.sources,
  ...environmentFactsContent.sources,
  ...vehicleFactsContent.sources,
  ...safetyFactsContent.sources,
  ...serviceFactsContent.sources,
  ...healthFactsContent.sources,
  ...workFactsContent.sources,
];
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
  | (typeof trafficLessonsContent.lessons)[number]
  | (typeof navigationLessonsContent.lessons)[number]
  | (typeof ecoLessonsContent.lessons)[number]
  | (typeof environmentLessonsContent.lessons)[number]
  | (typeof vehicleLessonsContent.lessons)[number]
  | (typeof safetyLessonsContent.lessons)[number]
  | (typeof serviceLessonsContent.lessons)[number]
  | (typeof healthLessonsContent.lessons)[number]
  | (typeof workLessonsContent.lessons)[number];

function inferTopicIdFromLesson(lesson: RawLesson) {
  if ('topic_id' in lesson && lesson.topic_id) {
    return lesson.topic_id;
  }

  return 'topic_d2_taxi_vilotider';
}

const allRawLessons = [
  ...navigationLessonsContent.lessons,
  ...ecoLessonsContent.lessons,
  ...environmentLessonsContent.lessons,
  ...vehicleLessonsContent.lessons,
  ...safetyLessonsContent.lessons,
  ...serviceLessonsContent.lessons,
  ...healthLessonsContent.lessons,
  ...workLessonsContent.lessons,
  ...remainingLessonsContent.lessons,
  ...lessonsContent.lessons,
  ...trafficLessonsContent.lessons,
];
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
    visualMetadata: readAnyMetadata(
      'visual_metadata' in lesson ? lesson.visual_metadata : 'navigation_metadata' in lesson ? lesson.navigation_metadata : undefined,
    ),
  };
});

type RawQuestion =
  | (typeof questionsContent.questions)[number]
  | (typeof remainingQuestionsContent.questions)[number]
  | (typeof workQuestionsContent.questions)[number]
  | (typeof trafficQuestionsContent.questions)[number]
  | (typeof navigationQuestionsContent.questions)[number]
  | (typeof ecoQuestionsContent.questions)[number]
  | (typeof environmentQuestionsContent.questions)[number]
  | (typeof vehicleQuestionsContent.questions)[number]
  | (typeof safetyQuestionsContent.questions)[number]
  | (typeof serviceQuestionsContent.questions)[number]
  | (typeof healthQuestionsContent.questions)[number];

function inferTopicIdFromQuestion(question: RawQuestion) {
  if ('topic_id' in question && question.topic_id) {
    return question.topic_id;
  }

  return 'topic_d2_taxi_vilotider';
}

function inferSubjectIdFromQuestion(question: RawQuestion) {
  if (inferTopicIdFromQuestion(question).startsWith('topic_d1_navigation_')) {
    return 'subject_d1_navigation';
  }

  if (inferTopicIdFromQuestion(question).startsWith('topic_d1_eco_')) {
    return 'subject_d1_korekonomi';
  }

  if (inferTopicIdFromQuestion(question).startsWith('topic_d1_env_')) {
    return 'subject_d1_miljo';
  }

  if (inferTopicIdFromQuestion(question).startsWith('topic_d1_vehicle_')) {
    return 'subject_d1_fordonskannedom';
  }

  if (inferTopicIdFromQuestion(question).startsWith('topic_d1_safety_')) {
    return 'subject_d1_sakerhet';
  }

  if (inferTopicIdFromQuestion(question).startsWith('topic_d1_service_')) {
    return 'subject_d1_bemotande';
  }

  if (inferTopicIdFromQuestion(question).startsWith('topic_d1_health_')) {
    return 'subject_d1_sjukdomar';
  }

  if (inferTopicIdFromQuestion(question).startsWith('topic_d1_work_')) {
    return 'subject_d1_arbetsmiljo';
  }

  return inferTopicIdFromQuestion(question).startsWith('topic_d2_traffic_')
    ? 'subject_d2_trafiklagstiftning'
    : 'subject_d2_taxitrafiklagstiftning';
}

function inferExamIdFromQuestion(question: RawQuestion) {
  return inferSubjectIdFromQuestion(question).startsWith('subject_d1_') ? 'exam_d1_sakerhet_beteende' : 'exam_d2_lagstiftning';
}

const questions: RawQuestion[] = [
  ...navigationQuestionsContent.questions,
  ...ecoQuestionsContent.questions,
  ...environmentQuestionsContent.questions,
  ...vehicleQuestionsContent.questions,
  ...safetyQuestionsContent.questions,
  ...serviceQuestionsContent.questions,
  ...healthQuestionsContent.questions,
  ...workQuestionsContent.questions,
  ...remainingQuestionsContent.questions,
  ...questionsContent.questions,
  ...trafficQuestionsContent.questions,
];

const questionVersions: QuestionVersion[] = questions.map((question) => ({
  id: `${question.stable_key.toLowerCase()}_v${question.version}`,
  questionId: question.stable_key.toLowerCase(),
  stableKey: question.stable_key,
  version: question.version,
  examId: inferExamIdFromQuestion(question),
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
  visualMetadata: readAnyMetadata(
    'visual_metadata' in question ? question.visual_metadata : 'navigation_metadata' in question ? question.navigation_metadata : undefined,
  ),
  status: question.status as QuestionVersion['status'],
  createdAt,
  reviewedAt: questionsContent.metadata.reviewed_at,
}));

const checkpointExams = [
  ...navigationQuestionsContent.topic_checkpoints,
  ...ecoQuestionsContent.topic_checkpoints,
  ...environmentQuestionsContent.topic_checkpoints,
  ...vehicleQuestionsContent.topic_checkpoints,
  ...safetyQuestionsContent.topic_checkpoints,
  ...serviceQuestionsContent.topic_checkpoints,
  ...healthQuestionsContent.topic_checkpoints,
  ...workQuestionsContent.topic_checkpoints,
  ...remainingQuestionsContent.checkpoint_exams,
  questionsContent.checkpoint_exam,
  ...trafficQuestionsContent.topic_checkpoints,
];

const topicAssessments: Assessment[] = checkpointExams.map((checkpoint) => ({
  id: checkpoint.stable_key,
  type: 'checkpoint',
  title: checkpoint.title,
  subjectId: checkpoint.topic?.startsWith('topic_d1_navigation_')
    ? 'subject_d1_navigation'
    : checkpoint.topic?.startsWith('topic_d1_eco_')
      ? 'subject_d1_korekonomi'
      : checkpoint.topic?.startsWith('topic_d1_env_')
        ? 'subject_d1_miljo'
        : checkpoint.topic?.startsWith('topic_d1_vehicle_')
          ? 'subject_d1_fordonskannedom'
          : checkpoint.topic?.startsWith('topic_d1_safety_')
            ? 'subject_d1_sakerhet'
            : checkpoint.topic?.startsWith('topic_d1_service_')
              ? 'subject_d1_bemotande'
              : checkpoint.topic?.startsWith('topic_d1_health_')
                ? 'subject_d1_sjukdomar'
                : checkpoint.topic?.startsWith('topic_d1_work_')
                  ? 'subject_d1_arbetsmiljo'
                : checkpoint.topic?.startsWith('topic_d2_traffic_')
                  ? 'subject_d2_trafiklagstiftning'
                  : 'subject_d2_taxitrafiklagstiftning',
  topicId: checkpoint.topic?.startsWith('topic_') ? checkpoint.topic : 'topic_d2_taxi_vilotider',
  questionCount: checkpoint.question_count,
  passThreshold: checkpoint.pass_threshold,
  status: checkpoint.status as Assessment['status'],
}));

const assessments: Assessment[] = topicAssessments.concat({
  id: navigationQuestionsContent.subject_checkpoint.stable_key,
  type: 'checkpoint',
  title: navigationQuestionsContent.subject_checkpoint.title,
  subjectId: 'subject_d1_navigation',
  questionCount: navigationQuestionsContent.subject_checkpoint.question_count,
  passThreshold: navigationQuestionsContent.subject_checkpoint.pass_threshold,
  status: navigationQuestionsContent.subject_checkpoint.status as Assessment['status'],
}, {
  id: ecoQuestionsContent.subject_checkpoint.stable_key,
  type: 'checkpoint',
  title: ecoQuestionsContent.subject_checkpoint.title,
  subjectId: 'subject_d1_korekonomi',
  questionCount: ecoQuestionsContent.subject_checkpoint.question_count,
  passThreshold: ecoQuestionsContent.subject_checkpoint.pass_threshold,
  status: ecoQuestionsContent.subject_checkpoint.status as Assessment['status'],
}, {
  id: environmentQuestionsContent.subject_checkpoint.stable_key,
  type: 'checkpoint',
  title: environmentQuestionsContent.subject_checkpoint.title,
  subjectId: 'subject_d1_miljo',
  questionCount: environmentQuestionsContent.subject_checkpoint.question_count,
  passThreshold: environmentQuestionsContent.subject_checkpoint.pass_threshold,
  status: environmentQuestionsContent.subject_checkpoint.status as Assessment['status'],
}, {
  id: vehicleQuestionsContent.subject_checkpoint.stable_key,
  type: 'checkpoint',
  title: vehicleQuestionsContent.subject_checkpoint.title,
  subjectId: 'subject_d1_fordonskannedom',
  questionCount: vehicleQuestionsContent.subject_checkpoint.question_count,
  passThreshold: vehicleQuestionsContent.subject_checkpoint.pass_threshold,
  status: vehicleQuestionsContent.subject_checkpoint.status as Assessment['status'],
}, {
  id: safetyQuestionsContent.subject_checkpoint.stable_key,
  type: 'checkpoint',
  title: safetyQuestionsContent.subject_checkpoint.title,
  subjectId: 'subject_d1_sakerhet',
  questionCount: safetyQuestionsContent.subject_checkpoint.question_count,
  passThreshold: safetyQuestionsContent.subject_checkpoint.pass_threshold,
  status: safetyQuestionsContent.subject_checkpoint.status as Assessment['status'],
}, {
  id: serviceQuestionsContent.subject_checkpoint.stable_key,
  type: 'checkpoint',
  title: serviceQuestionsContent.subject_checkpoint.title,
  subjectId: 'subject_d1_bemotande',
  questionCount: serviceQuestionsContent.subject_checkpoint.question_count,
  passThreshold: serviceQuestionsContent.subject_checkpoint.pass_threshold,
  status: serviceQuestionsContent.subject_checkpoint.status as Assessment['status'],
}, {
  id: healthQuestionsContent.subject_checkpoint.stable_key,
  type: 'checkpoint',
  title: healthQuestionsContent.subject_checkpoint.title,
  subjectId: 'subject_d1_sjukdomar',
  questionCount: healthQuestionsContent.subject_checkpoint.question_count,
  passThreshold: healthQuestionsContent.subject_checkpoint.pass_threshold,
  status: healthQuestionsContent.subject_checkpoint.status as Assessment['status'],
}, {
  id: workQuestionsContent.subject_checkpoint.stable_key,
  type: 'checkpoint',
  title: workQuestionsContent.subject_checkpoint.title,
  subjectId: 'subject_d1_arbetsmiljo',
  questionCount: workQuestionsContent.subject_checkpoint.question_count,
  passThreshold: workQuestionsContent.subject_checkpoint.pass_threshold,
  status: workQuestionsContent.subject_checkpoint.status as Assessment['status'],
}, {
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
      id: 'blueprint_d1_realistic_full_mock_v1',
      examId: 'exam_d1_sakerhet_beteende',
      name: 'Realistiskt D1 övningsprov',
      type: 'mock_exam',
      version: 1,
      status: 'published',
      passThreshold: 48 / 65,
      passingScore: 48,
      scoringQuestionCount: 65,
      nonScoringTestQuestionCount: 5,
      totalDisplayedQuestionCount: 70,
      timeLimitSeconds: 3000,
      officialStructure: {
        scoringQuestionCount: 65,
        passingScore: 48,
        nonScoringTestQuestionCount: 5,
        totalDisplayedQuestionCount: 70,
        timeLimitSeconds: 3000,
      },
      label: 'Internal realistic mock exam, not an official Trafikverket exam',
      disclaimer: 'The questions are our own training questions. The five simulation items are not claimed to correspond to actual trial questions.',
      active: true,
      subjects: [
        ['subject_d1_navigation', 10],
        ['subject_d1_korekonomi', 6],
        ['subject_d1_miljo', 6],
        ['subject_d1_sakerhet', 10],
        ['subject_d1_bemotande', 12],
        ['subject_d1_sjukdomar', 8],
        ['subject_d1_arbetsmiljo', 6],
        ['subject_d1_fordonskannedom', 7],
      ].map(([subjectId, questionCount]) => ({
        id: `blueprint_d1_realistic_full_mock_v1_${subjectId}`,
        examBlueprintId: 'blueprint_d1_realistic_full_mock_v1',
        subjectId: String(subjectId),
        questionCount: Number(questionCount),
      })),
    },
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
export const d1NavigationFactRecords = navigationFactsContent.facts;
export const d1EcoDrivingFactRecords = ecoFactsContent.facts;
export const d1EnvironmentFactRecords = environmentFactsContent.facts;
export const d1VehicleKnowledgeFactRecords = vehicleFactsContent.facts;
export const d1SafetyFactRecords = safetyFactsContent.facts;
export const d1ServiceFactRecords = serviceFactsContent.facts;
export const d1HealthDisabilitiesFactRecords = healthFactsContent.facts;
export const d1WorkEnvironmentRiskFactRecords = workFactsContent.facts;
export const officialCurriculumRequirements = curriculum.requirements;
