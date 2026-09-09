import type { Assessment, Course, Exam, ExamBlueprint, LearningRepository, Lesson, QuestionVersion, Source, Subject, Topic } from './types';

const now = '2026-09-09T00:00:00.000Z';

export const course: Course = {
  id: 'course_taxiforarlegitimation',
  title: 'Taxiforarlegitimation',
  status: 'published',
};

export const exams: Exam[] = [
  {
    id: 'exam_d1_sakerhet_beteende',
    courseId: course.id,
    code: 'D1',
    title: 'Delprov 1 - Sakerhet och beteende',
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

export const subjects: Subject[] = [
  { id: 'subject_d1_navigation', examId: exams[0].id, title: 'Navigering', officialQuestionCount: 10, order: 1, status: 'published' },
  { id: 'subject_d1_korekonomi', examId: exams[0].id, title: 'Korekonomi', officialQuestionCount: 6, order: 2, status: 'published' },
  { id: 'subject_d1_miljo', examId: exams[0].id, title: 'Miljo', officialQuestionCount: 6, order: 3, status: 'published' },
  { id: 'subject_d1_sakerhet', examId: exams[0].id, title: 'Sakerhet', officialQuestionCount: 10, order: 4, status: 'published' },
  { id: 'subject_d1_bemotande', examId: exams[0].id, title: 'Bemotande', officialQuestionCount: 12, order: 5, status: 'published' },
  { id: 'subject_d1_sjukdomar', examId: exams[0].id, title: 'Sjukdomar och funktionsnedsattningar', officialQuestionCount: 8, order: 6, status: 'published' },
  { id: 'subject_d1_arbetsmiljo', examId: exams[0].id, title: 'Arbetsmiljo, omdome och riskmedvetenhet', officialQuestionCount: 6, order: 7, status: 'published' },
  { id: 'subject_d1_fordonskannedom', examId: exams[0].id, title: 'Fordonskannedom', officialQuestionCount: 7, order: 8, status: 'published' },
  { id: 'subject_d2_taxitrafiklagstiftning', examId: exams[1].id, title: 'Taxitrafiklagstiftning', officialQuestionCount: 23, order: 1, status: 'published' },
  { id: 'subject_d2_trafiklagstiftning', examId: exams[1].id, title: 'Trafiklagstiftning', officialQuestionCount: 23, order: 2, status: 'published' },
];

export const topics: Topic[] = [
  {
    id: 'topic_d2_taxi_vilotider',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    title: 'Vilotider',
    order: 1,
    status: 'published',
  },
];

export const sources: Source[] = [
  {
    id: 'source_placeholder_curriculum',
    title: 'Demo placeholder content for software validation',
    organization: 'Taxi Theory MVP',
    status: 'published',
  },
];

export const lessons: Lesson[] = [
  {
    id: 'lesson_vilotider_intro',
    topicId: 'topic_d2_taxi_vilotider',
    title: 'Varfor vilotider finns',
    order: 1,
    status: 'published',
    sourceIds: ['source_placeholder_curriculum'],
    blocks: [
      { type: 'heading', text: 'Demo: varfor vilotider finns' },
      { type: 'warning', text: 'Detta ar demo- och platshallarinnehall. Det ska ersattas med granskad, kallbelagd kursinformation innan publicering.' },
      { type: 'paragraph', text: 'Vilotider handlar om att minska risker fran trotthet och skapa en tryggare taxiresa for forare, passagerare och andra trafikanter.' },
      { type: 'info', text: 'I appen ska varje regel senare kunna sparas med kallhanvisning och granskningsstatus.' },
    ],
  },
  {
    id: 'lesson_vilotider_ansvar',
    topicId: 'topic_d2_taxi_vilotider',
    title: 'Forarens ansvar',
    order: 2,
    status: 'published',
    sourceIds: ['source_placeholder_curriculum'],
    blocks: [
      { type: 'heading', text: 'Demo: forarens ansvar' },
      { type: 'paragraph', text: 'Foraren behover kunna planera arbetet sa att korning, raster och vila kan foljas i praktiken.' },
      { type: 'bullet_list', items: ['Kanna igen risker med trotthet', 'Planera pass och pauser', 'Saga ifran nar sakerheten paverkas'] },
      { type: 'example', text: 'Exempel: om du marker att uppmarksamheten sjunker ska du behandla det som en sakerhetsrisk, inte som ett schema-problem.' },
    ],
  },
  {
    id: 'lesson_vilotider_planering',
    topicId: 'topic_d2_taxi_vilotider',
    title: 'Planera ett arbetspass',
    order: 3,
    status: 'published',
    sourceIds: ['source_placeholder_curriculum'],
    blocks: [
      { type: 'heading', text: 'Demo: planera ett arbetspass' },
      { type: 'paragraph', text: 'Ett bra arbetspass bor ha marginaler. Appens framtida innehall kan koppla teori till scenarier dar foraren maste valja ett sakert beslut.' },
      { type: 'info', text: 'Denna lektion testar renderer-stod for informationsrutor och stegvis inlarning.' },
    ],
  },
  {
    id: 'lesson_vilotider_dokumentation',
    topicId: 'topic_d2_taxi_vilotider',
    title: 'Dokumentation och kontroll',
    order: 4,
    status: 'published',
    sourceIds: ['source_placeholder_curriculum'],
    blocks: [
      { type: 'heading', text: 'Demo: dokumentation och kontroll' },
      { type: 'paragraph', text: 'Vissa regler behover kunna styrkas i efterhand. Datamodellen sparar darfor kallor, status och versioner sa att andringar kan granskas.' },
      { type: 'warning', text: 'Inga faktiska lagkrav anges har. Detta ar bara en teknisk vertikal slice.' },
    ],
  },
  {
    id: 'lesson_vilotider_repetition',
    topicId: 'topic_d2_taxi_vilotider',
    title: 'Repetition fore prov',
    order: 5,
    status: 'published',
    sourceIds: ['source_placeholder_curriculum'],
    blocks: [
      { type: 'heading', text: 'Demo: repetition' },
      { type: 'paragraph', text: 'Innan checkpointen ska eleven ha last momenten och provat fragor som ar kopplade till samma amne och topic.' },
      { type: 'checkpoint_ref', assessmentId: 'assessment_vilotider_checkpoint' },
    ],
  },
];

export const assessments: Assessment[] = [
  {
    id: 'assessment_vilotider_checkpoint',
    type: 'checkpoint',
    title: 'Checkpoint: Vilotider',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    topicId: 'topic_d2_taxi_vilotider',
    questionCount: 8,
    passThreshold: 0.75,
    status: 'published',
  },
];

function createQuestion(index: number, lessonId: string): QuestionVersion {
  const padded = index.toString().padStart(3, '0');
  const correct = index % 4 === 0 ? 'd' : index % 3 === 0 ? 'c' : index % 2 === 0 ? 'b' : 'a';

  return {
    id: `question_version_vilotider_${padded}_v1`,
    questionId: `question_vilotider_${padded}`,
    stableKey: `TAXI-D2-LAW-REST-${padded}`,
    version: 1,
    examId: 'exam_d2_lagstiftning',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    topicId: 'topic_d2_taxi_vilotider',
    lessonId,
    type: 'single_choice',
    contexts: ['checkpoint', 'practice', 'assessment'],
    prompt: `Demo-fraga ${index}: vilket svar visar bast sakerhets- och regelmedvetenhet kring vilotider?`,
    choices: [
      { id: 'a', text: 'Planera arbetet med marginal och avbryt om trotthet paverkar sakerheten.' },
      { id: 'b', text: 'Fortsatt kora sa lange kunden vill, och los vilan senare.' },
      { id: 'c', text: 'Hoppa over rast om dagens schema ar pressat.' },
      { id: 'd', text: 'Lat priset avgora om vilan kan vanta.' },
    ],
    correctChoiceId: correct,
    explanation: 'Demo-forklaring: i riktig kurs ska forklaringen kopplas till granskad teori och kallor. Har provar vi versionering, rattning och aterkoppling.',
    difficulty: index <= 6 ? 'easy' : index <= 13 ? 'medium' : 'hard',
    sourceIds: ['source_placeholder_curriculum'],
    status: 'published',
    createdAt: now,
    reviewedAt: now,
  };
}

export const questionVersions: QuestionVersion[] = Array.from({ length: 18 }, (_, index) => {
  const lesson = lessons[index % lessons.length];
  return createQuestion(index + 1, lesson.id);
});

export const examBlueprints: ExamBlueprint[] = [
  {
    id: 'blueprint_d1_official_mock',
    examId: 'exam_d1_sakerhet_beteende',
    name: 'Delprov 1 mock exam blueprint',
    type: 'mock_exam',
    passThreshold: 0.75,
    timeLimitSeconds: 50 * 60,
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
    ].map(([subjectId, questionCount], index) => ({
      id: `blueprint_d1_subject_${index + 1}`,
      examBlueprintId: 'blueprint_d1_official_mock',
      subjectId: String(subjectId),
      questionCount: Number(questionCount),
    })),
  },
  {
    id: 'blueprint_d2_official_mock',
    examId: 'exam_d2_lagstiftning',
    name: 'Delprov 2 mock exam blueprint',
    type: 'mock_exam',
    passThreshold: 0.75,
    timeLimitSeconds: 40 * 60,
    active: true,
    subjects: [
      ['subject_d2_taxitrafiklagstiftning', 23],
      ['subject_d2_trafiklagstiftning', 23],
    ].map(([subjectId, questionCount], index) => ({
      id: `blueprint_d2_subject_${index + 1}`,
      examBlueprintId: 'blueprint_d2_official_mock',
      subjectId: String(subjectId),
      questionCount: Number(questionCount),
    })),
  },
];

export const demoRepository: LearningRepository = {
  course,
  exams,
  subjects,
  topics,
  lessons,
  sources,
  questionVersions,
  examBlueprints,
  assessments,
};
