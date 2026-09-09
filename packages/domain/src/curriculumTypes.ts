export type LegalStatus = 'binding_rule' | 'general_advice' | 'informational';
export type CompetencyType = 'KNOW' | 'UNDERSTAND' | 'EXPLAIN' | 'APPLY' | 'ASSESS' | 'CALCULATE' | 'USE' | 'PERFORM';
export type CurriculumContentStatus = 'planned' | 'sourcing' | 'authored' | 'reviewed' | 'verified' | 'published' | 'archived';

export type OfficialCurriculumRequirement = {
  stable_key: string;
  exam: 'D1' | 'D2';
  subject: string;
  official_reference: string;
  source_text_summary: string;
  normalized_requirement: string;
  original_competency_wording: string;
  competency_type: CompetencyType;
  legal_status: LegalStatus;
  topic: string;
  content_status: CurriculumContentStatus;
  recommended_question_type?: string;
  requires_scenario: boolean;
  requires_calculation: boolean;
  requires_image: boolean;
  requires_map: boolean;
  practical_application: boolean;
  source: string;
  active: boolean;
};

export type OfficialCurriculumTopic = {
  stable_key: string;
  subject: string;
  title: string;
  source_sections: string[];
};
