import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-10';
const contentDir = 'data/content/d1-eco-driving';
const questionDir = 'data/questions/d1-eco-driving';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sources = [
  {
    source_key: 'TSFS_2021_119_CONSOLIDATED',
    source_title: 'Transportstyrelsens föreskrifter och allmänna råd om taxiförarlegitimation',
    source_type: 'primary_legal_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'TSFS 2021:119, 3 kap. 4-5 §§',
    url: 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/ts-foreskrifter-i-nummerordning/2011/details?RuleNumber=2021%3A119&RulePrefix=TSFS',
    relevant_chapter_section: '3 kap. 4 § och 5 § 1-3',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary curriculum authority for D1 Körekonomi requirements.',
  },
  {
    source_key: 'TS_SPARSAM_KORNING',
    source_title: 'Sparsam körning',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official guidance on sparsam körning',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/miljo/klimat-och-energi/sparsam-korning/',
    relevant_chapter_section: 'Right tire pressure, speed limits, removing roof rack/roof box, speed effect on fuel use and driving-test relevance',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official guidance page, senast uppdaterad 2026-08-26.',
  },
  {
    source_key: 'TRV_HASTIGHET_HALLBARHET',
    source_title: 'Hastighet och hållbarhet',
    source_type: 'official_explanatory_source',
    authority: 'Trafikverket',
    legal_reference: 'Official road-safety and sustainability guidance',
    url: 'https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/hastighetsgranser-pa-vag/hastighet-och-hallbarhet/',
    relevant_chapter_section: 'Relationship between speed, fuel consumption and carbon dioxide emissions',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official explanatory source, senast uppdaterad 2022-03-31.',
  },
  {
    source_key: 'TS_DACK_PERSONBIL',
    source_title: 'Krav på däck för personbil',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official vehicle/tire guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/dack/Dackbyte-pa-personbil/',
    relevant_chapter_section: 'Tire type, load capacity, dimensions and checking tire pressure',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for tire pressure, driving properties, fuel consumption and tire life; senast uppdaterad 2025-11-11.',
  },
  {
    source_key: 'ENERGIMYNDIGHETEN_TRANSPORT_ATGARDER',
    source_title: 'Åtgärder som inte kräver en investering',
    source_type: 'official_explanatory_source',
    authority: 'Energimyndigheten',
    legal_reference: 'Official energy-efficiency guidance for companies',
    url: 'https://www.energimyndigheten.se/guide-for-energieffektiva-foretag/genomfor-och-finansiera-atgarder/genomforande-av-investeringsfria-atgarder/atgarder-som-inte-kraver-en-investering/',
    relevant_chapter_section: 'Åtgärder för transporter: sparsam körning, reduced fuel consumption, lower service/maintenance costs, logistics planning and route optimisation',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official energy authority guidance; senast uppdaterad 2025-05-14.',
  },
];

const topics = [
  {
    slug: 'ekonomisk-korning',
    title: 'Ekonomisk körning',
    prefix: 'ECON',
    order: 1,
    facts: [
      ['D1-ECO-004-001', 'Förarprovet kräver kunskap om hur bästa körekonomin kan uppnås.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 4 §'],
      ['D1-ECO-005-001', 'Förarprovet kräver att föraren kan redogöra för faktorer som främjar ekonomisk körning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 5 § 1'],
      ['D1-ECO-004-001', 'Sparsam körning handlar om körteknik för lägre bränsleförbrukning och ingår i helhetsbedömningen av körningen.', 'TS_SPARSAM_KORNING', 'Sparsam körning, Sparsam körning i förarprovet och förarutbildningen'],
      ['D1-ECO-005-001', 'Rätt lufttryck i däcken, att hålla hastighetsgränserna och att ta bort takräcke eller takbox när de inte behövs är exempel på sparsam körning.', 'TS_SPARSAM_KORNING', 'Sparsam körning, inledande vägledning'],
      ['D1-ECO-005-001', 'För en taxiförare innebär god körekonomi att köra mjukt, planerat och utan onödiga energiförluster samtidigt som säkerhet och regelkrav går först.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 4-5 §§'],
    ],
  },
  {
    slug: 'bransleforbrukning',
    title: 'Bränsleförbrukning',
    prefix: 'FUEL',
    order: 2,
    facts: [
      ['D1-ECO-005-002', 'Förarprovet kräver att föraren kan redogöra för andra faktorer som påverkar bränsleförbrukning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 5 § 2'],
      ['D1-ECO-005-002', 'Bränsleförbrukningen påverkas av hastigheten; ju fortare bilen körs, desto mer bränsle går åt.', 'TS_SPARSAM_KORNING', 'Sparsam körning, hastighet och bränsleförbrukning'],
      ['D1-ECO-005-002', 'Transportstyrelsen anger att varje 10 km/tim högre hastighet över 70-75 km/tim ökar bränsleförbrukningen med ungefär 0,5-1,0 deciliter per mil.', 'TS_SPARSAM_KORNING', 'Sparsam körning, hastighet och bränsleförbrukning'],
      ['D1-ECO-005-002', 'Trafikverket beskriver ett tydligt samband mellan bränsleförbrukning och koldioxidutsläpp, där högre hastighet ger större bränsleförbrukning och mer utsläpp.', 'TRV_HASTIGHET_HALLBARHET', 'Hastighet och hållbarhet, hastighetens betydelse'],
      ['D1-ECO-005-002', 'Onödig last och yttre utrustning som takräcke eller takbox när den inte behövs kan öka energiförlusterna och försämra körekonomin.', 'TS_SPARSAM_KORNING', 'Sparsam körning, inledande vägledning'],
    ],
  },
  {
    slug: 'planering-korsatt',
    title: 'Planering och körsätt',
    prefix: 'PLAN',
    order: 3,
    facts: [
      ['D1-ECO-005-001', 'Faktorer som främjar ekonomisk körning ska kunna förklaras, inte bara kännas igen som lösa tips.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 5 § 1'],
      ['D1-ECO-005-001', 'Körsättet har stor betydelse för utsläpp och buller.', 'TS_SPARSAM_KORNING', 'Sparsam körning, inledande vägledning'],
      ['D1-ECO-005-001', 'Att hålla hastighetsgränserna är både ett sparsam-körning-råd och en del av att undvika onödigt hög bränsleförbrukning.', 'TS_SPARSAM_KORNING', 'Sparsam körning, inledande vägledning'],
      ['D1-ECO-005-001', 'Logistikplanering och ruttoptimering anges av Energimyndigheten som transportåtgärder för energieffektivisering.', 'ENERGIMYNDIGHETEN_TRANSPORT_ATGARDER', 'Åtgärder för transporter'],
      ['D1-ECO-005-001', 'För en taxi kan god planering minska tomkörning, felkörning och onödiga stopp, vilket stödjer både effektivt uppdrag och körekonomi.', 'ENERGIMYNDIGHETEN_TRANSPORT_ATGARDER', 'Åtgärder för transporter: logistikplanera och ruttoptimera'],
    ],
  },
  {
    slug: 'fordonsunderhall-korekonomi',
    title: 'Fordonsunderhåll och körekonomi',
    prefix: 'MAINT',
    order: 4,
    facts: [
      ['D1-ECO-005-003', 'Förarprovet kräver att föraren kan bedöma sambandet mellan förebyggande fordonsunderhåll och god körekonomi.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 5 § 3'],
      ['D1-ECO-005-003', 'Fel däcktryck kan påverka köregenskaper, bränsleförbrukning och däckens livslängd.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, Kolla däckens lufttryck ofta'],
      ['D1-ECO-005-003', 'Rätt däcktryck för däcken till bilen finns i bilens instruktionsbok enligt Transportstyrelsens vägledning.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, Kolla däckens lufttryck ofta'],
      ['D1-ECO-005-003', 'Däck ska ha belastningsförmåga som motsvarar bilens största tillåtna axelbelastning.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, Belastningsförmåga'],
      ['D1-ECO-005-003', 'Sparsam körning kan enligt Energimyndigheten minska bränsleförbrukning och kostnader för service och underhåll.', 'ENERGIMYNDIGHETEN_TRANSPORT_ATGARDER', 'Åtgärder för transporter'],
      ['D1-ECO-005-003', 'Förebyggande kontroll av däck, last och onödig yttre utrustning är praktiska fordonsåtgärder som stödjer god körekonomi.', 'TS_SPARSAM_KORNING', 'Sparsam körning, inledande vägledning'],
    ],
  },
];

function topicId(topic) {
  return `topic_d1_eco_${topic.slug.replaceAll('-', '_')}`;
}

function factKey(topic, index) {
  return `D1-ECO-${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`;
}

function lessonKey(topic) {
  return `D1-ECO-${topic.prefix}-L01`;
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
      legal_or_guidance_status: source_id === 'TSFS_2021_119_CONSOLIDATED' ? 'binding_curriculum_requirement' : 'official_guidance',
      verified_at: verifiedAt,
      verification_status: 'verified',
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
      `Förstå hur ${topic.title.toLowerCase()} påverkar taxiuppdragets kostnader.`,
      'Kunna välja ett körsätt eller en fordonsåtgärd som stödjer god körekonomi.',
    ],
    requirement_keys: [...new Set(topicFacts.map((fact) => fact.requirement_key))],
    fact_keys: topicFacts.map((fact) => fact.stable_key),
    source_references: [...new Set(topicFacts.map((fact) => fact.source_id))].map((sourceId) => ({
      source_id: sourceId,
      exact_references: topicFacts.filter((fact) => fact.source_id === sourceId).map((fact) => fact.exact_reference),
    })),
    estimated_study_time_minutes: topic.prefix === 'MAINT' ? 8 : 6,
    status: 'published',
    content_blocks: [
      { type: 'heading', text: topic.title, fact_keys: [topicFacts[0].stable_key] },
      {
        type: 'paragraph',
        text: 'Körekonomi handlar om att minska onödig förbrukning utan att tumma på säkerhet, trafikregler eller kundens uppdrag.',
        fact_keys: [topicFacts[0].stable_key],
      },
      {
        type: 'bullet_list',
        items: topicFacts.slice(0, 4).map((fact) => fact.fact_text),
        fact_keys: topicFacts.slice(0, 4).map((fact) => fact.stable_key),
      },
      {
        type: 'example',
        text:
          topic.prefix === 'MAINT'
            ? 'Inför ett långt pass kontrollerar du däcktryck och tar bort utrustning som inte behövs. Det är en förebyggande åtgärd, inte bara en verkstadsfråga.'
            : 'När två rimliga färdvägar finns väljer du den som minskar onödiga stopp och omvägar, samtidigt som kundens önskemål och trafiksäkerheten respekteras.',
        fact_keys: [topicFacts[Math.min(1, topicFacts.length - 1)].stable_key],
      },
      {
        type: 'warning',
        text: 'Körekonomi får aldrig användas som skäl för att köra för fort, för nära eller på annat sätt osäkert.',
        fact_keys: [topicFacts[0].stable_key],
      },
      { type: 'checkpoint', text: 'Kan du koppla åtgärden till lägre förbrukning eller bättre fordonsdrift?', fact_keys: [topicFacts[0].stable_key] },
    ],
  };
}

function makeQuestion(topic, index) {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  const fact = topicFacts[index % topicFacts.length];
  const isScenario = topic.prefix === 'MAINT' || topic.prefix === 'PLAN' || index % 2 === 0;
  const caseLabel = `${topic.prefix}-fall ${index + 1}`;

  return {
    stable_key: `D1-ECO-${topic.prefix}-Q${String(index + 1).padStart(3, '0')}`,
    version: 1,
    topic_id: topicId(topic),
    requirement_keys: [fact.requirement_key],
    fact_keys: [fact.stable_key],
    lesson_key: lessonKey(topic),
    question_type: isScenario ? 'scenario' : 'single_choice',
    competencies: isScenario ? ['bedöma'] : ['redogöra'],
    prompt: `${caseLabel}: Vilket svar stämmer bäst för körekonomi? ${fact.fact_text}`,
    answer_choices: [
      { id: 'A', text: fact.fact_text },
      { id: 'B', text: `${caseLabel}: körekonomi betyder alltid att välja högsta möjliga hastighet för att bli klar snabbare.` },
      { id: 'C', text: `${caseLabel}: fordonskontroller påverkar inte bränsleförbrukning eller driftskostnad.` },
      { id: 'D', text: `${caseLabel}: sparsam körning gäller inte när bilen används som taxi.` },
    ],
    correct_answer_id: 'A',
    explanation: `Rätt: ${fact.fact_text} Svaret följer av den verifierade källan och kopplar åtgärden till bränsleförbrukning, drift eller provkrav. Repetera lektion 1.`,
    difficulty: index < 3 ? 'easy' : index < 6 ? 'medium' : 'hard',
    source_references: [{ source_id: fact.source_id, exact_reference: fact.exact_reference }],
    status: 'published',
  };
}

const lessons = topics.map(makeLesson);
const questions = topics.flatMap((topic) => Array.from({ length: topic.prefix === 'MAINT' ? 10 : 8 }, (_, index) => makeQuestion(topic, index)));
const topicCheckpoints = topics.map((topic) => ({
  stable_key: `D1-ECO-${topic.prefix}-CHECKPOINT-001`,
  title: `Intern checkpoint: ${topic.title}`,
  type: 'checkpoint',
  subject: 'D1_ECO_DRIVING',
  topic: topicId(topic),
  eligible_status: 'published',
  question_count: topic.prefix === 'MAINT' ? 8 : 6,
  pass_threshold: 0.8,
  selection: 'random_from_eligible_published_questions',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
}));

const subjectCheckpoint = {
  stable_key: 'D1-ECO-SUBJECT-CHECKPOINT-001',
  title: 'Intern ämnescheckpoint: Körekonomi',
  type: 'checkpoint',
  subject: 'D1_ECO_DRIVING',
  topic: null,
  eligible_status: 'published',
  question_count: 20,
  pass_threshold: 0.8,
  selection: 'broad_sample_across_all_d1_eco_driving_topics',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
};

const requirementMap = [
  ['D1-ECO-004-001', 'TSFS 2021:119, 3 kap. 4 §', ['TSFS_2021_119_CONSOLIDATED', 'TS_SPARSAM_KORNING']],
  ['D1-ECO-005-001', 'TSFS 2021:119, 3 kap. 5 § 1', ['TSFS_2021_119_CONSOLIDATED', 'TS_SPARSAM_KORNING', 'TRV_HASTIGHET_HALLBARHET', 'ENERGIMYNDIGHETEN_TRANSPORT_ATGARDER']],
  ['D1-ECO-005-002', 'TSFS 2021:119, 3 kap. 5 § 2', ['TSFS_2021_119_CONSOLIDATED', 'TS_SPARSAM_KORNING', 'TRV_HASTIGHET_HALLBARHET']],
  ['D1-ECO-005-003', 'TSFS 2021:119, 3 kap. 5 § 3', ['TSFS_2021_119_CONSOLIDATED', 'TS_DACK_PERSONBIL', 'ENERGIMYNDIGHETEN_TRANSPORT_ATGARDER']],
];

writeFileSync(
  'data/curriculum/d1-eco-driving-sources.json',
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_ECO_DRIVING',
        phase: 'source_expansion',
        language: 'sv',
        scope: 'Authoritative source map for TSFS 2021:119, 3 kap. 4-5 §§.',
        created_at: verifiedAt,
        last_verified_at: verifiedAt,
      },
      source_catalog: sources,
      requirement_source_map: requirementMap.map(([requirement_key, official_requirement_reference, sourceKeys]) => ({
        requirement_key,
        official_requirement_reference,
        sources: sourceKeys.map((key) => sources.find((source) => source.source_key === key)),
        overall_status: 'FULLY_SOURCED',
      })),
      pedagogical_topics: topics.map((topic) => ({
        topic_id: topicId(topic),
        title: topic.title,
        requirement_keys: [...new Set(facts.filter((fact) => fact.topic_id === topicId(topic)).map((fact) => fact.requirement_key))],
        status: 'published',
      })),
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${contentDir}/eco-driving-facts.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_ECO_DRIVING',
        title: 'D1 eco-driving verified facts',
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
  `${contentDir}/eco-driving-lessons.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_ECO_DRIVING',
        title: 'D1 eco-driving lessons',
        status: 'published',
        verified_at: verifiedAt,
        note: 'Source-backed mobile-first lessons for taxi-driver use cases.',
      },
      lessons,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${questionDir}/eco-driving-questions.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_ECO_DRIVING',
        title: 'D1 eco-driving question bank',
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

console.log(`Wrote ${topics.length} D1 eco-driving topics, ${facts.length} facts, ${lessons.length} lessons and ${questions.length} questions.`);
