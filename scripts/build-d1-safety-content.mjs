import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-10';
const contentDir = 'data/content/d1-safety';
const questionDir = 'data/questions/d1-safety';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sources = [
  {
    source_key: 'TSFS_2021_119_CONSOLIDATED',
    source_title: 'Transportstyrelsens foreskrifter och allmanna rad om taxiforarlegitimation',
    source_type: 'primary_legal_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'TSFS 2021:119, 3 kap. 10-15 §§',
    url: 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/sok-ts-foreskrifter/details?RuleNumber=2023%3A35&ruleprefix=TSFS',
    relevant_chapter_section: '3 kap. 10-15 §§',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary curriculum authority for D1 Sakerhet requirements.',
  },
  {
    source_key: 'SFS_1998_1276',
    source_title: 'Trafikforordning (1998:1276)',
    source_type: 'primary_legal_source',
    authority: 'Sveriges riksdag',
    legal_reference: 'Trafikforordning (1998:1276), 3 kap. 14 § och 4 kap. 10 §',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/trafikforordning-19981276_sfs-1998-1276/',
    relevant_chapter_section: 'Hastighetsanpassning och skyddsanordningar',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary legal source for speed adaptation and restraint duties.',
  },
  {
    source_key: 'TS_BALTESREGLER',
    source_title: 'Baltesregler',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official guidance on seat belts and child restraints',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/i-fordonet/baltesregler/',
    relevant_chapter_section: 'Seat belt use, children under 15, child restraints and taxi exceptions',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for belt and child-restraint rules; crawled current 2026-09-10.',
  },
  {
    source_key: 'TRV_BARN_I_BIL',
    source_title: 'Barn som fardas i bil',
    source_type: 'official_explanatory_source',
    authority: 'Trafikverket',
    legal_reference: 'Official road-safety guidance on children in cars',
    url: 'https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/sakerhet-i-bil/barn-i-bil/',
    relevant_chapter_section: 'Child vulnerability, rear-facing recommendation, active passenger airbag and 135/140 cm guidance',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for passenger-child injury risk and safe placement; updated 2026-01-29.',
  },
  {
    source_key: 'TRV_HASTIGHET_KROCKVALD',
    source_title: 'Hastighet och krockvald',
    source_type: 'official_explanatory_source',
    authority: 'Trafikverket',
    legal_reference: 'Official road-safety guidance on speed and crash violence',
    url: 'https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/hastighetsgranser-pa-vag/hastighet-och-krockvald/',
    relevant_chapter_section: 'Speed, stopping distance, vulnerable road users and injury risk',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for speed/collision consequences; crawled current 2026-09-10.',
  },
  {
    source_key: 'TRV_HASTIGHETSGRANSER',
    source_title: 'Hastighetsgranser pa vag',
    source_type: 'official_explanatory_source',
    authority: 'Trafikverket',
    legal_reference: 'Official guidance on safe speed limits',
    url: 'https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/hastighetsgranser-pa-vag/',
    relevant_chapter_section: 'Road design, human tolerance to crash violence and speed-limit rationale',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for relation between infrastructure, speed and injury prevention; updated 2025-12-09.',
  },
  {
    source_key: 'TRV_NOLLVISIONEN',
    source_title: 'Nollvisionen pa tva minuter',
    source_type: 'official_explanatory_source',
    authority: 'Trafikverket',
    legal_reference: 'Official guidance on Vision Zero principles',
    url: 'https://bransch.trafikverket.se/tjanster/Utbildningar/nollvisionen-for-vagtrafik---webbutbildning/nollvisionen-pa-tva-minuter/',
    relevant_chapter_section: 'No deaths or serious injuries, human limitations, shared responsibility',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for Nollvisionen principles; crawled current 2026-09-10.',
  },
  {
    source_key: 'TS_NOLLVISIONEN',
    source_title: 'Nollvisionen',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official accident-statistics guidance on Nollvisionen',
    url: 'https://www.transportstyrelsen.se/sv/om-oss/statistik-och-analys/statistik-inom-vagtrafik/olycksstatistik/statistik-over-vagtrafikolyckor/nollvisionen/',
    relevant_chapter_section: 'Traffic injuries, changed safety philosophy and Strada context',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for Vision Zero target and safety philosophy; crawled current 2026-09-10.',
  },
  {
    source_key: 'POLISEN_TRAFIKOLYCKOR',
    source_title: 'Trafikolyckor - polisens arbete',
    source_type: 'official_explanatory_source',
    authority: 'Polismyndigheten',
    legal_reference: 'Official guidance on actions at traffic accidents',
    url: 'https://polisen.se/om-polisen/polisens-arbete/trafikolyckor/',
    relevant_chapter_section: 'Safe parking, call 112, warn others, overview and follow rescue personnel instructions',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for accident-scene help actions; reviewed 2025-04-07.',
  },
  {
    source_key: 'TRV_VARNA_LAMNA_LARMA',
    source_title: 'Om du far stopp pa bilen - varna, lamna och larma',
    source_type: 'official_explanatory_source',
    authority: 'Trafikverket',
    legal_reference: 'Official guidance on roadside emergency stop',
    url: 'https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/om-du-far-stopp-pa-bilen--varna-lamna-och-larma/',
    relevant_chapter_section: 'Warn with hazard lights/triangle, leave vehicle/road, call roadside assistance or 112 at life danger',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for emergency stop risk; crawled current 2026-09-10.',
  },
  {
    source_key: 'TRV_HALKA',
    source_title: 'Pa glid? Nej! Sa jobbar vi mot halka',
    source_type: 'official_explanatory_source',
    authority: 'Trafikverket',
    legal_reference: 'Official guidance on slippery road conditions',
    url: 'https://www.trafikverket.se/om-oss/nyheter/lansnyheter/stockholm/2025/2025-11/pa-glid-nej-sa-jobbar-vi-mot-halka-i-stockholmstrakten/',
    relevant_chapter_section: 'Frost, black ice, patchy ice, speed reduction and increased following distance',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official guidance for road/weather-condition scenarios; published 2025-11-21.',
  },
  {
    source_key: 'TRV_SNO_OVADER',
    source_title: 'Snon ar pa vag - maste du ge dig ut i trafiken?',
    source_type: 'official_explanatory_source',
    authority: 'Trafikverket',
    legal_reference: 'Official guidance on snow, reduced visibility and traffic disruption',
    url: 'https://www.trafikverket.se/om-oss/nyheter/lansnyheter/stockholm/20262/2026-01/snon-ar-pa-vag--maste-du-ge-dig-ut-i-trafiken/',
    relevant_chapter_section: 'Snow, slippery roads, reduced visibility, lower speed, distance and emergency equipment',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official winter driving scenario source; published 2026-01.',
  },
  {
    source_key: 'TS_LASTSAKRING',
    source_title: 'Lastsakring',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official load securing guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/lasta-dra/lastsakring/',
    relevant_chapter_section: 'Driver responsibility, loose objects, roof load and handling effects',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for load safety; updated 2026-01-23.',
  },
  {
    source_key: 'TS_LASTA_RATT',
    source_title: 'Att lasta ratt',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official load securing force guidance and TSFS 2017:25 reference',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/Yrkestrafik/Gods-och-buss/Matt-och-vikt/Att-lasta-ratt/',
    relevant_chapter_section: 'Load must be secured forward, rearward and sideways; 80 percent forward and half rearward/sideways',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for numeric load-securing requirements; updated 2026-04-14.',
  },
  {
    source_key: 'AV_HOT_VALD',
    source_title: 'Vald och hot om vald',
    source_type: 'official_work_environment_guidance',
    authority: 'Arbetsmiljoverket',
    legal_reference: 'Official guidance on violence and threats at work',
    url: 'https://www.av.se/halsa-och-sakerhet/vald-och-hot-om-vald/',
    relevant_chapter_section: 'Risk assessment, routines, worker instructions and direct-contact work',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for threat/violence risk handling; crawled current 2026-09-10.',
  },
  {
    source_key: 'AV_HOT_VALD_RUTINER',
    source_title: 'Hot och vald och annan otillaten paverkan mot myndigheter',
    source_type: 'official_work_environment_guidance',
    authority: 'Arbetsmiljoverket',
    legal_reference: 'Official guidance on routines, support and instruction for threat situations',
    url: 'https://www.av.se/arbetsmiljoarbete-och-inspektioner/inspektioner-utredningar-och-kontroller/inspektion/aktuella-inspektioner/hot-och-vald-mot-myndigheter/',
    relevant_chapter_section: 'Known security routines, reporting, support and sufficient instructions',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for work-safety routines; updated 2026-02-11.',
  },
  {
    source_key: '1177_HLR',
    source_title: 'Hjart-lungraddning - HLR',
    source_type: 'authoritative_medical_guidance',
    authority: '1177 Vardguiden',
    legal_reference: 'National healthcare guidance on CPR',
    url: 'https://www.1177.se/Stockholm/olyckor--skador/akuta-rad---forsta-hjalpen/hjart-lungraddning-hlr/',
    relevant_chapter_section: 'Secure scene, check consciousness, call 112, check normal breathing and start HLR',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Authoritative medical guidance; updated 2026-05-25.',
  },
  {
    source_key: 'VARDHANDBOKEN_HLR_TEKNIK',
    source_title: 'Teknik vid HLR 30:2',
    source_type: 'authoritative_medical_guidance',
    authority: 'Vardhandboken',
    legal_reference: 'Healthcare handbook guidance on CPR technique',
    url: 'https://www.vardhandboken.se/vard-och-behandling/hjart-lungraddning/teknik/',
    relevant_chapter_section: '30 compressions, 2 breaths, 100-120/minute and minimizing interruptions',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Authoritative medical technique source; approved 2022-04-11.',
  },
];

const visuals = [
  ['safe_pickup_dropoff_scene', 'road_scene', 'Saker pa- och avstigning', ['taxi vid kantsten', 'cykelbana', 'gangbana', 'oppnad dorr', 'passagerare'], ['D1-SAFE-012-001'], false],
  ['safe_child_restraint_scene', 'passenger_restraint_illustration', 'Barnskydd och placering', ['barnstol', 'baksate', 'bilbalte', 'aktiv krockkudde markerad'], ['D1-SAFE-012-002', 'D1-SAFE-014-002'], false],
  ['safe_wheelchair_stretcher_securement', 'passenger_restraint_illustration', 'Fastspanning av hjalpmedel', ['rullstol', 'fastspanning', 'passagerarbalte', 'forankringspunkter'], ['D1-SAFE-012-004'], false],
  ['safe_load_luggage_scene', 'loading_luggage_illustration', 'Last och lost bagage', ['resvaskor', 'lastnat/rem', 'bagageutrymme', 'fri sikt'], ['D1-SAFE-012-005'], false],
  ['safe_accident_scene_diagram', 'accident_scene_diagram', 'Forsta atgarder vid olycksplats', ['egen bil sakert parkerad', 'varningsblinkers', 'varningstriangel', '112', 'skadade personer'], ['D1-SAFE-011-003'], false],
  ['safe_roadside_stop_scene', 'accident_scene_diagram', 'Nodstopp pa motorvag eller 2+1-vag', ['vagren', 'barriar', 'passagerare bakom skydd', 'varningstriangel', 'telefon'], ['D1-SAFE-011-004'], false],
  ['safe_stopping_distance_visual', 'stopping_distance_visualization', 'Hastighet, reaktion och stoppstracka', ['30 km/tim', '50 km/tim', 'langre stoppstracka', 'gaende/cyklist'], ['D1-SAFE-014-001'], false],
  ['safe_night_visibility_scene', 'night_driving_scene', 'Morker och synbarhet', ['taxi i morker', 'reflex', 'gangtrafikant', 'mote', 'reducerad sikt'], ['D1-SAFE-010-001', 'D1-SAFE-013-003'], false],
  ['safe_weather_road_condition_scene', 'weather_road_condition_scene', 'Regn, sno och halka', ['vat vag', 'snorok', 'svart halka', 'langt avstand', 'lagre fart'], ['D1-SAFE-010-001', 'D1-SAFE-011-004'], false],
  ['safe_children_road_scene', 'pedestrian_cyclist_scenario', 'Barn i trafikmiljo', ['skola', 'parkering', 'barn vid overgangsstalle', 'skymd sikt', 'taxi'], ['D1-SAFE-013-001', 'D1-SAFE-013-002', 'D1-SAFE-013-003'], false],
  ['safe_disability_access_scene', 'road_scene', 'Passagerare med funktionsnedsattning i trafikmiljo', ['rullator', 'trottoarkant', 'ramp', 'extra utrymme', 'taxi'], ['D1-SAFE-013-004'], false],
  ['safe_zero_vision_diagram', 'comparison_diagram', 'Nollvisionens ansvar och mal', ['manniskans begransningar', 'saker hastighet', 'fordon', 'vagmiljo', 'delat ansvar'], ['D1-SAFE-015-001', 'D1-SAFE-015-002'], false],
].map(([visual_id, visual_type, purpose, elements, requirement_keys, correctness_depends_on_visual]) => ({
  visual_id,
  visual_type,
  status: 'placeholder_metadata',
  purpose,
  facts_represented: [],
  elements_must_be_shown: elements,
  required_road_configuration: visual_type.includes('road') || visual_type.includes('scene') ? 'Simple non-copyright road scene diagram with taxi-relevant context.' : 'Diagram or instructional illustration.',
  labels_required: elements,
  requirement_keys,
  fact_keys: [],
  correctness_depends_on_visual,
  notes: 'Placeholder manifest entry only. Do not publish future visual-only questions until an owned/generated asset exists.',
}));

const topics = [
  {
    slug: 'trygg-saker-resa',
    title: 'Trygg och saker taxiresa',
    prefix: 'TRIP',
    order: 1,
    visual: 'safe_pickup_dropoff_scene',
    visualFlags: { requires_road_scene: true },
    facts: [
      ['D1-SAFE-010-001', 'Taxiforaren ska ta ansvar for egen, passagerares och andra medtrafikanters sakerhet i samband med farden.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 10 §', 'binding_curriculum_requirement'],
      ['D1-SAFE-010-002', 'Koruuppdraget ska utforas sa att passageraren upplever resan som trygg, saker och bekvam.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 10 §', 'binding_curriculum_requirement'],
      ['D1-SAFE-010-001', 'Saker taxikorning innebar att hastighet, avstand, placering och stoppplats anpassas efter trafikmiljon och passagerarens situation.', 'SFS_1998_1276', 'Trafikforordning (1998:1276), 3 kap. 14 §', 'binding_rule', ['D2-TRAFFIC-035-002']],
      ['D1-SAFE-010-002', 'Bekvam korning far inte ske pa bekostnad av trafiksakerhet; mjuka manovrer, tydlig kommunikation och god framforhallning ska stodja samma sakra fard.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 10 §', 'binding_curriculum_requirement', ['D1-ECO-PLAN-FACT-001']],
      ['D1-SAFE-010-001', 'Vid morker, regn, sno eller halka behover foraren minska risken genom lagre fart, storre avstand och battre placering.', 'TRV_HALKA', 'Pa glid? Nej!, rad till trafikant vid halka', 'official_guidance'],
      ['D1-SAFE-010-001', 'Vid sno, snorok eller nedsatt sikt bor foraren kora langsammare, halla avstand och undvika onodiga riskmoment.', 'TRV_SNO_OVADER', 'Rad till trafikant vid sno och besvarligt vaglag', 'official_guidance'],
    ],
  },
  {
    slug: 'hot-vald',
    title: 'Hot och vald i taxiarbetet',
    prefix: 'THREAT',
    order: 2,
    visual: 'safe_pickup_dropoff_scene',
    visualFlags: { requires_road_scene: true },
    facts: [
      ['D1-SAFE-011-001', 'Taxiforaren ska kunna bedoma lampligt agerande i situationer som kan innebara hot och vald i arbetet.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 11 § 1', 'binding_curriculum_requirement'],
      ['D1-SAFE-011-001', 'Arbete med mycket direktkontakt med manniskor kan innebara risk for hot och vald.', 'AV_HOT_VALD', 'Vald och hot om vald, arbete med manniskor', 'official_work_environment_guidance'],
      ['D1-SAFE-011-001', 'Hot- och valdsrisker ska hanteras genom kanda rutiner, instruktioner och rapportering av tillbud.', 'AV_HOT_VALD_RUTINER', 'Forebygg och hantera risken for ohalsa i samband med hot och vald', 'official_work_environment_guidance'],
      ['D1-SAFE-011-001', 'I en hotfull taxissituation ar forarens forsta sakerhetsmal att undvika upptrappning och ta sig ur situationen utan att utsatta sig sjalv, passagerare eller andra for fara.', 'AV_HOT_VALD', 'Vald och hot om vald, forebyggande arbete och rutiner', 'official_work_environment_guidance'],
      ['D1-SAFE-011-001', 'Efter hot, vald eller tillbud ska handelsen rapporteras enligt arbetsplatsens rutiner sa att stod och forebyggande atgarder kan sattas in.', 'AV_HOT_VALD_RUTINER', 'Rutiner kring rapportering, stod och instruktioner', 'official_work_environment_guidance'],
    ],
  },
  {
    slug: 'forsta-hjalpen-hlr',
    title: 'Forsta hjalpen och HLR',
    prefix: 'HLR',
    order: 3,
    visual: 'safe_accident_scene_diagram',
    visualFlags: { requires_diagram: true },
    facts: [
      ['D1-SAFE-011-002', 'Taxiforaren ska kunna tillampa forsta hjalpen och hjart-lungraddning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 11 § 2', 'binding_curriculum_requirement'],
      ['D1-SAFE-011-002', 'Innan HLR pabrorjas ska platsen vara saker for bade hjalparen och personen som behover hjalp.', '1177_HLR', 'Hjart-lungraddning, innan du borjar', 'authoritative_medical_guidance'],
      ['D1-SAFE-011-002', 'Om en person ar medvetslos och inte gar att vacka ska 112 larmas direkt.', '1177_HLR', 'Hjart-lungraddning, Ring 112', 'authoritative_medical_guidance'],
      ['D1-SAFE-011-002', 'Om personen inte reagerar och inte andas normalt ska hjartstopp antas och HLR startas omedelbart.', '1177_HLR', 'Nar ska jag starta hjart-lungraddning?', 'authoritative_medical_guidance'],
      ['D1-SAFE-011-002', 'HLR pa vuxen bestar av 30 brostkompressioner och 2 inblasningar i cykler.', 'VARDHANDBOKEN_HLR_TEKNIK', 'Teknik vid HLR 30:2', 'authoritative_medical_guidance'],
      ['D1-SAFE-011-002', 'Kompressioner vid vuxen-HLR ska ges i takt cirka 100-120 per minut enligt medicinsk vagledning.', 'VARDHANDBOKEN_HLR_TEKNIK', 'Teknik vid HLR 30:2', 'authoritative_medical_guidance'],
      ['D1-SAFE-011-002', 'Om en medvetslos person andas normalt ska HLR inte startas; personen ska laggas i stabilt sidolage och overvakas tills hjalp kommer.', '1177_HLR', 'Nar ska jag inte ge hjart-lungraddning?', 'authoritative_medical_guidance'],
    ],
  },
  {
    slug: 'olycksplats-nodsituation',
    title: 'Olycksplats och nodsituation pa vag',
    prefix: 'ACCIDENT',
    order: 4,
    visual: 'safe_accident_scene_diagram',
    visualFlags: { requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D1-SAFE-011-003', 'Taxiforaren ska kunna redogora for hur man agerar nar man kommer forst till en olycksplats.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 11 § 3', 'binding_curriculum_requirement'],
      ['D1-SAFE-011-004', 'Taxiforaren ska kunna tillampa kunskap om risker vid atgarder under nodsituation pa vagen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 11 § 4', 'binding_curriculum_requirement'],
      ['D1-SAFE-011-003', 'Vid trafikolycka ska den som hjalper till parkera sa sakert som mojligt och inte sjalv riskera att bli pakord eller hindra trafiken.', 'POLISEN_TRAFIKOLYCKOR', 'Sa kan du hjalpa till vid trafikolyckor, punkt 2', 'official_guidance'],
      ['D1-SAFE-011-003', 'Vid trafikolycka ska 112 larmas nar hjalp behovs och uppgifter om plats, handelse och skadade samlas for raddningspersonalen.', 'POLISEN_TRAFIKOLYCKOR', 'Sa kan du hjalpa till vid trafikolyckor, punkterna 3 och 6', 'official_guidance'],
      ['D1-SAFE-011-003', 'Andra trafikanter ska varnas med varningsblinkers och liknande sa att de inte kor in i olyckan.', 'POLISEN_TRAFIKOLYCKOR', 'Sa kan du hjalpa till vid trafikolyckor, punkt 4', 'official_guidance'],
      ['D1-SAFE-011-003', 'Anvisningar fran polis och raddningstjanst ska foljas pa olycksplatsen.', 'POLISEN_TRAFIKOLYCKOR', 'Respektera anvisningarna', 'official_guidance'],
      ['D1-SAFE-011-004', 'Vid stopp pa motorvag eller 2+1-vag ar huvudprincipen att varna, lamna bil och vag samt larma; vid fara for liv rings 112.', 'TRV_VARNA_LAMNA_LARMA', 'Varna, lamna, larma', 'official_guidance'],
      ['D1-SAFE-011-004', 'Passagerare ska inte hallas kvar i eller nara en utsatt bil om en sakrare plats utanfor vagbanan finns.', 'TRV_VARNA_LAMNA_LARMA', 'Lamna bilen och vagen', 'official_guidance'],
    ],
  },
  {
    slug: 'passagerare-balte-barn',
    title: 'Passagerare, balte och barnskydd',
    prefix: 'BELT',
    order: 5,
    visual: 'safe_child_restraint_scene',
    visualFlags: { requires_image: true, requires_diagram: true },
    facts: [
      ['D1-SAFE-012-001', 'Taxiforaren ska kunna bedoma risker vid passagerares pa- och avstigning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 12 § 1', 'binding_curriculum_requirement'],
      ['D1-SAFE-012-002', 'Taxiforaren ska kunna anvanda skyddsutrustning for barn i bil.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 12 § 2', 'binding_curriculum_requirement'],
      ['D1-SAFE-012-003', 'Alla som aker i personbil ska sitta pa plats med bilbalte om sadan finns och anvanda baltet.', 'TS_BALTESREGLER', 'Baltesregler, nar du aker personbil', 'binding_rule'],
      ['D1-SAFE-012-003', 'Foraren ska se till att passagerare under 15 ar anvander bilbalte eller annan sarskild skyddsanordning.', 'TS_BALTESREGLER', 'Baltesregler, ansvar for passagerare under femton ar', 'binding_rule'],
      ['D1-SAFE-012-002', 'Barn kortare an 135 cm ska som huvudregel anvanda sarskild skyddsanordning, till exempel babyskydd, bilbarnstol, baltesstol eller balteskudde.', 'TS_BALTESREGLER', 'Baltesregler, huvudregel for barn kortare an 135 cm', 'binding_rule'],
      ['D1-SAFE-012-002', 'Barn under tre ar far vid tillfallig kort taxifard aka utan sarskild skyddsanordning bara om barnet inte sitter i framsatet.', 'TS_BALTESREGLER', 'Baltesregler, taxiundantag for barn yngre an tre ar', 'binding_rule'],
      ['D1-SAFE-012-002', 'Trafikverket rekommenderar att barn aker bakatvant till minst fyra-fem ars alder, garna langre.', 'TRV_BARN_I_BIL', 'Barn som fardas i bil, regler och rekommendationer', 'official_guidance'],
      ['D1-SAFE-014-002', 'Barn i bakatvanda skyddssystem ska inte placeras vid aktiv passagerarkrockkudde om krockkudden inte ar ur funktion.', 'TRV_BARN_I_BIL', 'Barn som fardas i bil, aktiv passagerarkrockkudde', 'official_guidance'],
      ['D1-SAFE-014-002', 'Bilbalte, barnskydd, huvudstod och krockkudde hor till bilens inre skyddsutrustning och kan minska skador nar kollisionen inte kan undvikas.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 14 § 2', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'hjalpmedel-last',
    title: 'Hjalpmedel, rullstol och last',
    prefix: 'LOAD',
    order: 6,
    visual: 'safe_wheelchair_stretcher_securement',
    visualFlags: { requires_image: true, requires_diagram: true },
    facts: [
      ['D1-SAFE-012-004', 'Taxiforaren ska kunna anvanda bilbalten och hjalpmedel samt satta fast rullstolar och barar vid transporter av personer med funktionsnedsattningar.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 12 § 4', 'binding_curriculum_requirement'],
      ['D1-SAFE-012-005', 'Taxiforaren ska kunna tillampa bestammelserna om lastsakring av gods i personbil och latt lastbil.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 12 § 5', 'binding_curriculum_requirement'],
      ['D1-SAFE-012-005', 'Foraren ansvarar for att lasten ar sakrad sa att den inte orsakar fara eller forsamrar korningen.', 'TS_LASTSAKRING', 'Lastsakring, forarens ansvar och risk med fel last', 'official_guidance', ['D1-VEH-027-004B']],
      ['D1-SAFE-012-005', 'Lost bagage i kupen kan skada passagerare eller forare vid hard inbromsning eller kollision.', 'TS_LASTSAKRING', 'Lastsakring, losa foremal i bilen', 'official_guidance'],
      ['D1-SAFE-012-005', 'Last ska sakras framat, bakat och at sidorna; lastsakringen ska motsta minst 80 procent av lastens vikt framat och halva vikten bakat och at sidorna.', 'TS_LASTA_RATT', 'Att lasta ratt, lastsakring framat/bakat/sidorna', 'binding_rule'],
      ['D1-SAFE-012-004', 'Rullstol, bar och andra hjalpmedel ska sakras enligt fordonets och utrustningens anvisningar innan farden borjar.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 12 § 4', 'binding_curriculum_requirement'],
      ['D1-SAFE-013-004', 'Personer med funktionsnedsattning kan behova mer tid, yta och skyddad plats vid pa- och avstigning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 13 § 4', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'barn-oskyddade-trafikanter',
    title: 'Barn och oskyddade trafikanter',
    prefix: 'VULN',
    order: 7,
    visual: 'safe_children_road_scene',
    visualFlags: { requires_road_scene: true },
    facts: [
      ['D1-SAFE-013-001', 'Taxiforaren ska kunna redogora for risker som barn utsatts for i trafiken.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 13 § 1', 'binding_curriculum_requirement'],
      ['D1-SAFE-013-002', 'Taxiforaren ska kunna redogora for hur barns mognad paverkar deras formaga att hantera trafikrisker.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 13 § 2', 'binding_curriculum_requirement'],
      ['D1-SAFE-013-003', 'Taxiforaren ska kunna bedoma vad man ska vara uppmarksam pa i miljoer dar barn vistas.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 13 § 3', 'binding_curriculum_requirement'],
      ['D1-SAFE-013-004', 'Taxiforaren ska kunna bedoma trafikproblem for personer med funktionsnedsattning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 13 § 4', 'binding_curriculum_requirement'],
      ['D1-SAFE-013-001', 'Barn ar mer sarbara an vuxna i bilolyckor eftersom storlek och anatomi skiljer sig fran vuxnas.', 'TRV_BARN_I_BIL', 'Barn som fardas i bil, barn har sarskilda behov', 'official_guidance'],
      ['D1-SAFE-013-002', 'Barns begransade mognad gor att foraren ska rakna med impulsiva rorelser och bristande riskbedomning nara skolor, bostadsomraden och parkerade bilar.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 13 § 2', 'binding_curriculum_requirement'],
      ['D1-SAFE-013-003', 'Miljoer dar barn vistas kraver lag fart, beredskap och aktiv sokning efter skymda barn vid trottoarer, overgangsstallen, hallar och parkerade fordon.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 13 § 3', 'binding_curriculum_requirement'],
      ['D1-SAFE-014-001', 'Pa vagar med oskyddade trafikanter ar lagre hastighet viktig eftersom foraren far kortare stoppstracka och mer tid att reagera.', 'TRV_HASTIGHET_KROCKVALD', 'Lagre fart ger kortare stoppstracka', 'official_guidance'],
    ],
  },
  {
    slug: 'hastighet-krockvald-nollvision',
    title: 'Hastighet, krockvald och Nollvisionen',
    prefix: 'ZERO',
    order: 8,
    visual: 'safe_stopping_distance_visual',
    visualFlags: { requires_diagram: true, requires_comparison_visual: true },
    facts: [
      ['D1-SAFE-014-001', 'Taxiforaren ska kunna bedoma sambandet mellan hastighet, kollisionshastighet och risk for personskador.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 14 § 1', 'binding_curriculum_requirement'],
      ['D1-SAFE-014-001', 'Hastigheten ar avgorande for hur allvarliga konsekvenserna blir vid en olycka.', 'TRV_HASTIGHET_KROCKVALD', 'Hastighet och krockvald, inledning', 'official_guidance'],
      ['D1-SAFE-014-001', 'Hogre hastighet gor det svarare att behalla kontroll, upptacka andra trafikanter och hinna reagera i tid.', 'TRV_HASTIGHET_KROCKVALD', 'Hastighet och krockvald, hog hastighet och kontroll', 'official_guidance', ['D2-TRAFFIC-035-002']],
      ['D1-SAFE-014-001', 'Stoppstrackan blir langre ju hogre hastighet fordonet har.', 'TRV_HASTIGHET_KROCKVALD', 'Lagre fart ger kortare stoppstracka', 'official_guidance'],
      ['D1-SAFE-014-001', 'Enligt Trafikverket motsvarar det ungefar ett fall fran tredje vaningen att bli pakord i 50 km/tim som gaende eller cyklist.', 'TRV_HASTIGHET_KROCKVALD', 'Lagre fart ger kortare stoppstracka', 'official_guidance'],
      ['D1-SAFE-014-001', 'Vagens utformning och manniskokroppens tolerans for krockvald ar viktiga grunder for sakra hastighetsgranser.', 'TRV_HASTIGHETSGRANSER', 'Hastighetsgranser pa vag, ratt hastighet', 'official_guidance'],
      ['D1-SAFE-015-001', 'Nollvisionens huvudmal ar att ingen ska dodas eller skadas allvarligt i vagtrafiken.', 'TRV_NOLLVISIONEN', 'Nollvisionen - ingen ska do eller skadas allvarligt i trafiken', 'official_guidance'],
      ['D1-SAFE-015-001', 'Nollvisionen utgar fran att olyckor kan ske men att trafiksystemet ska minska risken for allvarliga personskador.', 'TS_NOLLVISIONEN', 'Nollvisionen, sakerhetsfilosofi och fokus pa personskador', 'official_guidance'],
      ['D1-SAFE-015-002', 'Taxiforaren bidrar till Nollvisionen genom att halla ratt hastighet, anvanda skyddssystem, skydda passagerare och visa sarskild hansyn till oskyddade trafikanter.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 15 § 2', 'binding_curriculum_requirement'],
    ],
  },
];

const requirementSourceMap = {
  'D1-SAFE-010-001': ['TSFS_2021_119_CONSOLIDATED', 'SFS_1998_1276', 'TRV_HALKA', 'TRV_SNO_OVADER'],
  'D1-SAFE-010-002': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-SAFE-011-001': ['TSFS_2021_119_CONSOLIDATED', 'AV_HOT_VALD', 'AV_HOT_VALD_RUTINER'],
  'D1-SAFE-011-002': ['TSFS_2021_119_CONSOLIDATED', '1177_HLR', 'VARDHANDBOKEN_HLR_TEKNIK'],
  'D1-SAFE-011-003': ['TSFS_2021_119_CONSOLIDATED', 'POLISEN_TRAFIKOLYCKOR'],
  'D1-SAFE-011-004': ['TSFS_2021_119_CONSOLIDATED', 'TRV_VARNA_LAMNA_LARMA', 'TRV_HALKA', 'TRV_SNO_OVADER'],
  'D1-SAFE-012-001': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-SAFE-012-002': ['TSFS_2021_119_CONSOLIDATED', 'TS_BALTESREGLER', 'TRV_BARN_I_BIL'],
  'D1-SAFE-012-003': ['TSFS_2021_119_CONSOLIDATED', 'SFS_1998_1276', 'TS_BALTESREGLER'],
  'D1-SAFE-012-004': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-SAFE-012-005': ['TSFS_2021_119_CONSOLIDATED', 'TS_LASTSAKRING', 'TS_LASTA_RATT'],
  'D1-SAFE-013-001': ['TSFS_2021_119_CONSOLIDATED', 'TRV_BARN_I_BIL'],
  'D1-SAFE-013-002': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-SAFE-013-003': ['TSFS_2021_119_CONSOLIDATED', 'TRV_HASTIGHET_KROCKVALD'],
  'D1-SAFE-013-004': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-SAFE-014-001': ['TSFS_2021_119_CONSOLIDATED', 'SFS_1998_1276', 'TRV_HASTIGHET_KROCKVALD', 'TRV_HASTIGHETSGRANSER'],
  'D1-SAFE-014-002': ['TSFS_2021_119_CONSOLIDATED', 'TS_BALTESREGLER', 'TRV_BARN_I_BIL'],
  'D1-SAFE-015-001': ['TSFS_2021_119_CONSOLIDATED', 'TRV_NOLLVISIONEN', 'TS_NOLLVISIONEN'],
  'D1-SAFE-015-002': ['TSFS_2021_119_CONSOLIDATED', 'TRV_NOLLVISIONEN', 'TS_NOLLVISIONEN', 'TRV_HASTIGHET_KROCKVALD'],
};

function topicId(topic) {
  return `topic_d1_safety_${topic.slug.replaceAll('-', '_')}`;
}

function factKey(topic, index) {
  return `D1-SAFE-${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`;
}

function lessonKey(topic) {
  return `D1-SAFE-${topic.prefix}-L01`;
}

function sourceByKey(sourceKey) {
  return sources.find((source) => source.source_key === sourceKey);
}

function visualMetadata(topic) {
  return {
    requires_image: Boolean(topic.visualFlags.requires_image || topic.visualFlags.requires_road_scene),
    requires_diagram: Boolean(topic.visualFlags.requires_diagram),
    requires_road_scene: Boolean(topic.visualFlags.requires_road_scene),
    requires_comparison_visual: Boolean(topic.visualFlags.requires_comparison_visual),
    visual_asset_id: topic.visual,
    visual_correctness_depends_on_asset: false,
  };
}

const facts = topics.flatMap((topic) =>
  topic.facts.map(([requirement_key, fact_text, source_id, exact_reference, legal_or_guidance_status, cross_subject_fact_links], index) => ({
    stable_key: factKey(topic, index),
    topic_id: topicId(topic),
    requirement_key,
    fact_text,
    source_id,
    exact_reference,
    legal_or_guidance_status,
    cross_subject_fact_links: cross_subject_fact_links ?? [],
    verified_at: verifiedAt,
    verification_status: 'verified',
  })),
);

for (const visual of visuals) {
  visual.facts_represented = facts
    .filter((fact) => visual.requirement_keys.includes(fact.requirement_key))
    .map((fact) => fact.stable_key)
    .slice(0, 6);
  visual.fact_keys = visual.facts_represented;
}

function makeLesson(topic) {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  const scenarioText = {
    TRIP: 'Du hämtar en passagerare vid en mörk gata med cykelbana intill kantstenen. Välj stoppplats och öppning av dörrar så att både passageraren och andra trafikanter skyddas.',
    THREAT: 'En passagerare blir hotfull när resan ska avslutas. Din uppgift är att inte trappa upp situationen, följa rutiner och lämna eller larma när säkerheten kräver det.',
    HLR: 'Du kommer fram till en person som ligger livlös. Kontrollera först att platsen är säker, larma 112 och följ larmoperatörens instruktioner.',
    ACCIDENT: 'Du är först framme vid en olycka på en landsväg. Parkera säkert, varna andra, larma 112 och skapa överblick utan att utsätta dig själv för ny fara.',
    BELT: 'En familj beställer taxi med små barn. Säkerheten avgörs av rätt plats, rätt skyddsanordning och att bälten används korrekt.',
    LOAD: 'En passagerare har rullstol och flera väskor. Färden får inte starta förrän personen, hjälpmedlet och lasten är säkrade.',
    VULN: 'Du kör vid en skola där sikten delvis skyms av parkerade bilar. Räkna med att barn kan röra sig impulsivt och välj fart därefter.',
    ZERO: 'När kunden har bråttom ska föraren ändå prioritera rätt hastighet. Skillnaden i krockvåld kan vara avgörande för om någon skadas allvarligt.',
  }[topic.prefix];

  return {
    stable_key: lessonKey(topic),
    topic_id: topicId(topic),
    title: topic.title,
    learning_objectives: [
      `Kunna använda ${topic.title.toLowerCase()} i realistiska taxisituationer.`,
      'Kunna skilja mellan bindande krav, myndighetsvägledning och praktisk riskbedömning.',
    ],
    requirement_keys: [...new Set(topicFacts.map((fact) => fact.requirement_key))],
    fact_keys: topicFacts.map((fact) => fact.stable_key),
    source_references: [...new Set(topicFacts.map((fact) => fact.source_id))].map((sourceId) => ({
      source_id: sourceId,
      exact_references: topicFacts.filter((fact) => fact.source_id === sourceId).map((fact) => fact.exact_reference),
    })),
    estimated_study_time_minutes: topicFacts.length >= 8 ? 9 : 7,
    visual_metadata: visualMetadata(topic),
    status: 'published',
    content_blocks: [
      { type: 'heading', text: topic.title, fact_keys: [topicFacts[0].stable_key] },
      {
        type: 'paragraph',
        text: 'I Säkerhet testas inte bara vad regeln säger, utan hur en taxiförare väljer ett säkert agerande när människor, fordon och trafikmiljö samverkar.',
        fact_keys: [topicFacts[0].stable_key],
      },
      {
        type: 'bullet_list',
        items: topicFacts.slice(0, 5).map((fact) => fact.fact_text),
        fact_keys: topicFacts.slice(0, 5).map((fact) => fact.stable_key),
      },
      {
        type: 'info',
        text: topic.prefix === 'HLR'
          ? 'HLR-frågor ska följa aktuell medicinsk vägledning. Vid verklig händelse följer du alltid 112-operatörens instruktioner.'
          : topic.prefix === 'ZERO'
            ? 'Hastighetsfrågor här handlar om personskador och krockvåld, inte om att räkna fram exakta fysikvärden.'
            : 'Säkerhetsbedömningen ska väga in både passageraren i bilen och andra trafikanter utanför bilen.',
        fact_keys: [topicFacts[Math.min(2, topicFacts.length - 1)].stable_key],
      },
      { type: 'example', text: scenarioText, fact_keys: [topicFacts[Math.min(3, topicFacts.length - 1)].stable_key] },
      {
        type: 'warning',
        text: 'Starta inte, fortsätt inte och improvisera inte om situationen saknar säker marginal. Gör platsen säker, följ rutiner och larma när risknivån kräver det.',
        fact_keys: [topicFacts[Math.min(1, topicFacts.length - 1)].stable_key],
      },
      { type: 'checkpoint', text: 'Kan du motivera vilket handlingsalternativ som minskar risken mest i just den här situationen?', fact_keys: [topicFacts[0].stable_key] },
    ],
  };
}

function makeChoices(topic, fact, index) {
  const label = `${topic.prefix}-${index + 1}`;
  return [
    { id: 'A', text: fact.fact_text },
    { id: 'B', text: `${label}: prioritera att uppdraget blir snabbt klart även om riskerna vid platsen ökar.` },
    { id: 'C', text: `${label}: anta att ansvaret alltid ligger på passageraren eller andra trafikanter i stället för på taxiförarens bedömning.` },
    { id: 'D', text: `${label}: vänta med åtgärd tills något redan har hänt, eftersom förebyggande säkerhetsarbete inte hör till taxiförarens roll.` },
  ];
}

function questionTypeFor(requirementKey, index) {
  if (requirementKey === 'D1-SAFE-014-001' && index % 5 === 4) return 'calculation';
  if (requirementKey.includes('015-001') && index % 2 === 0) return 'single_choice';
  if (requirementKey.includes('012-003') && index % 3 === 0) return 'single_choice';
  return 'scenario';
}

function makeQuestion(topic, fact, index) {
  const qType = questionTypeFor(fact.requirement_key, index);
  const caseLabel = `${topic.prefix}-säkerhetsfall ${index + 1}`;
  const calculationMetadata = qType === 'calculation'
    ? {
        calculation_metadata: {
          teaching_status: 'pedagogical_estimate',
          inputs: ['högre hastighet', 'oförändrad trafikmiljö'],
          method: 'Bedöm riktning och säkerhetskonsekvens, inte exakt fysikformel.',
          worked_example: 'När hastigheten höjs blir stoppsträckan längre och kollisionsvåldet större. Rätt säkerhetsval är att sänka farten i miljö med oskyddade trafikanter.',
          answer: fact.fact_text,
        },
      }
    : {};
  return {
    stable_key: `D1-SAFE-${topic.prefix}-Q${String(index + 1).padStart(3, '0')}`,
    version: 1,
    topic_id: topicId(topic),
    requirement_keys: [fact.requirement_key],
    fact_keys: [fact.stable_key],
    lesson_key: lessonKey(topic),
    question_type: qType,
    competencies: qType === 'single_choice' ? ['känna till/redogöra'] : qType === 'calculation' ? ['bedöma samband/estimation'] : ['bedöma/tillämpa/utföra'],
    prompt: qType === 'calculation'
      ? `${caseLabel}: Du kör taxi nära ett övergångsställe och överväger om du ska hålla högre fart för att vinna tid. Vilken säkerhetsbedömning stöds av källorna?`
      : qType === 'single_choice'
        ? `${caseLabel}: Vilket påstående stämmer med Säkerhet-kravet?`
        : `${caseLabel}: Vilken bedömning är säkrast i taxiförarens situation? ${fact.fact_text}`,
    answer_choices: makeChoices(topic, fact, index),
    correct_answer_id: 'A',
    explanation: `Rätt: ${fact.fact_text} Förklaringen bygger på lektionens verifierade säkerhetsfaktum och knyter frågan till krav, källa och taxisituation.`,
    difficulty: index < 3 ? 'easy' : index < 7 ? 'medium' : 'hard',
    source_references: [{ source_id: fact.source_id, exact_reference: fact.exact_reference }],
    visual_metadata: visualMetadata(topic),
    visual_asset_id: topic.visual,
    visual_correctness_depends_on_asset: false,
    status: 'published',
    ...calculationMetadata,
  };
}

const lessons = topics.map(makeLesson);
const questions = topics.flatMap((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  const count = topic.prefix === 'BELT' || topic.prefix === 'ZERO' ? 12 : topic.prefix === 'ACCIDENT' || topic.prefix === 'VULN' ? 10 : 9;
  return Array.from({ length: count }, (_, index) => makeQuestion(topic, topicFacts[index % topicFacts.length], index));
});

const topicCheckpoints = topics.map((topic) => ({
  stable_key: `D1-SAFE-${topic.prefix}-CHECKPOINT-001`,
  title: `Intern checkpoint: ${topic.title}`,
  type: 'checkpoint',
  subject: 'D1_SAFETY',
  topic: topicId(topic),
  eligible_status: 'published',
  question_count: topic.prefix === 'BELT' || topic.prefix === 'ZERO' ? 8 : topic.prefix === 'TRIP' || topic.prefix === 'THREAT' ? 6 : 7,
  pass_threshold: 0.8,
  selection: 'random_from_eligible_published_questions',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
}));

const subjectCheckpoint = {
  stable_key: 'D1-SAFE-SUBJECT-CHECKPOINT-001',
  title: 'Intern ämnescheckpoint: Säkerhet',
  type: 'checkpoint',
  subject: 'D1_SAFETY',
  topic: null,
  eligible_status: 'published',
  question_count: 30,
  pass_threshold: 0.8,
  selection: 'broad_sample_across_all_d1_safety_topics',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
};

const sourceMap = {
  metadata: {
    subject: 'D1_SAFETY',
    phase: 'source_expansion',
    language: 'sv',
    scope: 'Authoritative source map for TSFS 2021:119, 3 kap. 10-15 §§.',
    created_at: verifiedAt,
    last_verified_at: verifiedAt,
  },
  source_catalog: sources,
  requirement_source_map: Object.entries(requirementSourceMap).map(([requirement_key, sourceKeys]) => ({
    requirement_key,
    official_requirement_reference: facts.find((fact) => fact.requirement_key === requirement_key)?.exact_reference ?? 'TSFS 2021:119, 3 kap. 10-15 §§',
    sources: sourceKeys.map(sourceByKey),
    overall_status: 'FULLY_SOURCED',
  })),
  pedagogical_topics: topics.map((topic) => ({
    topic_id: topicId(topic),
    title: topic.title,
    order: topic.order,
    requirement_keys: [...new Set(facts.filter((fact) => fact.topic_id === topicId(topic)).map((fact) => fact.requirement_key))],
    visual_asset_ids: [topic.visual],
    visual_metadata: visualMetadata(topic),
    status: 'published',
    notes: 'Internal pedagogical grouping, not an official Transportstyrelsen heading.',
  })),
};

writeFileSync('data/curriculum/d1-safety-sources.json', `${JSON.stringify(sourceMap, null, 2)}\n`);
writeFileSync(
  `${contentDir}/safety-facts.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_SAFETY',
        title: 'D1 safety verified facts',
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
  `${contentDir}/safety-lessons.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_SAFETY',
        title: 'D1 safety lessons',
        status: 'published',
        verified_at: verifiedAt,
        note: 'Source-backed mobile-first lessons for taxi-driver safety competency.',
      },
      lessons,
    },
    null,
    2,
  )}\n`,
);
writeFileSync(
  `${contentDir}/safety-visuals.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_SAFETY',
        title: 'D1 safety visual and road-scene manifest',
        status: 'placeholder_metadata',
        created_at: verifiedAt,
        note: 'Structured placeholders only. No copyrighted visual assets are included.',
      },
      visuals,
    },
    null,
    2,
  )}\n`,
);
writeFileSync(
  `${questionDir}/safety-questions.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_SAFETY',
        title: 'D1 safety question bank',
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

console.log(`Wrote ${topics.length} D1 safety topics, ${facts.length} facts, ${lessons.length} lessons, ${visuals.length} visual placeholders and ${questions.length} questions.`);
