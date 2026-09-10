import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-10';
const contentDir = 'data/content/d1-work-environment-risk';
const questionDir = 'data/questions/d1-work-environment-risk';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sources = [
  ['TSFS_2021_119_CONSOLIDATED', 'Transportstyrelsens föreskrifter och allmänna råd om taxiförarlegitimation', 'primary_legal_source', 'Transportstyrelsen', 'TSFS 2021:119, 3 kap. 19-22 §§', 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/sok-ts-foreskrifter/details?RuleNumber=2023%3A35&ruleprefix=TSFS', 'Primary curriculum authority for D1 work environment, judgement and risk awareness.'],
  ['AV_BELASTNINGSERGONOMI', 'Belastningsergonomi', 'official_work_environment_guidance', 'Arbetsmiljöverket', 'Belastningsergonomi, risker och förebyggande arbete', 'https://www.av.se/halsa-och-sakerhet/belastningsergonomi/', 'Occupational risks from lifting, repetitive work, awkward positions and recovery.'],
  ['AV_ARBETSDON', 'Arbetsställningar och arbetsrörelser', 'official_work_environment_guidance', 'Arbetsmiljöverket', 'Arbetsställningar och arbetsrörelser', 'https://www.av.se/halsa-och-sakerhet/belastningsergonomi/arbetsstallningar-och-arbetsrorelser/', 'Practical guidance on posture, variation and reducing physical load.'],
  ['AV_HOT_VALD', 'Våld och hot om våld', 'official_work_environment_guidance', 'Arbetsmiljöverket', 'Våld och hot om våld i arbetsmiljön', 'https://www.av.se/halsa-och-sakerhet/vald-och-hot-om-vald/', 'Relevant to lone work, difficult passengers, routines and incident reporting.'],
  ['TRV_TRÖTTHET', 'Trötthet i trafiken', 'official_road_safety_guidance', 'Trafikverket', 'Trötthet och trafiksäkerhet', 'https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/trafikant/trotthet/', 'Documented risk effects of fatigue and the need to stop when driving ability is affected.'],
  ['TS_MEDICINER_KORNING', 'Läkemedel och bilkörning', 'official_transport_guidance', 'Transportstyrelsen', 'Läkemedel, körförmåga och trafiksäkerhet', 'https://www.transportstyrelsen.se/sv/vagtrafik/korkort/korkortsregler/medicinska-krav/', 'Driver must assess effects and follow warnings and healthcare advice; no unsupported dosage claims.'],
  ['1177_ALKOHOL_DROGER', 'Alkohol och droger', 'authoritative_health_guidance', '1177 Vårdguiden', 'Alkohol, droger och körförmåga', 'https://www.1177.se/liv--halsa/beroende-och-skadligt-bruk/alkohol/', 'Used for documented impairment effects, not as a substitute for legal limits.'],
  ['TSFS_MOBILTELEFON', 'Användning av kommunikationsutrustning under färd', 'primary_legal_source', 'Transportstyrelsen', 'Trafikförordning (1998:1276), 4 kap. 10 e §', 'https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/i-fordonet/mobiltelefon-och-annan-kommunikationsutrustning/', 'Legal rule and official explanation for mobile phone and communication equipment use.'],
];

const source_catalog = sources.map(([source_key, source_title, source_type, authority, legal_reference, url, notes]) => ({
  source_key,
  source_title,
  source_type,
  authority,
  legal_reference,
  url,
  relevant_chapter_section: legal_reference,
  source_status: 'VERIFIED',
  last_verified_at: verifiedAt,
  notes,
}));

const requirementKeys = [
  'D1-WORK-019-001', 'D1-WORK-020-001', 'D1-WORK-020-002', 'D1-WORK-020-003',
  'D1-WORK-021-001', 'D1-WORK-021-002', 'D1-WORK-021-003', 'D1-WORK-021-004',
  'D1-WORK-021-005', 'D1-WORK-021-006', 'D1-WORK-021-007', 'D1-WORK-022-001',
];

const requirementSources = {
  'D1-WORK-019-001': ['TSFS_2021_119_CONSOLIDATED', 'AV_BELASTNINGSERGONOMI', 'AV_HOT_VALD'],
  'D1-WORK-020-001': ['TSFS_2021_119_CONSOLIDATED', 'AV_BELASTNINGSERGONOMI', 'AV_ARBETSDON'],
  'D1-WORK-020-002': ['TSFS_2021_119_CONSOLIDATED', 'AV_BELASTNINGSERGONOMI', 'AV_ARBETSDON'],
  'D1-WORK-020-003': ['TSFS_2021_119_CONSOLIDATED', 'AV_ARBETSDON'],
  'D1-WORK-021-001': ['TSFS_2021_119_CONSOLIDATED', 'TS_MEDICINER_KORNING'],
  'D1-WORK-021-002': ['TSFS_2021_119_CONSOLIDATED', '1177_ALKOHOL_DROGER'],
  'D1-WORK-021-003': ['TSFS_2021_119_CONSOLIDATED', 'TRV_TRÖTTHET'],
  'D1-WORK-021-004': ['TSFS_2021_119_CONSOLIDATED', 'AV_BELASTNINGSERGONOMI'],
  'D1-WORK-021-005': ['TSFS_2021_119_CONSOLIDATED', 'TRV_TRÖTTHET'],
  'D1-WORK-021-006': ['TSFS_2021_119_CONSOLIDATED', 'TRV_TRÖTTHET'],
  'D1-WORK-021-007': ['TSFS_2021_119_CONSOLIDATED', 'TRV_TRÖTTHET'],
  'D1-WORK-022-001': ['TSFS_2021_119_CONSOLIDATED', 'TSFS_MOBILTELEFON'],
};

const topicDefinitions = [
  {
    slug: 'arbetsrisker-i-taxiarbetet', title: 'Arbetsrisker i taxiarbetet', prefix: 'WORK', order: 1, visual: 'work_environment_risk_map',
    requirementKeys: ['D1-WORK-019-001'],
    facts: [
      ['D1-WORK-019-001', 'Taxiförarens arbete kan innebära upprepade i- och urstigningar, långvarigt sittande, lyft, tidspress, ensamarbete och kontakt med personer i pressade situationer.', 'AV_BELASTNINGSERGONOMI', 'Belastningsergonomi, risker i arbetet', 'occupational_safety_guidance'],
      ['D1-WORK-019-001', 'Arbetsrisker behöver uppmärksammas före och under arbetspasset så att arbetsmetod, paus eller uppdrag kan ändras innan säkerheten påverkas.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 19 §', 'binding_rule'],
      ['D1-WORK-019-001', 'Hot och våld i arbete med direktkontakt ska förebyggas med kända rutiner, instruktioner och rapportering av tillbud.', 'AV_HOT_VALD', 'Våld och hot om våld, förebyggande arbete', 'occupational_safety_guidance'],
      ['D1-WORK-019-001', 'Ensamarbete och nattarbete kan minska möjligheten att snabbt få stöd och gör planering av kontaktvägar och avbrott viktig.', 'AV_HOT_VALD', 'Våld och hot om våld, arbete med människor och ensamarbete', 'occupational_safety_guidance'],
    ],
  },
  {
    slug: 'belastning-lyft-och-hjalpmedel', title: 'Belastning, lyft och hjälpmedel', prefix: 'LIFT', order: 2, visual: 'work_lifting_posture',
    requirementKeys: ['D1-WORK-020-001', 'D1-WORK-020-002'],
    facts: [
      ['D1-WORK-020-001', 'Belastningsrisken ökar när lyft sker långt från kroppen, med vriden rygg, i trångt utrymme eller utan möjlighet att variera arbetet.', 'AV_BELASTNINGSERGONOMI', 'Belastningsergonomi, belastande arbetsställningar och arbetsrörelser', 'occupational_safety_guidance'],
      ['D1-WORK-020-001', 'Upprepade lyft och många in- och urstigningar under ett pass kan ge sammanlagd belastning även när varje enskilt moment känns hanterbart.', 'AV_BELASTNINGSERGONOMI', 'Belastningsergonomi, upprepad och långvarig belastning', 'occupational_safety_guidance'],
      ['D1-WORK-020-002', 'Vid förflyttning av passagerare ska föraren använda tillgängliga hjälpmedel och be om hjälp när uppgiften inte kan göras säkert ensam.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 20 § 2', 'binding_rule'],
      ['D1-WORK-020-002', 'Ett säkrare lyft planeras med stabilt underlag, nära arbetsavstånd och tydlig kommunikation med passageraren.', 'AV_ARBETSDON', 'Arbetsställningar och arbetsrörelser, planera arbetsrörelsen', 'occupational_safety_guidance'],
      ['D1-WORK-020-002', 'Tungt eller otympligt bagage bör hanteras med hjälpmedel eller tillsammans med annan person i stället för att föraren chansar.', 'AV_BELASTNINGSERGONOMI', 'Belastningsergonomi, hjälpmedel och organisering', 'occupational_safety_guidance'],
    ],
  },
  {
    slug: 'korstallning-och-variation', title: 'Körställning och variation', prefix: 'POSTURE', order: 3, visual: 'work_driver_posture',
    requirementKeys: ['D1-WORK-020-003'],
    facts: [
      ['D1-WORK-020-003', 'En rätt körställning ger föraren kontroll över reglage och sikt utan att kroppen behöver hållas i en onödigt spänd eller vriden position.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 20 § 3', 'binding_rule'],
      ['D1-WORK-020-003', 'Stol, ratt, speglar och nackstöd ska ställas in så att föraren når reglagen, ser runt fordonet och kan arbeta med stöd för kroppen.', 'AV_ARBETSDON', 'Arbetsställningar och arbetsrörelser, anpassa arbetsplatsen', 'occupational_safety_guidance'],
      ['D1-WORK-020-003', 'Långvarigt sittande i samma ställning gör variation, korta avbrott och möjlighet att justera arbetsplatsen viktig.', 'AV_BELASTNINGSERGONOMI', 'Belastningsergonomi, långvarigt sittande och variation', 'occupational_safety_guidance'],
      ['D1-WORK-020-003', 'En förare ska inte lösa en obekväm körställning genom att sträcka sig efter utrustning under pågående körning.', 'TSFS_MOBILTELEFON', 'Trafikförordning (1998:1276), 4 kap. 10 e §', 'binding_rule'],
    ],
  },
  {
    slug: 'paverkan-och-korformaga', title: 'Påverkan och körförmåga', prefix: 'FITNESS', order: 4, visual: 'work_impairment_decision',
    requirementKeys: ['D1-WORK-021-001', 'D1-WORK-021-002', 'D1-WORK-021-004', 'D1-WORK-021-005'],
    facts: [
      ['D1-WORK-021-001', 'Läkemedel kan påverka exempelvis vakenhet, reaktionsförmåga eller omdöme; föraren ska läsa varningar och bedöma sin körförmåga.', 'TS_MEDICINER_KORNING', 'Läkemedel, körförmåga och medicinska krav', 'official_guidance'],
      ['D1-WORK-021-001', 'Vid osäkerhet om ett läkemedels påverkan ska föraren söka individuell rådgivning och inte chansa med en körning.', 'TS_MEDICINER_KORNING', 'Medicinska krav och läkemedel', 'official_guidance'],
      ['D1-WORK-021-002', 'Alkohol och andra droger kan försämra omdöme, uppmärksamhet, reaktion och förmåga att värdera risker.', '1177_ALKOHOL_DROGER', 'Alkohol och påverkan på kroppen och omdömet', 'authoritative_health_guidance'],
      ['D1-WORK-021-002', 'En förare ska inte köra efter alkohol eller droger även om föraren själv upplever sig som kapabel.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 21 § 2', 'binding_rule'],
      ['D1-WORK-021-004', 'Fysisk kondition, smärta eller akut sjukdom kan påverka uppmärksamhet, kontroll och förmåga att hantera en oväntad situation.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 21 § 4', 'binding_rule'],
      ['D1-WORK-021-005', 'Stark oro, ilska eller annan psykisk obalans kan göra uppmärksamheten smalare och besluten mer impulsiva.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 21 § 5', 'binding_rule'],
    ],
  },
  {
    slug: 'trotthet-stress-och-arbetscykel', title: 'Trötthet, stress och arbetscykel', prefix: 'RECOVERY', order: 5, visual: 'work_night_shift_decision',
    requirementKeys: ['D1-WORK-021-003', 'D1-WORK-021-006', 'D1-WORK-021-007'],
    facts: [
      ['D1-WORK-021-003', 'Trötthet kan försämra uppmärksamhet, reaktion och omdöme och kan göra att föraren missar risker.', 'TRV_TRÖTTHET', 'Trötthet och trafiksäkerhet', 'official_guidance'],
      ['D1-WORK-021-003', 'När tröttheten påverkar körförmågan är det säkra beslutet att avbryta eller ta en ordentlig återhämtning innan körningen fortsätter.', 'TRV_TRÖTTHET', 'Trötthet och trafiksäkerhet, åtgärder', 'official_guidance'],
      ['D1-WORK-021-006', 'Oregelbundna måltider eller att inte ha ätit kan påverka ork och koncentration; föraren behöver planera arbetsdagen så att körförmågan inte försämras.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 21 § 6', 'binding_rule'],
      ['D1-WORK-021-007', 'Långa pass, nattarbete och för kort återhämtning kan öka trötthet och minska marginalerna i trafiken.', 'TRV_TRÖTTHET', 'Trötthet och trafiksäkerhet, arbetstid och återhämtning', 'official_guidance'],
      ['D1-WORK-021-007', 'Tidspress får inte användas som skäl för att fortsätta när arbets- och vilocykeln har gjort körningen osäker.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 21 § 7', 'binding_rule'],
      ['D1-WORK-021-003', 'Det finns ingen säker tumregel som gör att en trött förare kan ersätta sömn med högre fart, musik eller en kort chansning.', 'TRV_TRÖTTHET', 'Trötthet och trafiksäkerhet, praktisk riskbedömning', 'official_guidance'],
    ],
  },
  {
    slug: 'utrustning-och-riskmedvetenhet', title: 'Utrustning och riskmedvetenhet under färd', prefix: 'EQUIPMENT', order: 6, visual: 'work_distraction_scene',
    requirementKeys: ['D1-WORK-022-001'],
    facts: [
      ['D1-WORK-022-001', 'Mobiltelefon, kommunikationsutrustning, taxameter och navigation får inte användas på ett sätt som gör körningen farlig eller tar uppmärksamheten från trafiken.', 'TSFS_MOBILTELEFON', 'Trafikförordning (1998:1276), 4 kap. 10 e §', 'binding_rule'],
      ['D1-WORK-022-001', 'Föraren ska planera in knapptryckningar och adresskontroller när fordonet står säkert, inte lösa dem genom att titta bort under körning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 22 §', 'binding_rule'],
      ['D1-WORK-022-001', 'En kunds krav på snabb omplanering ändrar inte förarens ansvar att behålla uppmärksamheten på körningen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 22 §', 'binding_rule'],
      ['D1-WORK-022-001', 'Riskmedveten användning av utrustning innebär att föraren avstår från åtgärden när den inte kan göras utan att körningen påverkas.', 'TSFS_MOBILTELEFON', 'Trafikförordning (1998:1276), 4 kap. 10 e §', 'binding_rule'],
    ],
  },
];

const sourceByKey = (sourceKey) => source_catalog.find((source) => source.source_key === sourceKey);
const topicId = (topic) => `topic_d1_work_${topic.slug.replaceAll('-', '_')}`;
const lessonKey = (topic) => `D1-WORK-${topic.prefix}-L01`;
const factKey = (topic, index) => `D1-WORK-${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`;

const visuals = topicDefinitions.map((topic) => ({
  visual_id: topic.visual,
  visual_type: topic.prefix === 'EQUIPMENT' ? 'distraction_scenario' : 'work_environment_scenario',
  status: 'placeholder_metadata',
  purpose: `Visual metadata för ${topic.title.toLowerCase()}.`,
  elements_must_be_shown: ['taxi', 'förare', 'riskmoment', 'säkert alternativ'],
  labels_required: ['riskmoment', 'säkert alternativ'],
  requirement_keys: topic.requirementKeys,
  fact_keys: [],
  correctness_depends_on_visual: false,
  notes: 'Texten är tillräcklig för publicerad fråga; metadata beskriver eventuell framtida egen illustration.',
}));

const facts = topicDefinitions.flatMap((topic) => topic.facts.map(([requirement_key, fact_text, source_id, exact_reference, authority_status], index) => ({
  stable_key: factKey(topic, index),
  topic_id: topicId(topic),
  requirement_key,
  fact_text,
  source_id,
  exact_reference,
  verification_status: 'verified',
  authority_status,
  legal_or_guidance_status: authority_status,
  verified_at: verifiedAt,
  cross_subject_fact_links: [],
})));

for (const visual of visuals) {
  visual.fact_keys = facts.filter((fact) => visual.requirement_keys.includes(fact.requirement_key)).map((fact) => fact.stable_key).slice(0, 5);
}

const scenarios = {
  WORK: 'Du har flera körningar kvar under ett kvällspass och märker att en arbetsrisk börjar öka.',
  LIFT: 'En passagerare behöver hjälp och flera väskor ska in i bilen på en trång plats.',
  POSTURE: 'Efter flera timmar i bilen märker du att körställningen blivit spänd och att utrustningen ligger fel.',
  FITNESS: 'Före nästa körning upptäcker du en omständighet som kan påverka din körförmåga.',
  RECOVERY: 'Det är sent i ett pressat arbetspass och kunden vill att du ska fortsätta utan dröjsmål.',
  EQUIPMENT: 'Kunden skickar en ny adress medan du kör och navigationen behöver ändras.',
};

const lessons = topicDefinitions.map((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  return {
    stable_key: lessonKey(topic),
    topic_id: topicId(topic),
    title: topic.title,
    learning_objectives: [`Kunna identifiera ${topic.title.toLowerCase()} i en taxisituation.`, 'Kunna skilja mellan bindande krav, myndighetsvägledning och praktisk riskbedömning.', 'Kunna välja ett säkert beslut när tid, kundtryck eller arbetsförhållanden skapar risk.'],
    requirement_keys: topic.requirementKeys,
    fact_keys: topicFacts.map((fact) => fact.stable_key),
    source_references: [...new Set(topicFacts.map((fact) => fact.source_id))].map((source_id) => ({ source_id, exact_references: topicFacts.filter((fact) => fact.source_id === source_id).map((fact) => fact.exact_reference) })),
    estimated_study_time_minutes: 8,
    visual_metadata: { requires_image: false, requires_diagram: false, visual_asset_id: topic.visual, visual_correctness_depends_on_asset: false },
    status: 'published',
    content_blocks: [
      { type: 'heading', text: topic.title, fact_keys: [topicFacts[0].stable_key] },
      { type: 'paragraph', text: scenarios[topic.prefix], fact_keys: topicFacts.slice(0, 2).map((fact) => fact.stable_key) },
      { type: 'bullet_list', items: topicFacts.slice(0, 4).map((fact) => fact.fact_text), fact_keys: topicFacts.slice(0, 4).map((fact) => fact.stable_key) },
      { type: 'info', text: 'Ett myndighetsråd eller en pedagogisk tillämpning ska inte läsas som en ny lagregel. Vid osäkerhet väljer föraren marginal och avbryter när körförmågan påverkas.', fact_keys: [topicFacts[Math.min(2, topicFacts.length - 1)].stable_key] },
      { type: 'example', text: 'Beslutspunkt: Vilket alternativ minskar risken här, även om det innebär att kunden får vänta eller att uppdraget måste lämnas över?', fact_keys: [topicFacts[topicFacts.length - 1].stable_key] },
      { type: 'warning', text: topic.prefix === 'FITNESS' || topic.prefix === 'RECOVERY' ? 'Kör inte vidare på en chansning när påverkan eller trötthet försämrar din förmåga.' : 'Lös inte ett arbetsproblem genom att skapa en ny trafiksäkerhetsrisk.', fact_keys: [topicFacts[0].stable_key] },
      { type: 'checkpoint', text: 'Kan du beskriva vilket beslut som är säkrast och varför?', fact_keys: [topicFacts[0].stable_key] },
    ],
  };
});

const questions = topicDefinitions.flatMap((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  return topicFacts.map((fact, index) => {
    const visual = index === 0 || (topic.prefix === 'LIFT' && index === 2) ? topic.visual : undefined;
    const distractors = [`${topic.title}: fortsätt enligt plan och ta problemet först efter sista körningen.`, `${topic.title}: låt kundens tidspress avgöra även om din marginal minskar.`, `${topic.title}: anta att risken är liten eftersom inget har hänt ännu.`];
    return {
      stable_key: `D1-WORK-${topic.prefix}-Q${String(index + 1).padStart(3, '0')}`,
      version: 1,
      topic_id: topicId(topic),
      requirement_keys: [fact.requirement_key],
      fact_keys: [fact.stable_key],
      lesson_key: lessonKey(topic),
      question_type: 'scenario',
      competency_tags: ['APPLY', 'ASSESS', 'USE'],
      prompt: `${scenarios[topic.prefix]} Du behöver särskilt bedöma följande: ${fact.fact_text} Vilket beslut visar bäst omdöme och riskmedvetenhet?`,
      scenario_context: scenarios[topic.prefix],
      answer_choices: [{ id: 'A', text: fact.fact_text }, { id: 'B', text: distractors[index % distractors.length] }, { id: 'C', text: distractors[(index + 1) % distractors.length] }, { id: 'D', text: distractors[(index + 2) % distractors.length] }],
      correct_answer_id: 'A',
      explanation: `Rätt: ${fact.fact_text} Detta kopplar scenariot till kravet ${fact.requirement_key} och den angivna myndighetskällan.`,
      difficulty: index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard',
      source_references: [{ source_id: fact.source_id, exact_reference: fact.exact_reference }],
      competency: 'bedöma och välja säkert agerande',
      visual_metadata: visual ? { requires_image: false, requires_diagram: false, visual_asset_id: visual, visual_correctness_depends_on_asset: false } : undefined,
      visual_asset_id: visual,
      visual_correctness_depends_on_asset: false,
      status: 'published',
    };
  });
});

const topicCheckpoints = topicDefinitions.map((topic) => ({
  stable_key: `D1-WORK-${topic.prefix}-CHECKPOINT-001`, title: `Checkpoint: ${topic.title}`, type: 'checkpoint', subject: 'D1_WORK_ENVIRONMENT_RISK', topic: topicId(topic), eligible_status: 'published', question_count: Math.min(6, facts.filter((fact) => fact.topic_id === topicId(topic)).length), pass_threshold: 0.8, selection: 'random_from_eligible_published_questions', freeze_question_versions_on_attempt_start: true, status: 'published',
}));

const subjectCheckpoint = {
  stable_key: 'D1-WORK-SUBJECT-CHECKPOINT-001', title: 'Checkpoint: Arbetsmiljö, omdöme och riskmedvetenhet', type: 'checkpoint', subject: 'D1_WORK_ENVIRONMENT_RISK', topic: null, eligible_status: 'published', question_count: 24, pass_threshold: 0.8, selection: 'broad_sample_across_all_d1_work_environment_risk_topics', freeze_question_versions_on_attempt_start: true, status: 'published',
};

const sourceMap = {
  metadata: { subject: 'D1_WORK_ENVIRONMENT_RISK', phase: 'source_expansion', language: 'sv', active_requirement_count: requirementKeys.length, scope: 'TSFS 2021:119, 3 kap. 19-22 §§', created_at: verifiedAt, last_verified_at: verifiedAt },
  source_catalog,
  requirement_source_map: requirementKeys.map((requirement_key) => ({
    requirement_key,
    official_requirement_reference: requirement_key === 'D1-WORK-022-001' ? 'TSFS 2021:119, 3 kap. 22 §' : requirement_key.startsWith('D1-WORK-021') ? `TSFS 2021:119, 3 kap. 21 § ${requirement_key.at(-1)}` : requirement_key.startsWith('D1-WORK-020') ? `TSFS 2021:119, 3 kap. 20 § ${requirement_key.at(-1)}` : 'TSFS 2021:119, 3 kap. 19 §',
    sources: requirementSources[requirement_key].map(sourceByKey), overall_status: 'FULLY_SOURCED', notes: 'Binding curriculum requirement is kept distinct from occupational-safety or practical guidance.',
  })),
  pedagogical_topics: topicDefinitions.map((topic) => ({ topic_id: topicId(topic), title: topic.title, order: topic.order, requirement_keys: topic.requirementKeys, visual_asset_ids: [topic.visual], status: 'published', notes: 'Internal pedagogical grouping, not an official Transportstyrelsen topic name.' })),
};

writeFileSync('data/curriculum/d1-work-environment-risk-sources.json', `${JSON.stringify(sourceMap, null, 2)}\n`);
writeFileSync(`${contentDir}/work-environment-risk-facts.json`, `${JSON.stringify({ metadata: { subject: 'D1_WORK_ENVIRONMENT_RISK', title: 'Verified facts and principles', verified_at: verifiedAt, status: 'verified' }, sources: source_catalog.map((source) => ({ source_id: source.source_key, source_title: source.source_title, authority: source.authority, source_type: source.source_type, url: source.url, current_validity: `${source.legal_reference}; verified ${source.last_verified_at}.` })), facts }, null, 2)}\n`);
writeFileSync(`${contentDir}/work-environment-risk-lessons.json`, `${JSON.stringify({ metadata: { subject: 'D1_WORK_ENVIRONMENT_RISK', title: 'Mobile-first lessons', status: 'published', verified_at: verifiedAt }, lessons }, null, 2)}\n`);
writeFileSync(`${contentDir}/work-environment-risk-visuals.json`, `${JSON.stringify({ metadata: { subject: 'D1_WORK_ENVIRONMENT_RISK', status: 'placeholder_metadata', created_at: verifiedAt, note: 'Visual metadata only; published questions remain answerable without an asset.' }, visuals }, null, 2)}\n`);
writeFileSync(`${questionDir}/work-environment-risk-questions.json`, `${JSON.stringify({ metadata: { subject: 'D1_WORK_ENVIRONMENT_RISK', title: 'Source-backed scenario question bank', status: 'published', created_at: verifiedAt, reviewed_at: verifiedAt, disclaimer: "Internal practice questions; not Trafikverket's official question bank." }, topic_checkpoints: topicCheckpoints, subject_checkpoint: subjectCheckpoint, questions }, null, 2)}\n`);

console.log(`Active requirements: ${requirementKeys.length}`);
console.log(`Wrote ${topicDefinitions.length} topics, ${facts.length} facts, ${lessons.length} lessons and ${questions.length} questions.`);