import {
  testAnswerUserBoundary,
  testAttemptSnapshotVersioning,
  testBlueprintAllocation,
  testInvalidQuestionStatuses,
  testQuestionSelection,
  testScoring,
} from './examEngine.test';
import { testSubjectProgressSemantics, testTopicProgress } from './progress.test';
import {
  testActiveSubjectsHaveRequirements,
  testBlueprintSums,
  testChapterThreeSectionsAreRepresented,
  testLawAndGeneralAdviceAreDistinguishable,
  testOfficialSubjectCounts,
  testRequirementsHaveSourceSubjectTopicAndReference,
  testStableKeysAreUnique,
  testTwoMainExamsExist,
} from './curriculum.test';
import {
  testD2TaxiLawLessonOutlinesCoverRequestedTopics,
  testD2TaxiLawSourceMappingsAreExplicitAndLegal,
  testD2TaxiLawUnresolvedMappingsAreMarked,
  testEveryD2TaxiLawRequirementHasSourceMapping,
} from './d2TaxiLawSources.test';
import {
  testD2TaxiLawCheckpointsUseFifteenPublishedQuestions,
  testD2TaxiLawFactsAreVerifiedAndSourced,
  testD2TaxiLawLessonsCoverEveryPublishedTopic,
  testD2TaxiLawQuestionsHaveFullTraceability,
  testD2TaxiLawRepositoryPublishesRequestedTopics,
} from './d2TaxiLawContent.test';
import {
  testD2FullMockExamBlueprintMatchesOfficialScoring,
  testD2FullMockQuestionVersionsFreezeAtAttemptStart,
  testD2StudyStateKeepsCompletionMasteryAndMockPerformanceSeparate,
  testD2TrafficLawFactsAreVerifiedAndSourced,
  testD2TrafficLawLessonsMapToRequirementsFactsAndVisualMetadata,
  testD2TrafficLawQuestionsHaveTraceabilityChain,
  testD2TrafficLawSourcesAreAuthoritative,
  testD2TrafficLawSubjectCheckpointSamplesBroadly,
  testD2TrafficLawTopicCheckpointsUseEligibleQuestions,
  testD2TrafficLawVisualDependentContentIsMarked,
  testEveryD2TrafficLawRequirementHasSourceMapping,
} from './d2TrafficLawContent.test';
import {
  testVilotiderCalculationQuestionsUseCalculationRequirement,
  testVilotiderCheckpointSelectionAndVersionFreeze,
  testVilotiderFactsAreVerifiedAndSourced,
  testVilotiderLessonsHaveRequirementAndFactLinks,
  testVilotiderQuestionsHaveFullTraceability,
} from './vilotiderContent.test';
import {
  testMobileFlowCheckpointUsesFifteenQuestions,
  testMobileFlowCompletedAttemptCannotBeAltered,
  testMobileFlowFirstIncompleteLesson,
  testMobileFlowLessonCompletionPersistence,
  testMobileFlowLessonOrdering,
  testMobileFlowQuestionVersionsRemainFrozen,
  testMobileFlowResultsAreDeterministic,
  testMobileFlowTopicProgressDerivation,
} from './mobileLearningFlow.test';

const tests = [
  ['blueprint allocation', testBlueprintAllocation],
  ['question selection', testQuestionSelection],
  ['invalid question statuses', testInvalidQuestionStatuses],
  ['attempt snapshot versioning', testAttemptSnapshotVersioning],
  ['scoring', testScoring],
  ['answer user boundary', testAnswerUserBoundary],
  ['topic progress', testTopicProgress],
  ['subject progress semantics', testSubjectProgressSemantics],
  ['curriculum has exactly two exams', testTwoMainExamsExist],
  ['curriculum has official subject counts', testOfficialSubjectCounts],
  ['curriculum blueprint sums', testBlueprintSums],
  ['active subjects have requirements', testActiveSubjectsHaveRequirements],
  ['requirements have source subject topic reference', testRequirementsHaveSourceSubjectTopicAndReference],
  ['law and general advice are distinguishable', testLawAndGeneralAdviceAreDistinguishable],
  ['stable keys are unique', testStableKeysAreUnique],
  ['chapter 3 sections are represented', testChapterThreeSectionsAreRepresented],
  ['D2 taxi law requirements have source mappings', testEveryD2TaxiLawRequirementHasSourceMapping],
  ['D2 taxi law source mappings are explicit and legal', testD2TaxiLawSourceMappingsAreExplicitAndLegal],
  ['D2 taxi law unresolved mappings are marked', testD2TaxiLawUnresolvedMappingsAreMarked],
  ['D2 taxi law lesson outlines cover requested topics', testD2TaxiLawLessonOutlinesCoverRequestedTopics],
  ['D2 taxi law repository publishes requested topics', testD2TaxiLawRepositoryPublishesRequestedTopics],
  ['D2 taxi law facts are verified and sourced', testD2TaxiLawFactsAreVerifiedAndSourced],
  ['D2 taxi law lessons cover every published topic', testD2TaxiLawLessonsCoverEveryPublishedTopic],
  ['D2 taxi law questions have full traceability', testD2TaxiLawQuestionsHaveFullTraceability],
  ['D2 taxi law checkpoints use fifteen published questions', testD2TaxiLawCheckpointsUseFifteenPublishedQuestions],
  ['D2 traffic law requirements have source mappings', testEveryD2TrafficLawRequirementHasSourceMapping],
  ['D2 traffic law sources are authoritative', testD2TrafficLawSourcesAreAuthoritative],
  ['D2 traffic law facts are verified and sourced', testD2TrafficLawFactsAreVerifiedAndSourced],
  ['D2 traffic law lessons map to requirements, facts and visuals', testD2TrafficLawLessonsMapToRequirementsFactsAndVisualMetadata],
  ['D2 traffic law questions have traceability chain', testD2TrafficLawQuestionsHaveTraceabilityChain],
  ['D2 traffic law visual-dependent content is marked', testD2TrafficLawVisualDependentContentIsMarked],
  ['D2 traffic law topic checkpoints use eligible questions', testD2TrafficLawTopicCheckpointsUseEligibleQuestions],
  ['D2 traffic law subject checkpoint samples broadly', testD2TrafficLawSubjectCheckpointSamplesBroadly],
  ['D2 full mock exam blueprint matches official scoring', testD2FullMockExamBlueprintMatchesOfficialScoring],
  ['D2 full mock question versions freeze at attempt start', testD2FullMockQuestionVersionsFreezeAtAttemptStart],
  ['D2 study state keeps completion mastery and mock performance separate', testD2StudyStateKeepsCompletionMasteryAndMockPerformanceSeparate],
  ['Vilotider facts are verified and sourced', testVilotiderFactsAreVerifiedAndSourced],
  ['Vilotider lessons have requirement and fact links', testVilotiderLessonsHaveRequirementAndFactLinks],
  ['Vilotider questions have full traceability', testVilotiderQuestionsHaveFullTraceability],
  ['Vilotider calculation questions use calculation requirement', testVilotiderCalculationQuestionsUseCalculationRequirement],
  ['Vilotider checkpoint selection and version freeze', testVilotiderCheckpointSelectionAndVersionFreeze],
  ['mobile flow lesson ordering', testMobileFlowLessonOrdering],
  ['mobile flow first incomplete lesson', testMobileFlowFirstIncompleteLesson],
  ['mobile flow lesson completion persistence', testMobileFlowLessonCompletionPersistence],
  ['mobile flow topic progress derivation', testMobileFlowTopicProgressDerivation],
  ['mobile flow checkpoint uses fifteen questions', testMobileFlowCheckpointUsesFifteenQuestions],
  ['mobile flow question versions remain frozen', testMobileFlowQuestionVersionsRemainFrozen],
  ['mobile flow completed attempt cannot be altered', testMobileFlowCompletedAttemptCannotBeAltered],
  ['mobile flow results are deterministic', testMobileFlowResultsAreDeterministic],
] as const;

for (const [name, run] of tests) {
  run();
  console.log(`ok - ${name}`);
}
