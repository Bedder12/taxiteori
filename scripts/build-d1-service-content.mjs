import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-10';
const contentDir = 'data/content/d1-service';
const questionDir = 'data/questions/d1-service';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sources = [
  {
    source_key: 'TSFS_2021_119_CONSOLIDATED',
    source_title: 'Transportstyrelsens föreskrifter och allmänna råd om taxiförarlegitimation',
    source_type: 'primary_legal_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'TSFS 2021:119, 3 kap. 16-17 §§',
    url: 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/sok-ts-foreskrifter/details?RuleNumber=2023%3A35&ruleprefix=TSFS',
    relevant_chapter_section: '3 kap. 16 § 1-3 och 17 § 1-8',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary curriculum authority for D1 Bemötande requirements.',
  },
  {
    source_key: 'DO_BRISTANDE_TILLGANGLIGHET',
    source_title: 'Bristande tillgänglighet är en form av diskriminering',
    source_type: 'official_legal_guidance',
    authority: 'Diskrimineringsombudsmannen',
    legal_reference: 'Official guidance on reasonable accessibility measures',
    url: 'https://www.do.se/diskriminerad/olika-former-av-diskriminering/bristande-tillganglighet-ar-diskriminering',
    relevant_chapter_section: 'Support, personal service, information, communication and comparable access',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for accessibility framing; updated 2026-09-03.',
  },
  {
    source_key: 'DO_TILLGANGLIGHET_FAQ',
    source_title: 'Kan jag anmäla till DO om en verksamhet brister när det gäller tillgänglighet?',
    source_type: 'official_legal_guidance',
    authority: 'Diskrimineringsombudsmannen',
    legal_reference: 'Official guidance on examples of reasonable accessibility measures',
    url: 'https://www.do.se/rattsfall-beslut-lagar-stodmaterial/fragor-och-svar-om-diskriminering/diskriminering/kan-jag-anmala-till-do-om-en-verksamhet-brister-nar-det-galler-tillganglighet',
    relevant_chapter_section: 'Examples: reading aloud, guiding a person, moving obstacles',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for practical accessibility examples; updated 2026-04-01.',
  },
  {
    source_key: 'MFD_START',
    source_title: 'Myndigheten för delaktighet',
    source_type: 'official_explanatory_source',
    authority: 'Myndigheten för delaktighet',
    legal_reference: 'Official disability-policy authority context',
    url: 'https://www.mfd.se/',
    relevant_chapter_section: 'Accessibility, participation, support and knowledge in disability policy',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official authority context for participation and accessible services.',
  },
  {
    source_key: 'AV_HOT_VALD',
    source_title: 'Våld och hot om våld',
    source_type: 'official_work_environment_guidance',
    authority: 'Arbetsmiljöverket',
    legal_reference: 'Official guidance on threats in direct-contact work',
    url: 'https://www.av.se/halsa-och-sakerhet/vald-och-hot-om-vald/',
    relevant_chapter_section: 'Direct contact with people, routines and preventing escalation',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Used only for conflict/passenger handling boundary, not broader work-risk subject.',
  },
  {
    source_key: '1177_DOFTO',
    source_title: 'Doftöverkänslighet',
    source_type: 'authoritative_medical_guidance',
    authority: '1177 Vårdguiden',
    legal_reference: 'Authoritative healthcare guidance on sensitivity to scents',
    url: 'https://www.1177.se/sjukdomar--besvar/allergier-och-overkanslighet/doftoverkanslighet/',
    relevant_chapter_section: 'Smoke, perfume, cleaning products and symptoms from scent sensitivity',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Used narrowly for D1_SERVICE scent/smoke/allergen passenger-impact requirement; updated 2026 context.',
  },
  {
    source_key: 'FHM_ROKFRIA_MILJOER',
    source_title: 'Rökfria miljöer med stöd i lagen',
    source_type: 'official_legal_guidance',
    authority: 'Folkhälsomyndigheten',
    legal_reference: 'Lag (2018:2088) om tobak och liknande produkter, 6 kap. 2 §',
    url: 'https://www.folkhalsomyndigheten.se/regler-och-tillsyn/tillsynsvagledning-och-stod/tillsynsvagledning-for-tobak-och-liknande-produkter-samt-tobaksfria-nikotinprodukter/vagledning-for-tillsyn-over-rokfria-miljoer/rokfria-miljoer-med-stod-i-lagen/',
    relevant_chapter_section: 'Taxi in general as collective transport; smoke-free environments',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for smoking-ban requirement in taxi/collective transport context.',
  },
  {
    source_key: 'FHM_ROKFRIA_UTOMHUS',
    source_title: 'Rökfria utomhusmiljöer',
    source_type: 'official_legal_guidance',
    authority: 'Folkhälsomyndigheten',
    legal_reference: 'Official guidance on smoke-free outdoor areas',
    url: 'https://www.folkhalsomyndigheten.se/regler-och-tillsyn/tillsynsvagledning-och-stod/tillsynsvagledning-for-tobak-och-liknande-produkter-samt-tobaksfria-nikotinprodukter/vagledning-for-tillsyn-over-rokfria-miljoer/rokfria-miljoer-med-stod-i-lagen/rokfria-utomhusmiljoer/',
    relevant_chapter_section: 'Public-transport outdoor areas and purpose of smoke-free environments',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Supports passenger-sensitive response around taxi zones and smoke exposure.',
  },
  {
    source_key: 'TS_PRISINFORMATION_TAXI',
    source_title: 'Prisinformation för taxikunder',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Official guidance on taxi price information and binding price quote',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/yrkestrafik/Taxi/prisinformation-taxi/',
    relevant_chapter_section: 'Comparison price, free pricing, binding price quote over 700 kronor and receipt',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official source for taxi price-information calculations; updated 2025-01-01.',
  },
  {
    source_key: 'SFS_2012_211',
    source_title: 'Taxitrafiklag (2012:211)',
    source_type: 'primary_legal_source',
    authority: 'Sveriges riksdag',
    legal_reference: 'Taxitrafiklag (2012:211), 2 kap. 17-22 §§',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/taxitrafiklag-2012211_sfs-2012-211/',
    relevant_chapter_section: 'Taxi fare, price information, comparison price and binding price quote',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary legal source for the approximate-price requirement.',
  },
  {
    source_key: 'KV_TAXI_PRIS',
    source_title: 'Taxi - vad gäller kring pris?',
    source_type: 'official_consumer_guidance',
    authority: 'Konsumentverket',
    legal_reference: 'Official consumer guidance on taxi prices',
    url: 'https://www.konsumentverket.se/varor-och-tjanster/taxi/',
    relevant_chapter_section: 'Free pricing, price information on vehicle exterior and consumer complaints',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official consumer source; reviewed 2026-09-02.',
  },
  {
    source_key: 'KV_TAXI_PRESS_2026',
    source_title: 'Stor ökning av anmälningar om taxiresor',
    source_type: 'official_consumer_guidance',
    authority: 'Konsumentverket',
    legal_reference: 'Official explanation of comparison price and binding price quote threshold',
    url: 'https://www.konsumentverket.se/pressmeddelande/stor-okning-av-anmalningar-om-taxiresor-resor-1-400-kronor-dyrare-an-forvantat/',
    relevant_chapter_section: 'Comparison price is 10 km/15 min; binding quote threshold is 1.2 percent of price base amount, about 700 kr in 2026',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Used for current 2026 threshold context and misunderstanding-risk explanation.',
  },
];

const visuals = [
  ['serv_entry_assistance_scene', 'vehicle_entry_assistance_scene', 'Stöd vid in- och urstigning', ['taxi vid kantsten', 'öppen dörr', 'passagerare', 'förare som frågar först'], ['D1-SERV-017-002D', 'D1-SERV-017-007'], false],
  ['serv_wheelchair_aid_scene', 'wheelchair_loading_situation', 'Hjälpmedel och praktisk hantering', ['rullstol', 'rollator', 'bagageutrymme', 'förankring utan detaljmedicin'], ['D1-SERV-017-007'], false],
  ['serv_luggage_cleanliness_scene', 'luggage_and_clean_vehicle_scene', 'Rent fordon och bagagehjälp', ['rent säte', 'bagage', 'fri golvyta', 'diskret förare'], ['D1-SERV-017-004'], false],
  ['serv_communication_scene', 'communication_scenario', 'Kommunikation utan antaganden', ['förare', 'passagerare', 'kort fråga', 'bekräftelse av önskemål'], ['D1-SERV-016-002', 'D1-SERV-016-003'], false],
].map(([visual_id, visual_type, purpose, elements, requirement_keys, correctness_depends_on_visual]) => ({
  visual_id,
  visual_type,
  status: 'placeholder_metadata',
  purpose,
  elements_must_be_shown: elements,
  labels_required: elements,
  requirement_keys,
  fact_keys: [],
  correctness_depends_on_visual,
  notes: 'Placeholder manifest entry only. Bemötande questions remain answerable from text alone.',
}));

const topics = [
  {
    slug: 'professionellt-bemotande',
    title: 'Professionellt bemötande och diskretion',
    prefix: 'PRO',
    order: 1,
    visual: null,
    competencyTags: ['service', 'communication'],
    facts: [
      ['D1-SERV-016-001', 'Taxiföraren ska förstå innebörden av att vara serviceinriktad och vikten av diskretion.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 1', 'curriculum_principle'],
      ['D1-SERV-016-001', 'Diskretion i taxiarbetet innebär att inte sprida, kommentera eller utnyttja privat information som föraren får genom uppdraget.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 1', 'pedagogical_application'],
      ['D1-SERV-016-001', 'Serviceinriktning innebär att göra resan tydlig, trygg och respektfull utan att ta över passagerarens självbestämmande.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 1 och 16 § 3', 'pedagogical_application'],
      ['D1-SERV-016-003', 'Olika människor kan ha olika förutsättningar och behov, och bemötandet ska utgå från den enskilda passagerarens situation.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 3', 'curriculum_principle'],
      ['D1-SERV-016-001', 'Ett professionellt bemötande kombinerar vänlighet med tydliga gränser, trafiksäkerhet och respekt för kundens integritet.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 1-3', 'pedagogical_application'],
    ],
  },
  {
    slug: 'kommunikation-onskemal',
    title: 'Kommunikation om behov och önskemål',
    prefix: 'COM',
    order: 2,
    visual: 'serv_communication_scene',
    competencyTags: ['communication', 'adaptation'],
    facts: [
      ['D1-SERV-016-002', 'Taxiföraren ska kunna kommunicera med passagerare för att tillmötesgå deras behov och önskemål.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 2', 'curriculum_principle'],
      ['D1-SERV-016-002', 'När ett önskemål är oklart bör föraren fråga kort och bekräfta vad kunden vill innan färden fortsätter.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 2', 'pedagogical_application'],
      ['D1-SERV-016-002', 'Kommunikationen ska vara saklig och begriplig även när kunden är stressad, osäker eller har svårt att förstå instruktionen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 2-3', 'pedagogical_application'],
      ['D1-SERV-016-003', 'Tillgänglighet kan handla om information, kommunikation, stöd och personlig service.', 'DO_BRISTANDE_TILLGANGLIGHET', 'Vilka tillgänglighetsåtgärder är rimliga att begära?', 'official_guidance'],
      ['D1-SERV-016-003', 'Enklare tillgänglighetsåtgärder kan vara att läsa upp information, ledsaga en person eller flytta sådant som står i vägen.', 'DO_TILLGANGLIGHET_FAQ', 'Exempel på skäliga tillgänglighetsåtgärder', 'official_guidance'],
    ],
  },
  {
    slug: 'svara-passagerarsituationer',
    title: 'Svåra passagerarsituationer',
    prefix: 'CONFLICT',
    order: 3,
    visual: null,
    competencyTags: ['conflict_handling', 'service'],
    facts: [
      ['D1-SERV-017-001', 'Taxiföraren ska kunna redogöra för lämpliga sätt att hantera situationer med alkohol- eller drogpåverkade passagerare.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 1', 'curriculum_principle'],
      ['D1-SERV-017-001', 'Vid påverkad eller irriterad passagerare bör föraren hålla kommunikationen lugn, konkret och inriktad på nästa säkra steg.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 1', 'pedagogical_application'],
      ['D1-SERV-017-001', 'Arbete med direktkontakt med människor kan innebära risk för hot och våld, vilket gör rutiner och tydliga gränser viktiga.', 'AV_HOT_VALD', 'Våld och hot om våld, arbete med människor', 'official_guidance', ['D1-SAFE-THREAT-FACT-002']],
      ['D1-SERV-017-001', 'Ett lämpligt bemötande av en påverkad passagerare ska undvika upptrappning och samtidigt skydda förare, passagerare och trafiksäkerhet.', 'AV_HOT_VALD', 'Våld och hot om våld, förebyggande arbete', 'official_guidance', ['D1-SAFE-THREAT-FACT-004']],
      ['D1-SERV-017-001', 'Om ett bemötandeproblem blir en säkerhetsrisk ska säkerhetsrutiner och larmmöjligheter prioriteras före serviceambition.', 'AV_HOT_VALD', 'Våld och hot om våld, risker i arbetet', 'official_guidance', ['D1-SAFE-THREAT-FACT-005']],
    ],
  },
  {
    slug: 'barn-ledsagare-sjalvbestammande',
    title: 'Barn, ledsagare och självbestämmande',
    prefix: 'CHILD',
    order: 4,
    visual: null,
    competencyTags: ['passenger_assistance', 'adaptation'],
    facts: [
      ['D1-SERV-017-002A', 'Taxiföraren ska kunna bedöma barns behov och vara lyhörd för krav på service.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 2', 'curriculum_principle'],
      ['D1-SERV-017-003', 'Taxiföraren ska kunna bedöma hur passagerare ska bemötas när ledsagare medföljer.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 3', 'curriculum_principle'],
      ['D1-SERV-017-002A', 'När barn reser ska föraren kommunicera på ett tydligt sätt med ansvarig vuxen och samtidigt bemöta barnet respektfullt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 2', 'pedagogical_application'],
      ['D1-SERV-017-003', 'När ledsagare följer med ska föraren inte automatiskt tala förbi passageraren, utan fråga hur passageraren vill kommunicera.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 3 och 17 § 3', 'pedagogical_application'],
      ['D1-SERV-016-003', 'Respekt för olika förutsättningar innebär att passagerarens egna önskemål ska bekräftas när det är möjligt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 3', 'pedagogical_application'],
    ],
  },
  {
    slug: 'syn-horsel-kommunikation',
    title: 'Syn, hörsel och anpassad kommunikation',
    prefix: 'ACCESS',
    order: 5,
    visual: 'serv_communication_scene',
    competencyTags: ['communication', 'adaptation'],
    facts: [
      ['D1-SERV-017-002B', 'Taxiföraren ska kunna bedöma behov hos passagerare med nedsatt syn.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 2', 'curriculum_principle'],
      ['D1-SERV-017-002C', 'Taxiföraren ska kunna bedöma behov hos passagerare med nedsatt hörsel.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 2', 'curriculum_principle'],
      ['D1-SERV-017-002B', 'Vid nedsatt syn kan bemötandet behöva vara mer muntligt beskrivande: presentera dig, ange bilens placering och fråga om stöd önskas.', 'DO_TILLGANGLIGHET_FAQ', 'Exempel: läsa upp information och ledsaga en person', 'pedagogical_application'],
      ['D1-SERV-017-002C', 'Vid nedsatt hörsel kan föraren behöva bekräfta information skriftligt, tydligt visuellt eller genom korta kontroller att budskapet uppfattats.', 'DO_BRISTANDE_TILLGANGLIGHET', 'Tillgänglighet: information och kommunikation', 'pedagogical_application'],
      ['D1-SERV-016-003', 'Anpassad kommunikation ska bygga på passagerarens uttryckta behov, inte på antaganden om personens förmåga.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 3', 'pedagogical_application'],
      ['D1-SERV-016-003', 'MFD är kunskapsmyndighet inom funktionshindersområdet och lyfter tillgänglighet och delaktighet som centrala mål.', 'MFD_START', 'Startsidan, myndighetens uppdrag', 'official_guidance'],
    ],
  },
  {
    slug: 'rorelseformaga-hjalpmedel',
    title: 'Rörelseförmåga och hjälpmedel',
    prefix: 'AID',
    order: 6,
    visual: 'serv_wheelchair_aid_scene',
    competencyTags: ['passenger_assistance', 'adaptation'],
    facts: [
      ['D1-SERV-017-002D', 'Taxiföraren ska kunna bedöma behov hos passagerare med nedsatt rörelseförmåga.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 2', 'curriculum_principle'],
      ['D1-SERV-017-007', 'Taxiföraren ska kunna hantera rullstolar, rollatorer och andra hjälpmedel som passagerare använder.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 7', 'curriculum_principle'],
      ['D1-SERV-017-002D', 'Vid nedsatt rörelseförmåga bör föraren välja en plats för på- eller avstigning som ger tid, utrymme och minskar stress.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 2', 'pedagogical_application', ['D1-SAFE-LOAD-FACT-007']],
      ['D1-SERV-017-007', 'Föraren bör fråga innan hjälpmedel flyttas eller hanteras, eftersom hjälpmedlet är en del av passagerarens självständighet.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 3 och 17 § 7', 'pedagogical_application'],
      ['D1-SERV-017-007', 'Tillgänglig personlig service kan innebära att ledsaga, flytta hinder eller hjälpa till praktiskt när åtgärden är rimlig och önskad.', 'DO_TILLGANGLIGHET_FAQ', 'Exempel på skäliga tillgänglighetsåtgärder', 'official_guidance'],
      ['D1-SERV-017-007', 'Bemötandefrågor om hjälpmedel ska hålla fokus på kommunikation, praktisk hjälp och respekt, inte på detaljerad hälsokunskap.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16-17 §§', 'pedagogical_application'],
    ],
  },
  {
    slug: 'rent-fordon-dofter-rok',
    title: 'Rent fordon, dofter och rök',
    prefix: 'CLEAN',
    order: 7,
    visual: 'serv_luggage_cleanliness_scene',
    competencyTags: ['service', 'adaptation'],
    facts: [
      ['D1-SERV-017-004', 'Taxiföraren ska kunna bedöma vikten av ett rent fordon.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 4', 'curriculum_principle'],
      ['D1-SERV-017-005', 'Taxiföraren ska kunna bedöma hur starka dofter, tobaksrök och allergiframkallande ämnen kan påverka passagerare.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 5', 'curriculum_principle'],
      ['D1-SERV-017-006', 'Taxiföraren ska kunna redogöra för lagstiftningen om rökförbud.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 6', 'curriculum_principle'],
      ['D1-SERV-017-005', 'Doftöverkänslighet kan ge besvär av exempelvis cigarettrök, avgaser, parfym, rengöringsmedel eller tvättmedel.', '1177_DOFTO', 'Doftöverkänslighet, vad är doftöverkänslighet?', 'official_guidance'],
      ['D1-SERV-017-006', 'Rökning är förbjuden på färdmedel i inrikes kollektivtrafik; Folkhälsomyndigheten anger att taxi i allmänhet omfattas.', 'FHM_ROKFRIA_MILJOER', 'Kollektivtrafik, inomhusmiljöer', 'binding_rule'],
      ['D1-SERV-017-006', 'Rökförbud gäller även på vissa utomhusområden som används av resande med kollektivtrafik, exempelvis taxizoner när de omfattas av reglerna.', 'FHM_ROKFRIA_UTOMHUS', 'Taxizoner och rökräckvidd', 'official_guidance'],
      ['D1-SERV-017-004', 'Ett rent fordon är en del av passagerarens upplevelse av trygg, respektfull och professionell service.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 16 § 1 och 17 § 4', 'pedagogical_application'],
    ],
  },
  {
    slug: 'prisinformation-ungefarligt-pris',
    title: 'Prisinformation och ungefärligt pris',
    prefix: 'PRICE',
    order: 8,
    visual: null,
    competencyTags: ['service', 'communication'],
    facts: [
      ['D1-SERV-017-008', 'Taxiföraren ska kunna beräkna det ungefärliga priset på en resa utifrån fordonets prisinformation.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 17 § 8', 'curriculum_principle'],
      ['D1-SERV-017-008', 'Jämförpriset för taxi avser en typresa på 10 kilometer som tar 15 minuter inklusive eventuell grundavgift.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 20 §', 'binding_rule', ['D2-TAXI-PRICE-FACT-001']],
      ['D1-SERV-017-008', 'Taxipriser är fria och kan variera mellan företag, vilket gör tydlig prisinformation viktig före resan.', 'TS_PRISINFORMATION_TAXI', 'Prisinformation för taxikunder, Fri prissättning råder', 'official_guidance', ['D2-TAXI-PRICE-FACT-002']],
      ['D1-SERV-017-008', 'Om jämförpriset överstiger 700 kronor ska föraren lämna en bindande prisuppgift innan resan, om fast pris inte används.', 'TS_PRISINFORMATION_TAXI', 'Prisuppgift till kunden innan taxiresan startar', 'binding_rule', ['D2-TAXI-PRICE-FACT-003']],
      ['D1-SERV-017-008', 'En prisuppgift ska ange högsta pris för färden och ett bevis om prisuppgiften ska lämnas till passageraren före färden.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 20-21 §§', 'binding_rule'],
      ['D1-SERV-017-008', 'Konsumentverket betonar att många resenärer missförstår jämförpris och bindande prisuppgift, så föraren behöver kunna förklara skillnaden enkelt.', 'KV_TAXI_PRESS_2026', 'Fakta - Jämförpris', 'official_consumer_guidance'],
      ['D1-SERV-017-008', 'En ungefärlig prisbedömning utifrån prisinformationen ska presenteras som en uppskattning om den inte är en bindande prisuppgift eller ett fast pris.', 'KV_TAXI_PRIS', 'Taxi - vad gäller kring pris?, taxiresor och prisnivå', 'pedagogical_application'],
    ],
  },
];

const requirementSourceMap = {
  'D1-SERV-016-001': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-SERV-016-002': ['TSFS_2021_119_CONSOLIDATED', 'DO_BRISTANDE_TILLGANGLIGHET'],
  'D1-SERV-016-003': ['TSFS_2021_119_CONSOLIDATED', 'DO_BRISTANDE_TILLGANGLIGHET', 'DO_TILLGANGLIGHET_FAQ', 'MFD_START'],
  'D1-SERV-017-001': ['TSFS_2021_119_CONSOLIDATED', 'AV_HOT_VALD'],
  'D1-SERV-017-002A': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-SERV-017-002B': ['TSFS_2021_119_CONSOLIDATED', 'DO_TILLGANGLIGHET_FAQ'],
  'D1-SERV-017-002C': ['TSFS_2021_119_CONSOLIDATED', 'DO_BRISTANDE_TILLGANGLIGHET'],
  'D1-SERV-017-002D': ['TSFS_2021_119_CONSOLIDATED', 'DO_TILLGANGLIGHET_FAQ'],
  'D1-SERV-017-003': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-SERV-017-004': ['TSFS_2021_119_CONSOLIDATED'],
  'D1-SERV-017-005': ['TSFS_2021_119_CONSOLIDATED', '1177_DOFTO'],
  'D1-SERV-017-006': ['TSFS_2021_119_CONSOLIDATED', 'FHM_ROKFRIA_MILJOER', 'FHM_ROKFRIA_UTOMHUS'],
  'D1-SERV-017-007': ['TSFS_2021_119_CONSOLIDATED', 'DO_TILLGANGLIGHET_FAQ'],
  'D1-SERV-017-008': ['TSFS_2021_119_CONSOLIDATED', 'SFS_2012_211', 'TS_PRISINFORMATION_TAXI', 'KV_TAXI_PRIS', 'KV_TAXI_PRESS_2026'],
};

function topicId(topic) {
  return `topic_d1_service_${topic.slug.replaceAll('-', '_')}`;
}

function factKey(topic, index) {
  return `D1-SERV-${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`;
}

function lessonKey(topic) {
  return `D1-SERV-${topic.prefix}-L01`;
}

function sourceByKey(sourceKey) {
  return sources.find((source) => source.source_key === sourceKey);
}

function visualMetadata(topic) {
  if (!topic.visual) return undefined;
  return {
    requires_image: true,
    requires_diagram: false,
    requires_road_scene: topic.visual.includes('entry'),
    requires_comparison_visual: false,
    visual_asset_id: topic.visual,
    visual_correctness_depends_on_asset: false,
  };
}

const facts = topics.flatMap((topic) =>
  topic.facts.map(([requirement_key, text, source_id, exact_reference, authority_status, cross_subject_fact_links], index) => ({
    stable_key: factKey(topic, index),
    topic_id: topicId(topic),
    requirement_key,
    text,
    fact_text: text,
    source_id,
    exact_reference,
    authority_status,
    legal_or_guidance_status: authority_status,
    cross_subject_fact_links: cross_subject_fact_links ?? [],
    verified_at: verifiedAt,
    verification_status: 'verified',
  })),
);

for (const visual of visuals) {
  visual.fact_keys = facts
    .filter((fact) => visual.requirement_keys.includes(fact.requirement_key))
    .map((fact) => fact.stable_key)
    .slice(0, 5);
}

function makeLesson(topic) {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  const examples = {
    PRO: 'En kund pratar i telefon om privata ärenden. Du kommenterar inte samtalet och berättar inte vidare vad du hört.',
    COM: 'Kunden säger bara att hen vill åka "snabbaste vägen". Du bekräftar om kunden menar kortast tid, inte lägst pris eller särskild väg.',
    CONFLICT: 'En påverkad passagerare blir irriterad över betalningen. Du håller låg röst, ger konkret information och undviker att argumentera om personen.',
    CHILD: 'Ett barn reser med vuxen. Du förklarar kort för den vuxna vad som behövs och bemöter barnet direkt när det gäller enkla frågor.',
    ACCESS: 'En passagerare verkar inte höra vad du säger. Du vänder dig mot personen, talar tydligt och erbjuder att visa eller skriva informationen.',
    AID: 'En passagerare använder rollator. Du frågar först om och hur personen vill ha hjälp innan du flyttar hjälpmedlet.',
    CLEAN: 'En kund säger att stark parfym ger besvär. Du vädrar om möjligt, undviker doftspray och förklarar lugnt vad du kan göra.',
    PRICE: 'Kunden frågar vad resan ungefär kostar. Du använder prisinformationen och är tydlig med om svaret är uppskattning, fast pris eller bindande prisuppgift.',
  }[topic.prefix];

  return {
    stable_key: lessonKey(topic),
    topic_id: topicId(topic),
    title: topic.title,
    learning_objectives: [
      `Kunna välja ett professionellt bemötande i situationer kopplade till ${topic.title.toLowerCase()}.`,
      'Kunna skilja mellan bindande regel, myndighetsvägledning och pedagogisk tillämpning.',
    ],
    requirement_keys: [...new Set(topicFacts.map((fact) => fact.requirement_key))],
    fact_keys: topicFacts.map((fact) => fact.stable_key),
    source_references: [...new Set(topicFacts.map((fact) => fact.source_id))].map((sourceId) => ({
      source_id: sourceId,
      exact_references: topicFacts.filter((fact) => fact.source_id === sourceId).map((fact) => fact.exact_reference),
    })),
    estimated_study_time_minutes: topic.prefix === 'PRICE' ? 9 : 6,
    visual_metadata: visualMetadata(topic),
    status: 'published',
    content_blocks: [
      { type: 'heading', text: topic.title, fact_keys: [topicFacts[0].stable_key] },
      {
        type: 'paragraph',
        text: 'Bemötande handlar om att förstå passagerarens behov, kommunicera tydligt och göra resan professionell utan att hitta på egna juridiska skyldigheter.',
        fact_keys: [topicFacts[0].stable_key],
      },
      {
        type: 'bullet_list',
        items: topicFacts.slice(0, 5).map((fact) => fact.text),
        fact_keys: topicFacts.slice(0, 5).map((fact) => fact.stable_key),
      },
      {
        type: 'info',
        text: topic.prefix === 'AID' || topic.prefix === 'ACCESS'
          ? 'Här lärs bemötande och praktisk anpassning. Diagnoser, symptom och sjukdomskunskap hör till ett senare ämne.'
          : topic.prefix === 'PRICE'
            ? 'Prisfrågor i Bemötande testar att kunna förklara och uppskatta pris tydligt för kunden, inte hela taxitrafiklagstiftningen.'
            : 'Ett bra svar är konkret: fråga, bekräfta, förklara eller agera på ett sätt som minskar missförstånd.',
        fact_keys: [topicFacts[Math.min(2, topicFacts.length - 1)].stable_key],
      },
      { type: 'example', text: examples, fact_keys: [topicFacts[Math.min(3, topicFacts.length - 1)].stable_key] },
      {
        type: 'warning',
        text: 'Gör inte antaganden om vad kunden kan, vill eller behöver. Fråga sakligt när situationen är oklar.',
        fact_keys: [topicFacts[Math.min(1, topicFacts.length - 1)].stable_key],
      },
      { type: 'checkpoint', text: 'Kan du peka ut vilket behov som styr bemötandet i scenariot?', fact_keys: [topicFacts[0].stable_key] },
    ],
  };
}

function makeDistractors(topic, fact, index) {
  const label = `${topic.prefix}-${index + 1}`;
  return [
    { id: 'A', text: fact.text },
    { id: 'B', text: `${label}: anta vad kunden behöver och genomför hjälpen utan att fråga.` },
    { id: 'C', text: `${label}: ge samma svar till alla kunder även när kunden uttrycker ett annat behov.` },
    { id: 'D', text: `${label}: flytta fokus till förarens bekvämlighet i stället för tydlig kommunikation och respektfull service.` },
  ];
}

function questionType(topic, fact, index) {
  if (fact.requirement_key === 'D1-SERV-017-008' && index % 2 === 1) return 'calculation';
  if (fact.requirement_key === 'D1-SERV-017-006' && index % 3 === 0) return 'single_choice';
  return 'scenario';
}

function makeQuestion(topic, fact, index) {
  const type = questionType(topic, fact, index);
  const caseLabel = `${topic.prefix}-bemötandefall ${index + 1}`;
  const calculation = type === 'calculation'
    ? {
        calculation_metadata: {
          teaching_status: 'source_backed_price_estimate',
          inputs: ['jämförpris för 10 km/15 min', 'uppskattad resa i samma nivå eller bindande prisuppgift om tillämpligt'],
          method: 'Använd prisinformationen för en ungefärlig kundförklaring och skilj uppskattning från fast eller bindande pris.',
          worked_example: 'Om prisinformationen visar jämförpris för en typresa förklarar föraren att faktisk resa påverkas av sträcka, tid och eventuella avgifter.',
          answer: fact.text,
        },
      }
    : {};

  return {
    stable_key: `D1-SERV-${topic.prefix}-Q${String(index + 1).padStart(3, '0')}`,
    version: 1,
    topic_id: topicId(topic),
    requirement_keys: [fact.requirement_key],
    fact_keys: [fact.stable_key],
    lesson_key: lessonKey(topic),
    question_type: type,
    competency_tags: type === 'calculation' ? ['service', 'communication'] : topic.competencyTags,
    competencies: type === 'calculation' ? ['beräkna/förklara ungefärligt pris'] : type === 'single_choice' ? ['redogöra'] : ['bedöma/kommunicera/anpassa'],
    prompt: type === 'calculation'
      ? `${caseLabel}: En kund ber om ungefärligt pris före avfärd. Vilket svar använder prisinformationen på ett korrekt och begripligt sätt?`
      : type === 'single_choice'
        ? `${caseLabel}: Vilket påstående stämmer med Bemötande-kravet?`
        : `${caseLabel}: En taxikund har ett konkret behov under resan. Vilket bemötande är bäst? ${fact.text}`,
    answer_choices: makeDistractors(topic, fact, index),
    correct_answer_id: 'A',
    explanation: `Rätt: ${fact.text} Svaret är bäst eftersom det knyter bemötandet till verifierat krav, källa och kundens uttryckta situation.`,
    difficulty: index < 3 ? 'easy' : index < 6 ? 'medium' : 'hard',
    source_references: [{ source_id: fact.source_id, exact_reference: fact.exact_reference }],
    visual_metadata: visualMetadata(topic),
    visual_asset_id: topic.visual ?? undefined,
    visual_correctness_depends_on_asset: false,
    status: 'published',
    ...calculation,
  };
}

const lessons = topics.map(makeLesson);
const questions = topics.flatMap((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  const count = topic.prefix === 'PRICE' ? 10 : topic.prefix === 'ACCESS' || topic.prefix === 'AID' || topic.prefix === 'CLEAN' ? 9 : 8;
  return Array.from({ length: count }, (_, index) => makeQuestion(topic, topicFacts[index % topicFacts.length], index));
});

const topicCheckpoints = topics.map((topic) => ({
  stable_key: `D1-SERV-${topic.prefix}-CHECKPOINT-001`,
  title: `Intern checkpoint: ${topic.title}`,
  type: 'checkpoint',
  subject: 'D1_SERVICE',
  topic: topicId(topic),
  eligible_status: 'published',
  question_count: topic.prefix === 'PRICE' ? 8 : topic.prefix === 'PRO' || topic.prefix === 'COM' ? 6 : 7,
  pass_threshold: 0.8,
  selection: 'random_from_eligible_published_questions',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
}));

const subjectCheckpoint = {
  stable_key: 'D1-SERV-SUBJECT-CHECKPOINT-001',
  title: 'Intern ämnescheckpoint: Bemötande',
  type: 'checkpoint',
  subject: 'D1_SERVICE',
  topic: null,
  eligible_status: 'published',
  question_count: 30,
  pass_threshold: 0.8,
  selection: 'broad_sample_across_all_d1_service_topics',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
};

const sourceMap = {
  metadata: {
    subject: 'D1_SERVICE',
    phase: 'source_expansion',
    language: 'sv',
    scope: 'Authoritative source map for TSFS 2021:119, 3 kap. 16-17 §§.',
    created_at: verifiedAt,
    last_verified_at: verifiedAt,
  },
  source_catalog: sources,
  requirement_source_map: Object.entries(requirementSourceMap).map(([requirement_key, sourceKeys]) => ({
    requirement_key,
    official_requirement_reference: facts.find((fact) => fact.requirement_key === requirement_key)?.exact_reference ?? 'TSFS 2021:119, 3 kap. 16-17 §§',
    sources: sourceKeys.map(sourceByKey),
    overall_status: 'FULLY_SOURCED',
  })),
  pedagogical_topics: topics.map((topic) => ({
    topic_id: topicId(topic),
    title: topic.title,
    order: topic.order,
    requirement_keys: [...new Set(facts.filter((fact) => fact.topic_id === topicId(topic)).map((fact) => fact.requirement_key))],
    visual_asset_ids: topic.visual ? [topic.visual] : [],
    visual_metadata: visualMetadata(topic),
    competency_tags: topic.competencyTags,
    status: 'published',
    notes: 'Internal pedagogical grouping, not an official Transportstyrelsen heading.',
  })),
};

writeFileSync('data/curriculum/d1-service-sources.json', `${JSON.stringify(sourceMap, null, 2)}\n`);
writeFileSync(
  `${contentDir}/service-facts.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_SERVICE',
        title: 'D1 service verified facts and principles',
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
  `${contentDir}/service-lessons.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_SERVICE',
        title: 'D1 service lessons',
        status: 'published',
        verified_at: verifiedAt,
        note: 'Source-backed mobile-first lessons for taxi-driver service and passenger communication competency.',
      },
      lessons,
    },
    null,
    2,
  )}\n`,
);
writeFileSync(
  `${contentDir}/service-visuals.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_SERVICE',
        title: 'D1 service visual manifest',
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
  `${questionDir}/service-questions.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D1_SERVICE',
        title: 'D1 service question bank',
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

console.log(`Wrote ${topics.length} D1 service topics, ${facts.length} facts/principles, ${lessons.length} lessons, ${visuals.length} visual placeholders and ${questions.length} questions.`);
