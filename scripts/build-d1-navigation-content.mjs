import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-10';
const contentDir = 'data/content/d1-navigation';
const questionDir = 'data/questions/d1-navigation';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sources = [
  {
    source_key: 'TSFS_2021_119_CONSOLIDATED',
    source_title: 'Transportstyrelsens föreskrifter och allmänna råd om taxiförarlegitimation',
    source_type: 'primary_legal_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'TSFS 2021:119, 3 kap. 2-3 §§',
    url: 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/sok-ts-foreskrifter/details?RuleNumber=2023%3A35&ruleprefix=TSFS',
    relevant_chapter_section: '3 kap. 2 § och 3 kap. 3 § 1-3',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary curriculum authority for D1 Navigering requirements.',
  },
  {
    source_key: 'LANTMATERIET_MIN_KARTA',
    source_title: 'Min karta',
    source_type: 'official_explanatory_source',
    authority: 'Lantmäteriet',
    legal_reference: 'Official map service guidance',
    url: 'https://www.lantmateriet.se/sv/kartor/vara-karttjanster/min-karta/?epslanguage=sv',
    relevant_chapter_section: 'Söka platser/adresser, mäta sträcka, kartlager och utskrift i valfri skala',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for map-tool capabilities used as practical navigation support. No copyrighted map screenshots are embedded.',
  },
  {
    source_key: 'LANTMATERIET_MIN_KARTA_HELP',
    source_title: 'Hjälp och tips till Min karta',
    source_type: 'official_explanatory_source',
    authority: 'Lantmäteriet',
    legal_reference: 'Official map service help',
    url: 'https://www2.lantmateriet.se/sv/kartor/vara-karttjanster/min-karta/hjalp-och-tips-till-min-karta/',
    relevant_chapter_section: 'Position, koordinatsökning, kartlager and GPS accuracy caveats',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official support for search, position and layer use in navigation scenarios.',
  },
  {
    source_key: 'TRAFIKVERKET_TRAFFIC_MAP',
    source_title: 'Trafikinformation vägkarta',
    source_type: 'official_explanatory_source',
    authority: 'Trafikverket',
    legal_reference: 'Official traffic information map',
    url: 'https://www.trafikverket.se/trafikinformation/vag/',
    relevant_chapter_section: 'Traffic state, roadworks, restrictions, rest areas, cameras, road weather, ferries and road condition layers',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for live road information useful when planning efficient taxi routes.',
  },
];

const topics = [
  {
    slug: 'navigeringshjalpmedel',
    title: 'Kartor och navigeringshjälpmedel',
    prefix: 'TOOLS',
    order: 1,
    visual: { requires_map: true, requires_route_scenario: true, requires_oral_route_description: false, requires_distance_estimation: false, requires_travel_time_calculation: false, requires_arrival_time_calculation: false },
    facts: [
      ['D1-NAV-002-001', 'Förarprovet kräver att föraren kan använda kartor, navigationssystem och andra hjälpmedel för att utföra köruppdrag effektivt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 2 §'],
      ['D1-NAV-003-001', 'Förarprovet kräver kännedom om hjälpmedel för färdplanering.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 1'],
      ['D1-NAV-002-001', 'Lantmäteriets Min karta kan användas för att söka platser, adresser och fastigheter samt visa detaljerade kartor och flygbilder över hela Sverige.', 'LANTMATERIET_MIN_KARTA', 'Min karta, Det här kan du göra i Min karta'],
      ['D1-NAV-002-001', 'Min karta har funktioner för att mäta sträcka, välja kartlager, visa position och skriva ut eller spara karta i valfri skala.', 'LANTMATERIET_MIN_KARTA', 'Min karta, Det här kan du göra i Min karta'],
      ['D1-NAV-002-001', 'Trafikverkets vägkarta kan visa trafikläget, vägarbeten, restriktioner, rastplatser, vägväder, vägfärjor och väglagsinformation.', 'TRAFIKVERKET_TRAFFIC_MAP', 'Trafikinformation vägkarta, Hjälp om kartan'],
    ],
  },
  {
    slug: 'muntlig-fardbeskrivning',
    title: 'Muntlig färdbeskrivning',
    prefix: 'ORAL',
    order: 2,
    visual: { requires_map: true, requires_route_scenario: true, requires_oral_route_description: true, requires_distance_estimation: false, requires_travel_time_calculation: false, requires_arrival_time_calculation: false },
    facts: [
      ['D1-NAV-003-002', 'Förarprovet kräver att föraren kan ta emot en muntlig färdbeskrivning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 2'],
      ['D1-NAV-003-003', 'Förarprovet kräver att föraren kan ställa kompletterande frågor när en färdbeskrivning är oklar.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 2'],
      ['D1-NAV-003-004', 'Förarprovet kräver att föraren kan hitta till en angiven plats utifrån färdbeskrivningen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 2'],
      ['D1-NAV-003-002', 'En muntlig färdbeskrivning behöver normalt brytas ner i startpunkt, riktning, hållpunkter, svängar och målpunkt för att kunna följas säkert.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 2'],
      ['D1-NAV-003-003', 'Kompletterande frågor bör klargöra osäkra hållpunkter, gatunamn, infart, entré eller önskad påstignings- och avstigningsplats.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 2'],
    ],
  },
  {
    slug: 'kartlasning',
    title: 'Kartläsning och teckenförklaring',
    prefix: 'MAP',
    order: 3,
    visual: { requires_map: true, requires_route_scenario: true, requires_oral_route_description: false, requires_distance_estimation: true, requires_travel_time_calculation: false, requires_arrival_time_calculation: false },
    facts: [
      ['D1-NAV-003-005', 'Förarprovet kräver att föraren kan hitta och använda navigeringsinformation.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 a'],
      ['D1-NAV-003-006', 'Förarprovet kräver att föraren kan lokalisera rätt kartbild.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 b'],
      ['D1-NAV-003-007', 'Förarprovet kräver att föraren kan avläsa en kartbild korrekt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 b'],
      ['D1-NAV-003-008', 'Förarprovet kräver att föraren kan förstå och använda kartors teckenförklaringar.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 c'],
      ['D1-NAV-003-006', 'En rätt kartbild väljs genom att matcha plats, riktning, skala och relevanta hållpunkter med uppdraget.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 b'],
      ['D1-NAV-003-008', 'Kartlager och teckenförklaringar hjälper föraren att tolka vägar, bebyggelse, hinder, vatten, grönområden och andra kartobjekt.', 'LANTMATERIET_MIN_KARTA_HELP', 'Hjälp och tips till Min karta, Välj kartlager'],
    ],
  },
  {
    slug: 'avstand-restid-ankomst',
    title: 'Avstånd, restid och ankomsttid',
    prefix: 'CALC',
    order: 4,
    visual: { requires_map: true, requires_route_scenario: true, requires_oral_route_description: false, requires_distance_estimation: true, requires_travel_time_calculation: true, requires_arrival_time_calculation: true },
    facts: [
      ['D1-NAV-003-009', 'Förarprovet kräver att föraren kan bedöma avstånd.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 d'],
      ['D1-NAV-003-010A', 'Förarprovet kräver att föraren kan beräkna restid.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 e'],
      ['D1-NAV-003-010B', 'Förarprovet kräver att föraren kan beräkna ankomsttid.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 e'],
      ['D1-NAV-003-010A', 'Restid kan beräknas som avstånd dividerat med genomsnittlig hastighet när avstånd och hastighet är givna i uppgiften.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 e'],
      ['D1-NAV-003-010B', 'Ankomsttid beräknas genom att lägga beräknad restid till avgångstid och ta hänsyn till minuter som passerar hel timme.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 e'],
      ['D1-NAV-003-009', 'När en karta eller uppgift anger delsträckor kan total sträcka bedömas genom att delsträckorna summeras.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 3 § 3 d'],
    ],
  },
];

function topicId(topic) {
  return `topic_d1_navigation_${topic.slug.replaceAll('-', '_')}`;
}

function factKey(topic, index) {
  return `D1-NAV-${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`;
}

function lessonKey(topic) {
  return `D1-NAV-${topic.prefix}-L01`;
}

function makeFacts() {
  return topics.flatMap((topic) =>
    topic.facts.map(([requirement_key, fact_text, source_id, exact_reference], index) => ({
      stable_key: factKey(topic, index),
      topic_id: topicId(topic),
      requirement_key,
      fact_text,
      source_id,
      exact_reference,
      legal_status: source_id === 'TSFS_2021_119_CONSOLIDATED' ? 'binding_curriculum_requirement' : 'official_practical_guidance',
      verified_at: verifiedAt,
      verification_status: 'verified',
      navigation_metadata: topic.visual,
    })),
  );
}

const facts = makeFacts();

function makeLesson(topic) {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  return {
    stable_key: lessonKey(topic),
    topic_id: topicId(topic),
    title: topic.title,
    learning_objectives: [
      `Kunna använda ${topic.title.toLowerCase()} i ett praktiskt taxiuppdrag.`,
      'Kunna välja rätt information, fråga eller beräkning innan färden startar.',
    ],
    requirement_keys: [...new Set(topicFacts.map((fact) => fact.requirement_key))],
    fact_keys: topicFacts.map((fact) => fact.stable_key),
    source_references: [...new Set(topicFacts.map((fact) => fact.source_id))].map((sourceId) => ({
      source_id: sourceId,
      exact_references: topicFacts.filter((fact) => fact.source_id === sourceId).map((fact) => fact.exact_reference),
    })),
    estimated_study_time_minutes: topic.prefix === 'CALC' ? 9 : 7,
    navigation_metadata: topic.visual,
    status: 'published',
    content_blocks: [
      { type: 'heading', text: topic.title, fact_keys: [topicFacts[0].stable_key] },
      {
        type: 'paragraph',
        text: `Det här momentet tränar navigering som en praktisk förarfärdighet: förstå uppdraget, välj rätt hjälpmedel och kontrollera vägen innan du kör.`,
        fact_keys: [topicFacts[0].stable_key],
      },
      {
        type: 'bullet_list',
        items: topicFacts.slice(0, 4).map((fact) => fact.fact_text),
        fact_keys: topicFacts.slice(0, 4).map((fact) => fact.stable_key),
      },
      {
        type: topic.prefix === 'CALC' ? 'worked_example' : 'example',
        ...(topic.prefix === 'CALC'
          ? {
              title: 'Räkna restid',
              timeline: ['Sträcka: 18 km', 'Genomsnittlig hastighet: 36 km/tim', '18 / 36 timmar = 0,5 timmar'],
              reasoning: '0,5 timmar är 30 minuter. Startar färden 14.10 blir beräknad ankomst 14.40.',
              final_answer: 'Restiden är 30 minuter och ankomsttiden blir 14.40.',
            }
          : {
              text: topic.visual.requires_oral_route_description
                ? 'Om kunden säger "kör mot stationen och ta andra höger efter bron" bör du bekräfta vilken bro och vilken entré kunden menar.'
                : 'Om två rutter är möjliga bör du välja den som bäst matchar uppdragets mål, trafikinformation och kundens behov.',
            }),
        fact_keys: [topicFacts[Math.min(1, topicFacts.length - 1)].stable_key],
      },
      {
        type: 'info',
        text: 'Kart- och scenariouppgifter använder egna enkla kartmetadata eller framtida genererade diagram, inte externa teoriboksbilder.',
        fact_keys: [topicFacts[0].stable_key],
      },
      { type: 'checkpoint', text: 'Kan du förklara vilket hjälpmedel, vilken fråga eller vilken beräkning som behövs?', fact_keys: [topicFacts[0].stable_key] },
    ],
  };
}

const mapFixtures = [
  { id: 'simple_grid_center_route', description: 'Egen schematisk rutnätskarta med Start, Torg, Bro, Station och Sjukhus.', nodes: ['Start', 'Torg', 'Bro', 'Station', 'Sjukhus'], route: ['Start', 'Torg', 'Bro', 'Station'] },
  { id: 'simple_suburb_route', description: 'Egen schematisk karta med huvudgata, sidogata, park och entré.', nodes: ['Hållplats', 'Park', 'Skola', 'Entré'], route: ['Hållplats', 'Park', 'Skola', 'Entré'] },
  { id: 'simple_distance_segments', description: 'Egen linjekarta med delsträckor 4 km, 6 km och 8 km.', segments_km: [4, 6, 8] },
];

function makeQuestion(topic, index) {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  const fact = topicFacts[index % topicFacts.length];
  const isCalc = fact.requirement_key.includes('010') || fact.requirement_key.includes('009');
  const type = isCalc ? 'calculation' : index % 2 === 0 || topic.visual.requires_route_scenario ? 'scenario' : 'single_choice';
  const caseLabel = `${topic.prefix}-fall ${index + 1}`;
  const map = topic.visual.requires_map ? mapFixtures[index % mapFixtures.length] : undefined;
  const prompt = isCalc
    ? `${caseLabel}: En schematisk rutt är ${index % 2 === 0 ? '18 km och medelhastigheten är 36 km/tim. Hur lång är restiden?' : '24 km och medelhastigheten är 48 km/tim. Om start är 09.20, när blir ankomsten?'}`
    : `${caseLabel}: Vilket svar passar navigeringskravet? ${fact.fact_text}`;
  const correctText = isCalc
    ? index % 2 === 0
      ? '30 minuter.'
      : '09.50.'
    : fact.fact_text;

  return {
    stable_key: `D1-NAV-${topic.prefix}-Q${String(index + 1).padStart(3, '0')}`,
    version: 1,
    topic_id: topicId(topic),
    requirement_keys: [fact.requirement_key],
    fact_keys: [fact.stable_key],
    lesson_key: lessonKey(topic),
    question_type: type,
    competencies: type === 'calculation' ? ['beräkna'] : type === 'scenario' ? ['använda'] : ['känna igen'],
    navigation_metadata: topic.visual,
    map_metadata: map,
    prompt,
    answer_choices: [
      { id: 'A', text: correctText },
      { id: 'B', text: `${caseLabel}: välj första möjliga väg utan att kontrollera uppdragets mål eller information.` },
      { id: 'C', text: `${caseLabel}: använd bara minnet även när plats, färdväg eller tid är oklar.` },
      { id: 'D', text: `${caseLabel}: avbryt planeringen eftersom navigering inte ingår i förarens uppgift.` },
    ],
    correct_answer_id: 'A',
    explanation: `Rätt: ${correctText} ${isCalc ? 'Beräkningen följer av uppgiftens sträcka, hastighet och tid.' : 'Svaret följer av navigeringskravet och den verifierade källan.'} Repetera lektion 1.`,
    difficulty: index < 3 ? 'easy' : index < 6 ? 'medium' : 'hard',
    source_references: [{ source_id: fact.source_id, exact_reference: fact.exact_reference }],
    status: 'published',
  };
}

const lessons = topics.map(makeLesson);
const questions = topics.flatMap((topic) => Array.from({ length: topic.prefix === 'CALC' ? 12 : 10 }, (_, index) => makeQuestion(topic, index)));
const topicCheckpoints = topics.map((topic) => ({
  stable_key: `D1-NAV-${topic.prefix}-CHECKPOINT-001`,
  title: `Intern checkpoint: ${topic.title}`,
  type: 'checkpoint',
  subject: 'D1_NAVIGATION',
  topic: topicId(topic),
  eligible_status: 'published',
  question_count: topic.prefix === 'CALC' ? 10 : 8,
  pass_threshold: 0.8,
  selection: 'random_from_eligible_published_questions',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
}));

const subjectCheckpoint = {
  stable_key: 'D1-NAV-SUBJECT-CHECKPOINT-001',
  title: 'Intern ämnescheckpoint: Navigering',
  type: 'checkpoint',
  subject: 'D1_NAVIGATION',
  topic: null,
  eligible_status: 'published',
  question_count: 24,
  pass_threshold: 0.8,
  selection: 'broad_sample_across_all_d1_navigation_topics',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
};

writeFileSync(
  'data/curriculum/d1-navigation-sources.json',
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_NAVIGATION',
        phase: 'source_expansion',
        language: 'sv',
        scope: 'Authoritative source map for TSFS 2021:119, 3 kap. 2-3 §§.',
        created_at: verifiedAt,
        last_verified_at: verifiedAt,
      },
      source_catalog: sources,
      requirement_source_map: [
        ['D1-NAV-002-001', 'TSFS 2021:119, 3 kap. 2 §', ['TSFS_2021_119_CONSOLIDATED', 'LANTMATERIET_MIN_KARTA', 'TRAFIKVERKET_TRAFFIC_MAP']],
        ['D1-NAV-003-001', 'TSFS 2021:119, 3 kap. 3 § 1', ['TSFS_2021_119_CONSOLIDATED', 'LANTMATERIET_MIN_KARTA', 'TRAFIKVERKET_TRAFFIC_MAP']],
        ['D1-NAV-003-002', 'TSFS 2021:119, 3 kap. 3 § 2', ['TSFS_2021_119_CONSOLIDATED']],
        ['D1-NAV-003-003', 'TSFS 2021:119, 3 kap. 3 § 2', ['TSFS_2021_119_CONSOLIDATED']],
        ['D1-NAV-003-004', 'TSFS 2021:119, 3 kap. 3 § 2', ['TSFS_2021_119_CONSOLIDATED']],
        ['D1-NAV-003-005', 'TSFS 2021:119, 3 kap. 3 § 3 a', ['TSFS_2021_119_CONSOLIDATED', 'LANTMATERIET_MIN_KARTA_HELP']],
        ['D1-NAV-003-006', 'TSFS 2021:119, 3 kap. 3 § 3 b', ['TSFS_2021_119_CONSOLIDATED', 'LANTMATERIET_MIN_KARTA_HELP']],
        ['D1-NAV-003-007', 'TSFS 2021:119, 3 kap. 3 § 3 b', ['TSFS_2021_119_CONSOLIDATED', 'LANTMATERIET_MIN_KARTA_HELP']],
        ['D1-NAV-003-008', 'TSFS 2021:119, 3 kap. 3 § 3 c', ['TSFS_2021_119_CONSOLIDATED', 'LANTMATERIET_MIN_KARTA_HELP']],
        ['D1-NAV-003-009', 'TSFS 2021:119, 3 kap. 3 § 3 d', ['TSFS_2021_119_CONSOLIDATED']],
        ['D1-NAV-003-010A', 'TSFS 2021:119, 3 kap. 3 § 3 e', ['TSFS_2021_119_CONSOLIDATED']],
        ['D1-NAV-003-010B', 'TSFS 2021:119, 3 kap. 3 § 3 e', ['TSFS_2021_119_CONSOLIDATED']],
      ].map(([requirement_key, official_requirement_reference, sourceKeys]) => ({
        requirement_key,
        official_requirement_reference,
        sources: sourceKeys.map((key) => sources.find((source) => source.source_key === key)),
        overall_status: 'FULLY_SOURCED',
      })),
      pedagogical_topics: topics.map((topic) => ({
        topic_id: topicId(topic),
        title: topic.title,
        requirement_keys: [...new Set(facts.filter((fact) => fact.topic_id === topicId(topic)).map((fact) => fact.requirement_key))],
        navigation_metadata: topic.visual,
        status: 'published',
      })),
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${contentDir}/navigation-facts.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_NAVIGATION',
        title: 'D1 navigation verified facts',
        verified_at: verifiedAt,
        status: 'verified',
        policy: 'Every statement used by lessons and questions must reference one or more fact stable keys.',
      },
      sources: sources.map((source) => ({
        source_id: source.source_key,
        source_title: source.source_title,
        authority: source.authority,
        source_type: source.source_type,
        url: source.url,
        current_validity: `${source.legal_reference}; ${source.source_status.toLowerCase()} ${source.last_verified_at}. ${source.notes}`,
      })),
      facts,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${contentDir}/navigation-lessons.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_NAVIGATION',
        title: 'D1 navigation lessons',
        status: 'published',
        verified_at: verifiedAt,
        note: 'Source-backed mobile-first lessons. Map metadata marks topics that need custom diagrams or route scenes.',
      },
      lessons,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${questionDir}/navigation-questions.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_NAVIGATION',
        title: 'D1 navigation question bank',
        status: 'published',
        created_at: verifiedAt,
        reviewed_at: verifiedAt,
        disclaimer: "Internal checkpoints and practice questions. These are not Trafikverket's official question bank.",
      },
      topic_checkpoints: topicCheckpoints,
      subject_checkpoint: subjectCheckpoint,
      questions,
    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote ${topics.length} D1 navigation topics, ${facts.length} facts, ${lessons.length} lessons and ${questions.length} questions.`);
