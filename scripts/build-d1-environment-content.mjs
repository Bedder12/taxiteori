import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-10';
const contentDir = 'data/content/d1-environment';
const questionDir = 'data/questions/d1-environment';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sources = [
  {
    source_key: 'TSFS_2021_119_CONSOLIDATED',
    source_title: 'Transportstyrelsens föreskrifter och allmänna råd om taxiförarlegitimation',
    source_type: 'primary_legal_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'TSFS 2021:119, 3 kap. 6-9 §§',
    url: 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/ts-foreskrifter-i-nummerordning/2011/details?RuleNumber=2021%3A119&RulePrefix=TSFS',
    relevant_chapter_section: '3 kap. 6 §, 7 § 1-3, 8 § och 9 § 1-2',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary curriculum authority for D1 Miljö requirements.',
  },
  {
    source_key: 'TS_AVGASER',
    source_title: 'Avgaser',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official guidance on vehicle exhaust emissions and emission classes',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/Miljo/Luftkvaliet-i-tatorter/Avgaser/',
    relevant_chapter_section: 'Emission classes, CO, HC, NOx, particles, Euro 5/Euro 6 and exhaust requirements',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for exhaust emissions, emission classes and vehicle choice; senast uppdaterad 2025-08-28.',
  },
  {
    source_key: 'TS_BULLER',
    source_title: 'Buller',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official guidance on traffic noise, vehicle noise and tyre noise',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/miljo/buller/',
    relevant_chapter_section: 'Traffic noise health effects, electric vehicles at low speed, tyre/road noise and S-marking',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for vehicle and tyre noise; senast uppdaterad 2026-06-23.',
  },
  {
    source_key: 'TS_DACK_PERSONBIL',
    source_title: 'Krav på däck för personbil',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official vehicle/tire guidance',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/dack/Dackbyte-pa-personbil/',
    relevant_chapter_section: 'E-marking, S-marking, tyre types, load capacity and tyre pressure',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for tyre rules and tyre pressure; senast uppdaterad 2025-11-11.',
  },
  {
    source_key: 'EM_DACK_ENERGIMARKNING',
    source_title: 'Energimärkning av däck',
    source_type: 'official_explanatory_source',
    authority: 'Energimyndigheten',
    legal_reference: 'Official guidance on EU tyre energy labelling',
    url: 'https://www.energimyndigheten.se/effektiv-energianvandning/hushall/nar-du-ska-kopa-nya-produkter/produkter-med-energimarkning/dack/energimarkning-av-dack/',
    relevant_chapter_section: 'Energy efficiency, wet grip, snow/ice grip and external rolling noise',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for environmental properties of tyre types and labels.',
  },
  {
    source_key: 'NV_LUFTFORORENINGAR_EFFEKTER',
    source_title: 'Luftföroreningar och dess effekter',
    source_type: 'official_explanatory_source',
    authority: 'Naturvårdsverket',
    legal_reference: 'Official guidance on air pollution health and environmental effects',
    url: 'https://www.naturvardsverket.se/amnesomraden/luft/luftfororeningar-och-dess-effekter/',
    relevant_chapter_section: 'Traffic as source of gases and particles; health and environmental effects',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for air pollution effects; granskad 2026-03-19.',
  },
  {
    source_key: 'NV_TRANSPORTER_KLIMAT',
    source_title: 'Klimatet och transporterna',
    source_type: 'official_explanatory_source',
    authority: 'Naturvårdsverket',
    legal_reference: 'Official climate guidance for transport',
    url: 'https://www.naturvardsverket.se/amnesomraden/klimatomstallningen/omraden/klimatet-och-transporterna/',
    relevant_chapter_section: 'Transport climate impact, traffic volume, energy efficiency, fossil-free fuels and electrification',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for transport climate impact; granskad 2025-08-11.',
  },
  {
    source_key: 'NV_TRANSPORTER_UTSLAPP',
    source_title: 'Inrikes transporter, utsläpp av växthusgaser',
    source_type: 'official_statistics_source',
    authority: 'Naturvårdsverket',
    legal_reference: 'Official statistics on greenhouse gas emissions from domestic transport',
    url: 'https://www.naturvardsverket.se/data-och-statistik/klimat/vaxthusgaser-utslapp-fran-inrikes-transporter/',
    relevant_chapter_section: 'Road traffic, passenger cars, traffic volume, biofuels, vehicle efficiency and electrification',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official statistics source; granskad 2026-06-17.',
  },
  {
    source_key: 'EM_DRIVMEDEL',
    source_title: 'Statistik om biobränslen och drivmedel',
    source_type: 'official_statistics_source',
    authority: 'Energimyndigheten',
    legal_reference: 'Official statistics and guidance on fuels and greenhouse gas intensity',
    url: 'https://www.energimyndigheten.se/statistik/ovrig-energistatistik/statistik-om-biobranslen-och-drivmedel/',
    relevant_chapter_section: 'Fuel greenhouse gas emissions, renewable share, biofuel blending and lifecycle perspective',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official energy authority source; senast uppdaterad 2025-06-04.',
  },
  {
    source_key: 'TS_SPARSAM_KORNING',
    source_title: 'Sparsam körning',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official guidance on economical/environmental driving',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/miljo/klimat-och-energi/sparsam-korning/',
    relevant_chapter_section: 'Driving style, emissions, noise, tyre pressure, speed and fuel consumption',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official guidance page; senast uppdaterad 2026-08-26.',
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
    notes: 'Official explanatory source for speed, fuel use and emissions; senast uppdaterad 2022-03-31.',
  },
  {
    source_key: 'KV_HALLBART_BILAGANDE',
    source_title: 'Hållbart bilägande',
    source_type: 'official_explanatory_source',
    authority: 'Konsumentverket',
    legal_reference: 'Official consumer guidance on sustainable car ownership',
    url: 'https://www.konsumentverket.se/miljo-och-hallbarhet/hallbart-bilagande/',
    relevant_chapter_section: 'Do not wash the car on the street; chemicals, particles, heavy metals and oil',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official consumer authority source for vehicle cleaning and runoff.',
  },
  {
    source_key: 'NV_BILSKROTNING',
    source_title: 'Omhändertagande av uttjänta bilar',
    source_type: 'official_explanatory_source',
    authority: 'Naturvårdsverket',
    legal_reference: 'Official guidance on end-of-life vehicles and hazardous waste',
    url: 'https://www.naturvardsverket.se/vagledning-och-stod/avfall/bilskrotning/',
    relevant_chapter_section: 'End-of-life vehicles as hazardous waste; oils, batteries, electronics and metals',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for hazardous vehicle components and waste handling.',
  },
  {
    source_key: 'NV_SPILLOLJA',
    source_title: 'Spillolja som bränns i alloljebrännare',
    source_type: 'official_explanatory_source',
    authority: 'Naturvårdsverket',
    legal_reference: 'Official guidance on waste oil as hazardous waste',
    url: 'https://prod-egp.naturvardsverket.se/vagledning-och-stod/branscher-och-verksamheter/forbranningsanlaggningar/avfallsforbranning/spillolja-som-branns-i-alloljebrannare/',
    relevant_chapter_section: 'Waste oil contains pollutants and is hazardous waste',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for waste oil environmental handling; granskad 2026-01-16.',
  },
];

const topics = [
  {
    slug: 'fordonets-miljopaverkan',
    title: 'Fordonets miljöpåverkan',
    prefix: 'IMPACT',
    order: 1,
    visual: { requires_diagram: true, requires_comparison_visual: true },
    facts: [
      ['D1-ENV-006-001', 'Förarprovet kräver kunskap om hur ett fordon påverkar miljön.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 6 §', 'binding_curriculum_requirement'],
      ['D1-ENV-006-001', 'Transporter påverkar klimatet främst genom utsläpp av växthusgaser från vägtrafik och andra transporter.', 'NV_TRANSPORTER_KLIMAT', 'Klimatet och transporterna, transporternas klimatpåverkan', 'official_guidance'],
      ['D1-ENV-006-001', 'Huvuddelen av växthusgasutsläppen från inrikes transporter kommer från vägtrafiken, där personbilar dominerar.', 'NV_TRANSPORTER_UTSLAPP', 'Inrikes transporter, utsläpp av växthusgaser', 'official_statistics'],
      ['D1-ENV-006-001', 'Vägtrafiken ger även luftföroreningar genom avgaser och partiklar från bromsar, hjul och vägbana.', 'NV_LUFTFORORENINGAR_EFFEKTER', 'Luftföroreningar och dess effekter, trafiken som källa', 'official_guidance'],
      ['D1-ENV-006-001', 'För en taxiförare påverkas miljöbelastningen av fordonets teknik, bränsle, skick, däck och hur uppdraget körs.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 6-9 §§', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'motorer-branslen-vatskor',
    title: 'Motorer, bränslen och fordonsvätskor',
    prefix: 'FUEL',
    order: 2,
    visual: { requires_image: true, requires_comparison_visual: true },
    facts: [
      ['D1-ENV-007-001', 'Förarprovet kräver kunskap om hur motorer, bränslen och andra vätskor påverkar miljö och hälsa.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 7 § 1', 'binding_curriculum_requirement'],
      ['D1-ENV-007-001', 'Förbränning av fossila bränslen är det största bidraget till klimatförändringarna från transporter.', 'NV_TRANSPORTER_KLIMAT', 'Klimatet och transporterna, fossil bränsleförbränning', 'official_guidance'],
      ['D1-ENV-007-001', 'Drivmedlens klimatpåverkan varierar med biodrivmedelsinblandning, biodrivmedlens livscykelpåverkan och den fossila andelen.', 'EM_DRIVMEDEL', 'Statistik om biobränslen och drivmedel, drivmedlens klimatpåverkan', 'official_statistics'],
      ['D1-ENV-007-001', 'Bensin- och dieselbilars avgasutsläpp klassas efter bland annat koloxid, kolväten, kväveoxider och partiklar.', 'TS_AVGASER', 'Avgaser, Vad betyder utsläppsklasserna?', 'official_guidance'],
      ['D1-ENV-007-001', 'Fordonsvätskor och oljerester ska hanteras så att de inte hamnar i mark, dagvatten eller vattendrag.', 'KV_HALLBART_BILAGANDE', 'Hållbart bilägande, Tvätta inte bilen på gatan', 'official_guidance'],
    ],
  },
  {
    slug: 'avgaser-reningssystem',
    title: 'Avgaser och reningssystem',
    prefix: 'EXHAUST',
    order: 3,
    visual: { requires_diagram: true, requires_comparison_visual: true },
    facts: [
      ['D1-ENV-007-002', 'Förarprovet kräver kunskap om hur avgasreningssystem fungerar.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 7 § 2', 'binding_curriculum_requirement'],
      ['D1-ENV-007-002', 'Utsläppsklasserna styrs av avgasutsläpp av koloxid, kolväten, kväveoxider och partiklar; koldioxid ingår inte i själva utsläppsklassen.', 'TS_AVGASER', 'Avgaser, Vad betyder utsläppsklasserna?', 'official_guidance'],
      ['D1-ENV-007-002', 'Nya lätta fordon måste uppfylla Euro 6-krav för att registreras.', 'TS_AVGASER', 'Avgaser, Dagens utsläppskrav', 'official_guidance'],
      ['D1-ENV-007-002', 'Katalytisk avgasrening har varit en viktig orsak till minskade utsläpp från vägtrafiken sedan 1990.', 'NV_LUFTFORORENINGAR_EFFEKTER', 'Utsläpp av luftföroreningar, transportsektorns minskningar', 'official_guidance'],
      ['D1-ENV-007-002', 'En förare ska inte ignorera felindikeringar i avgasreningen, eftersom reningssystemet är en del av fordonets miljöfunktion.', 'TS_AVGASER', 'Avgaser, dagens utsläppskrav och utsläppsklasser', 'official_guidance'],
    ],
  },
  {
    slug: 'dack-och-miljo',
    title: 'Däck och miljö',
    prefix: 'TYRE',
    order: 4,
    visual: { requires_image: true, requires_comparison_visual: true },
    facts: [
      ['D1-ENV-007-003', 'Förarprovet kräver att föraren kan redogöra för miljöegenskaper hos olika däcktyper.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 7 § 3', 'binding_curriculum_requirement'],
      ['D1-ENV-007-003', 'Däckens energimärkning visar energieffektivitet, våtgrepp och buller utanför bilen.', 'EM_DACK_ENERGIMARKNING', 'Energimärkning av däck, den nya energimärkningen', 'official_guidance'],
      ['D1-ENV-007-003', 'Energiklass A på däck betyder lägst rullmotstånd och bäst energieffektivitet på skalan A-E.', 'EM_DACK_ENERGIMARKNING', 'Energimärkning av däck, Energieffektivitet på skala A-E', 'official_guidance'],
      ['D1-ENV-007-003', 'Nya däck ska normalt vara S-märkta för att uppfylla bullerkrav från kontakten mellan däck och vägbana.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, S-märkning', 'official_guidance'],
      ['D1-ENV-007-003', 'Dubbdäck påverkar buller och kan bidra till höga partikelhalter genom vägslitage.', 'TS_BULLER', 'Buller, krav på ljudnivå för däck', 'official_guidance'],
      ['D1-ENV-007-003', 'Fel däcktryck kan påverka bränsleförbrukning, däckens livslängd och därmed miljöbelastning.', 'TS_DACK_PERSONBIL', 'Krav på däck för personbil, Kolla däckens lufttryck ofta', 'official_guidance', ['D1-ECO-MAINT-FACT-002']],
    ],
  },
  {
    slug: 'fordonsskotsel-restprodukter',
    title: 'Miljöanpassad fordonsskötsel',
    prefix: 'CARE',
    order: 5,
    visual: { requires_image: true },
    facts: [
      ['D1-ENV-008-001', 'Förarprovet kräver att föraren kan redogöra för fordonsskötsel som minimerar miljöpåverkan.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 8 §', 'binding_curriculum_requirement'],
      ['D1-ENV-008-002', 'Förarprovet kräver att föraren kan redogöra för hur restprodukter från rengöring, service och reparation tas om hand.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 8 §', 'binding_curriculum_requirement'],
      ['D1-ENV-008-001', 'Biltvättmedel, partiklar, tungmetaller och olja kan hamna i dagvatten eller vattendrag om bilen tvättas på gatan.', 'KV_HALLBART_BILAGANDE', 'Hållbart bilägande, Tvätta inte bilen på gatan', 'official_guidance'],
      ['D1-ENV-008-002', 'Uttjänta bilar klassas som farligt avfall tills de tömts på farliga vätskor och komponenter.', 'NV_BILSKROTNING', 'Omhändertagande av uttjänta bilar, Vad är farligt avfall?', 'official_guidance'],
      ['D1-ENV-008-002', 'Spillolja är farligt avfall och innehåller mer föroreningar än vanlig eldningsolja.', 'NV_SPILLOLJA', 'Spillolja som bränns i alloljebrännare', 'official_guidance'],
      ['D1-ENV-008-001', 'Miljöanpassad taxiservice innebär att upptäcka läckage, hantera vätskor rätt och använda tvättplats som är avsedd för fordon.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 8 §', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'start-tomgang-buller',
    title: 'Start, tomgång och buller',
    prefix: 'START',
    order: 6,
    visual: { requires_diagram: true },
    facts: [
      ['D1-ENV-009-001', 'Förarprovet kräver att föraren kan bedöma miljöeffekter av kallstart, varmstart, motorvärmare, tomgång och buller.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 9 § 1', 'binding_curriculum_requirement'],
      ['D1-ENV-009-001', 'Kallstart ger större miljöbelastning än varmstart eftersom motorn och avgasreningen inte har nått effektiv drift direkt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 9 § 1', 'binding_curriculum_requirement'],
      ['D1-ENV-009-001', 'Motorvärmare är relevant därför att den kan minska kallstartens miljöeffekt när den används ändamålsenligt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 9 § 1', 'binding_curriculum_requirement'],
      ['D1-ENV-009-001', 'Hur bilen körs har stor betydelse för utsläpp och buller.', 'TS_SPARSAM_KORNING', 'Sparsam körning, inledande vägledning', 'official_guidance', ['D1-ECO-PLAN-FACT-002']],
      ['D1-ENV-009-001', 'Trafikbuller kan påverka prestation, inlärning och sömn och långvarig exponering kan öka risken för hjärt- och kärlsjukdomar.', 'TS_BULLER', 'Buller, trafikbuller och hälsa', 'official_guidance'],
      ['D1-ENV-009-001', 'Tomgång bör undvikas när den inte behövs, eftersom motorn då ger utsläpp och buller utan att transportera kunden.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 9 § 1', 'binding_curriculum_requirement'],
    ],
  },
  {
    slug: 'korsatt-vagval-miljo',
    title: 'Körsätt och vägval',
    prefix: 'DRIVE',
    order: 7,
    visual: { requires_diagram: true },
    facts: [
      ['D1-ENV-009-002', 'Förarprovet kräver att föraren kan bedöma hur hastighet, växelval, acceleration, planerad körning och vägval påverkar bränsleförbrukning och miljö.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 9 § 2', 'binding_curriculum_requirement'],
      ['D1-ENV-009-002', 'Högre hastighet ökar bränsleförbrukningen och ger därmed större utsläpp från fordon som använder förbränningsbränsle.', 'TS_SPARSAM_KORNING', 'Sparsam körning, hastighet och bränsleförbrukning', 'official_guidance', ['D1-ECO-FUEL-FACT-002']],
      ['D1-ENV-009-002', 'Trafikverket beskriver att högre hastigheter ger högre bränsleförbrukning och mer koldioxidutsläpp.', 'TRV_HASTIGHET_HALLBARHET', 'Hastighet och hållbarhet, hastighetens betydelse', 'official_guidance', ['D1-ECO-FUEL-FACT-004']],
      ['D1-ENV-009-002', 'Planerad körning kan minska onödiga stopp, accelerationer och omvägar som ökar bränsleförbrukning och miljöbelastning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 9 § 2', 'binding_curriculum_requirement'],
      ['D1-ENV-009-002', 'Energieffektiva fordon, hållbara fossilfria drivmedel, begränsade trafikvolymer och elektrifiering är viktiga sätt att minska transporters klimatpåverkan.', 'NV_TRANSPORTER_KLIMAT', 'Klimatet och transporterna, Hur kan transporters klimatpåverkan minska?', 'official_guidance'],
      ['D1-ENV-009-002', 'För en taxi ska miljöanpassat vägval väga in kortare körsträcka, jämnare trafikflöde och kundens säkerhet och behov.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 9 § 2', 'binding_curriculum_requirement'],
    ],
  },
];

const requirementMap = [
  ['D1-ENV-006-001', 'TSFS 2021:119, 3 kap. 6 §', ['TSFS_2021_119_CONSOLIDATED', 'NV_TRANSPORTER_KLIMAT', 'NV_TRANSPORTER_UTSLAPP', 'NV_LUFTFORORENINGAR_EFFEKTER']],
  ['D1-ENV-007-001', 'TSFS 2021:119, 3 kap. 7 § 1', ['TSFS_2021_119_CONSOLIDATED', 'TS_AVGASER', 'NV_TRANSPORTER_KLIMAT', 'EM_DRIVMEDEL', 'KV_HALLBART_BILAGANDE']],
  ['D1-ENV-007-002', 'TSFS 2021:119, 3 kap. 7 § 2', ['TSFS_2021_119_CONSOLIDATED', 'TS_AVGASER', 'NV_LUFTFORORENINGAR_EFFEKTER']],
  ['D1-ENV-007-003', 'TSFS 2021:119, 3 kap. 7 § 3', ['TSFS_2021_119_CONSOLIDATED', 'TS_DACK_PERSONBIL', 'EM_DACK_ENERGIMARKNING', 'TS_BULLER']],
  ['D1-ENV-008-001', 'TSFS 2021:119, 3 kap. 8 §', ['TSFS_2021_119_CONSOLIDATED', 'KV_HALLBART_BILAGANDE', 'NV_BILSKROTNING', 'NV_SPILLOLJA']],
  ['D1-ENV-008-002', 'TSFS 2021:119, 3 kap. 8 §', ['TSFS_2021_119_CONSOLIDATED', 'KV_HALLBART_BILAGANDE', 'NV_BILSKROTNING', 'NV_SPILLOLJA']],
  ['D1-ENV-009-001', 'TSFS 2021:119, 3 kap. 9 § 1', ['TSFS_2021_119_CONSOLIDATED', 'TS_SPARSAM_KORNING', 'TS_BULLER']],
  ['D1-ENV-009-002', 'TSFS 2021:119, 3 kap. 9 § 2', ['TSFS_2021_119_CONSOLIDATED', 'TS_SPARSAM_KORNING', 'TRV_HASTIGHET_HALLBARHET', 'NV_TRANSPORTER_KLIMAT']],
];

function topicId(topic) {
  return `topic_d1_env_${topic.slug.replaceAll('-', '_')}`;
}

function factKey(topic, index) {
  return `D1-ENV-${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`;
}

function lessonKey(topic) {
  return `D1-ENV-${topic.prefix}-L01`;
}

function sourceByKey(sourceKey) {
  return sources.find((source) => source.source_key === sourceKey);
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
      `Förstå hur ${topic.title.toLowerCase()} påverkar miljö, hälsa eller utsläpp.`,
      'Kunna välja ett taxiförarbeteende som minskar miljöpåverkan utan att försämra säkerheten.',
    ],
    requirement_keys: [...new Set(topicFacts.map((fact) => fact.requirement_key))],
    fact_keys: topicFacts.map((fact) => fact.stable_key),
    source_references: [...new Set(topicFacts.map((fact) => fact.source_id))].map((sourceId) => ({
      source_id: sourceId,
      exact_references: topicFacts.filter((fact) => fact.source_id === sourceId).map((fact) => fact.exact_reference),
    })),
    estimated_study_time_minutes: topic.prefix === 'CARE' || topic.prefix === 'START' ? 8 : 6,
    visual_metadata: topic.visual,
    status: 'published',
    content_blocks: [
      { type: 'heading', text: topic.title, fact_keys: [topicFacts[0].stable_key] },
      {
        type: 'paragraph',
        text: 'I Miljö ligger fokus på utsläpp, hälsa, buller, avfall och resursanvändning. Samma körsätt kan ibland också förbättra körekonomin, men här bedöms miljöeffekten.',
        fact_keys: [topicFacts[0].stable_key],
      },
      {
        type: 'bullet_list',
        items: topicFacts.slice(0, 4).map((fact) => fact.fact_text),
        fact_keys: topicFacts.slice(0, 4).map((fact) => fact.stable_key),
      },
      {
        type: 'info',
        text:
          topic.prefix === 'TYRE'
            ? 'Däckval handlar både om säkerhet och miljö: rullmotstånd, buller, slitagepartiklar och vinteregenskaper måste vägas ihop.'
            : topic.prefix === 'CARE'
              ? 'Rengöring och service blir miljöfrågor när vätskor, oljerester, tungmetaller eller kemikalier riskerar att hamna i dagvatten eller natur.'
              : 'En taxiförare behöver förstå vilken åtgärd som minskar utsläpp eller buller i den aktuella situationen.',
        fact_keys: [topicFacts[Math.min(2, topicFacts.length - 1)].stable_key],
      },
      {
        type: 'example',
        text:
          topic.prefix === 'DRIVE'
            ? 'Du väljer en jämnare väg med färre stopp i stället för en något kortare men ryckig väg genom tät trafik. Miljövinsten ligger i färre onödiga accelerationer och lägre förbrukning.'
          : topic.prefix === 'START'
              ? 'Vid väntan på kund stänger du av motorn när bilen inte behöver vara igång. Det minskar utsläpp och buller på platsen.'
              : topic.prefix === 'CARE'
                ? 'När bilen behöver tvättas använder du tvätthall eller anläggning avsedd för fordon, så att smutsigt vatten kan tas om hand.'
                : topic.prefix === 'TYRE'
                  ? 'När däcken ska bytas jämför du inte bara pris och grepp, utan även energimärkning, buller och rätt däcktryck.'
                  : topic.prefix === 'EXHAUST'
                    ? 'Om bilen visar fel i avgasreningen behandlar du det som ett miljöproblem, inte bara som en servicepåminnelse.'
                    : 'När du väljer och kör taxi påverkas miljöbelastningen av fordonets teknik, bränsle, skick och hur uppdraget körs.',
        fact_keys: [topicFacts[Math.min(4, topicFacts.length - 1)].stable_key],
      },
      {
        type: 'warning',
        text: 'Miljöanpassad körning får aldrig bli ett skäl att bryta trafikregler eller välja ett osäkert beteende.',
        fact_keys: [topicFacts[0].stable_key],
      },
      { type: 'checkpoint', text: 'Kan du förklara miljöeffekten, inte bara peka ut en sparsam åtgärd?', fact_keys: [topicFacts[0].stable_key] },
    ],
  };
}

function makeQuestion(topic, fact, index) {
  const caseLabel = `${topic.prefix}-miljöfall ${index + 1}`;
  const scenario = ['CARE', 'START', 'DRIVE'].includes(topic.prefix) || index % 2 === 0;
  const comparison = ['FUEL', 'EXHAUST', 'TYRE'].includes(topic.prefix) && index % 3 === 1;

  return {
    stable_key: `D1-ENV-${topic.prefix}-Q${String(index + 1).padStart(3, '0')}`,
    version: 1,
    topic_id: topicId(topic),
    requirement_keys: [fact.requirement_key],
    fact_keys: [fact.stable_key],
    lesson_key: lessonKey(topic),
    question_type: scenario ? 'scenario' : 'single_choice',
    competencies: scenario ? ['bedöma miljöeffekt'] : comparison ? ['jämföra'] : ['känna till'],
    prompt: scenario
      ? `${caseLabel}: Vilken bedömning är bäst ur miljösynpunkt? ${fact.fact_text}`
      : `${caseLabel}: Vilket påstående stämmer med Miljö-kravet?`,
    answer_choices: [
      { id: 'A', text: fact.fact_text },
      { id: 'B', text: `${caseLabel}: åtgärden är bara en ekonomifråga och saknar miljöeffekt.` },
      { id: 'C', text: `${caseLabel}: högre hastighet, mer tomgång eller fel avfallshantering är normalt bättre för miljön.` },
      { id: 'D', text: `${caseLabel}: miljökravet gäller bara privatbilister och inte taxiförare.` },
    ],
    correct_answer_id: 'A',
    explanation: `Rätt: ${fact.fact_text} Frågan testar miljöeffekt och spåras via lektionen till verifierad källa, inte till ett allmänt råd utan källa.`,
    difficulty: index < 3 ? 'easy' : index < 6 ? 'medium' : 'hard',
    source_references: [{ source_id: fact.source_id, exact_reference: fact.exact_reference }],
    visual_metadata: topic.visual,
    status: 'published',
  };
}

const lessons = topics.map(makeLesson);
const questions = topics.flatMap((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  return Array.from({ length: 8 }, (_, index) => makeQuestion(topic, topicFacts[index % topicFacts.length], index));
});

const topicCheckpoints = topics.map((topic) => ({
  stable_key: `D1-ENV-${topic.prefix}-CHECKPOINT-001`,
  title: `Intern checkpoint: ${topic.title}`,
  type: 'checkpoint',
  subject: 'D1_ENVIRONMENT',
  topic: topicId(topic),
  eligible_status: 'published',
  question_count: topic.prefix === 'IMPACT' ? 5 : topic.prefix === 'CARE' || topic.prefix === 'START' || topic.prefix === 'DRIVE' ? 7 : 6,
  pass_threshold: 0.8,
  selection: 'random_from_eligible_published_questions',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
}));

const subjectCheckpoint = {
  stable_key: 'D1-ENV-SUBJECT-CHECKPOINT-001',
  title: 'Intern ämnescheckpoint: Miljö',
  type: 'checkpoint',
  subject: 'D1_ENVIRONMENT',
  topic: null,
  eligible_status: 'published',
  question_count: 24,
  pass_threshold: 0.8,
  selection: 'broad_sample_across_all_d1_environment_topics',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
};

writeFileSync(
  'data/curriculum/d1-environment-sources.json',
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_ENVIRONMENT',
        phase: 'source_expansion',
        language: 'sv',
        scope: 'Authoritative source map for TSFS 2021:119, 3 kap. 6-9 §§.',
        created_at: verifiedAt,
        last_verified_at: verifiedAt,
      },
      source_catalog: sources,
      requirement_source_map: requirementMap.map(([requirement_key, official_requirement_reference, sourceKeys]) => ({
        requirement_key,
        official_requirement_reference,
        sources: sourceKeys.map(sourceByKey),
        overall_status: 'FULLY_SOURCED',
      })),
      pedagogical_topics: topics.map((topic) => ({
        topic_id: topicId(topic),
        title: topic.title,
        requirement_keys: [...new Set(facts.filter((fact) => fact.topic_id === topicId(topic)).map((fact) => fact.requirement_key))],
        visual_metadata: topic.visual,
        status: 'published',
      })),
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${contentDir}/environment-facts.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_ENVIRONMENT',
        title: 'D1 environment verified facts',
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
  `${contentDir}/environment-lessons.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_ENVIRONMENT',
        title: 'D1 environment lessons',
        status: 'published',
        verified_at: verifiedAt,
        note: 'Source-backed mobile-first lessons for taxi-driver environmental competency.',
      },
      lessons,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${questionDir}/environment-questions.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_ENVIRONMENT',
        title: 'D1 environment question bank',
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

console.log(`Wrote ${topics.length} D1 environment topics, ${facts.length} facts, ${lessons.length} lessons and ${questions.length} questions.`);
