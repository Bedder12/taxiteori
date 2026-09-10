type SubjectContent = {
  facts: unknown;
  lessons: unknown;
  questions: unknown;
  visuals?: unknown;
};

const loaders: Record<string, () => Promise<SubjectContent>> = {
  D1_NAVIGATION: async () => ({ facts: (await import('../../../data/content/d1-navigation/navigation-facts.json')).default, lessons: (await import('../../../data/content/d1-navigation/navigation-lessons.json')).default, questions: (await import('../../../data/questions/d1-navigation/navigation-questions.json')).default, visuals: (await import('../../../data/content/d1-navigation/navigation-visuals.json')).default }),
  D1_ECO_DRIVING: async () => ({ facts: (await import('../../../data/content/d1-eco-driving/eco-driving-facts.json')).default, lessons: (await import('../../../data/content/d1-eco-driving/eco-driving-lessons.json')).default, questions: (await import('../../../data/questions/d1-eco-driving/eco-driving-questions.json')).default }),
  D1_ENVIRONMENT: async () => ({ facts: (await import('../../../data/content/d1-environment/environment-facts.json')).default, lessons: (await import('../../../data/content/d1-environment/environment-lessons.json')).default, questions: (await import('../../../data/questions/d1-environment/environment-questions.json')).default }),
  D1_SAFETY: async () => ({ facts: (await import('../../../data/content/d1-safety/safety-facts.json')).default, lessons: (await import('../../../data/content/d1-safety/safety-lessons.json')).default, questions: (await import('../../../data/questions/d1-safety/safety-questions.json')).default, visuals: (await import('../../../data/content/d1-safety/safety-visuals.json')).default }),
  D1_SERVICE: async () => ({ facts: (await import('../../../data/content/d1-service/service-facts.json')).default, lessons: (await import('../../../data/content/d1-service/service-lessons.json')).default, questions: (await import('../../../data/questions/d1-service/service-questions.json')).default, visuals: (await import('../../../data/content/d1-service/service-visuals.json')).default }),
  D1_HEALTH_DISABILITIES: async () => ({ facts: (await import('../../../data/content/d1-health-disabilities/health-disabilities-facts.json')).default, lessons: (await import('../../../data/content/d1-health-disabilities/health-disabilities-lessons.json')).default, questions: (await import('../../../data/questions/d1-health-disabilities/health-disabilities-questions.json')).default, visuals: (await import('../../../data/content/d1-health-disabilities/health-disabilities-visuals.json')).default }),
  D1_WORK_ENVIRONMENT_RISK: async () => ({ facts: (await import('../../../data/content/d1-work-environment-risk/work-environment-risk-facts.json')).default, lessons: (await import('../../../data/content/d1-work-environment-risk/work-environment-risk-lessons.json')).default, questions: (await import('../../../data/questions/d1-work-environment-risk/work-environment-risk-questions.json')).default, visuals: (await import('../../../data/content/d1-work-environment-risk/work-environment-risk-visuals.json')).default }),
  D1_VEHICLE_KNOWLEDGE: async () => ({ facts: (await import('../../../data/content/d1-vehicle-knowledge/vehicle-facts.json')).default, lessons: (await import('../../../data/content/d1-vehicle-knowledge/vehicle-lessons.json')).default, questions: (await import('../../../data/questions/d1-vehicle-knowledge/vehicle-questions.json')).default, visuals: (await import('../../../data/content/d1-vehicle-knowledge/vehicle-visuals.json')).default }),
  D2_TAXI_LAW: async () => {
    const [facts, lessons, questions, vilotiderFacts, vilotiderLessons, vilotiderQuestions] = await Promise.all([
      import('../../../data/content/d2-taxi-law/remaining-topics-facts.json'),
      import('../../../data/content/d2-taxi-law/remaining-topics-lessons.json'),
      import('../../../data/questions/d2-taxi-law/remaining-topics-questions.json'),
      import('../../../data/content/d2-taxi-law/vilotider-facts.json'),
      import('../../../data/content/d2-taxi-law/vilotider-lessons.json'),
      import('../../../data/questions/d2-taxi-law/vilotider-questions.json'),
    ]);
    return {
      facts: { ...facts.default, facts: [...facts.default.facts, ...vilotiderFacts.default.facts] },
      lessons: { ...lessons.default, lessons: [...lessons.default.lessons, ...vilotiderLessons.default.lessons] },
      questions: { ...questions.default, questions: [...questions.default.questions, ...vilotiderQuestions.default.questions] },
    };
  },
  D2_TRAFFIC_LAW: async () => ({ facts: (await import('../../../data/content/d2-traffic-law/traffic-law-facts.json')).default, lessons: (await import('../../../data/content/d2-traffic-law/traffic-law-lessons.json')).default, questions: (await import('../../../data/questions/d2-traffic-law/traffic-law-questions.json')).default }),
};

export async function loadSubjectContent(subject: string) {
  const loader = loaders[subject];
  if (!loader) throw new Error(`No content loader exists for ${subject}.`);
  return loader();
}

export function getLoadedSubjectKeys() {
  return Object.keys(loaders);
}
