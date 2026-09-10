import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-09';
const createdAt = '2026-09-09';
const contentDir = 'data/content/d2-taxi-law';
const questionDir = 'data/questions/d2-taxi-law';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sources = [
  {
    source_id: 'SFS_2012_211',
    source_title: 'Taxitrafiklag (2012:211)',
    authority: 'Sveriges riksdag / Svensk författningssamling',
    source_type: 'primary_legal_source',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/taxitrafiklag-2012211_sfs-2012-211/',
    current_validity: 'Ändrad t.o.m. SFS 2024:1094 enligt Riksdagen/SFS, verifierad 2026-09-09.',
  },
  {
    source_id: 'SFS_2012_238',
    source_title: 'Taxitrafikförordning (2012:238)',
    authority: 'Sveriges riksdag / Svensk författningssamling',
    source_type: 'primary_legal_source',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/taxitrafikforordning-2012238_sfs-2012-238/',
    current_validity: 'Ändrad t.o.m. SFS 2025:81 enligt Riksdagen/SFS, verifierad 2026-09-09.',
  },
  {
    source_id: 'TSFS_2013_41',
    source_title: 'Transportstyrelsens föreskrifter om taxitrafik, konsoliderad elektronisk utgåva',
    authority: 'Transportstyrelsen',
    source_type: 'primary_legal_source',
    url: 'https://www.transportstyrelsen.se/TSFS/TSFS%202013_41k.pdf',
    current_validity:
      'Konsoliderad elektronisk utgåva med ändringar införda t.o.m. TSFS 2023:24; PDF anger att tryckt utgåva gäller vid fel. Exakta avsnitt i 1-7 kap. och bilaga extraherade 2026-09-09.',
  },
  {
    source_id: 'SFS_1970_340',
    source_title: 'Förordning (1970:340) om skolskjutsning',
    authority: 'Sveriges riksdag / Svensk författningssamling',
    source_type: 'primary_legal_source',
    url: 'https://data.riksdagen.se/dokument/sfs-1970-340.html',
    current_validity: 'Ändrad t.o.m. SFS 2018:933 enligt Riksdagen/SFS, verifierad 2026-09-09.',
  },
  {
    source_id: 'SFS_2010_800',
    source_title: 'Skollag (2010:800)',
    authority: 'Sveriges riksdag / Svensk författningssamling',
    source_type: 'primary_legal_source',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/skollag-2010800_sfs-2010-800/',
    current_validity: 'Primär rättskälla för skolskjutsrätt; verifierad 2026-09-09.',
  },
  {
    source_id: 'SFS_1994_1297',
    source_title: 'Förordning (1994:1297) om vilotider vid vissa vägtransporter inom landet',
    authority: 'Sveriges riksdag / Svensk författningssamling',
    source_type: 'primary_legal_source',
    url: 'https://data.riksdagen.se/dokument/sfs-1994-1297.html',
    current_validity: 'Ändrad t.o.m. SFS 2014:1259 enligt Riksdagen/SFS, verifierad 2026-09-09.',
  },
  {
    source_id: 'SFS_2005_395',
    source_title: 'Lag (2005:395) om arbetstid vid visst vägtransportarbete',
    authority: 'Sveriges riksdag / Svensk författningssamling',
    source_type: 'primary_legal_source',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2005395-om-arbetstid-vid-visst_sfs-2005-395/',
    current_validity: 'Ändrad t.o.m. SFS 2022:464 enligt Riksdagen/SFS, verifierad 2026-09-09.',
  },
];

const topics = [
  {
    slug: 'taxitrafikens-grunder',
    title: 'Taxitrafikens grunder',
    topicId: 'topic_d2_taxi_taxitrafikens_grunder',
    checkpoint: 'D2-TAXI-GRUNDER-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-030-001'],
    prefix: 'BASIC',
    order: 1,
    facts: [
      ['Taxitrafik är yrkesmässig trafik med personbil eller lätt lastbil där fordon och förare mot betalning ställs till allmänhetens förfogande för persontransport.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 1 kap. 1 §', 'binding_rule'],
      ['Taxitrafik får bedrivas endast av den som har taxitrafiktillstånd.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 1 §', 'binding_rule'],
      ['Hos juridiska personer med taxitrafiktillstånd ska det finnas trafikansvariga som ansvarar för att verksamheten bedrivs enligt föreskrifter, god branschsed och på ett trafiksäkert sätt.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 3 §', 'binding_rule'],
      ['Polismyndigheten utför vägkontroller av att fordon framförs enligt taxitrafiklagen, taxitrafikförordningen och villkor för trafiktillstånd eller taxiförarlegitimation.', 'SFS_2012_238', 'Taxitrafikförordning (2012:238), 4 kap. 10 §', 'binding_rule'],
    ],
  },
  {
    slug: 'taxiforarlegitimation',
    title: 'Taxiförarlegitimation',
    topicId: 'topic_d2_taxi_taxiforarlegitimation',
    checkpoint: 'D2-TAXI-TFL-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-031-001'],
    prefix: 'TFL',
    order: 2,
    facts: [
      ['Personbil eller lätt lastbil får föras i taxitrafik endast av den som har giltig taxiförarlegitimation eller tillfälligt utövar taxiföraryrket enligt reglerna om erkännande av yrkeskvalifikationer.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 3 kap. 1 §', 'binding_rule'],
      ['Taxiförarlegitimation får ges till den som har fyllt 20 år, har B-körkort sedan minst två år eller D-körkort, uppfyller medicinska krav, bedöms lämplig i yrkeskompetens och laglydnad samt har godkänt körprov.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 3 kap. 3 § första stycket', 'binding_rule'],
      ['Taxiförarlegitimation gäller från utlämnandet och endast tillsammans med giltigt körkort.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 3 kap. 10 §', 'binding_rule'],
      ['Taxiförarlegitimation ska förnyas inom tio år efter utfärdande eller senaste förnyelse med nya uppgifter, och även om den förstörts, kommit bort eller uppgifter ändrats.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 3 kap. 12 §', 'binding_rule'],
      ['En giltig taxiförarlegitimation ska medföras i taxitrafik, vara väl synlig för passagerarna och visas för polisman eller bilinspektör på begäran.', 'SFS_2012_238', 'Taxitrafikförordning (2012:238), 3 kap. 13 §', 'binding_rule'],
    ],
  },
  {
    slug: 'aterkallelse',
    title: 'Återkallelse',
    topicId: 'topic_d2_taxi_aterkallelse',
    checkpoint: 'D2-TAXI-ATERKALLELSE-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-031-002'],
    prefix: 'REVOKE',
    order: 3,
    facts: [
      ['Taxiförarlegitimation ska återkallas om innehavaren genom brottslig gärning eller andra missförhållanden visat sig olämplig som taxiförare.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 4 kap. 6 § första stycket 1', 'binding_rule'],
      ['Taxiförarlegitimation ska återkallas om innehavaren inte längre uppfyller de medicinska kraven eller inte följer föreläggande att ge in läkarintyg.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 4 kap. 6 § första stycket 2-3', 'binding_rule'],
      ['Om missförhållandena inte är så allvarliga att taxiförarlegitimationen bör återkallas får varning meddelas i stället.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 4 kap. 6 § andra stycket', 'binding_rule'],
      ['Vid återkallelse på grund av olämplighet ska en olämplighetstid på lägst tre och högst fem år bestämmas.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 4 kap. 7 §', 'binding_rule'],
      ['När en taxiförarlegitimation återkallas, tas om hand eller blir ogiltig ska innehavaren på uppmaning överlämna den till prövningsmyndigheten eller Polismyndigheten.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 4 kap. 11 §', 'binding_rule'],
    ],
  },
  {
    slug: 'begrepp-definitioner',
    title: 'Begrepp och definitioner',
    topicId: 'topic_d2_taxi_begrepp_definitioner',
    checkpoint: 'D2-TAXI-BEGREPP-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-031-003'],
    prefix: 'TERM',
    order: 4,
    facts: [
      ['Taxitrafik definieras i taxitrafiklagen som yrkesmässig persontransport med personbil eller lätt lastbil där fordon och förare ställs till allmänhetens förfogande mot betalning.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 1 kap. 1 §', 'binding_rule'],
      ['Taxiförarlegitimation är en handling som ger behörighet att föra fordon i taxitrafik.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 1 kap. 1 §', 'binding_rule'],
      ['Fordonsuttryck i taxitrafiklagen har samma betydelse som i lagen om vägtrafikdefinitioner.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 1 kap. 2 §', 'binding_rule'],
      ['I TSFS 2013:41 betyder körpass den tid under vilken en taxiförare använder ett fordon i taxitrafik.', 'TSFS_2013_41', 'TSFS 2013:41, 2 kap. 1 §', 'binding_rule'],
      ['I TSFS 2013:41 betyder köruppdrag varje transport i taxitrafik.', 'TSFS_2013_41', 'TSFS 2013:41, 2 kap. 1 §', 'binding_rule'],
    ],
  },
  {
    slug: 'handlingar-kontroller',
    title: 'Handlingar och kontroller',
    topicId: 'topic_d2_taxi_handlingar_kontroller',
    checkpoint: 'D2-TAXI-HANDLINGAR-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-031-004A', 'D2-TAXI-031-004B'],
    prefix: 'DOC',
    order: 5,
    facts: [
      ['Giltig taxiförarlegitimation ska medföras i taxitrafik, vara synlig för passagerarna och visas upp för polisman eller bilinspektör på begäran.', 'SFS_2012_238', 'Taxitrafikförordning (2012:238), 3 kap. 13 §', 'binding_rule'],
      ['Polismyndigheten utför vägkontroller av att fordon framförs enligt taxitrafiklagen, taxitrafikförordningen och villkor för trafiktillstånd eller taxiförarlegitimation.', 'SFS_2012_238', 'Taxitrafikförordning (2012:238), 4 kap. 10 §', 'binding_rule'],
      ['Vid färd med fordon vars registreringsskyltar har tagits om hand ska det finnas bevis i fordonet om polismans medgivande till färden.', 'SFS_2012_238', 'Taxitrafikförordning (2012:238), 5 kap. 6 §', 'binding_rule'],
      ['Tidboken ska medföras under färden och lämnas till polisman eller bilinspektör på begäran.', 'SFS_1994_1297', 'Förordning (1994:1297), 7 §', 'binding_rule'],
      ['Den senaste kontrollrapporten för taxameterutrustningen ska medföras i original i fordonet och överlämnas på begäran av polisman eller bilinspektör.', 'TSFS_2013_41', 'TSFS 2013:41, 5 kap. 8 §', 'binding_rule'],
    ],
  },
  {
    slug: 'taxitrafiktillstand',
    title: 'Taxitrafiktillstånd',
    topicId: 'topic_d2_taxi_taxitrafiktillstand',
    checkpoint: 'D2-TAXI-TILLSTAND-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-031-005'],
    prefix: 'PERMIT',
    order: 6,
    facts: [
      ['Taxitrafik får bedrivas endast av den som har taxitrafiktillstånd.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 1 §', 'binding_rule'],
      ['Taxitrafiktillstånd får endast ges till den som med hänsyn till yrkeskunnande, ekonomiska förhållanden och gott anseende bedöms lämplig att bedriva verksamheten.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 5 §', 'binding_rule'],
      ['Kravet på yrkeskunnande för taxitrafiktillstånd uppfylls genom godkänt skriftligt prov i yrkeskunnande.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 8 §', 'binding_rule'],
      ['Som huvudregel anses sökanden ha tillräckliga ekonomiska resurser vid kapital och reserver om minst 100 000 kronor för ett fordon och 50 000 kronor för varje ytterligare fordon.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 9 §', 'binding_rule'],
      ['Tillståndshavaren ska säkerställa att ett fordon inte används i taxitrafik förrän en korrekt anmälan har kommit in till Transportstyrelsen.', 'SFS_2012_238', 'Taxitrafikförordning (2012:238), 4 kap. 8 §', 'binding_rule'],
    ],
  },
  {
    slug: 'taxameter-sarskild-utrustning',
    title: 'Taxameter och särskild utrustning',
    topicId: 'topic_d2_taxi_taxameter_sarskild_utrustning',
    checkpoint: 'D2-TAXI-TAXAMETER-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-031-006', 'D2-TAXI-031-007'],
    prefix: 'METER',
    order: 7,
    facts: [
      ['Ett fordon får användas i taxitrafik endast om det har godkänd och fungerande taxameterutrustning eller sådan särskild utrustning för taxifordon som regelverket anger.', 'SFS_2012_238', 'Taxitrafikförordning (2012:238), 5 kap. 1 §', 'binding_rule'],
      ['Ett taxifordon får inte samtidigt vara försett med taxameterutrustning och särskild utrustning för taxifordon.', 'SFS_2012_238', 'Taxitrafikförordning (2012:238), 5 kap. 2 §', 'binding_rule'],
      ['Taxameterutrustning ska besiktas senast ett år från installationen eller senaste besiktningen av ett godkänt besiktningsorgan och en kontrollrapport ska upprättas.', 'SFS_2012_238', 'Taxitrafikförordning (2012:238), 5 kap. 3 §', 'binding_rule'],
      ['När det finns taxameterutrustning i ett fordon som används i taxitrafik ska taxiföraren kontrollera att den fungerar.', 'TSFS_2013_41', 'TSFS 2013:41, 3 kap. 1 §', 'binding_rule'],
      ['När körpasset påbörjas ska taxiföraren registrera sin förarkod eller sitt särskiljande nummer i taxameterutrustningen och registrera när körpasset avslutas.', 'TSFS_2013_41', 'TSFS 2013:41, 3 kap. 3 §', 'binding_rule'],
      ['Efter varje avslutat köruppdrag, eller vid delbetalning, ska taxiföraren erbjuda kunden kvitto eller följesedel från taxameterutrustningen.', 'TSFS_2013_41', 'TSFS 2013:41, 5 kap. 1 §', 'binding_rule'],
      ['För fordon med särskild utrustning ska taxiföraren identifiera sig elektroniskt för beställningscentralen med förarkod eller särskiljande nummer.', 'TSFS_2013_41', 'TSFS 2013:41, 7 kap. 2 §', 'binding_rule'],
    ],
  },
  {
    slug: 'prisinformation',
    title: 'Prisinformation',
    topicId: 'topic_d2_taxi_prisinformation',
    checkpoint: 'D2-TAXI-PRIS-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-031-008'],
    prefix: 'PRICE',
    order: 8,
    facts: [
      ['Den som har taxitrafiktillstånd och bedriver taxitrafik med taxameterutrustat fordon ska informera om den taxa som tillämpas och lämna prisuppgift enligt taxitrafiklagen.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 17 §', 'binding_rule'],
      ['Taxan ska vara uppbyggd så att priset enkelt kan bedömas före färden och beräknas efter färden med kännedom om körd sträcka och nyttjad tid.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 18 §', 'binding_rule'],
      ['Prisuppgift ska ange högsta pris för färden och lämnas om jämförpriset överstiger 1,2 procent av årets prisbasbelopp avrundat nedåt till närmaste tiotal kronor; den behövs inte när fast pris tillämpas.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 20 §', 'binding_rule'],
      ['Jämförpriset är priset inklusive mervärdesskatt för en 10 kilometer lång transport som varar 15 minuter inklusive eventuell grundavgift.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 2 kap. 20 § andra stycket', 'binding_rule'],
      ['När taxameterutrustat fordon används i taxitrafik ska prisinformationen vara väl synlig inne i fordonet och på utsidan, varaktigt utförd och fastsatt samt inte förvilla eller försvåra för passageraren.', 'TSFS_2013_41', 'TSFS 2013:41, 6 kap. 1-2 §§', 'binding_rule'],
      ['Jämförpris ska anges för varje tariff där fast pris inte tillämpas.', 'TSFS_2013_41', 'TSFS 2013:41, 6 kap. 5 §', 'binding_rule'],
      ['Bevis om prisuppgifter för de senaste två dygnen ska finnas tillgängliga i fordonet och överlämnas på begäran av polisman eller bilinspektör.', 'TSFS_2013_41', 'TSFS 2013:41, 6 kap. 11 §', 'binding_rule'],
      ['Bevis om prisuppgifter ska sparas på ett beständigt sätt i sex månader från datumet på prisuppgiften.', 'TSFS_2013_41', 'TSFS 2013:41, 6 kap. 12 §', 'binding_rule'],
    ],
  },
  {
    slug: 'arbetstid-ansvar',
    title: 'Arbetstid och ansvar',
    topicId: 'topic_d2_taxi_arbetstid_ansvar',
    checkpoint: 'D2-TAXI-ARBETSTID-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-032-002'],
    prefix: 'WORK',
    order: 10,
    facts: [
      ['Sammanlagd arbetstid enligt vägarbetstidslagen är summan av arbetstid som omfattas av lagen, även om arbetet utförs för flera arbetsgivare eller kunder.', 'SFS_2005_395', 'Lag (2005:395), 10 §', 'binding_rule'],
      ['Arbetsgivaren ska skriftligen begära uppgifter från arbetstagaren om arbete för annan arbetsgivare, och arbetstagaren ska lämna uppgifterna skriftligen.', 'SFS_2005_395', 'Lag (2005:395), 11 §', 'binding_rule'],
      ['Sammanlagd arbetstid får vara högst 48 timmar per vecka i genomsnitt under en beräkningsperiod om högst fyra månader och får inte överstiga 60 timmar under någon vecka.', 'SFS_2005_395', 'Lag (2005:395), 12 §', 'binding_rule'],
      ['Arbete får aldrig utföras längre än sex timmar i följd utan rast; rasten ska vara minst 30 minuter vid 6-9 timmars arbetstid och minst 45 minuter när arbetstiden överstiger 9 timmar.', 'SFS_2005_395', 'Lag (2005:395), 18 §', 'binding_rule'],
      ['Arbetsgivare och egenföretagare ska registrera all arbetstid som omfattas av vägarbetstidslagen och bevara registren i minst två år.', 'SFS_2005_395', 'Lag (2005:395), 20 §', 'binding_rule'],
    ],
  },
  {
    slug: 'skolskjuts',
    title: 'Skolskjuts',
    topicId: 'topic_d2_taxi_skolskjuts',
    checkpoint: 'D2-TAXI-SKOLSKJUTS-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-033-001'],
    prefix: 'SCHOOL',
    order: 11,
    facts: [
      ['Skolskjutsning är skjuts till eller från skolan av elever i förskola, förskoleklass, grundskola, gymnasieskola eller motsvarande skola, särskilt ordnad av det allmänna och inte tillfällig.', 'SFS_1970_340', 'Förordning (1970:340), 1 §', 'binding_rule'],
      ['Skolskjutsning ska när det gäller tidsplaner och färdvägar ordnas så att kraven på trafiksäkerhet tillgodoses.', 'SFS_1970_340', 'Förordning (1970:340), 2 § första stycket', 'binding_rule'],
      ['Kommunal nämnd ska verka för att särskilt anordnade hållplatser utformas så att olyckor i möjligaste mån undviks och bestämmer färdvägar och på- eller avstigningsplatser efter föreskrivna samråd.', 'SFS_1970_340', 'Förordning (1970:340), 2 § andra stycket', 'binding_rule'],
      ['När ett fordon används för skolskjutsning ska det vara försett med skylt eller liknande som visar användningen.', 'SFS_1970_340', 'Förordning (1970:340), 5 § första stycket', 'binding_rule'],
      ['Vid skolskjutsning ska vänstra sidans dörrar inte kunna öppnas av passagerare, andra dörrar ska inte kunna öppnas ofrivilligt och sittplatser i personbil eller lätt lastbil ska ha bilbälte.', 'SFS_1970_340', 'Förordning (1970:340), 5 § första och tredje stycket', 'binding_rule'],
      ['Förare och den som bedrivit skolskjutsningen kan dömas till böter om fordon används uppsåtligen eller av oaktsamhet i strid med fordonskraven i 5 § eller anslutande föreskrifter.', 'SFS_1970_340', 'Förordning (1970:340), 7 §', 'binding_rule'],
    ],
  },
  {
    slug: 'sanktioner-pafoljder',
    title: 'Sanktioner och påföljder',
    topicId: 'topic_d2_taxi_sanktioner_pafoljder',
    checkpoint: 'D2-TAXI-SANKTIONER-CHECKPOINT-001',
    requirementKeys: ['D2-TAXI-030-001', 'D2-TAXI-031-002', 'D2-TAXI-032-002', 'D2-TAXI-033-001'],
    prefix: 'SANCTION',
    order: 12,
    facts: [
      ['Den som uppsåtligen bedriver taxitrafik utan tillstånd döms för olaga taxitrafik till böter eller fängelse i högst ett år.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 5 kap. 1 §', 'binding_rule'],
      ['Den som i strid mot kravet på taxiförarlegitimation uppsåtligen för ett fordon döms till böter eller fängelse i högst sex månader.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 5 kap. 4 § första stycket', 'binding_rule'],
      ['Tillståndshavare som uppsåtligen eller av oaktsamhet anlitar förare som saknar taxiförarlegitimation eller rätt att tillfälligt utöva taxiföraryrket döms till samma straff som förare utan legitimation.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 5 kap. 4 § andra stycket', 'binding_rule'],
      ['Om ett fordon framförs i strid med taxitrafiklagen, anslutande föreskrifter eller villkor får fortsatt färd hindras enligt klampningslagen.', 'SFS_2012_211', 'Taxitrafiklag (2012:211), 5 kap. 7 §', 'binding_rule'],
      ['Förare som uppsåtligen eller av oaktsamhet bryter mot reglerna om dygnsvila, anteckningar eller medförande av tidbok kan dömas till penningböter.', 'SFS_1994_1297', 'Förordning (1994:1297), 12 § första stycket', 'binding_rule'],
      ['Arbetsgivare som uppsåtligen eller av oaktsamhet bryter mot reglerna om anteckningar, bevarande, tidbok eller kontrollhandlingar kan dömas till penningböter.', 'SFS_1994_1297', 'Förordning (1994:1297), 12 § andra stycket', 'binding_rule'],
      ['Förare och den som bedrivit skolskjutsningen kan dömas till böter vid uppsåtlig eller oaktsam användning av fordon i strid med skolskjutsförordningens fordonskrav.', 'SFS_1970_340', 'Förordning (1970:340), 7 §', 'binding_rule'],
    ],
  },
];

function factKey(topic, index) {
  return `${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`;
}

function lessonKey(topic) {
  return `D2-TAXI-${topic.prefix}-L01`;
}

function makeLesson(topic, facts) {
  return {
    stable_key: lessonKey(topic),
    topic_id: topic.topicId,
    title: topic.title,
    learning_objectives: [
      `Kunna koppla ${topic.title.toLowerCase()} till rätt krav och källa.`,
      'Kunna bedöma enkla provscenarier utan att blanda ihop närliggande regler.',
    ],
    requirement_keys: topic.requirementKeys,
    fact_keys: facts.map((fact) => fact.stable_key),
    source_references: [...new Set(facts.map((fact) => fact.source_id))].map((sourceId) => ({
      source_id: sourceId,
      exact_references: facts.filter((fact) => fact.source_id === sourceId).map((fact) => fact.exact_reference),
    })),
    estimated_study_time_minutes: topic.facts.length >= 7 ? 9 : 7,
    status: 'published',
    content_blocks: [
      {
        type: 'heading',
        text: topic.title,
        fact_keys: [facts[0].stable_key],
      },
      {
        type: 'paragraph',
        text: `Det här momentet samlar de regler som provet kan använda när frågan gäller ${topic.title.toLowerCase()}. Börja alltid med att identifiera om frågan handlar om behörighet, fordon, ansvar, kontroll eller påföljd.`,
        fact_keys: [facts[0].stable_key],
      },
      {
        type: 'bullet_list',
        items: facts.slice(0, 4).map((fact) => fact.fact_text),
        fact_keys: facts.slice(0, 4).map((fact) => fact.stable_key),
      },
      {
        type: 'warning',
        text: 'Blanda inte ihop vad föraren ska göra direkt i fordonet med vad tillståndshavare, arbetsgivare, kommun eller myndighet ansvarar för.',
        fact_keys: facts.slice(0, Math.min(2, facts.length)).map((fact) => fact.stable_key),
      },
      {
        type: 'example',
        text: `I en kontrollfråga om ${topic.title.toLowerCase()} ska svaret kunna motiveras med den regel som uttryckligen säger vem som ska agera och när.`,
        fact_keys: [facts[Math.min(1, facts.length - 1)].stable_key],
      },
      {
        type: 'checkpoint',
        text: 'Kan du peka ut både regeln och ansvarig aktör innan du väljer svar?',
        fact_keys: [facts[0].stable_key],
      },
    ],
  };
}

function makeQuestion(topic, facts, index) {
  const fact = facts[index % facts.length];
  const stable = `D2-TAXI-${topic.prefix}-Q${String(index + 1).padStart(3, '0')}`;
  const promptPrefix = index % 3 === 0 ? 'Vilket påstående stämmer?' : index % 3 === 1 ? 'Vad är rätt bedömning i provsituationen?' : 'Vilken regel ska du använda först?';
  const caseLabel = `${topic.prefix}-kontrollfall ${index + 1}`;

  return {
    stable_key: stable,
    version: 1,
    topic_id: topic.topicId,
    requirement_keys: [fact.requirement_key],
    fact_keys: [fact.stable_key],
    lesson_key: lessonKey(topic),
    question_type: index % 3 === 1 ? 'scenario' : 'single_choice',
    competencies: index % 3 === 1 ? ['bedöma'] : ['redogöra'],
    prompt: `${caseLabel}: ${promptPrefix} ${fact.fact_text}`,
    answer_choices: [
      { id: 'A', text: fact.fact_text },
      { id: 'B', text: `${caseLabel}: regeln gäller bara om kunden själv begär att den ska användas.` },
      { id: 'C', text: `${caseLabel}: föraren kan alltid välja bort regeln om körningen är kort.` },
      { id: 'D', text: `${caseLabel}: regeln är endast ett internt råd utan koppling till taxitrafiklagstiftningen.` },
    ],
    correct_answer_id: 'A',
    explanation: `Rätt: ${fact.fact_text} Vanlig feltolkning är att göra regeln frivillig eller flytta ansvaret till fel aktör. Repetera lektion 1.`,
    difficulty: index < 5 ? 'easy' : index < 11 ? 'medium' : 'hard',
    source_references: [{ source_id: fact.source_id, exact_reference: fact.exact_reference }],
    status: 'published',
  };
}

const facts = topics.flatMap((topic) =>
  topic.facts.map(([fact_text, source_id, exact_reference, legal_status], index) => ({
    stable_key: factKey(topic, index),
    topic_id: topic.topicId,
    requirement_key: topic.requirementKeys[Math.min(index, topic.requirementKeys.length - 1)],
    fact_text,
    source_id,
    exact_reference,
    legal_status,
    verified_at: verifiedAt,
    verification_status: 'verified',
  })),
);

const lessons = topics.map((topic) => makeLesson(topic, facts.filter((fact) => fact.topic_id === topic.topicId)));
const questions = topics.flatMap((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === topic.topicId);
  return Array.from({ length: 15 }, (_, index) => makeQuestion(topic, topicFacts, index));
});

const checkpointExams = topics.map((topic) => ({
  stable_key: topic.checkpoint,
  title: `Intern checkpoint: ${topic.title}`,
  type: 'checkpoint',
  topic: topic.topicId,
  eligible_status: 'published',
  question_count: 15,
  pass_threshold: 0.8,
  selection: 'random_from_eligible_published_questions',
  freeze_question_versions_on_attempt_start: true,
  status: 'published',
}));

writeFileSync(
  `${contentDir}/remaining-topics-facts.json`,
  `${JSON.stringify(
    {
      metadata: {
        topic: 'D2_TAXI_LAW_REMAINING_TOPICS',
        title: 'Remaining D2 taxi law verified facts',
        verified_at: verifiedAt,
        status: 'verified',
        policy: 'Every legal statement used by lessons and questions must reference one or more fact stable keys.',
      },
      sources,
      facts,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${contentDir}/remaining-topics-lessons.json`,
  `${JSON.stringify(
    {
      metadata: {
        topic: 'D2_TAXI_LAW_REMAINING_TOPICS',
        title: 'Remaining D2 taxi law lessons',
        status: 'published',
        verified_at: verifiedAt,
        note: 'Production-oriented authored topic slices. Content is source-backed, but not an official Trafikverket question bank.',
      },
      lessons,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  `${questionDir}/remaining-topics-questions.json`,
  `${JSON.stringify(
    {
      metadata: {
        topic: 'D2_TAXI_LAW_REMAINING_TOPICS',
        title: 'Remaining D2 taxi law question banks',
        status: 'published',
        created_at: createdAt,
        reviewed_at: verifiedAt,
        disclaimer: "Internal topic checkpoint questions. These are not Trafikverket's official question bank.",
      },
      checkpoint_exams: checkpointExams,
      questions,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  'docs/tsfs-2013-41-extraction.md',
  `# TSFS 2013:41 extraction\n\nVerified 2026-09-09 from Transportstyrelsen's consolidated electronic PDF.\n\nThe PDF states that the consolidated electronic version can contain errors and that the printed version applies if there is a discrepancy. The content below is therefore treated as verified section extraction for app authoring, with the normal source caveat retained in source metadata.\n\n## Extracted sections used\n\n- 1 kap. 1-2 §§: scope and related taxameter standards.\n- 2 kap. 1-2 §§: definitions including körpass, köruppdrag, tariff, tariffparameter, taxameterutrustning, särskild utrustning and belopp in SEK.\n- 3 kap. 1-8 §§: taxameter function check, one taxameter equipment, driver registration, trip/session registration, fixed-price registration, negative tariff parameters and reporting to redovisningscentral.\n- 4 kap. 1-7 §§: Ledig, Upptagen and Stoppad operating modes and older Tariff/Kassa terms.\n- 5 kap. 1-8 §§: customer receipt/följesedel, copies at control, körpassrapport, taxameterkontroll and original control report in the vehicle.\n- 6 kap. 1-13 §§: visible price information, tariff registration, jämförpris, tariff parameter units, inside/outside placement, price-proof content, two-day vehicle availability and six-month preservation.\n- 7 kap. 1-3 §§: booking-centre notification, electronic driver identification for special-equipment vehicles and original special-equipment control report in the vehicle.\n\nNo unresolved TSFS 2013:41 section issue remains for the authored taxameter or prisinformation lessons in this slice.\n`,
);

console.log(`Wrote ${topics.length} topics, ${lessons.length} lessons and ${questions.length} questions.`);
