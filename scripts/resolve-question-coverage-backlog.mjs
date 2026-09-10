import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const backlogPath = 'docs/question-coverage-backlog.md';
const minTarget = 3;

function loadJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8').replace(/^\uFEFF/, ''));
}

function saveJson(relativePath, value) {
  const target = resolve(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}

const curriculum = loadJson('data/curriculum/requirements.json');
const backlog = readFileSync(resolve(root, backlogPath), 'utf8');
const backlogRows = [...backlog.matchAll(/\| (P1-[^|]+) \| ([^| ]+) \| ([^| ]+) \| (\d+) \| ([^|]+) \| (\d+) \| ([^|]+) \|/g)].map((match) => ({
  priority: match[1].trim(),
  requirementKey: match[2].trim(),
  subject: match[3].trim(),
  previousCount: Number(match[4]),
  backlogCompetency: match[5].trim(),
  recommendedMinimum: Number(match[6]),
  recommendedForm: match[7].trim(),
}));

const questionFiles = {
  D1_NAVIGATION: 'data/questions/d1-navigation/navigation-questions.json',
  D1_SAFETY: 'data/questions/d1-safety/safety-questions.json',
  D1_VEHICLE_KNOWLEDGE: 'data/questions/d1-vehicle-knowledge/vehicle-questions.json',
  D1_WORK_ENVIRONMENT_RISK: 'data/questions/d1-work-environment-risk/work-environment-risk-questions.json',
  D2_TRAFFIC_LAW: 'data/questions/d2-traffic-law/traffic-law-questions.json',
};

const factFiles = {
  D1_NAVIGATION: 'data/content/d1-navigation/navigation-facts.json',
  D1_SAFETY: 'data/content/d1-safety/safety-facts.json',
  D1_VEHICLE_KNOWLEDGE: 'data/content/d1-vehicle-knowledge/vehicle-facts.json',
  D1_WORK_ENVIRONMENT_RISK: 'data/content/d1-work-environment-risk/work-environment-risk-facts.json',
  D2_TRAFFIC_LAW: 'data/content/d2-traffic-law/traffic-law-facts.json',
};

const lessonFiles = {
  D1_NAVIGATION: 'data/content/d1-navigation/navigation-lessons.json',
  D1_SAFETY: 'data/content/d1-safety/safety-lessons.json',
  D1_VEHICLE_KNOWLEDGE: 'data/content/d1-vehicle-knowledge/vehicle-lessons.json',
  D1_WORK_ENVIRONMENT_RISK: 'data/content/d1-work-environment-risk/work-environment-risk-lessons.json',
  D2_TRAFFIC_LAW: 'data/content/d2-traffic-law/traffic-law-lessons.json',
};

const subjectPrefix = {
  D1_NAVIGATION: 'D1-NAV-COVERAGE',
  D1_SAFETY: 'D1-SAFE-COVERAGE',
  D1_VEHICLE_KNOWLEDGE: 'D1-VEH-COVERAGE',
  D1_WORK_ENVIRONMENT_RISK: 'D1-WORK-COVERAGE',
  D2_TRAFFIC_LAW: 'D2-TRAFFIC-COVERAGE',
};

const reqByKey = new Map(curriculum.requirements.map((requirement) => [requirement.stable_key, requirement]));
const questionBanks = new Map(Object.entries(questionFiles).map(([subject, file]) => [subject, loadJson(file)]));
const factBanks = new Map(Object.entries(factFiles).map(([subject, file]) => [subject, loadJson(file)]));
const lessonBanks = new Map(Object.entries(lessonFiles).map(([subject, file]) => [subject, loadJson(file)]));

for (const bank of questionBanks.values()) {
  bank.questions = bank.questions.filter((question) => !question.stable_key.includes('-COVERAGE-'));
  if (bank.metadata) bank.metadata.reviewed_at = '2026-09-11';
}

function factsFor(subject, requirementKey) {
  return factBanks.get(subject).facts.filter((fact) => fact.requirement_key === requirementKey);
}

function lessonFor(subject, requirementKey, fact) {
  const lessons = lessonBanks.get(subject).lessons;
  return lessons.find((lesson) => lesson.requirement_keys?.includes(requirementKey) && lesson.fact_keys?.includes(fact.stable_key))
    ?? lessons.find((lesson) => lesson.requirement_keys?.includes(requirementKey))
    ?? lessons.find((lesson) => lesson.fact_keys?.includes(fact.stable_key));
}

function factText(fact) {
  return fact.fact_text ?? fact.text;
}

function sourceRef(fact) {
  return {
    source_id: fact.source_id,
    exact_reference: fact.exact_reference,
  };
}

const d1Plans = {
  'D1-NAV-003-001': [
    ['Du får en körning till ett område du inte känner till och behöver planera innan start. Vad visar rätt kunskap om färdplaneringshjälpmedel?', 'Välj lämpliga hjälpmedel, till exempel navigation, karta eller bokningsinformation, och kontrollera rutten innan du kör.', 'Kör iväg direkt och låt passageraren lösa osäkerheter under färden.', 'Använd bara minnet även när adressen är okänd.', 'Avstå från planering eftersom hjälpmedel inte ingår i navigering.'],
  ],
  'D1-NAV-003-004': [
    ['En passagerare beskriver vägen muntligt: efter bron ska du ta andra avfarten och sedan följa skylt mot vårdcentralen. Vad är bäst innan du kör vidare?', 'Upprepa de viktigaste punkterna och bekräfta att du har förstått färdbeskrivningen.', 'Gissa första möjliga väg för att slippa störa passageraren.', 'Välja kortaste vägen i appen utan att jämföra med beskrivningen.', 'Be passageraren vänta tills du redan passerat avfarten.'],
  ],
  'D1-NAV-003-005': [
    ['GPS:en föreslår huvudinfarten, men bokningen anger att kunden ska lämnas vid sidoentrén. Hur använder du navigeringsinformationen bäst?', 'Jämför uppgifterna och planera färdvägen mot rätt entré innan sista svängen.', 'Följ alltid första GPS-förslaget även när bokningen säger något annat.', 'Ignorera bokningsinformationen eftersom den inte är en karta.', 'Stanna långt från målet och låt kunden leta efter entrén själv.'],
  ],
  'D1-NAV-003-007': [
    ['Du använder en enkel kartskiss där målet ligger norr om parken och infarten bara finns från öster. Vilket agerande visar korrekt kartavläsning?', 'Planera ankomst från östra sidan och kontrollera att målet ligger på rätt sida om parken.', 'Köra mot närmaste gatunamn utan att se var infarten finns.', 'Anta att alla infarter fungerar eftersom målet syns på kartan.', 'Välja sydsidan eftersom den verkar kortare trots att infarten saknas där.'],
  ],
  'D1-SAFE-012-001': [
    ['Du ska släppa av en passagerare vid en smal gata med cykelbana och parkerade bilar. Vad är säkrast?', 'Välj en plats där passageraren kan kliva ur utan att öppna dörren mot passerande trafik.', 'Stanna där bilen råkar vara även om dörren hamnar mot cyklister.', 'Låt passageraren avgöra helt själv medan du står i körfältet.', 'Öppna dörren snabbt så att stoppet blir kort.'],
  ],
  'D1-SAFE-013-003': [
    ['Du kör taxi nära en skola strax efter skoldagens slut. Vilken bedömning är bäst?', 'Sänk farten och sök aktivt efter barn som kan vara skymda av bilar eller bussar.', 'Håll normal fart eftersom barnen bör se taxin.', 'Titta främst på appen för att hitta nästa uppdrag.', 'Räkna med att övergångsstället gör miljön riskfri.'],
  ],
  'D1-SAFE-013-004': [
    ['En passagerare med rollator ska kliva av vid en trafikerad hållplats. Vad visar rätt riskbedömning?', 'Ge mer tid och välj en skyddad plats med tillräcklig yta om det kan göras säkert.', 'Släpp av direkt i den trängsta luckan för att undvika kö.', 'Låt passageraren kliva ur mot körbanan eftersom hjälpmedlet syns.', 'Fortsätt tills du hittar en plats långt från målet utan att fråga.'],
  ],
  'D1-SAFE-014-002': [
    ['En barnstol ska användas i framsätet och bilen har aktiv passagerarkrockkudde. Vad är rätt säkerhetsbedömning?', 'Bakåtvänt barnskydd ska inte placeras där en aktiv passagerarkrockkudde finns.', 'Krockkudden gör alltid framsätet bäst för bakåtvänt barnskydd.', 'Bilbälte räcker, så krockkudden saknar betydelse.', 'Barnskyddets placering spelar ingen roll vid kort taxiresa.'],
  ],
  'D1-SAFE-015-001': [
    ['Vilket val beskriver Nollvisionens huvudmål bäst i taxiförarens trafiksäkerhetsarbete?', 'Att ingen ska dödas eller skadas allvarligt i vägtrafiken.', 'Att alla resor ska gå så snabbt som möjligt.', 'Att endast förare i yrkestrafik har ansvar för säkerheten.', 'Att olyckor ska accepteras om reglerna följts formellt.'],
  ],
  'D1-SAFE-015-002': [
    ['Du ligger efter tidtabell men närmar dig ett övergångsställe med skymd sikt. Vad bidrar bäst till Nollvisionen?', 'Sänka farten, skapa marginal och vara beredd på oskyddade trafikanter.', 'Hålla högre fart för att minska försening.', 'Lita på att gångtrafikanter alltid väntar.', 'Fokusera på nästa bokning i stället för platsens risker.'],
    ['En kund vill att du kör fortare genom ett bostadsområde. Vilket svar visar hur taxiförare kan bidra till Nollvisionen?', 'Hålla rätt hastighet och prioritera risken för allvarliga personskador framför tidspress.', 'Öka farten eftersom kunden betalar för resan.', 'Köra snabbare bara så länge bilen har bra bromsar.', 'Låta kunden ta ansvar för hastighetsvalet.'],
  ],
  'D1-VEH-024-002': [
    ['Du ska kontrollera om taxin får dra en viss släpvagn. Var bör du söka tekniska uppgifter?', 'I registreringsbeviset eller Transportstyrelsens fordonsuppgifter.', 'I passagerarens muntliga uppskattning av bilens storlek.', 'På däcksidan enbart, oavsett vilken uppgift som behövs.', 'Genom att prova att köra och se om bilen orkar.'],
  ],
  'D1-VEH-025-001': [
    ['Du ser en färgad vätskefläck under bilen före första körningen. Vad är bäst?', 'Identifiera läckaget innan bilen används vidare.', 'Torka bort fläcken och köra om lamporna fungerar.', 'Anta att alla läckage är vatten från klimatanläggningen.', 'Vänta tills nästa service utan kontroll.'],
  ],
  'D1-VEH-025-003': [
    ['Du ska fylla på en fordonsvätska men är osäker på typ och placering. Vad är rätt?', 'Kontrollera fordonets anvisningar och använd rätt vätsketyp.', 'Fyll på den vätska som finns tillgänglig om färgen liknar den gamla.', 'Blanda vätskor för att nivån snabbt ska bli rätt.', 'Hoppa över kontrollen eftersom vätskor inte påverkar trafiksäkerheten.'],
  ],
  'D1-VEH-026-001': [
    ['En säkring har gått och du hittar en säkring med högre amperetal än den gamla. Vad är korrekt?', 'Ersätt bara med rätt amperetal enligt fordonets anvisningar.', 'Använd högre amperetal så håller säkringen längre.', 'Sätt i valfri säkring om funktionen startar igen.', 'Kör utan kontroll eftersom säkringar bara påverkar komfort.'],
  ],
  'D1-VEH-026-002': [
    ['Du ska hjälpa till med startkablar på en mörk taxiplats. Vad visar rätt riskförståelse?', 'Följ fordonens anvisningar och undvik felkoppling eftersom batterier och elsystem kan skadas.', 'Koppla kablarna snabbt i valfri ordning.', 'Låt kablarna ligga löst över rörliga delar medan motorn startas.', 'Använd startkablar även om batteriet ser skadat ut.'],
    ['Ett batteri är sprucket och luktar starkt när någon vill använda startkablar. Vad bör du göra?', 'Avstå från startförsöket och hantera situationen som en risk.', 'Starta ändå eftersom taxin behöver bli klar snabbt.', 'Hålla kablarna längre tid så batteriet laddas mer.', 'Be en passagerare hålla kablarna på plats.'],
  ],
  'D1-VEH-026-003': [
    ['Vid batterikontroll ser du skadade kablar nära batteriet. Vad är bäst?', 'Ta skadan på allvar och låt felet hanteras innan bilen används normalt.', 'Dölja kabeln och kontrollera igen efter arbetsdagen.', 'Röra kabeln fram och tillbaka för att se om bilen startar.', 'Köra vidare eftersom batteriet bara behövs vid start.'],
  ],
  'D1-VEH-026-004': [
    ['En föreskriven lykta fungerar inte inför kvällskörning. Vad visar rätt förståelse?', 'Föraren måste säkerställa att bilen visar rätt ljus innan färd.', 'Köra ändå om gatubelysningen är stark.', 'Ersätta kontrollen med varningsblinkers hela resan.', 'Låta kunden bestämma om ljuset räcker.'],
  ],
  'D1-VEH-026-005': [
    ['Du laddar en eltaxi via vanligt vägguttag under lång tid. Vilken risk behöver du förstå?', 'Hög ström och lång laddtid kan innebära brandrisk om elanläggningen inte är avsedd för det.', 'Vanligt vägguttag tar bort alla laddningsrisker.', 'Brandrisk gäller bara när bilen körs.', 'Förlängningssladd gör laddningen säkrare oavsett belastning.'],
  ],
  'D1-VEH-027-001': [
    ['Vilken enkel kontroll hör till styrinrättningen före körning?', 'Att reagera på onormalt glapp, kärvhet eller sidodragning vid styrning.', 'Att bara kontrollera bränslenivån.', 'Att bedöma styrningen genom bilens lackskick.', 'Att vänta tills passageraren märker ett problem.'],
    ['Under låg hastighet känns ratten ovanligt trög. Vad visar rätt kunskap om styrkontroll?', 'Stanna och bedöm styrningen som en möjlig säkerhetsbrist.', 'Fortsätt köra eftersom trög styrning brukar lösa sig.', 'Öka farten för att göra ratten lättare.', 'Ignorera känslan om inga varningslampor syns.'],
  ],
  'D1-VEH-027-002': [
    ['Taxin drar tydligt åt höger på rak väg. Vad tyder det på?', 'En styrnings- eller hjulrelaterad brist som ska tas på allvar.', 'Att vägen alltid lutar för mycket för taxi.', 'Att problemet saknar betydelse om ratten går att vrida.', 'Att passagerarens vikt automatiskt är orsaken.'],
  ],
  'D1-VEH-027-003': [
    ['Föraren vrider ratten häftigt vid halt väglag med passagerare i bilen. Vilken följd behöver föraren känna till?', 'Felaktig styrningshantering kan försämra kontrollen och öka risken för sladd eller obalans.', 'Kraftig styrning gör alltid bilen stabilare.', 'Styrningen påverkar bara komforten.', 'Följden beror bara på bilens färg och modellår.'],
    ['Du upptäcker instabil styrkänsla men fortsätter köra i tät trafik. Vad är riskbedömningen?', 'Fel hantering av styrbrist kan göra bilen svårare att kontrollera i en kritisk situation.', 'Styrbrist blir mindre viktig i tät trafik.', 'Det räcker att hålla ratten lösare.', 'Problemet gäller bara vid parkering.'],
  ],
  'D1-VEH-027-004A': [
    ['Du byter från framhjulsdriven till bakhjulsdriven taxi inför vinterpass. Vad behöver du känna till?', 'Drivningstyp kan påverka köregenskaper och hur bilen reagerar vid halt väglag.', 'Alla drivningstyper reagerar exakt likadant.', 'Bak-, fram- och fyrhjulsdrift påverkar bara bränsleförbrukning.', 'Drivning saknar betydelse när bilen har antisladdsystem.'],
    ['En fyrhjulsdriven taxi accelererar lätt på halt underlag. Vilken slutsats är rimlig?', 'Drivningen kan hjälpa framkomlighet men tar inte bort behovet av anpassad körning.', 'Fyrhjulsdrift gör bromssträckan riskfri.', 'Fyrhjulsdrift betyder att väglaget kan ignoreras.', 'Drivningen avgör att hög hastighet alltid är lämplig.'],
  ],
  'D1-VEH-027-004B': [
    ['Du lastar tungt bagage längst bak i bilen. Vad måste du känna till?', 'Last och viktfördelning kan påverka köregenskaper och stabilitet.', 'Last påverkar bara bagageutrymmet.', 'Tung last gör alltid styrningen bättre.', 'Viktfördelning saknar betydelse om bilen är ny.'],
  ],
  'D1-VEH-027-004C': [
    ['Regn övergår i blötsnö under passet. Vad behöver du känna till om köregenskaper?', 'Väder och väglag ändrar friktion och sikt, så styrning, hastighet och marginaler måste anpassas.', 'Köregenskaperna är oförändrade så länge däcken är godkända.', 'Sikten påverkar bara passagerarens komfort.', 'Väglag spelar ingen roll för styrningen i låg fart.'],
  ],
  'D1-VEH-028-001': [
    ['Vilken förklaring passar moderna bromssystem bäst?', 'De består av flera funktioner som ska hjälpa föraren att bromsa stabilt men kräver rätt användning och kontroll.', 'De gör att föraren aldrig behöver hålla avstånd.', 'De ersätter behovet av däck med rätt skick.', 'De fungerar oberoende av fel eller varningssignaler.'],
  ],
  'D1-VEH-028-002': [
    ['En taxi har kort avstånd till bilen framför i tät trafik. Vad är rätt bromsanvändning?', 'Skapa marginal och bromsa mjukt när det går, men tydligt vid fara.', 'Ligga nära och lita på moderna bromssystem.', 'Bromsa sent varje gång för att hålla flödet.', 'Pumpbromsa alltid oavsett bromssystem och väglag.'],
  ],
  'D1-VEH-028-004': [
    ['Du gör en enkel bromskontroll och märker avvikande känsla vid provbromsning. Vad är rätt?', 'Se det som en möjlig brist i bromssystemet och låt bilen kontrolleras innan normal körning.', 'Köra vidare om bilen fortfarande stannar någon gång.', 'Ignorera känslan om passageraren inte märker den.', 'Kompensera genom att bromsa hårdare resten av passet.'],
  ],
  'D1-VEH-029-007B': [
    ['Det är 20 april och vinterväglag befaras under nattpasset. Vad gäller för dubbdäck?', 'Dubbdäck får användas även efter 15 april om det är eller befaras bli vinterväglag.', 'Dubbdäck är förbjudna efter 15 april oavsett väglag.', 'Dubbdäck får bara användas om kunden begär det.', 'Dubbdäck får alltid blandas med odubbade däck på samma bil.'],
  ],
  'D1-VEH-029-007E': [
    ['Du överväger alternativa fälg- och däckdimensioner på taxin. Vad måste vara uppfyllt?', 'Krav på typgodkännande, belastning, hastighet, fri rörlighet och hastighetsmätarvisning måste uppfyllas.', 'Dimensionen är tillåten bara den ser ut att passa i hjulhuset.', 'Större fälg är alltid tillåten på taxi.', 'Hastighetsmätarens visning saknar betydelse vid dimensionbyte.'],
  ],
  'D1-WORK-020-001': [
    ['Efter flera körningar har du lyft tunga väskor vridet från bagageutrymmet. Vilken bedömning minskar risken för belastningsskada?', 'Planera lyftet, stå nära lasten och använda hjälpmedel eller be om hjälp vid behov.', 'Lyfta snabbare så belastningen blir kortvarig.', 'Vrida ryggen mer för att nå längre in.', 'Vänta med åtgärd tills smärta gör körning omöjlig.'],
  ],
  'D1-WORK-021-001': [
    ['Du har tagit ett läkemedel som kan göra dig dåsig innan ett arbetspass. Vad visar bäst omdöme?', 'Bedöm påverkan på körförmågan och kör inte om trafiksäkerheten kan påverkas.', 'Kör ändå om läkemedlet är lagligt utskrivet.', 'Låt kunden avgöra om du verkar pigg.', 'Kompensiera med högre musik och öppet fönster.'],
  ],
  'D1-WORK-021-002': [
    ['En förare tror att gårdagens droganvändning inte längre påverkar arbetspasset. Vad är rätt riskbedömning?', 'Alkohol och andra droger kan påverka omdöme och körförmåga, så föraren måste avstå om påverkan finns.', 'Det är riskfritt om föraren känner sig van.', 'Påverkan spelar bara roll vid privat körning.', 'Kundens brådska avgör om körningen kan genomföras.'],
  ],
  'D1-WORK-021-004': [
    ['Efter en lång sjukperiod känner du att reaktion och ork är sämre än vanligt. Vad är bäst?', 'Bedöm om fysisk kondition påverkar körförmågan innan du tar passagerare.', 'Köra ändå för att träna upp orken under passet.', 'Ta bara korta resor utan annan bedömning.', 'Låta passageraren säga till om körningen verkar osäker.'],
    ['Du blir snabbt andfådd och får svårt att bära lätt bagage inför arbetspasset. Vad visar rätt riskmedvetenhet?', 'Se fysisk kondition som en faktor som kan påverka både omdöme, ork och trafiksäkerhet.', 'Anta att kondition aldrig påverkar körning i taxi.', 'Köra snabbare så passet blir kortare.', 'Undvika alla raster för att komma hem tidigare.'],
  ],
  'D1-WORK-021-005': [
    ['Du är starkt upprörd efter ett hotfullt samtal och ska direkt köra en kund. Vad är bäst?', 'Bedöm om psykisk obalans påverkar uppmärksamhet och beslut innan du kör.', 'Köra direkt så tankarna kommer på annat.', 'Låta irritationen styra körtempot.', 'Berätta för kunden att du måste köra fort för att bli klar.'],
    ['Under ett pass märker du att stress och ilska gör dig impulsiv i trafiken. Vad bör du göra?', 'Pausa och återta kontrollen innan du fortsätter med passagerare.', 'Fortsätta eftersom känslor inte påverkar körbeslut.', 'Ta fler körningar för att tänka på annat.', 'Köra närmare andra fordon för att spara tid.'],
  ],
  'D1-WORK-021-006': [
    ['Du har hoppat över mat och känner dig skakig och okoncentrerad under passet. Vad är rätt bedömning?', 'Kosthållning kan påverka omdöme och körförmåga, så du bör pausa och återställa koncentrationen.', 'Fortsätt köra eftersom matvanor inte påverkar trafiksäkerhet.', 'Kör fortare till nästa kund för att hinna äta senare.', 'Låt passageraren hålla koll på trafiken.'],
    ['En förare planerar ett långt pass utan möjlighet till mat eller dryck. Vad är riskmedvetet?', 'Planera för energi och vätska eftersom brist kan påverka koncentration och beslut.', 'Hoppa över pauser för att minska arbetstiden.', 'Äta först efter passet oavsett hur kroppen reagerar.', 'Se kost som en privat fråga utan koppling till körförmåga.'],
  ],
  'D1-WORK-021-007': [
    ['Du har haft flera sena pass i rad och märker att uppmärksamheten faller. Vad är rätt bedömning?', 'Arbets- och vilocykeln kan påverka omdöme och trafiksäkerhet, så återhämtning behöver prioriteras.', 'Fortsätt tills schemat är slut eftersom trötthet bara är obekvämt.', 'Öka tempot för att hålla dig vaken.', 'Ta fler uppdrag för att undvika passivitet.'],
  ],
};

const d2Plans = {
  'D2-TRAFFIC-035-003A1': [
    ['En bil är byggd främst för personbefordran och har 8 sittplatser utöver förarplatsen. Vilken definition passar?', 'Personbil.', 'Buss.', 'Lätt lastbil.', 'Tung lastbil.', 'Jämför antal sittplatser utöver förarplatsen med gränsen högst åtta.', '8 sittplatser utöver förarplatsen ger personbil när bilen är inrättad för personbefordran.'],
  ],
  'D2-TRAFFIC-035-003A2': [
    ['En lastbil har totalvikt 3 500 kg. Vilken definition passar?', 'Lätt lastbil.', 'Tung lastbil.', 'Lätt släpfordon.', 'Personbil med släp.', 'Jämför totalvikten med gränsen högst 3,5 ton.', '3 500 kg är 3,5 ton och ligger inom lätt lastbil.'],
  ],
  'D2-TRAFFIC-035-003A3': [
    ['En bil är byggd för personbefordran och har 10 sittplatser utöver förarplatsen. Vilken definition passar?', 'Buss.', 'Personbil.', 'Lätt lastbil.', 'Släpfordon.', 'Räkna sittplatser utöver förarplatsen och jämför med gränsen fler än åtta.', '10 är fler än 8, därför är definitionen buss.'],
  ],
  'D2-TRAFFIC-035-003B1': [
    ['Ett släpfordon har totalvikt 700 kg. Hur klassas det?', 'Lätt släpfordon.', 'Tungt släpfordon.', 'Buss.', 'Lätt lastbil.', 'Jämför släpfordonets totalvikt med 750 kg-gränsen.', '700 kg är högst 750 kg och klassas som lätt släpfordon.'],
    ['Ett släp väger över 750 kg i totalvikt. Dragfordonets och släpets sammanlagda totalvikt är 3 400 kg. Hur klassas släpet enligt definitionen?', 'Lätt släpfordon.', 'Tungt släpfordon.', 'Personbil.', 'Motorredskap.', 'För släp över 750 kg kontrolleras om sammanlagd totalvikt är högst 3,5 ton.', '3 400 kg överstiger inte 3,5 ton, därför ryms släpet i lätt släpfordon.'],
  ],
  'D2-TRAFFIC-035-003B2': [
    ['Ett släp har totalvikt 900 kg och ekipagets sammanlagda totalvikt är 3 800 kg. Hur klassas släpet?', 'Tungt släpfordon.', 'Lätt släpfordon.', 'Personbil.', 'Buss.', 'Pröva först 750 kg-gränsen och därefter 3,5 tons sammanlagd totalvikt.', 'Släpet är över 750 kg och ekipaget över 3,5 ton, alltså är det inte lätt släpfordon.'],
    ['Ett släpfordon är inte ett lätt släpfordon enligt definitionen. Vilken klassning återstår?', 'Tungt släpfordon.', 'Personbil.', 'Lätt lastbil.', 'Moped.', 'Använd definitionen att tungt släpfordon är annat släpfordon än lätt släpfordon.', 'När lätt släpfordon inte uppfylls är klassningen tungt släpfordon.'],
  ],
  'D2-TRAFFIC-035-003C1': [
    ['Vilken uppgift hör till tjänstevikt för bil?', 'Bilen i normalt fullt driftfärdigt skick med bland annat förare och bränsle.', 'Bilen med maximal last och alla passagerare.', 'Den vikt bilen har just nu vid vägning med aktuell last.', 'Skillnaden mellan totalvikt och tjänstevikt.', 'Identifiera vad som ingår i definitionen av tjänstevikt.', 'Tjänstevikt avser driftfärdigt skick och inkluderar bland annat förare och bränsle.'],
  ],
  'D2-TRAFFIC-035-003C2': [
    ['En bil vägs vid vägkanten med aktuell last och passagerare. Vilken vikt beskriver situationen?', 'Bruttovikt.', 'Tjänstevikt.', 'Maximilast.', 'Antal sittplatser.', 'Bruttovikt är den statiska vikt fordonet vid ett visst tillfälle för över till vägbanan.', 'Vikten gäller just detta tillfälle och är därför bruttovikt.'],
  ],
  'D2-TRAFFIC-035-003C3': [
    ['En bil har tjänstevikt 1 820 kg och maximilast 580 kg. Vad är totalvikten?', '2 400 kg.', '1 240 kg.', '580 kg.', '1 820 kg.', 'Totalvikt = tjänstevikt + maximilast.', '1 820 + 580 = 2 400 kg.'],
  ],
  'D2-TRAFFIC-035-003C4': [
    ['Ett fordon har totalvikt 2 650 kg och tjänstevikt 1 940 kg. Vad är maximilasten?', '710 kg.', '4 590 kg.', '2 650 kg.', '1 940 kg.', 'Maximilast = totalvikt - tjänstevikt.', '2 650 - 1 940 = 710 kg.'],
  ],
};

function makeQuestion(row, indexWithinRequirement, plan) {
  const requirement = reqByKey.get(row.requirementKey);
  const facts = factsFor(row.subject, row.requirementKey);
  const fact = facts[indexWithinRequirement % facts.length] ?? facts[0];
  const lesson = lessonFor(row.subject, row.requirementKey, fact);
  if (!requirement || !fact || !lesson) {
    throw new Error(`Missing chain for ${row.requirementKey}`);
  }

  const source = sourceRef(fact);
  const competency = requirement.competency_type ?? row.backlogCompetency;
  const stableKey = `${subjectPrefix[row.subject]}-${row.requirementKey}-Q${String(indexWithinRequirement + 1).padStart(3, '0')}`;

  if (row.subject === 'D2_TRAFFIC_LAW') {
    const [prompt, correct, wrong1, wrong2, wrong3, method, workedExample] = plan;
    return {
      stable_key: stableKey,
      version: 1,
      topic_id: lesson.topic_id,
      requirement_keys: [row.requirementKey],
      fact_keys: [fact.stable_key],
      lesson_key: lesson.stable_key,
      question_type: 'calculation',
      competencies: ['definiera', 'beräkna', 'tillämpa'],
      visual_metadata: { requires_image: false, requires_diagram: false, requires_road_scene: false },
      prompt,
      answer_choices: [
        { id: 'A', text: correct },
        { id: 'B', text: wrong1 },
        { id: 'C', text: wrong2 },
        { id: 'D', text: wrong3 },
      ],
      correct_answer_id: 'A',
      explanation: `Rätt: ${correct} ${workedExample} Detta följer av ${fact.exact_reference}.`,
      difficulty: indexWithinRequirement === 0 ? 'medium' : 'hard',
      calculation_metadata: {
        teaching_status: 'source_backed_definition_calculation',
        inputs: [prompt],
        method,
        worked_example: workedExample,
        answer: correct,
      },
      source_references: [source],
      status: 'published',
    };
  }

  const [prompt, correct, wrong1, wrong2, wrong3] = plan;
  const scenarioLike = ['APPLY', 'ASSESS', 'USE', 'PERFORM'].includes(competency) || requirement.requires_scenario || row.recommendedForm.includes('application');
  const question = {
    stable_key: stableKey,
    version: 1,
    topic_id: lesson.topic_id,
    requirement_keys: [row.requirementKey],
    fact_keys: [fact.stable_key],
    lesson_key: lesson.stable_key,
    question_type: scenarioLike ? 'scenario' : 'single_choice',
    competencies: [competency.toLowerCase(), 'coverage_backlog_v2'],
    competency_tags: [competency, scenarioLike ? 'APPLY' : 'KNOW'],
    prompt,
    answer_choices: [
      { id: 'A', text: correct },
      { id: 'B', text: wrong1 },
      { id: 'C', text: wrong2 },
      { id: 'D', text: wrong3 },
    ],
    correct_answer_id: 'A',
    explanation: `Rätt: ${correct} Frågan prövar ${requirement.normalized_requirement ?? row.requirementKey} och bygger på ${fact.exact_reference}.`,
    difficulty: indexWithinRequirement === 0 ? 'medium' : 'hard',
    source_references: [source],
    visual_metadata: { requires_image: false, requires_diagram: false, requires_road_scene: false },
    visual_correctness_depends_on_asset: false,
    status: 'published',
  };

  if (row.subject === 'D1_WORK_ENVIRONMENT_RISK') {
    question.competency = 'bedöma och välja säkert agerande';
    question.scenario_context = prompt.split('?')[0];
  }

  if (row.subject === 'D1_SAFETY') {
    question.prompt = `${question.prompt} Situationen gäller taxiförarens val med passagerare i verklig trafik.`;
  }

  if (row.subject === 'D1_NAVIGATION') {
    question.navigation_metadata = fact.navigation_metadata ?? {
      requires_map: false,
      requires_route_scenario: false,
      requires_oral_route_description: false,
      requires_distance_estimation: false,
      requires_travel_time_calculation: false,
      requires_arrival_time_calculation: false,
    };
    if (question.navigation_metadata.requires_map) {
      question.map_metadata = {
        id: `${stableKey.toLowerCase()}_simple_map_placeholder`,
        description: 'Simple custom map metadata placeholder; the prompt contains all information needed to answer.',
        copyright_status: 'custom_metadata_only',
      };
    }
  }

  return question;
}

const auditRows = [];
let added = 0;

for (const row of backlogRows) {
  const bank = questionBanks.get(row.subject);
  const existing = bank.questions.filter((question) => question.requirement_keys?.includes(row.requirementKey));
  const needed = Math.max(0, minTarget - existing.length);
  const plans = row.subject === 'D2_TRAFFIC_LAW' ? d2Plans[row.requirementKey] : d1Plans[row.requirementKey];
  if (!plans) throw new Error(`No question plan for ${row.requirementKey}`);

  const questionsToAdd = plans.slice(0, needed).map((plan, index) => makeQuestion(row, index, plan));
  bank.questions.push(...questionsToAdd);
  added += questionsToAdd.length;
  auditRows.push({
    ...row,
    action: needed > 0 ? `ADDED_${questionsToAdd.length}_TARGETED_QUESTION${questionsToAdd.length === 1 ? '' : 'S'}` : 'NO_NEW_QUESTION_NEEDED',
    classification: needed > 0 ? 'GENUINELY_UNDERCOVERED' : 'SUFFICIENT_NARROW_REQUIREMENT',
    added: questionsToAdd.length,
  });
}

for (const [subject, bank] of questionBanks.entries()) {
  saveJson(questionFiles[subject], bank);
}

saveJson('data/quality/question-coverage-backlog-v2-actions.json', {
  metadata: {
    generated_at: '2026-09-11',
    backlog_requirements_reviewed: backlogRows.length,
    questions_added: added,
    scope: 'docs/question-coverage-backlog.md',
  },
  actions: auditRows,
});
