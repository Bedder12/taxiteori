export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';
export type ExamCode = 'D1' | 'D2';
export type QuestionType = 'single_choice' | 'scenario' | 'calculation';
export type QuestionContext = 'checkpoint' | 'practice' | 'assessment';
export type AttemptType = 'checkpoint' | 'mock_exam' | 'practice';
export type AttemptStatus = 'in_progress' | 'completed' | 'timed_out';
export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'bullet_list'
  | 'info'
  | 'warning'
  | 'example'
  | 'worked_example'
  | 'checkpoint'
  | 'image'
  | 'video_ref'
  | 'checkpoint_ref';

type TraceableBlock = {
  factKeys?: string[];
};

export type ContentBlock =
  | ({ type: 'heading' | 'paragraph' | 'info' | 'warning' | 'example' | 'checkpoint'; text: string } & TraceableBlock)
  | ({ type: 'bullet_list'; items: string[] } & TraceableBlock)
  | ({
      type: 'worked_example';
      title: string;
      timeline: string[];
      reasoning: string;
      finalAnswer: string;
    } & TraceableBlock)
  | ({ type: 'image'; mediaId: string; alt: string } & TraceableBlock)
  | ({ type: 'video_ref'; mediaId: string } & TraceableBlock)
  | ({ type: 'checkpoint_ref'; assessmentId: string } & TraceableBlock);

export type VisualMetadata = {
  requiresImage?: boolean;
  requiresDiagram?: boolean;
  requiresRoadScene?: boolean;
  requiresMap?: boolean;
  requiresRouteScenario?: boolean;
  requiresOralRouteDescription?: boolean;
  requiresDistanceEstimation?: boolean;
  requiresTravelTimeCalculation?: boolean;
  requiresArrivalTimeCalculation?: boolean;
  requiresComparisonVisual?: boolean;
  visualAssetId?: string;
  visualCorrectnessDependsOnAsset?: boolean;
};

export type Course = {
  id: string;
  title: string;
  status: ContentStatus;
};

export type Exam = {
  id: string;
  courseId: string;
  code: ExamCode;
  title: string;
  order: number;
  status: ContentStatus;
};

export type Subject = {
  id: string;
  examId: string;
  title: string;
  officialQuestionCount: number;
  order: number;
  status: ContentStatus;
};

export type Topic = {
  id: string;
  subjectId: string;
  title: string;
  order: number;
  status: ContentStatus;
};

export type Lesson = {
  id: string;
  topicId: string;
  title: string;
  order: number;
  status: ContentStatus;
  blocks: ContentBlock[];
  sourceIds: string[];
  requirementKeys?: string[];
  factKeys?: string[];
  estimatedStudyTimeMinutes?: number;
  visualMetadata?: VisualMetadata;
};

export type Source = {
  id: string;
  title: string;
  organization: string;
  url?: string;
  documentReference?: string;
  publishedAt?: string;
  retrievedAt?: string;
  status: ContentStatus;
};

export type AnswerChoice = {
  id: string;
  text: string;
};

export type QuestionVersion = {
  id: string;
  questionId: string;
  stableKey: string;
  version: number;
  examId: string;
  subjectId: string;
  topicId?: string;
  lessonId?: string;
  type: QuestionType;
  contexts: QuestionContext[];
  prompt: string;
  choices: AnswerChoice[];
  correctChoiceId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceIds: string[];
  requirementKeys?: string[];
  factKeys?: string[];
  sourceReferences?: { sourceId: string; exactReference: string }[];
  visualMetadata?: VisualMetadata;
  scoringRole?: 'scored' | 'non_scoring_simulation';
  status: ContentStatus;
  createdAt: string;
  reviewedAt?: string;
};

export type ExamBlueprint = {
  id: string;
  examId: string;
  name: string;
  type: AttemptType;
  passThreshold: number;
  timeLimitSeconds?: number;
  scoringQuestionCount?: number;
  passingScore?: number;
  nonScoringTestQuestionCount?: number;
  totalDisplayedQuestionCount?: number;
  label?: string;
  version?: number;
  status?: ContentStatus;
  officialStructure?: {
    scoringQuestionCount: number;
    passingScore: number;
    nonScoringTestQuestionCount: number;
    totalDisplayedQuestionCount: number;
    timeLimitSeconds: number;
  };
  disclaimer?: string;
  active: boolean;
  subjects: ExamBlueprintSubject[];
};

export type ExamBlueprintSubject = {
  id: string;
  examBlueprintId: string;
  subjectId: string;
  questionCount: number;
};

export type Assessment = {
  id: string;
  type: AttemptType;
  title: string;
  subjectId?: string;
  topicId?: string;
  questionCount: number;
  passThreshold: number;
  timeLimitSeconds?: number;
  status: ContentStatus;
};

export type AttemptQuestion = {
  id: string;
  attemptId: string;
  questionVersionId: string;
  questionId: string;
  stableKey: string;
  version: number;
  order: number;
  subjectId: string;
  scoringRole: 'scored' | 'non_scoring_simulation';
};

export type Attempt = {
  id: string;
  userId: string;
  assessmentId: string;
  type: AttemptType;
  startedAt: string;
  completedAt?: string;
  status: AttemptStatus;
  score?: number;
  totalQuestions: number;
  scoringQuestionCount?: number;
  passThreshold: number;
  passingScore?: number;
  blueprintVersion?: number;
  timeLimitSeconds?: number;
  timedOut?: boolean;
  passed?: boolean;
  questions: AttemptQuestion[];
};

export type Answer = {
  id: string;
  attemptId: string;
  attemptQuestionId: string;
  userId: string;
  selectedChoiceId: string;
  correct: boolean;
  answeredAt: string;
  responseTimeMs?: number;
};

export type UserProgressFact =
  | { type: 'lesson_completed'; userId: string; lessonId: string; completedAt: string }
  | { type: 'attempt_completed'; userId: string; attemptId: string; assessmentId: string; passed: boolean; completedAt: string };

export type LearningRepository = {
  course: Course;
  exams: Exam[];
  subjects: Subject[];
  topics: Topic[];
  lessons: Lesson[];
  sources: Source[];
  questionVersions: QuestionVersion[];
  examBlueprints: ExamBlueprint[];
  assessments: Assessment[];
};
