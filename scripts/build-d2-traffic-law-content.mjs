import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-09';
const contentDir = 'data/content/d2-traffic-law';
const questionDir = 'data/questions/d2-traffic-law';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sourceCatalog = [
  {
    source_key: 'SFS_1998_1276',
    source_title: 'Trafikförordning (1998:1276)',
    source_type: 'primary_legal_source',
    authority: 'Sveriges riksdag / Svensk författningssamling',
    legal_reference: 'Trafikförordning (1998:1276)',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/trafikforordning-19981276_sfs-1998-1276/',
    relevant_chapter_section: '2 kap.; 3 kap.; 8 kap.; 9 kap.; 10 kap.',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary source for traffic rules, speed, priority, placement, overtaking, stopping, parking and local traffic rules.',
  },
  {
    source_key: 'SFS_2007_90',
    source_title: 'Vägmärkesförordning (2007:90)',
    source_type: 'primary_legal_source',
    authority: 'Sveriges riksdag / Svensk författningssamling',
    legal_reference: 'Vägmärkesförordning (2007:90)',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/vagmarkesforordning-200790_sfs-2007-90/',
    relevant_chapter_section: '1-7 kap.; bilagda märkesförteckningar i tryckt SFS',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary source for signs, supplementary plates, signals, road markings and other traffic devices. Riksdagen fulltext notes that symbol images are not included.',
  },
  {
    source_key: 'SFS_2001_559',
    source_title: 'Lag (2001:559) om vägtrafikdefinitioner',
    source_type: 'primary_legal_source',
    authority: 'Sveriges riksdag / Svensk författningssamling',
    legal_reference: 'Lag (2001:559) om vägtrafikdefinitioner, 2 §',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2001559-om-vagtrafikdefinitioner_sfs-2001-559/',
    relevant_chapter_section: '2 § fordons- och viktdefinitioner',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Primary source for vehicle and weight terms used by D2 traffic-law definition requirements.',
  },
  {
    source_key: 'TS_VAGMARKEN',
    source_title: 'Vägmärken',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Vägmärkesförordning (2007:90); TSFS 2019:74; TSFS 2010:171; TSFS 2014:30',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/',
    relevant_chapter_section: 'Official overview of sign groups, road markings, signals and traffic devices',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official explanatory material only; not used as primary legal authority.',
  },
  {
    source_key: 'TS_VAGMARKERINGAR',
    source_title: 'Vägmarkeringar',
    source_type: 'official_explanatory_source',
    authority: 'Transportstyrelsen',
    legal_reference: 'Vägmärkesförordning (2007:90), 4 kap.',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/vagmarkeringar/',
    relevant_chapter_section: 'Official overview of M-series road markings',
    source_status: 'VERIFIED',
    last_verified_at: verifiedAt,
    notes: 'Official explanatory support for future visual/diagram work.',
  },
];

const requirementSources = [
  ['D2-TRAFFIC-034-001', 'TSFS 2021:119, 3 kap. 34 §', ['SFS_1998_1276']],
  ['D2-TRAFFIC-034-002', 'TSFS 2021:119, 3 kap. 34 §', ['SFS_2007_90', 'TS_VAGMARKEN']],
  ['D2-TRAFFIC-035-001', 'TSFS 2021:119, 3 kap. 35 § 1', ['SFS_2007_90', 'TS_VAGMARKEN', 'TS_VAGMARKERINGAR']],
  ['D2-TRAFFIC-035-002', 'TSFS 2021:119, 3 kap. 35 § 2', ['SFS_1998_1276']],
  ['D2-TRAFFIC-035-003A1', 'TSFS 2021:119, 3 kap. 35 § 3 a', ['SFS_2001_559']],
  ['D2-TRAFFIC-035-003A2', 'TSFS 2021:119, 3 kap. 35 § 3 a', ['SFS_2001_559']],
  ['D2-TRAFFIC-035-003A3', 'TSFS 2021:119, 3 kap. 35 § 3 a', ['SFS_2001_559']],
  ['D2-TRAFFIC-035-003B1', 'TSFS 2021:119, 3 kap. 35 § 3 b', ['SFS_2001_559']],
  ['D2-TRAFFIC-035-003B2', 'TSFS 2021:119, 3 kap. 35 § 3 b', ['SFS_2001_559']],
  ['D2-TRAFFIC-035-003C1', 'TSFS 2021:119, 3 kap. 35 § 3 c', ['SFS_2001_559']],
  ['D2-TRAFFIC-035-003C2', 'TSFS 2021:119, 3 kap. 35 § 3 c', ['SFS_2001_559']],
  ['D2-TRAFFIC-035-003C3', 'TSFS 2021:119, 3 kap. 35 § 3 c', ['SFS_2001_559']],
  ['D2-TRAFFIC-035-003C4', 'TSFS 2021:119, 3 kap. 35 § 3 c', ['SFS_2001_559']],
];

const topics = [
  {
    slug: 'grundlaggande-trafikregler',
    title: 'Grundläggande trafikregler',
    prefix: 'BASIC',
    order: 1,
    visual: { requires_image: false, requires_diagram: false, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-034-001', 'Trafikant ska iaktta omsorg och varsamhet som krävs med hänsyn till omständigheterna för att undvika trafikolyckor.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 2 kap. 1 §'],
      ['D2-TRAFFIC-034-001', 'Trafikant ska visa särskild hänsyn mot barn, äldre, skolpatruller och personer med funktionshinder eller sjukdom som är till hinder i trafiken.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 2 kap. 1 §'],
      ['D2-TRAFFIC-034-001', 'Vägtrafikant ska följa anvisningar för trafiken som meddelas genom vägmärken, vägmarkeringar, trafiksignaler och andra anordningar.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 2 kap. 2 §'],
      ['D2-TRAFFIC-034-001', 'Tecken av polisman gäller framför trafiksignal, vägmärke och vägmarkering.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 2 kap. 3 §'],
    ],
  },
  {
    slug: 'vajnigsregler',
    title: 'Väjningsregler',
    prefix: 'YIELD',
    order: 2,
    visual: { requires_image: false, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-035-002', 'När två fordons kurser skär varandra har förare väjningsplikt mot fordon som närmar sig från höger, utom i särskilt angivna fall.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 18 §'],
      ['D2-TRAFFIC-035-002', 'Förare med stopplikt eller stopp på grund av trafiksignal ska stanna vid stopplinje, eller annars omedelbart före signalen eller innan den korsande vägen, leden eller spårområdet.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 19 §'],
      ['D2-TRAFFIC-035-002', 'Förare som kör in på huvudled, motorväg eller motortrafikled från annan väg utan accelerationsfält har väjningsplikt mot fordon på den vägen.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 21 § första stycket'],
      ['D2-TRAFFIC-035-002', 'Förare har väjningsplikt mot korsande fordon när föraren kör in på väg från parkeringsplats, fastighet, bensinstation, liknande område, stig, ägoväg, cykelbana, gågata, gångfartsområde, cykelgata, terräng eller efter att ha korsat gång- eller cykelbana.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 21 § andra stycket'],
    ],
  },
  {
    slug: 'hastighet',
    title: 'Hastighet',
    prefix: 'SPEED',
    order: 3,
    visual: { requires_image: false, requires_diagram: false, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-035-002', 'Fordonets hastighet ska anpassas till trafiksäkerheten och får aldrig vara högre än att föraren behåller kontroll och kan stanna för varje hinder som går att förutse.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 14 §'],
      ['D2-TRAFFIC-035-002', 'Förare ska hålla tillräckligt låg hastighet bland annat vid nedsatt sikt, övergångsställen, korsande trafik, skarpa kurvor, backkrön, halt väglag, vägarbete, olycksplats och nära barn.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 15 §'],
      ['D2-TRAFFIC-035-002', 'Förare får inte utan giltigt skäl köra med överdrivet låg hastighet, plötsligt bromsa eller på annat sätt hindra andra förares körning.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 16 §'],
      ['D2-TRAFFIC-035-002', 'Inom tättbebyggt område är grundregeln högst 50 km/tim, men kommunen får föreskriva 30 eller 40 km/tim om det är motiverat av trafiksäkerhet, framkomlighet eller miljö.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 17 § första och andra stycket'],
      ['D2-TRAFFIC-035-002', 'Utom tättbebyggt område är bashastigheten högst 70 km/tim om inte annan föreskrift gäller.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 17 § tredje stycket'],
    ],
  },
  {
    slug: 'placering-korfalt',
    title: 'Placering och körfält',
    prefix: 'LANE',
    order: 4,
    visual: { requires_image: false, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-035-002', 'Fordon ska föras i det körfält som är längst till höger i färdriktningen och som är avsett för fordonet, om annat inte följer av regler eller anvisningar.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 7 §'],
      ['D2-TRAFFIC-035-002', 'Körfältet får bytas endast om det kan ske utan fara eller onödigt hinder för andra trafikanter.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 43 §'],
      ['D2-TRAFFIC-035-002', 'Förare ska använda körriktningsvisare eller annat tydligt tecken när föraren avser att starta från vägkant, vända, svänga, byta körfält eller flytta fordonet i sidled på annat betydande sätt.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 65 §'],
      ['D2-TRAFFIC-035-002', 'Förare får bara använda körfält eller körbana för fordon i linjetrafik när det följer av regler eller särskild anvisning.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 10 §'],
    ],
  },
  {
    slug: 'korsningar',
    title: 'Korsningar',
    prefix: 'JUNCTION',
    order: 5,
    visual: { requires_image: false, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-035-002', 'När en förare närmar sig eller kör in i vägkorsning ska körsättet anpassas så att det inte uppstår onödigt hinder för korsande trafik om fordonet tvingas stanna i korsningen.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 20 §'],
      ['D2-TRAFFIC-035-002', 'Förare som svänger i vägkorsning ska passera gående eller cyklande som korsar körbanan med låg hastighet och lämna dem tillfälle att passera.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 61 §'],
      ['D2-TRAFFIC-035-002', 'Förare som lämnar väg ska anpassa körsättet så att andra trafikanter inte utsätts för fara eller onödigt hinder.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 26 §'],
      ['D2-TRAFFIC-035-002', 'Förare som korsar gång- eller cykelbana ska lämna företräde enligt reglerna om utfartssituation när sådan väjning gäller.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 21 § andra stycket 4'],
    ],
  },
  {
    slug: 'cirkulationsplatser',
    title: 'Cirkulationsplatser',
    prefix: 'ROUND',
    order: 6,
    visual: { requires_image: false, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-035-001', 'Påbudsmärke D3 anger cirkulationsplats.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 2 kap. 10 §, märke D3'],
      ['D2-TRAFFIC-035-002', 'Förare som byter körfält eller annars flyttar fordonet i sidled får göra det endast om det kan ske utan fara eller onödigt hinder.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 43 §'],
      ['D2-TRAFFIC-035-002', 'Förare ska ge tydligt tecken vid betydande sidoförflyttning, till exempel körfältsbyte inför utfart ur cirkulationsplats.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 65 §'],
      ['D2-TRAFFIC-035-001', 'Påbudsmärken som anger att viss trafik är påbjuden anger även förbud mot annan trafik, om inte annat är föreskrivet.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 2 kap. 9 §'],
    ],
  },
  {
    slug: 'omkorning',
    title: 'Omkörning',
    prefix: 'PASS',
    order: 7,
    visual: { requires_image: false, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-035-002', 'Omkörning ska ske till vänster utom i de fall trafikförordningen tillåter annat.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 31 §'],
      ['D2-TRAFFIC-035-002', 'Förare som ska köra om ska förvissa sig om att det kan ske utan fara.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 32 §'],
      ['D2-TRAFFIC-035-002', 'Omkörande förare ska lämna betryggande sidavstånd till den som körs om.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 33 §'],
      ['D2-TRAFFIC-035-002', 'Omkörning är förbjuden strax före eller i vägkorsning utom i undantag som anges i trafikförordningen.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 38 §'],
    ],
  },
  {
    slug: 'stannande-parkering',
    title: 'Stannande och parkering',
    prefix: 'PARK',
    order: 8,
    visual: { requires_image: false, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-035-002', 'Fordon får på väg stannas eller parkeras endast på högra sidan i färdriktningen, med särskilda undantag för bland annat enkelriktad trafik.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 52 §'],
      ['D2-TRAFFIC-035-002', 'Fordon får inte stannas eller parkeras på eller inom tio meter före övergångsställe, cykelpassage eller cykelöverfart.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 53 § första stycket 1'],
      ['D2-TRAFFIC-035-002', 'Fordon får inte stannas eller parkeras i vägkorsning eller inom tio meter från korsande körbanas närmaste ytterkant.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 53 § första stycket 2'],
      ['D2-TRAFFIC-035-002', 'Fordon får inte parkeras på huvudled.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 55 §'],
    ],
  },
  {
    slug: 'gaende-cyklister',
    title: 'Gående och cyklister',
    prefix: 'VULN',
    order: 9,
    visual: { requires_image: false, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-035-002', 'Förare ska anpassa hastigheten särskilt vid övergångsställen och andra platser där gående korsar vägen.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 15 § 3'],
      ['D2-TRAFFIC-035-002', 'Förare ska hålla tillräckligt låg hastighet när fordonet närmar sig barn som uppehåller sig på eller bredvid vägen.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 15 § 11'],
      ['D2-TRAFFIC-035-002', 'Förare som närmar sig obevakat övergångsställe ska anpassa körningen så att gående som gått ut på eller just ska gå ut på övergångsstället inte utsätts för fara.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 61 §'],
      ['D2-TRAFFIC-035-002', 'Förare som kör ut ur cirkulationsplats eller svänger ska passera cykelpassage med låg hastighet och lämna cyklande och mopedförare tillfälle att passera.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 61 §'],
    ],
  },
  {
    slug: 'buss-sparvag-jarnvag',
    title: 'Buss, spårväg och järnväg',
    prefix: 'TRANSIT',
    order: 10,
    visual: { requires_image: false, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-035-002', 'Förare ska hålla tillräckligt låg hastighet när fordonet närmar sig spårvagn, buss eller skolskjuts som stannats för passagerares på- eller avstigning.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 15 § 10'],
      ['D2-TRAFFIC-035-002', 'Fordon får inte stannas eller parkeras på eller inom tio meter före korsande cykelbana, gångbana eller körbana vid vägkorsning enligt parkeringsreglerna.', 'SFS_1998_1276', 'Trafikförordning (1998:1276), 3 kap. 53 §'],
      ['D2-TRAFFIC-034-002', 'Vägmärkesförordningen innehåller säkerhetsanordningar i korsningar med järnväg eller spårväg som en särskild anvisningskategori.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 1 kap. 1 §'],
      ['D2-TRAFFIC-034-002', 'Vägmärkesförordningen innehåller signaler vid öppningsbar bro, utryckningsstation, flygfält, vägarbete, tunnel eller liknande.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 3 kap. 19-20 §§'],
    ],
  },
  {
    slug: 'vagmarken',
    title: 'Vägmärken',
    prefix: 'SIGN',
    order: 11,
    visual: { requires_image: true, requires_diagram: false, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-034-002', 'Vägmärkesförordningen innehåller bestämmelser om anvisningar för trafik genom vägmärken och tilläggstavlor.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 1 kap. 1 §'],
      ['D2-TRAFFIC-035-001', 'Vägmärken delas in i varningsmärken, väjningspliktsmärken, förbudsmärken, påbudsmärken, anvisningsmärken, lokaliseringsmärken och upplysningsmärken.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 2 kap. 1 §'],
      ['D2-TRAFFIC-035-001', 'Vägmärken, symboler och tilläggstavlor har den betydelse som framgår av deras namn om inte annat särskilt anges.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 2 kap. 2 §'],
      ['D2-TRAFFIC-035-001', 'Varningsmärken varnar för fara och upplyser om farans art.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 2 kap. 4 §'],
      ['D2-TRAFFIC-035-001', 'Väjningspliktsmärken, förbudsmärken, påbudsmärken och anvisningsmärken får bara sättas upp för regler som följer av angivna författningar eller föreskrifter.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 1 kap. 9 §'],
    ],
  },
  {
    slug: 'vagmarkeringar',
    title: 'Vägmarkeringar',
    prefix: 'MARK',
    order: 12,
    visual: { requires_image: true, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-034-002', 'Vägmarkeringar delas in i längsgående markeringar, tvärgående markeringar och övriga markeringar.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 4 kap. 1 §'],
      ['D2-TRAFFIC-035-001', 'Vägmarkeringar används för att reglera trafiken eller för att varna eller vägleda trafikanter, separat eller tillsammans med vägmärken eller andra anordningar.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 4 kap. 2 §'],
      ['D2-TRAFFIC-035-001', 'Vägmarkeringar är vita om inte annat anges och kan vara gula vid tillfälligt behov på grund av vägarbete eller motsvarande.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 4 kap. 3 §'],
      ['D2-TRAFFIC-035-001', 'M13 stopplinje anger var fordon ska stannas enligt vägmärke, trafiksignal eller ljussignal.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 4 kap. 8 §, M13'],
      ['D2-TRAFFIC-035-001', 'M14 väjningslinje anger den linje som fordon inte bör passera när föraren iakttar väjningsplikt.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 4 kap. 8 §, M14'],
    ],
  },
  {
    slug: 'trafiksignaler-anordningar',
    title: 'Trafiksignaler och andra anordningar',
    prefix: 'SIGNAL',
    order: 13,
    visual: { requires_image: true, requires_diagram: true, requires_road_scene: true },
    facts: [
      ['D2-TRAFFIC-034-002', 'Trafiksignaler utgörs av flerfärgssignaler, kollektivtrafiksignaler, körfältssignaler, vissa särskilda signaler och signaler för särskild försiktighet.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 3 kap. 1 §'],
      ['D2-TRAFFIC-035-001', 'Röd fordonssignal betyder stopp och fordon får inte passera stopplinjen eller, om sådan saknas, signalen.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 3 kap. 6 §'],
      ['D2-TRAFFIC-035-001', 'Röd och gul fordonssignal betyder att växling till grönt är omedelbart förestående men har i övrigt samma innebörd som röd.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 3 kap. 6 §'],
      ['D2-TRAFFIC-035-001', 'Blinkande gul signalbild visas vid driftsavbrott eller när anläggning tillfälligt är ur funktion under kortare tid.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 3 kap. 3 §'],
      ['D2-TRAFFIC-035-001', 'Växelvis blinkande rött ljus vid öppningsbar bro, utryckningsstation, flygfält, vägarbete, tunnel eller liknande betyder stopp.', 'SFS_2007_90', 'Vägmärkesförordning (2007:90), 3 kap. 19-20 §§'],
    ],
  },
  {
    slug: 'fordonsdefinitioner',
    title: 'Fordonsdefinitioner',
    prefix: 'VEHICLE',
    order: 14,
    visual: { requires_image: false, requires_diagram: false, requires_road_scene: false },
    facts: [
      ['D2-TRAFFIC-035-003A1', 'Personbil är en bil som är inrättad huvudsakligen för personbefordran och försedd med högst åtta sittplatser utöver förarplatsen.', 'SFS_2001_559', 'Lag (2001:559) om vägtrafikdefinitioner, 2 §'],
      ['D2-TRAFFIC-035-003A2', 'Lätt lastbil är en lastbil med totalvikt av högst 3,5 ton.', 'SFS_2001_559', 'Lag (2001:559) om vägtrafikdefinitioner, 2 §'],
      ['D2-TRAFFIC-035-003A3', 'Buss är en bil som är inrättad huvudsakligen för personbefordran och försedd med fler än åtta sittplatser utöver förarplatsen.', 'SFS_2001_559', 'Lag (2001:559) om vägtrafikdefinitioner, 2 §'],
      ['D2-TRAFFIC-035-003B1', 'Lätt släpfordon är ett släpfordon med totalvikt högst 750 kilogram eller ett släpfordon över 750 kilogram om dragfordonets och släpfordonets sammanlagda totalvikt inte överstiger 3,5 ton.', 'SFS_2001_559', 'Lag (2001:559) om vägtrafikdefinitioner, 2 §'],
      ['D2-TRAFFIC-035-003B2', 'Tungt släpfordon är ett annat släpfordon än ett lätt släpfordon.', 'SFS_2001_559', 'Lag (2001:559) om vägtrafikdefinitioner, 2 §'],
    ],
  },
  {
    slug: 'viktbegrepp',
    title: 'Viktbegrepp',
    prefix: 'WEIGHT',
    order: 15,
    visual: { requires_image: false, requires_diagram: true, requires_road_scene: false },
    facts: [
      ['D2-TRAFFIC-035-003C1', 'Tjänstevikt för bil är vikten av bilen i normalt fullt driftfärdigt skick med tyngsta karosseri, verktyg, reservhjul, bränsle, smörjolja, vatten och förare.', 'SFS_2001_559', 'Lag (2001:559) om vägtrafikdefinitioner, 2 §'],
      ['D2-TRAFFIC-035-003C2', 'Bruttovikt på fordon är den sammanlagda statiska vikt som samtliga hjul, band eller medar på ett fordon vid ett visst tillfälle för över till vägbanan.', 'SFS_2001_559', 'Lag (2001:559) om vägtrafikdefinitioner, 2 §'],
      ['D2-TRAFFIC-035-003C3', 'Totalvikt är summan av fordonets tjänstevikt och maximilast.', 'SFS_2001_559', 'Lag (2001:559) om vägtrafikdefinitioner, 2 §'],
      ['D2-TRAFFIC-035-003C4', 'Maximilast för motorfordon, traktor, motorredskap, terrängmotorfordon, släpfordon eller sidvagn är skillnaden mellan fordonets totalvikt och tjänstevikt.', 'SFS_2001_559', 'Lag (2001:559) om vägtrafikdefinitioner, 2 §'],
    ],
  },
];

function topicId(topic) {
  return `topic_d2_traffic_${topic.slug.replaceAll('-', '_')}`;
}

function factKey(topic, index) {
  return `D2-TRAFFIC-${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`;
}

function lessonKey(topic) {
  return `D2-TRAFFIC-${topic.prefix}-L01`;
}

function questionCount(topic) {
  if (topic.visual.requires_image || topic.visual.requires_diagram) {
    return 8;
  }
  return topic.facts.length >= 5 ? 8 : 6;
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
      legal_status: 'binding_rule',
      verified_at: verifiedAt,
      verification_status: 'verified',
      visual_metadata: topic.visual,
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
      `Känna igen centrala regler i ${topic.title.toLowerCase()}.`,
      'Kunna välja rätt regel i en enkel trafiksituation.',
    ],
    requirement_keys: [...new Set(topicFacts.map((fact) => fact.requirement_key))],
    fact_keys: topicFacts.map((fact) => fact.stable_key),
    source_references: [...new Set(topicFacts.map((fact) => fact.source_id))].map((sourceId) => ({
      source_id: sourceId,
      exact_references: topicFacts.filter((fact) => fact.source_id === sourceId).map((fact) => fact.exact_reference),
    })),
    estimated_study_time_minutes: topicFacts.length >= 5 ? 8 : 6,
    visual_metadata: topic.visual,
    status: 'published',
    content_blocks: [
      { type: 'heading', text: topic.title, fact_keys: [topicFacts[0].stable_key] },
      {
        type: 'paragraph',
        text: `I det här momentet tränar du på ${topic.title.toLowerCase()} som en del av Delprov 2 Trafiklagstiftning. Målet är att känna igen regeln, aktören och situationen innan du svarar.`,
        fact_keys: [topicFacts[0].stable_key],
      },
      {
        type: 'bullet_list',
        items: topicFacts.slice(0, 4).map((fact) => fact.fact_text),
        fact_keys: topicFacts.slice(0, 4).map((fact) => fact.stable_key),
      },
      {
        type: 'example',
        text: topic.visual.requires_road_scene
          ? 'I en bild- eller scenariouppgift ska du först avgöra vilka trafikanter, märken eller markeringar som styr situationen.'
          : 'I en definitionsfråga ska du hålla isär liknande ord och använda den exakta juridiska betydelsen.',
        fact_keys: [topicFacts[Math.min(1, topicFacts.length - 1)].stable_key],
      },
      {
        type: 'info',
        text: topic.visual.requires_image || topic.visual.requires_diagram
          ? 'Det här momentet är markerat för framtida egna diagram eller vägscener. Ingen extern teoriboksbild används i innehållet.'
          : 'Frågorna i momentet kan lösas med text, men ska fortfarande kunna spåras till källa.',
        fact_keys: [topicFacts[0].stable_key],
      },
      {
        type: 'checkpoint',
        text: 'Kan du motivera svaret med rätt regel och källa?',
        fact_keys: [topicFacts[0].stable_key],
      },
    ],
  };
}

function makeQuestion(topic, index) {
  const topicFacts = facts.filter((fact) => fact.topic_id === topicId(topic));
  const fact = topicFacts[index % topicFacts.length];
  const type = topic.visual.requires_image && index % 4 === 0 ? 'scenario' : fact.requirement_key.includes('003') ? 'calculation' : index % 2 === 0 ? 'scenario' : 'single_choice';
  const caseLabel = `Trafikfall ${index + 1}`;

  return {
    stable_key: `D2-TRAFFIC-${topic.prefix}-Q${String(index + 1).padStart(3, '0')}`,
    version: 1,
    topic_id: topicId(topic),
    requirement_keys: [fact.requirement_key],
    fact_keys: [fact.stable_key],
    lesson_key: lessonKey(topic),
    question_type: type,
    competencies: type === 'calculation' ? ['definiera', 'beräkna'] : type === 'scenario' ? ['tillämpa'] : ['redogöra'],
    visual_metadata: topic.visual,
    prompt:
      type === 'calculation'
        ? `${caseLabel}: Vilken definition eller beräkning är korrekt? ${fact.fact_text}`
        : `${caseLabel}: Vilket svar följer av regeln i ${topic.title.toLowerCase()}? ${fact.fact_text}`,
    answer_choices: [
      { id: 'A', text: fact.fact_text },
      { id: 'B', text: `${caseLabel}: regeln gäller bara om vägen saknar vägmärken och trafiksignaler.` },
      { id: 'C', text: `${caseLabel}: föraren kan bortse från regeln om färden är kort eller trafiken är gles.` },
      { id: 'D', text: `${caseLabel}: regeln är endast en rekommendation utan betydelse i provets trafiksituationer.` },
    ],
    correct_answer_id: 'A',
    explanation: `Rätt: ${fact.fact_text} Utgå från den uttryckliga regeln och repetera lektion 1.`,
    difficulty: index < 3 ? 'easy' : index < 6 ? 'medium' : 'hard',
    source_references: [{ source_id: fact.source_id, exact_reference: fact.exact_reference }],
    status: 'published',
  };
}

const lessons = topics.map(makeLesson);
const questions = topics.flatMap((topic) => Array.from({ length: questionCount(topic) }, (_, index) => makeQuestion(topic, index)));
const topicCheckpoints = topics.map((topic) => ({
  stable_key: `D2-TRAFFIC-${topic.prefix}-CHECKPOINT-001`,
  title: `Intern checkpoint: ${topic.title}`,
  type: 'checkpoint',
  subject: 'D2_TRAFFIC_LAW',
  topic: topicId(topic),
  eligible_status: 'published',
  question_count: questionCount(topic),
  pass_threshold: 0.8,
  selection: 'random_from_eligible_published_questions',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
}));

const subjectCheckpoint = {
  stable_key: 'D2-TRAFFIC-SUBJECT-CHECKPOINT-001',
  title: 'Intern ämnescheckpoint: Trafiklagstiftning',
  type: 'checkpoint',
  subject: 'D2_TRAFFIC_LAW',
  topic: null,
  eligible_status: 'published',
  question_count: 30,
  pass_threshold: 0.8,
  selection: 'broad_sample_across_all_d2_traffic_law_topics',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
};

writeFileSync(
  'data/curriculum/d2-traffic-law-sources.json',
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D2_TRAFFIC_LAW',
        phase: 'source_expansion',
        language: 'sv',
        scope: 'Authoritative source map for TSFS 2021:119, 3 kap. 34-35 §§.',
        created_at: verifiedAt,
        last_verified_at: verifiedAt,
      },
      source_catalog: sourceCatalog,
      requirement_source_map: requirementSources.map(([requirement_key, official_requirement_reference, sourceKeys]) => ({
        requirement_key,
        official_requirement_reference,
        sources: sourceKeys.map((key) => sourceCatalog.find((source) => source.source_key === key)),
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
  `${contentDir}/traffic-law-facts.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D2_TRAFFIC_LAW',
        title: 'D2 traffic law verified facts',
        verified_at: verifiedAt,
        status: 'verified',
        policy: 'Every legal statement used by lessons and questions must reference one or more fact stable keys.',
      },
      sources: sourceCatalog.map((source) => ({
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
  `${contentDir}/traffic-law-lessons.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D2_TRAFFIC_LAW',
        title: 'D2 traffic law lessons',
        status: 'published',
        verified_at: verifiedAt,
        note: 'Source-backed mobile-first lessons. Visual metadata marks topics that need custom diagrams or road scenes later.',
      },
      lessons,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${questionDir}/traffic-law-questions.json`,
  `${JSON.stringify(
    {
      metadata: {
        subject: 'D2_TRAFFIC_LAW',
        title: 'D2 traffic law question bank',
        status: 'published',
        created_at: verifiedAt,
        reviewed_at: verifiedAt,
        disclaimer: "Internal checkpoints and mock questions. These are not Trafikverket's official question bank.",
      },
      topic_checkpoints: topicCheckpoints,
      subject_checkpoint: subjectCheckpoint,
      questions,
    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote ${topics.length} traffic topics, ${facts.length} facts, ${lessons.length} lessons and ${questions.length} questions.`);
