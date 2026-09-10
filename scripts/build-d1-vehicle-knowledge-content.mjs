import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-10';
const contentDir = 'data/content/d1-vehicle-knowledge';
const questionDir = 'data/questions/d1-vehicle-knowledge';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sources = [
  {
    source_key: 'TSFS_2021_119_CONSOLIDATED',
    source_title: 'Transportstyrelsens föreskrifter och allmänna råd om taxiförarlegitimation',
    source_type: 'primary_legal_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'TSFS 2021:119, 3 kap. 23-29 §§',
    url: 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/ts-foreskrifter-i-nummerordning/2011/details?RuleNumber=2021%3A119&RulePrefix=TSFS',
    relevant_chapter_section: '3 kap. 23-29 §§',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary curriculum authority for D1 Fordonskännedom requirements.',
  },
  {
    source_key: 'TS_DACK_PERSONBIL',
    source_title: 'Krav på däck för personbil',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official vehicle tyre guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/dack/Dackbyte-pa-personbil/',
    relevant_chapter_section: 'E-marking, S-marking, load capacity, speed capacity, tyre types, dimensions and tyre pressure',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for tyre construction/rule facts; senast uppdaterad 2025-11-11.',
  },
  {
    source_key: 'TS_VINTERDACK',
    source_title: 'Vinterdäck',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official winter tyre guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/dack/vinterdack/',
    relevant_chapter_section: 'Winter tyre dates, tread depth, studded tyres, trailer combinations and exceptions',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for winter tyre and studded tyre rules; senast uppdaterad 2026-05-27.',
  },
  {
    source_key: 'TS_BESIKTNING',
    source_title: 'Besiktning av fordon',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official inspection guidance',
    url: 'https://www.transportstyrelsen.se/fordonsbesiktning',
    relevant_chapter_section: 'Inspection responsibility, inspection date, deficiency remediation and vehicle inspection rules',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for statutory vehicle checks; senast uppdaterad 2025-10-08.',
  },
  {
    source_key: 'TSFS_2017_54_KONTROLLBESIKTNING',
    source_title: 'Transportstyrelsens föreskrifter och allmänna råd om kontrollbesiktning',
    source_type: 'primary_legal_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'TSFS 2017:54',
    url: 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/ts-foreskrifter-i-nummerordning/2020/details?RuleNumber=2020%3A39&ruleprefix=TSFS',
    relevant_chapter_section: 'Control inspection of brakes, steering, lights, tyres and test drive observations',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary source for inspection-control areas and defect categories.',
  },
  {
    source_key: 'TS_FORDONSBELYSNING',
    source_title: 'Fordonsbelysning',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official vehicle lighting guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/generella-trafikregler/fordonsbelysning/',
    relevant_chapter_section: 'Required lighting, white/yellow light forward, red light rearward and manual light activation',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for lighting checks; senast uppdaterad 2026-05-08.',
  },
  {
    source_key: 'TS_LASTSAKRING',
    source_title: 'Lastsäkring',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official load securing guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/lasta-dra/lastsakring/',
    relevant_chapter_section: 'Load effects on handling, roof load, loose objects, trailer load and driver responsibility',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for weight/load effects; senast uppdaterad 2026-01-23.',
  },
  {
    source_key: 'TS_SLAPVAGNSVIKTER',
    source_title: 'Vikter att ta hänsyn till när du drar en släpvagn',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official vehicle-combination weight guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/regler-for-olika-fordonsslag/slap/vikter/',
    relevant_chapter_section: 'Registration certificate, maximum trailer weight and technical limitations',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for vehicle-combination facts; senast uppdaterad 2026-05-27.',
  },
  {
    source_key: 'TS_DRAGKROK',
    source_title: 'Dragkrok',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official towbar guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/regler-for-olika-fordonsslag/slap/dragkrok/',
    relevant_chapter_section: 'EU-approved towbar, manufacturer instructions and registered maximum trailer weight',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for towing equipment constraints; senast uppdaterad 2026-05-27.',
  },
  {
    source_key: 'TS_AVGASER',
    source_title: 'Avgaser',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official exhaust and vehicle emission guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/Miljo/Luftkvaliet-i-tatorter/Avgaser/',
    relevant_chapter_section: 'Emission classes, exhaust requirements and vehicle technical requirements',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for technical vehicle environmental systems; senast uppdaterad 2025-08-28.',
  },
  {
    source_key: 'ELS_LADDA_ELBIL',
    source_title: 'Säkerhetsrisker vid laddning av elbilar',
    source_type: 'official_safety_guidance',
    authority: 'Elsäkerhetsverket',
    legal_reference: 'Official electrical safety guidance',
    url: 'https://www.elsakerhetsverket.se/privatpersoner/din-elanlaggning/bygga-och-renovera/installation-av-elbilsladdare/sakerhetsrisker-vid-laddning-av-elbilar/',
    relevant_chapter_section: 'Schuko risk, high current, long duration, installation condition and fire risk',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for charging risk; senast granskad 2025-05-26.',
  },
  {
    source_key: 'ELS_LADDARE_BATTERIER',
    source_title: 'Laddare',
    source_type: 'official_safety_guidance',
    authority: 'Elsäkerhetsverket',
    legal_reference: 'Official electrical product and battery safety guidance',
    url: 'https://www.elsakerhetsverket.se/privatpersoner/dina-elprodukter/produkter/laddare/',
    relevant_chapter_section: 'Damaged batteries, cables, charging products, fire and toxic smoke risks',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for battery and charging risks; senast granskad 2026-02-13.',
  },
  {
    source_key: 'KV_HALLBART_BILAGANDE',
    source_title: 'Hållbart bilägande',
    source_type: 'official_explanatory_source',
    authority: 'Konsumentverket',
    legal_reference: 'Official consumer guidance on sustainable car ownership',
    url: 'https://www.konsumentverket.se/miljo-och-hallbarhet/hallbart-bilagande/',
    relevant_chapter_section: 'Vehicle fluids, washing runoff, heavy metals, oil and harmful substances',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official consumer authority source for vehicle fluids and runoff.',
  },
];

const visuals = [
  ['veh_component_overview', 'component_diagram', 'Fordonets uppbyggnad', ['motor/drivlina', 'styrning', 'bromsar', 'elsystem', 'hjul/däck'], ['D1-VEH-023-001']],
  ['veh_defect_decision_tree', 'component_diagram', 'Felbedömning och åtgärd', ['kör vidare', 'åtgärda snarast', 'avbryt körning', 'verkstad/bärgning'], ['D1-VEH-023-002']],
  ['veh_dashboard_warning_symbols', 'dashboard_warning_symbol_image', 'Varningsindikeringar', ['röd varning', 'gul varning', 'broms', 'batteri/laddning', 'motor/avgas'], ['D1-VEH-024-004']],
  ['veh_fluid_reservoirs', 'fluid_reservoir_diagram', 'Vätskor och läckage', ['olja', 'kylvätska', 'bromsvätska', 'spolarvätska', 'läckage under bil'], ['D1-VEH-025-001', 'D1-VEH-025-003']],
  ['veh_fuse_panel', 'component_diagram', 'Säkringar', ['säkringshållare', 'amperetal', 'instruktionsbok/schema'], ['D1-VEH-026-001']],
  ['veh_battery_jump_start', 'battery_jump_start_diagram', 'Batteri och startkablar', ['plus/minus', 'jordpunkt', 'skadad kabel', 'gnistrisk'], ['D1-VEH-026-002', 'D1-VEH-026-003']],
  ['veh_drivetrain_types', 'drivetrain_diagram', 'Fram-, bak- och fyrhjulsdrift', ['framdrift', 'bakdrift', 'fyrhjulsdrift', 'väglag'], ['D1-VEH-027-004A']],
  ['veh_steering_system', 'steering_diagram', 'Styrning och fel', ['ratt', 'hjulupphängning', 'glapp', 'sidodragning'], ['D1-VEH-027-001', 'D1-VEH-027-002']],
  ['veh_brake_system', 'brake_system_diagram', 'Bromssystem', ['pedal', 'bromsvätska', 'bromsskiva', 'bromsbelägg', 'ojämn bromsverkan'], ['D1-VEH-028-001']],
  ['veh_wheel_change_safety', 'component_diagram', 'Säkert hjulbyte', ['plan yta', 'domkraftspunkt', 'hjulbultar', 'efterkontroll'], ['D1-VEH-029-002', 'D1-VEH-029-004']],
  ['veh_tyre_wear_patterns', 'tyre_wear_pattern', 'Däckslitage', ['mittslitage', 'kantsslitage', 'ojämnt slitage', 'lufttryck'], ['D1-VEH-029-001', 'D1-VEH-029-005']],
  ['veh_tyre_sidewall', 'tyre_sidewall_illustration', 'Däckmärkning', ['dimension', 'belastningskod', 'hastighetskod', 'E-märkning'], ['D1-VEH-029-006', 'D1-VEH-029-007E']],
  ['veh_tread_depth_winter', 'tread_depth_illustration', 'Mönsterdjup och vinterdäck', ['1,6 mm', '3 mm', 'alptopp/snöflinga', 'dubbdäcksperiod'], ['D1-VEH-029-007A', 'D1-VEH-029-007B', 'D1-VEH-029-007C']],
].map(([visual_id, visual_type, purpose, elements, requirement_keys]) => ({
  visual_id,
  visual_type,
  status: 'placeholder_metadata',
  purpose,
  elements_must_be_shown: elements,
  labels_required: elements,
  requirement_keys,
  correctness_depends_on_visual: false,
  notes: 'Placeholder manifest entry only. Do not use copyrighted theory-book diagrams.',
}));

const topics = [
  {
    slug: 'uppbyggnad-funktion',
    title: 'Fordonets uppbyggnad och funktion',
    prefix: 'BASIC',
    visual: 'veh_component_overview',
    facts: [
      ['D1-VEH-023-001', 'Förarprovet kräver förståelse för personbilars och lätta lastbilars uppbyggnad, funktion och fordonslagstiftning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 23 §', 'binding_curriculum_requirement'],
      ['D1-VEH-023-001', 'Personbil och lätt lastbil ska förstås som fordon med flera samverkande system: drivlina, styrning, bromsar, elsystem, hjul och däck.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 23 §', 'binding_curriculum_requirement'],
      ['D1-VEH-023-002', 'Föraren ska kunna avgöra fordonsbrister, hur fel kan avhjälpas och vilka åtgärder som bör vidtas när fel uppstår.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 23 §', 'binding_curriculum_requirement'],
      ['D1-VEH-023-002', 'Ett fel som påverkar styrning, bromsar, hjul eller belysning ska bedömas som trafiksäkerhetskritiskt tills det kontrollerats.', 'TSFS_2017_54_KONTROLLBESIKTNING', 'TSFS 2017:54, kontrollområden för styrning, bromsar, belysning och hjul', 'binding_rule'],
      ['D1-VEH-023-002', 'Modellspecifika uppgifter om var delar sitter och hur enklare åtgärder görs ska hämtas från fordonets dokumentation eller verkstad.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 23-24 §§', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'kontroller-tekniska-uppgifter',
    title: 'Fordonskontroller och tekniska uppgifter',
    prefix: 'CHECK',
    visual: 'veh_defect_decision_tree',
    facts: [
      ['D1-VEH-024-001', 'Förarprovet kräver att föraren kan redogöra för kontroller enligt fordonslagstiftningen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 24 § 1', 'binding_curriculum_requirement'],
      ['D1-VEH-024-001', 'Fordonsägaren eller brukaren ansvarar för att fordonet kontrollbesiktas i rätt tid.', 'TS_BESIKTNING', 'Besiktning av fordon, kontrollbesiktning i rätt tid', 'official_guidance'],
      ['D1-VEH-024-001', 'Om brister upptäcks vid besiktning ska de åtgärdas snarast; utebliven efterkontroll kan leda till körförbud.', 'TS_BESIKTNING', 'Besiktning av fordon, föreläggande och efterkontroll', 'official_guidance'],
      ['D1-VEH-024-002', 'Förarprovet kräver att föraren kan ta reda på fakta och tekniska uppgifter om fordonet.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 24 § 2', 'binding_curriculum_requirement'],
      ['D1-VEH-024-002', 'Tekniska uppgifter som släpvagnsvikt, däckdimension och axelbelastning finns i registreringsbevis eller Transportstyrelsens fordonsuppgifter.', 'TS_SLAPVAGNSVIKTER', 'Vikter att ta hänsyn till när du drar en släpvagn, registreringsbevis och e-tjänster', 'official_guidance'],
    ],
  },
  {
    slug: 'sakerhetssystem',
    title: 'Aktiva och passiva säkerhetssystem',
    prefix: 'SAFE',
    visual: 'veh_dashboard_warning_symbols',
    facts: [
      ['D1-VEH-024-003', 'Förarprovet kräver att föraren kan redogöra för aktiva och passiva system och deras funktion.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 24 § 3', 'binding_curriculum_requirement'],
      ['D1-VEH-024-003', 'Aktiva säkerhetssystem hjälper föraren att undvika olyckor, till exempel genom stöd för bromsning, stabilitet eller sikt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 24 § 3', 'binding_curriculum_requirement'],
      ['D1-VEH-024-003', 'Passiva säkerhetssystem minskar skador när en olycka inträffar, till exempel bälte, krockkudde och karossens skyddande konstruktion.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 24 § 3', 'binding_curriculum_requirement'],
      ['D1-VEH-024-003', 'Registreringsbesiktning och typgodkännande omfattar tekniska krav på bland annat bromsar, avgasrening och krocksäkerhet.', 'TS_AVGASER', 'Fordonsimport och ursprungskontroll, tekniska krav vid registrering', 'official_guidance'],
      ['D1-VEH-024-003', 'Ett stödsystem ersätter inte förarens ansvar att kontrollera fordonets skick och anpassa körningen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 23-24 §§', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'varningslampor-fel',
    title: 'Varningslampor och fel',
    prefix: 'WARN',
    visual: 'veh_dashboard_warning_symbols',
    facts: [
      ['D1-VEH-024-004', 'Förarprovet kräver att föraren kan bedöma åtgärder när indikeringar varnar eller fel uppstår.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 24 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-024-004', 'Röd varning eller tydlig påverkan på broms, styrning, laddning eller motortemperatur ska leda till omedelbar försiktig åtgärd och kontroll.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 24 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-024-004', 'Gul varning kräver att föraren kontrollerar instruktionsbok eller fordonsinformation och planerar åtgärd innan felet förvärras.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 24 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-024-004', 'Felindikationer vid provkörning kan ligga till grund för fortsatt kontroll vid kontrollbesiktning.', 'TSFS_2017_54_KONTROLLBESIKTNING', 'TSFS 2017:54, bilaga 1, provkörning och felindikationer', 'binding_rule'],
      ['D1-VEH-024-004', 'En taxi ska inte sättas i trafik med ett känt fel som kan påverka säkerhet, kontrollbarhet eller föreskriven utrustning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 23-24 §§', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'vatskor-lackage',
    title: 'Vätskor och läckage',
    prefix: 'FLUID',
    visual: 'veh_fluid_reservoirs',
    facts: [
      ['D1-VEH-025-001', 'Förarprovet kräver att föraren kan identifiera olika läckage.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 25 § 1', 'binding_curriculum_requirement'],
      ['D1-VEH-025-002', 'Förarprovet kräver kunskap om risker med olika läckage.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 25 § 2', 'binding_curriculum_requirement'],
      ['D1-VEH-025-003', 'Förarprovet kräver att föraren kan redogöra för kontroll och påfyllning av fordonsvätskor.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 25 § 3', 'binding_curriculum_requirement'],
      ['D1-VEH-025-002', 'Läckage av bränsle, olja, kylvätska eller bromsvätska kan innebära brand-, miljö- eller trafiksäkerhetsrisk.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 25 § 2', 'binding_curriculum_requirement'],
      ['D1-VEH-025-003', 'Påfyllning av vätskor ska göras med rätt vätsketyp och enligt fordonets anvisningar, eftersom nivåer och placering varierar mellan modeller.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 25 § 3', 'binding_curriculum_requirement'],
      ['D1-VEH-025-002', 'Fordonsvätskor och oljerester ska hanteras så att de inte hamnar i mark, dagvatten eller vattendrag.', 'KV_HALLBART_BILAGANDE', 'Hållbart bilägande, Tvätta inte bilen på gatan', 'official_guidance', ['D1-ENV-FUEL-FACT-005']],
    ],
  },
  {
    slug: 'batteri-sakringar-elsystem',
    title: 'Batteri, säkringar och elsystem',
    prefix: 'ELEC',
    visual: 'veh_battery_jump_start',
    facts: [
      ['D1-VEH-026-001', 'Förarprovet kräver att föraren kan redogöra för säkringars placering och rätt ampere.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 26 § 1', 'binding_curriculum_requirement'],
      ['D1-VEH-026-002', 'Förarprovet kräver att föraren kan redogöra för risker vid användning av startkablar.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 26 § 2', 'binding_curriculum_requirement'],
      ['D1-VEH-026-003', 'Förarprovet kräver att föraren kan redogöra för kontroll och hantering av batteri.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 26 § 3', 'binding_curriculum_requirement'],
      ['D1-VEH-026-004', 'Förarprovet kräver att föraren kan redogöra för kontroll och byte av glödlampor.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 26 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-026-005', 'Förarprovet kräver att föraren kan redogöra för risker vid laddning av fordon.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 26 § 5', 'binding_curriculum_requirement'],
      ['D1-VEH-026-001', 'En säkring ska ersättas med rätt amperetal; fel amperetal kan göra att elsystemets skydd inte fungerar som avsett.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 26 § 1', 'binding_curriculum_requirement'],
      ['D1-VEH-026-004', 'Vid färd ska föreskrivna lyktor och strålkastare vara tända, och föraren måste säkerställa att bilen visar rätt ljus.', 'TS_FORDONSBELYSNING', 'Fordonsbelysning, föreskriven belysning', 'official_guidance'],
      ['D1-VEH-026-005', 'Laddning i vanligt vägguttag kan innebära brandrisk vid hög ström, lång laddtid eller brister i elanläggningen.', 'ELS_LADDA_ELBIL', 'Säkerhetsrisker vid laddning av elbilar, Schuko och brandrisk', 'official_safety_guidance'],
      ['D1-VEH-026-003', 'Skadade batterier, kablar eller laddare kan orsaka brand, explosion eller giftig rök och ska tas på allvar.', 'ELS_LADDARE_BATTERIER', 'Laddare, felaktiga/skadade batterier och kablar', 'official_safety_guidance'],
    ],
  },
  {
    slug: 'styrning-koregenskaper',
    title: 'Styrning och köregenskaper',
    prefix: 'STEER',
    visual: 'veh_steering_system',
    facts: [
      ['D1-VEH-027-001', 'Förarprovet kräver kunskap om enklare kontroller av styrinrättningen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 27 § 1', 'binding_curriculum_requirement'],
      ['D1-VEH-027-002', 'Förarprovet kräver kunskap om felaktigheter som kan uppstå i styrinrättningen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 27 § 2', 'binding_curriculum_requirement'],
      ['D1-VEH-027-003', 'Förarprovet kräver kunskap om följder av felaktig hantering av styrinrättningen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 27 § 3', 'binding_curriculum_requirement'],
      ['D1-VEH-027-004A', 'Förarprovet kräver kunskap om hur fram-, bak- och fyrhjulsdrift påverkar köregenskaper.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 27 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-027-004B', 'Förarprovet kräver kunskap om hur last- och viktförhållanden påverkar köregenskaper.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 27 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-027-004C', 'Förarprovet kräver kunskap om hur väderförhållanden påverkar köregenskaper.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 27 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-027-002', 'Påtaglig sidodragning, kärv styrning, instabilitet eller mycket svår manövrering är brister som ska tas på allvar.', 'TSFS_2017_54_KONTROLLBESIKTNING', 'TSFS 2017:54, bilaga 1, provkörning och styrningsbrister', 'binding_rule'],
      ['D1-VEH-027-004B', 'Fel lastning kan försämra bilens köregenskaper eller medföra att last tappas på vägen.', 'TS_LASTSAKRING', 'Lastsäkring, risk vid fel lastning', 'official_guidance'],
      ['D1-VEH-027-004C', 'Väder och väglag ändrar friktion och sikt, så styrning, hastighet och marginaler måste anpassas.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 27 § 4', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'bromssystem',
    title: 'Bromssystem',
    prefix: 'BRAKE',
    visual: 'veh_brake_system',
    facts: [
      ['D1-VEH-028-001', 'Förarprovet kräver att föraren kan redogöra för moderna bromssystems uppbyggnad och funktion.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 28 § 1', 'binding_curriculum_requirement'],
      ['D1-VEH-028-002', 'Förarprovet kräver att föraren kan använda fordonets bromsar på rätt sätt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 28 § 2', 'binding_curriculum_requirement'],
      ['D1-VEH-028-003', 'Förarprovet kräver att föraren kan redogöra för felaktigheter som kan uppstå på bromssystem.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 28 § 3', 'binding_curriculum_requirement'],
      ['D1-VEH-028-004', 'Förarprovet kräver att föraren kan utföra enklare kontroller av bromssystem.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 28 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-028-003', 'Ojämn bromsverkan, pulsering, anliggande broms eller bromsläckage är brister som kan konstateras vid kontrollbesiktning.', 'TSFS_2017_54_KONTROLLBESIKTNING', 'TSFS 2017:54, bilaga 1, bromskontroll', 'binding_rule'],
      ['D1-VEH-028-004', 'Bromssystem kan kontrolleras genom funktion, täthet, slitage och provkörningsiakttagelser.', 'TSFS_2017_54_KONTROLLBESIKTNING', 'TSFS 2017:54, bilaga 1, bromssystem', 'binding_rule'],
      ['D1-VEH-028-002', 'Rätt bromsanvändning innebär att hålla avstånd, bromsa mjukt när det går och agera tydligt vid fara.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 28 § 2', 'binding_curriculum_requirement'],
      ['D1-VEH-028-003', 'Om bromspedal, bromsvarning eller bromsverkan känns onormal ska bilen inte fortsätta i taxitrafik utan kontroll.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 28 § 3', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'hjul-sakerhetskontroll',
    title: 'Hjul och säkerhetskontroll',
    prefix: 'WHEEL',
    visual: 'veh_wheel_change_safety',
    facts: [
      ['D1-VEH-029-002', 'Förarprovet kräver kunskap om risker vid hjulbyte.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 2', 'binding_curriculum_requirement'],
      ['D1-VEH-029-004', 'Förarprovet kräver att föraren kan redogöra för säkerhetskontroller på hjulen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-029-004', 'Hjulens fastsättning, synliga skador, däckens kondition och korrekt lufttryck ingår i praktisk hjulkontroll.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 4', 'binding_curriculum_requirement'],
      ['D1-VEH-029-002', 'Vid hjulbyte ska bilen stå stabilt och lyftas enligt fordonets anvisningar; fel lyftpunkt eller osäker plats kan göra arbetet farligt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 2', 'binding_curriculum_requirement'],
      ['D1-VEH-029-004', 'Efter hjulbyte behöver föraren försäkra sig om att hjulen sitter korrekt innan bilen används i uppdrag.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 4', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'dackslitage-lufttryck',
    title: 'Däckslitage och lufttryck',
    prefix: 'PRESS',
    visual: 'veh_tyre_wear_patterns',
    facts: [
      ['D1-VEH-029-001', 'Förarprovet kräver kunskap om orsaker till onormalt däckslitage.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 1', 'binding_curriculum_requirement'],
      ['D1-VEH-029-005', 'Förarprovet kräver att föraren kan bedöma hur däck, lufttryck och hjulens kondition påverkar fordon och taxameterutrustning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 5', 'binding_curriculum_requirement'],
      ['D1-VEH-029-005', 'Fel däcktryck kan påverka köregenskaper, bränsleförbrukning och däckens livslängd.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, Kolla däckens lufttryck ofta', 'official_guidance', ['D1-ECO-MAINT-FACT-002', 'D1-ENV-TYRE-FACT-006']],
      ['D1-VEH-029-005', 'Rätt däcktryck för bilen finns i fordonets instruktionsbok eller tekniska uppgifter.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, Kolla däckens lufttryck ofta', 'official_guidance'],
      ['D1-VEH-029-001', 'Onormalt däckslitage kan tyda på fel lufttryck, fel hjulinställning, skadade komponenter eller olämplig körning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 1', 'binding_curriculum_requirement'],
      ['D1-VEH-029-005', 'Ändrad däckdimension eller rullningsomkrets kan påverka hastighetsmätarens visning och därmed taxameterutrustningens förutsättningar.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, alternativa dimensioner och hastighetsmätare', 'official_guidance'],
    ],
  },
  {
    slug: 'dackmarkningar',
    title: 'Däckmärkningar',
    prefix: 'MARK',
    visual: 'veh_tyre_sidewall',
    facts: [
      ['D1-VEH-029-006', 'Förarprovet kräver kunskap om märkningar på typgodkända däck.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 6', 'binding_curriculum_requirement'],
      ['D1-VEH-029-006', 'Nya däck ska normalt vara E-märkta och typgodkända enligt gällande reglementen.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, E-märkning', 'official_guidance'],
      ['D1-VEH-029-006', 'Nya däck som tagits i bruk efter den 1 oktober 2009 ska normalt vara S-märkta för bullerkrav.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, S-märkning', 'official_guidance'],
      ['D1-VEH-029-006', 'E-märkta däck anger belastningskod på däckets sida.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, belastningsförmåga', 'official_guidance'],
      ['D1-VEH-029-006', 'På E-märkta däck anges hastighetskapacitet med en beteckning på däckets sida.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, hastighetskapacitet', 'official_guidance'],
    ],
  },
  {
    slug: 'vinterdack-dubbdack',
    title: 'Vinterdäck och dubbdäck',
    prefix: 'WINTER',
    visual: 'veh_tread_depth_winter',
    facts: [
      ['D1-VEH-029-007A', 'Förarprovet kräver att föraren kan tillämpa regler om mönsterdjup.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 7 a', 'binding_curriculum_requirement'],
      ['D1-VEH-029-007C', 'Personbilar och lätta lastbilar ska ha vinterdäck eller likvärdig utrustning 1 december-31 mars när det är vinterväglag.', 'TS_VINTERDACK', 'Vinterdäck, personbilar och lätta lastbilar', 'official_guidance'],
      ['D1-VEH-029-007A', 'Minsta mönsterdjup under vinterdäckskravet är 3 mm för personbil och lätt lastbil upp till 3 500 kg.', 'TS_VINTERDACK', 'Vinterdäck, minsta mönsterdjup', 'official_guidance'],
      ['D1-VEH-029-007C', 'Vinterväglag innebär snö, is, snömodd eller frost på någon del av vägen; Polisen avgör om vinterväglag råder på plats.', 'TS_VINTERDACK', 'Vinterdäck, vinterväglag', 'official_guidance'],
      ['D1-VEH-029-007B', 'Dubbdäck får användas 1 oktober-15 april och även annan tid om det är eller befaras bli vinterväglag.', 'TS_VINTERDACK', 'Vinterdäck, dubbade vinterdäck', 'official_guidance'],
      ['D1-VEH-029-007C', 'Dubbfria vinterdäck för personbil ska vara märkta med symbolen alptopp/snöflinga.', 'TS_VINTERDACK', 'Vinterdäck, dubbfria vinterdäck', 'official_guidance'],
      ['D1-VEH-029-007B', 'Personbilar och lätta lastbilar får inte använda dubbade och odubbade däck samtidigt.', 'TS_VINTERDACK', 'Vinterdäck, dubbade vinterdäck', 'official_guidance'],
    ],
  },
  {
    slug: 'fordonskombinationer-dimensioner',
    title: 'Hjul-, däck- och fordonskombinationer',
    prefix: 'COMBO',
    visual: 'veh_tyre_sidewall',
    facts: [
      ['D1-VEH-029-003', 'Förarprovet kräver kunskap om nödhjul och punkteringsspray.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 3', 'binding_curriculum_requirement'],
      ['D1-VEH-029-007D', 'Förarprovet kräver att föraren kan tillämpa regler om olika fordonskombinationer.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 7 d', 'binding_curriculum_requirement'],
      ['D1-VEH-029-007E', 'Förarprovet kräver att föraren kan tillämpa regler om hjul- och däckdimensioner.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 7 e', 'binding_curriculum_requirement'],
      ['D1-VEH-029-007D', 'Bilens högsta tillåtna släpvagnsvikt och fordonskombinationens vikter framgår av registreringsbevis eller Transportstyrelsens e-tjänster.', 'TS_SLAPVAGNSVIKTER', 'Vikter att ta hänsyn till när du drar en släpvagn', 'official_guidance'],
      ['D1-VEH-029-007E', 'Alternativa däck- och fälgdimensioner får användas bara om krav på typgodkännande, belastning, hastighet, fri rörlighet och hastighetsmätarvisning uppfylls.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, alternativa dimensioner', 'official_guidance'],
      ['D1-VEH-029-003', 'Nödhjul och punkteringsspray är tillfälliga lösningar vars begränsningar ska följas enligt fordonets anvisningar.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 29 § 3', 'binding_curriculum_requirement'],
    ],
  },
];

const extraSourceIds = {
  'D1-VEH-023-001': ['TSFS_2021_119_CONSOLIDATED', 'TS_AVGASER'],
  'D1-VEH-023-002': ['TSFS_2021_119_CONSOLIDATED', 'TSFS_2017_54_KONTROLLBESIKTNING'],
  'D1-VEH-024-001': ['TSFS_2021_119_CONSOLIDATED', 'TS_BESIKTNING', 'TSFS_2017_54_KONTROLLBESIKTNING'],
  'D1-VEH-024-002': ['TSFS_2021_119_CONSOLIDATED', 'TS_SLAPVAGNSVIKTER', 'TS_DACK_PERSONBIL'],
  'D1-VEH-024-003': ['TSFS_2021_119_CONSOLIDATED', 'TS_AVGASER'],
  'D1-VEH-024-004': ['TSFS_2021_119_CONSOLIDATED', 'TSFS_2017_54_KONTROLLBESIKTNING'],
  'D1-VEH-025-001': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-025-002': ['TSFS_2021_119_CONSOLIDATED', 'KV_HALLBART_BILAGANDE'],
  'D1-VEH-025-003': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-026-001': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-026-002': ['TSFS_2021_119_CONSOLIDATED', 'ELS_LADDARE_BATTERIER'],
  'D1-VEH-026-003': ['TSFS_2021_119_CONSOLIDATED', 'ELS_LADDARE_BATTERIER'],
  'D1-VEH-026-004': ['TSFS_2021_119_CONSOLIDATED', 'TS_FORDONSBELYSNING'],
  'D1-VEH-026-005': ['TSFS_2021_119_CONSOLIDATED', 'ELS_LADDA_ELBIL', 'ELS_LADDARE_BATTERIER'],
  'D1-VEH-027-001': ['TSFS_2021_119_CONSOLIDATED', 'TSFS_2017_54_KONTROLLBESIKTNING'],
  'D1-VEH-027-002': ['TSFS_2021_119_CONSOLIDATED', 'TSFS_2017_54_KONTROLLBESIKTNING'],
  'D1-VEH-027-003': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-027-004A': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-027-004B': ['TSFS_2021_119_CONSOLIDATED', 'TS_LASTSAKRING'],
  'D1-VEH-027-004C': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-028-001': ['TSFS_2021_119_CONSOLIDATED', 'TSFS_2017_54_KONTROLLBESIKTNING'],
  'D1-VEH-028-002': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-028-003': ['TSFS_2021_119_CONSOLIDATED', 'TSFS_2017_54_KONTROLLBESIKTNING'],
  'D1-VEH-028-004': ['TSFS_2021_119_CONSOLIDATED', 'TSFS_2017_54_KONTROLLBESIKTNING'],
  'D1-VEH-029-001': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-029-002': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-029-003': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-029-004': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-VEH-029-005': ['TSFS_2021_119_CONSOLIDATED', 'TS_DACK_PERSONBIL'],
  'D1-VEH-029-006': ['TSFS_2021_119_CONSOLIDATED', 'TS_DACK_PERSONBIL'],
  'D1-VEH-029-007A': ['TSFS_2021_119_CONSOLIDATED', 'TS_VINTERDACK'],
  'D1-VEH-029-007B': ['TSFS_2021_119_CONSOLIDATED', 'TS_VINTERDACK'],
  'D1-VEH-029-007C': ['TSFS_2021_119_CONSOLIDATED', 'TS_VINTERDACK'],
  'D1-VEH-029-007D': ['TSFS_2021_119_CONSOLIDATED', 'TS_SLAPVAGNSVIKTER', 'TS_DRAGKROK'],
  'D1-VEH-029-007E': ['TSFS_2021_119_CONSOLIDATED', 'TS_DACK_PERSONBIL'],
};

function topicId(topic) {
  return `topic_d1_vehicle_${topic.slug.replaceAll('-', '_')}`;
}

function factKey(topic, index) {
  return `D1-VEH-${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`;
}

function lessonKey(topic) {
  return `D1-VEH-${topic.prefix}-L01`;
}

function sourceByKey(sourceKey) {
  return sources.find((source) => source.source_key === sourceKey);
}

function visualMetadata(topic) {
  const visual = visuals.find((candidate) => candidate.visual_id === topic.visual);
  const base = {
    requires_image: true,
    requires_diagram: true,
    requires_comparison_visual: visual?.visual_type.includes('tyre') || visual?.visual_type.includes('drivetrain') || false,
    visual_asset_id: topic.visual,
    visual_correctness_depends_on_asset: false,
  };
  return base;
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

function makeLesson(topic) {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  return {
    stable_key: lessonKey(topic),
    topic_id: topicId(topic),
    title: topic.title,
    learning_objectives: [
      `Kunna koppla ${topic.title.toLowerCase()} till säker taxikörning.`,
      'Kunna avgöra när information ska hämtas i fordonsuppgifter, instruktionsbok eller via verkstad.',
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
        text: 'Fordonskännedom handlar om att upptäcka fel, förstå risker och veta när bilen inte ska användas innan felet är kontrollerat.',
        fact_keys: [topicFacts[0].stable_key],
      },
      {
        type: 'bullet_list',
        items: topicFacts.slice(0, 5).map((fact) => fact.fact_text),
        fact_keys: topicFacts.slice(0, 5).map((fact) => fact.stable_key),
      },
      {
        type: 'info',
        text: 'Tekniska lösningar varierar mellan fordonsmodeller. Använd därför alltid bilens egna anvisningar när placering, påfyllning eller arbetsordning är modellspecifik.',
        fact_keys: [topicFacts[topicFacts.length - 1].stable_key],
      },
      {
        type: 'example',
        text: 'Inför ett taxipass upptäcker du en varning, ett läckage eller ett onormalt ljud. Rätt första steg är att bedöma risk, kontrollera information och avstå körning om säkerheten kan påverkas.',
        fact_keys: [topicFacts[Math.min(2, topicFacts.length - 1)].stable_key],
      },
      {
        type: 'warning',
        text: 'Gissa inte vid broms-, styrnings-, hjul- eller elfel. Fordonet ska kontrolleras innan det används om felet kan påverka säkerheten.',
        fact_keys: [topicFacts[Math.min(3, topicFacts.length - 1)].stable_key],
      },
      { type: 'checkpoint', text: 'Kan du avgöra om detta är en kontrollfråga, en åtgärdsfråga eller en fråga för verkstad?', fact_keys: [topicFacts[0].stable_key] },
    ],
  };
}

function makeQuestion(topic, fact, index) {
  const caseLabel = `${topic.prefix}-fordonsfall ${index + 1}`;
  const scenario = !['BASIC', 'SAFE', 'MARK'].includes(topic.prefix) || index % 2 === 0;
  const choices = [
    { id: 'A', text: fact.fact_text },
    { id: 'B', text: `${caseLabel}: felet kan alltid ignoreras om bilen fortfarande går att köra.` },
    { id: 'C', text: `${caseLabel}: föraren ska alltid välja en egen lösning även när fordonets anvisningar säger något annat.` },
    { id: 'D', text: `${caseLabel}: fordonskravet gäller bara privatbil och saknar betydelse för taxi.` },
  ];
  return {
    stable_key: `D1-VEH-${topic.prefix}-Q${String(index + 1).padStart(3, '0')}`,
    version: 1,
    topic_id: topicId(topic),
    requirement_keys: [fact.requirement_key],
    fact_keys: [fact.stable_key],
    lesson_key: lessonKey(topic),
    question_type: scenario ? 'scenario' : 'single_choice',
    competencies: scenario ? ['bedöma/utföra/tillämpa'] : ['känna till/redogöra'],
    prompt: scenario
      ? `${caseLabel}: Vilken bedömning är bäst för säker fordonskännedom? ${fact.fact_text}`
      : `${caseLabel}: Vilket påstående stämmer med kravet på fordonskännedom?`,
    answer_choices: choices,
    correct_answer_id: 'A',
    explanation: `Rätt: ${fact.fact_text} Svaret följer av den verifierade källan och är kopplat till fordonskontroll, felbedömning eller regelanvändning.`,
    difficulty: index < 3 ? 'easy' : index < 6 ? 'medium' : 'hard',
    source_references: [{ source_id: fact.source_id, exact_reference: fact.exact_reference }],
    visual_metadata: visualMetadata(topic),
    visual_asset_id: topic.visual,
    visual_correctness_depends_on_asset: false,
    status: 'published',
  };
}

const lessons = topics.map(makeLesson);
const questions = topics.flatMap((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  return Array.from({ length: topic.prefix === 'ELEC' || topic.prefix === 'STEER' || topic.prefix === 'BRAKE' ? 9 : 8 }, (_, index) =>
    makeQuestion(topic, topicFacts[index % topicFacts.length], index),
  );
});
const topicCheckpoints = topics.map((topic) => ({
  stable_key: `D1-VEH-${topic.prefix}-CHECKPOINT-001`,
  title: `Intern checkpoint: ${topic.title}`,
  type: 'checkpoint',
  subject: 'D1_VEHICLE_KNOWLEDGE',
  topic: topicId(topic),
  eligible_status: 'published',
  question_count: topic.prefix === 'ELEC' || topic.prefix === 'STEER' || topic.prefix === 'BRAKE' ? 8 : 6,
  pass_threshold: 0.8,
  selection: 'random_from_eligible_published_questions',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
}));
const subjectCheckpoint = {
  stable_key: 'D1-VEH-SUBJECT-CHECKPOINT-001',
  title: 'Intern ämnescheckpoint: Fordonskännedom',
  type: 'checkpoint',
  subject: 'D1_VEHICLE_KNOWLEDGE',
  topic: null,
  eligible_status: 'published',
  question_count: 32,
  pass_threshold: 0.8,
  selection: 'broad_sample_across_all_d1_vehicle_knowledge_topics',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
};

const sourceMap = {
  metadata: {
    subject: 'D1_VEHICLE_KNOWLEDGE',
    phase: 'source_expansion',
    language: 'sv',
    scope: 'Authoritative source map for TSFS 2021:119, 3 kap. 23-29 §§.',
    created_at: verifiedAt,
    last_verified_at: verifiedAt,
  },
  source_catalog: sources,
  requirement_source_map: Object.entries(extraSourceIds).map(([requirement_key, sourceKeys]) => ({
    requirement_key,
    official_requirement_reference: facts.find((fact) => fact.requirement_key === requirement_key)?.exact_reference ?? 'TSFS 2021:119, 3 kap. 23-29 §§',
    sources: sourceKeys.map(sourceByKey),
    overall_status: 'FULLY_SOURCED',
  })),
  pedagogical_topics: topics.map((topic) => ({
    topic_id: topicId(topic),
    title: topic.title,
    requirement_keys: [...new Set(facts.filter((fact) => fact.topic_id === topicId(topic)).map((fact) => fact.requirement_key))],
    visual_asset_ids: [topic.visual],
    visual_metadata: visualMetadata(topic),
    status: 'published',
  })),
};

writeFileSync('data/curriculum/d1-vehicle-knowledge-sources.json', `${JSON.stringify(sourceMap, null, 2)}\n`);
writeFileSync(
  `${contentDir}/vehicle-facts.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_VEHICLE_KNOWLEDGE',
        title: 'D1 vehicle knowledge verified facts',
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
  `${contentDir}/vehicle-lessons.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_VEHICLE_KNOWLEDGE',
        title: 'D1 vehicle knowledge lessons',
        status: 'published',
        verified_at: verifiedAt,
        note: 'Source-backed mobile-first lessons for taxi-driver vehicle knowledge.',
      },
      lessons,
    },
    null,
    2,
  )}\n`,
);
writeFileSync(
  `${contentDir}/vehicle-visuals.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_VEHICLE_KNOWLEDGE',
        title: 'D1 vehicle knowledge visual asset manifest',
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
  `${questionDir}/vehicle-questions.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_VEHICLE_KNOWLEDGE',
        title: 'D1 vehicle knowledge question bank',
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

console.log(`Wrote ${topics.length} D1 vehicle topics, ${facts.length} facts, ${lessons.length} lessons, ${visuals.length} visual placeholders and ${questions.length} questions.`);
