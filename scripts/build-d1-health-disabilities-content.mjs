import { mkdirSync, writeFileSync } from 'node:fs';

const verifiedAt = '2026-09-10';
const contentDir = 'data/content/d1-health-disabilities';
const questionDir = 'data/questions/d1-health-disabilities';

mkdirSync(contentDir, { recursive: true });
mkdirSync(questionDir, { recursive: true });

const sourceCatalog = [
  ['TSFS_2021_119_CONSOLIDATED', 'Transportstyrelsens föreskrifter och allmänna råd om taxiförarlegitimation', 'primary_legal_source', 'Transportstyrelsen', 'TSFS 2021:119, 3 kap. 18 § och allmänna råd till 18 §', 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/sok-ts-foreskrifter/details?RuleNumber=2023%3A35&ruleprefix=TSFS', '3 kap. 18 § och allmänna råd', 'Primary curriculum authority for D1 Sjukdomar och funktionsnedsättningar.'],
  ['1177_INSULINKANNING', 'Insulinkänning', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on low blood sugar', 'https://www.1177.se/Stockholm/sjukdomar--besvar/diabetes/insulinkanning//', 'Confusion/drowsiness may indicate low blood sugar; help with sugar if possible; seek emergency care if needed.', 'Used only for practical awareness during taxi transport.'],
  ['1177_ASTMA', 'Astma', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on asthma', 'https://www.1177.se/Stockholm/sjukdomar--besvar/lungor-och-luftvagar/andningssvarigheter-och-andningsuppehall/astma//', 'Asthma attacks can worsen breathing; smoke, strong scents and cold air can worsen symptoms; call 112 if breathing is very difficult despite medication.', 'Used for transport environment and urgent-help boundaries.'],
  ['1177_EPILEPSI', 'Epilepsi', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on epilepsy', 'https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/yrsel-svimning-och-kramper/epilepsi/', 'During a seizure: protect from injury, time the seizure, do not put anything in the mouth, call 112 if it lasts five minutes or longer or recovery is poor.', 'Used only for safe response during a ride.'],
  ['1177_STROKE', 'Stroke', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on stroke', 'https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/stroke-och-blodkarl-i-hjarnan/stroke/', 'Suspected stroke requires calling 112 immediately, even if symptoms are mild or pass.', 'Used for urgent-help taxi scenarios.'],
  ['1177_PARKINSON', 'Parkinsons sjukdom', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on Parkinsons disease', 'https://www.1177.se/Stockholm/sjukdomar--besvar/hjarna-och-nerver/nerver/parkinsons-sjukdom/', 'Movement may be slower, starting movement can be difficult, balance and speech can be affected; symptoms vary.', 'Used for mobility and communication awareness.'],
  ['1177_MS', 'Multipel skleros - MS', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on MS', 'https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/nerver/multipel-skleros--ms/', 'MS can affect walking, balance, vision, memory, concentration and fatigue; symptoms vary.', 'Used for practical support awareness.'],
  ['1177_CP', 'Cerebral pares - CP', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on CP', 'https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/nerver/cerebral-pares--cp/', 'CP affects movement in varying ways and can involve muscle tension, involuntary movements, balance issues and communication aids.', 'Used for assistance and communication scenarios.'],
  ['1177_KOGNITIVT_STOD', 'Hjälpmedel för kognitivt stöd', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on cognitive support aids', 'https://www.1177.se/Vasterbotten/undersokning-behandling/hjalpmedel/hjalpmedel-for-kognition-och-kommunikation/hjalpmedel-for-kognitivt-stod/', 'Cognitive difficulty can affect memory, concentration, orientation, planning and communication; aids can support planning, reminders and orientation.', 'Used for practical support during transport.'],
  ['1177_DEMENS_NARSTAENDE', 'Närstående till någon med en demenssjukdom', 'authoritative_medical_guidance', '1177 Vårdguiden/Vårdhandboken', 'Healthcare guidance for support around dementia', 'https://www.vardhandboken.se/externa-sidor/1177/narstaende-till-nagon-med-en-demenssjukdom/', 'Patience, time, respect and avoiding argument can support a person with dementia.', 'Used narrowly for respectful route/passenger communication.'],
  ['1177_PSYKOS', 'Psykos och psykossjukdomar', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on psychosis', 'https://www.1177.se/sjukdomar--besvar/psykiska-sjukdomar-och-besvar/psykos-och-vanforestallningar/psykos-och-psykossjukdomar/', 'Psychosis can involve interpreting reality differently, hearing voices, feeling persecuted and difficulty planning or caring for oneself.', 'Used only for calm, non-confrontational transport response.'],
  ['1177_PANIKSYNDROM', 'Paniksyndrom', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on panic attacks', 'https://www.1177.se/Stockholm/sjukdomar--besvar/psykiska-sjukdomar-och-besvar/angest/paniksyndrom/', 'Panic attacks are frightening, often last minutes and pass; calm breathing and a calm environment can help.', 'Used for calm taxi response, not treatment.'],
  ['1177_ADHD', 'ADHD', 'authoritative_medical_guidance', '1177 Vårdguiden', 'Healthcare guidance on ADHD', 'https://www.1177.se/stockholm/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/adhd/', 'ADHD can affect concentration, impulse control, planning, time and following instructions; needs vary.', 'Used for communication and planning awareness.'],
  ['1177_AUTISM_IF', 'Autism med intellektuell funktionsnedsättning', 'authoritative_medical_guidance', '1177 Vårdguiden/Vårdpersonal', 'Healthcare guidance on autism with intellectual disability', 'https://vardpersonal.1177.se/kunskapsstod/kliniska-kunskapsstod/autism-med-intellektuell-funktionsnedsattning/?globalregion=19&selectionCode=profession_primarvard', 'Structure, routines, clear language and visual support can be important; verbal understanding varies.', 'Used narrowly for practical communication and predictability.'],
  ['1177_ANAFYLAXI', 'Anafylaxi', 'authoritative_medical_guidance', '1177 Vårdguiden/Vårdpersonal', 'Healthcare guidance on severe allergic reaction', 'https://vardpersonal.1177.se/kunskapsstod/kliniska-kunskapsstod/anafylaxi/?region=stockholm&selectionCode=profession_primarvard', 'Severe allergic reaction can worsen quickly and require urgent medical help.', 'Used only for urgent-help boundary.'],
];

const source_catalog = sourceCatalog.map(([source_key, source_title, source_type, authority, legal_reference, url, relevant_chapter_section, notes]) => ({
  source_key,
  source_title,
  source_type,
  authority,
  legal_reference,
  url,
  relevant_chapter_section,
  source_status: 'VERIFIED',
  last_verified_at: verifiedAt,
  notes,
}));

const requirement_source_map = [
  ['D1-HEALTH-018-001', ['TSFS_2021_119_CONSOLIDATED', '1177_KOGNITIVT_STOD', '1177_DEMENS_NARSTAENDE']],
  ['D1-HEALTH-018-GA-001', ['TSFS_2021_119_CONSOLIDATED', '1177_INSULINKANNING', '1177_ASTMA', '1177_EPILEPSI', '1177_STROKE', '1177_ANAFYLAXI']],
  ['D1-HEALTH-018-GA-002', ['TSFS_2021_119_CONSOLIDATED', '1177_PARKINSON', '1177_MS', '1177_CP']],
  ['D1-HEALTH-018-GA-003', ['TSFS_2021_119_CONSOLIDATED', '1177_PANIKSYNDROM', '1177_PSYKOS']],
  ['D1-HEALTH-018-GA-004', ['TSFS_2021_119_CONSOLIDATED', '1177_ADHD', '1177_AUTISM_IF', '1177_KOGNITIVT_STOD']],
].map(([requirement_key, sourceKeys]) => ({
  requirement_key,
  sources: sourceKeys.map((source_key) => {
    const source = source_catalog.find((candidate) => candidate.source_key === source_key);
    return {
      source_key,
      source_type: source.source_type,
      authority: source.authority,
      exact_reference: source.legal_reference,
      source_status: 'VERIFIED',
      verification_notes: source.notes,
    };
  }),
  overall_status: 'FULLY_SOURCED',
  notes: 'Source expansion verified for practical taxi-driver awareness, not medical diagnosis or treatment.',
}));

const visuals = [
  ['health_boarding_mobility_scene', 'mobility_assistance_scene', 'Praktisk hjälp vid i- och urstigning när rörelse, balans eller ork påverkar resan.', ['taxi vid kantsten', 'öppen dörr', 'passagerare med hjälpmedel', 'förare som frågar innan stöd ges'], ['D1-HEALTH-018-GA-002']],
  ['health_cognitive_support_scene', 'cognitive_support_scene', 'Tydlig kommunikation och orienteringsstöd vid kognitiv eller neuropsykiatrisk påverkan.', ['kort textmeddelande', 'adressbekräftelse', 'lugn miljö', 'förare som ger en sak i taget'], ['D1-HEALTH-018-001', 'D1-HEALTH-018-GA-004']],
  ['health_urgent_help_decision_scene', 'urgent_help_decision_scene', 'Beslutsstöd för när resan ska avbrytas och hjälp tillkallas.', ['säker stoppplats', 'telefon 112', 'förare som håller avstånd från trafik', 'passagerare med akut försämring'], ['D1-HEALTH-018-GA-001', 'D1-HEALTH-018-GA-003']],
].map(([visual_id, visual_type, purpose, elements_must_be_shown, requirement_keys]) => ({
  visual_id,
  visual_type,
  status: 'placeholder_metadata',
  purpose,
  elements_must_be_shown,
  labels_required: elements_must_be_shown,
  requirement_keys,
  fact_keys: [],
  correctness_depends_on_visual: false,
  notes: 'Custom/simple visual placeholder. Published questions remain answerable from text alone.',
}));

const topics = [
  {
    slug: 'forarens-roll-granser',
    title: 'Förarens roll och gränser',
    prefix: 'ROLE',
    order: 1,
    visual: null,
    competency_tags: ['KNOW', 'USE'],
    facts: [
      ['D1-HEALTH-018-001', 'Taxiföraren ska känna till sjukdomar och funktionsnedsättningar så att resan kan genomföras tryggt och med rätt praktisk assistans.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'binding_rule'],
      ['D1-HEALTH-018-001', 'Förarens roll är att uppmärksamma praktiska behov under transporten, inte att fastställa vilket tillstånd passageraren har.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
      ['D1-HEALTH-018-001', 'Trygg assistans börjar med att fråga vad passageraren vill ha hjälp med och bekräfta det innan föraren agerar.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
      ['D1-HEALTH-018-001', 'När passagerarens behov är oklart ska föraren hålla kommunikationen enkel, lugn och kopplad till nästa praktiska steg i resan.', '1177_KOGNITIVT_STOD', 'Hjälpmedel för kognitivt stöd: planering, orientering, kommunikation', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-001', 'En person som har svårt att minnas eller orientera sig kan behöva extra tid, tydlig information och respektfull bekräftelse.', '1177_DEMENS_NARSTAENDE', 'Närstående till någon med en demenssjukdom: tålamod, tid och respekt', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-001', 'Om situationen ändras under färden ska föraren prioritera säker plats, lugn kommunikation och hjälp enligt läget.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
    ],
  },
  {
    slug: 'akuta-forandringar-under-resan',
    title: 'Akuta förändringar under resan',
    prefix: 'URGENT',
    order: 2,
    visual: 'health_urgent_help_decision_scene',
    competency_tags: ['KNOW', 'ASSESS'],
    facts: [
      ['D1-HEALTH-018-GA-001', 'Allmänna råden till 3 kap. 18 § anger diabetes, astma, allergi, epilepsi, demens och hjärtbesvär som exempel på sjukdomar föraren bör känna till.', 'TSFS_2021_119_CONSOLIDATED', 'Allmänna råd till TSFS 2021:119, 3 kap. 18 §', 'general_advice'],
      ['D1-HEALTH-018-GA-001', 'Vid misstänkt mycket lågt blodsocker kan en förvirrad eller dåsig person behöva snabb hjälp och något som höjer blodsockret om personen kan äta eller dricka.', '1177_INSULINKANNING', 'Insulinkänning: förvirring/dåsighet och hjälp att höja blodsocker', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-001', 'Astma kan ge anfall där andningen snabbt blir sämre, och rök, starka dofter eller kall luft kan förvärra besvären.', '1177_ASTMA', 'Astma: symtom och faktorer som kan förvärra', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-001', 'Vid ett epileptiskt anfall ska omgivningen skydda personen från skada, ta tiden och inte stoppa något i munnen.', '1177_EPILEPSI', 'Epilepsi: hjälp under anfall', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-001', '112 ska kontaktas vid krampanfall som varar fem minuter eller längre eller om personen inte återhämtar sig ordentligt.', '1177_EPILEPSI', 'Epilepsi: när 112 ska ringas', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-001', 'Vid misstänkt stroke ska 112 kontaktas omedelbart, även om besvären verkar milda eller går över.', '1177_STROKE', 'Stroke: ring 112 direkt vid misstanke', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-001', 'En svår allergisk reaktion kan försämras snabbt och kräva akut hjälp.', '1177_ANAFYLAXI', 'Anafylaxi: akut försämring och behov av snabb hjälp', 'authoritative_medical_guidance'],
    ],
  },
  {
    slug: 'rorelse-balans-ork',
    title: 'Rörelse, balans och ork',
    prefix: 'MOBILITY',
    order: 3,
    visual: 'health_boarding_mobility_scene',
    competency_tags: ['KNOW', 'APPLY'],
    facts: [
      ['D1-HEALTH-018-GA-002', 'Allmänna råden anger reumatiska sjukdomar, Parkinsons sjukdom, stroke, cerebral pares och multipel skleros som exempel på tillstånd föraren bör känna till.', 'TSFS_2021_119_CONSOLIDATED', 'Allmänna råd till TSFS 2021:119, 3 kap. 18 §', 'general_advice'],
      ['D1-HEALTH-018-GA-002', 'Parkinsons sjukdom kan göra rörelser långsammare och göra det svårare att starta rörelse, hålla balansen eller tala tydligt.', '1177_PARKINSON', 'Parkinsons sjukdom: rörelse, balans och tal kan påverkas', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-002', 'MS kan påverka gång, balans, syn, koncentration och ork, och besvären kan variera mellan personer och över tid.', '1177_MS', 'Multipel skleros: gång, balans, syn, trötthet och kognition', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-002', 'Cerebral pares påverkar rörelse på olika sätt och kan bland annat ge spända muskler, ofrivilliga rörelser eller balanssvårigheter.', '1177_CP', 'Cerebral pares: rörelsepåverkan varierar', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-002', 'En passagerare med påverkad rörelseförmåga kan behöva extra tid, stabilt läge vid bilen och hjälp först efter att föraren frågat.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
      ['D1-HEALTH-018-GA-002', 'När hjälpmedel används ska föraren hantera dem varsamt och låta passageraren beskriva vad som behövs.', '1177_CP', 'Cerebral pares: hjälpmedel och varierande behov', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-002', 'Efter stroke kan praktiska behov gälla rörelse, tal, syn eller balans, och föraren ska anpassa assistansen till det passageraren uttrycker.', '1177_STROKE', 'Stroke: påverkan på rörelse, tal, känsel och syn', 'authoritative_medical_guidance'],
    ],
  },
  {
    slug: 'kognition-minne-orientering',
    title: 'Kognition, minne och orientering',
    prefix: 'COG',
    order: 4,
    visual: 'health_cognitive_support_scene',
    competency_tags: ['KNOW', 'APPLY'],
    facts: [
      ['D1-HEALTH-018-GA-001', 'Demens anges i allmänna råden som ett exempel på sjukdom som taxiföraren bör känna till.', 'TSFS_2021_119_CONSOLIDATED', 'Allmänna råd till TSFS 2021:119, 3 kap. 18 §', 'general_advice'],
      ['D1-HEALTH-018-001', 'Kognitiva svårigheter kan påverka minne, koncentration, orientering, planering och kommunikation.', '1177_KOGNITIVT_STOD', 'Hjälpmedel för kognitivt stöd: exempel på kognitiva svårigheter', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-001', 'Vid kognitiv påverkan är det ofta bättre med korta besked, en sak i taget och kontroll av adress eller mål än långa förklaringar.', '1177_KOGNITIVT_STOD', 'Hjälpmedel för kognitivt stöd: planering och kommunikation', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-001', 'En person med demenssjukdom kan behöva tålamod och tid, och det är olämpligt att pressa fram snabba svar.', '1177_DEMENS_NARSTAENDE', 'Närstående till någon med en demenssjukdom: tålamod och tid', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-004', 'Neuropsykiatriska funktionsnedsättningar kan påverka koncentration, impulskontroll, planering, tidsuppfattning eller kommunikation.', '1177_ADHD', 'ADHD: koncentration, impulskontroll, planering och tid', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-004', 'Tydlig struktur, förutsägbarhet och visuellt stöd kan underlätta för vissa personer med autism eller intellektuell funktionsnedsättning.', '1177_AUTISM_IF', 'Autism med intellektuell funktionsnedsättning: struktur och visuellt stöd', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-001', 'Föraren ska inte tolka långsam respons som ovilja, utan ge tid och använda tydlig, respektfull kommunikation.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
    ],
  },
  {
    slug: 'psykisk-neuropsykiatrisk-paverkan',
    title: 'Psykisk och neuropsykiatrisk påverkan',
    prefix: 'MENTAL',
    order: 5,
    visual: null,
    competency_tags: ['KNOW', 'ASSESS'],
    facts: [
      ['D1-HEALTH-018-GA-003', 'Allmänna råden anger ångesttillstånd, tvångstillstånd och psykotiska tillstånd som schizofreni som exempel på psykiska sjukdomar föraren bör känna till.', 'TSFS_2021_119_CONSOLIDATED', 'Allmänna råd till TSFS 2021:119, 3 kap. 18 §', 'general_advice'],
      ['D1-HEALTH-018-GA-004', 'Allmänna råden anger autismspektrumtillstånd, ADHD och Tourettes syndrom som exempel på neuropsykiatriska funktionsnedsättningar föraren bör känna till.', 'TSFS_2021_119_CONSOLIDATED', 'Allmänna råd till TSFS 2021:119, 3 kap. 18 §', 'general_advice'],
      ['D1-HEALTH-018-GA-003', 'En panikattack kan vara mycket skrämmande men går ofta över efter en stund; lugn miljö och lugnt bemötande kan underlätta.', '1177_PANIKSYNDROM', 'Paniksyndrom: panikattack och lugnande åtgärder', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-003', 'Psykos kan innebära att personen tolkar verkligheten annorlunda, till exempel hör röster eller känner sig hotad.', '1177_PSYKOS', 'Psykos och psykossjukdomar: vanliga upplevelser', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-003', 'När en passagerare verkar starkt rädd eller misstänksam ska föraren undvika att argumentera om upplevelsen och i stället hålla fokus på trygghet och nästa steg.', '1177_PSYKOS', 'Psykos och psykossjukdomar: bemötande vid förändrad verklighetsuppfattning', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-004', 'ADHD kan göra det svårare att följa flera instruktioner samtidigt, passa tider eller hålla ordning på moment i resan.', '1177_ADHD', 'ADHD: planering, tid och instruktioner', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-GA-004', 'Vid neuropsykiatrisk påverkan kan korta instruktioner, tydlig turordning och förutsägbarhet göra resan tryggare.', '1177_AUTISM_IF', 'Autism med intellektuell funktionsnedsättning: struktur och tydlighet', 'authoritative_medical_guidance'],
    ],
  },
  {
    slug: 'individuella-behov-trygg-transport',
    title: 'Individuella behov och trygg transport',
    prefix: 'ADAPT',
    order: 6,
    visual: null,
    competency_tags: ['KNOW', 'USE'],
    facts: [
      ['D1-HEALTH-018-001', 'Samma sjukdom eller funktionsnedsättning kan ge olika praktiska behov, därför ska föraren utgå från passagerarens situation.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
      ['D1-HEALTH-018-001', 'Trygg transport kräver att föraren kombinerar respekt, tålamod och tydliga frågor med trafiksäkerhet.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
      ['D1-HEALTH-018-GA-002', 'Vid nedsatt rörelse, balans eller ork kan resan bli tryggare genom extra marginaler vid hämtning, avlämning och i- och urstigning.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 § och allmänna råd', 'pedagogical_application'],
      ['D1-HEALTH-018-GA-001', 'Vid andningsbesvär eller allergikänslighet kan rök, dofter och luftmiljö i eller nära bilen påverka resan.', '1177_ASTMA', 'Astma: rök, dofter och luft kan förvärra besvär', 'authoritative_medical_guidance'],
      ['D1-HEALTH-018-001', 'Om passageraren har stödperson, ledsagare eller anhörig med ska föraren fortfarande bekräfta passagerarens egna önskemål när det är möjligt.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
      ['D1-HEALTH-018-001', 'Föraren ska hålla medicinska detaljer privata och bara dela information som behövs för uppdragets säkerhet eller hjälpbehov.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
      ['D1-HEALTH-018-001', 'När resan inte längre kan genomföras tryggt ska föraren avbryta på en säker plats och tillkalla rätt hjälp enligt situationen.', 'TSFS_2021_119_CONSOLIDATED', 'TSFS 2021:119, 3 kap. 18 §', 'pedagogical_application'],
    ],
  },
];

const sources = source_catalog.map((source) => ({
  source_id: source.source_key,
  source_title: source.source_title,
  authority: source.authority,
  url: source.url,
  current_validity: source.legal_reference,
}));

const facts = [];
for (const topic of topics) {
  topic.facts.forEach(([requirement_key, text, source_id, exact_reference, authority_status], index) => {
    const source = sources.find((candidate) => candidate.source_id === source_id);
    facts.push({
      stable_key: `D1-HEALTH-${topic.prefix}-FACT-${String(index + 1).padStart(3, '0')}`,
      topic_id: `topic_d1_health_${topic.slug}`,
      requirement_key,
      text,
      fact_text: text,
      source_id,
      source_title: source.source_title,
      authority: source.authority,
      exact_reference,
      verification_status: 'verified',
      authority_status,
      legal_or_guidance_status: authority_status === 'binding_rule' ? 'binding_rule' : authority_status === 'general_advice' ? 'general_advice' : 'guidance_or_application',
      medical_scope: 'practical_transport_awareness',
    });
  });
}

for (const visual of visuals) {
  visual.fact_keys = facts.filter((fact) => visual.requirement_keys.includes(fact.requirement_key)).slice(0, 3).map((fact) => fact.stable_key);
}

const pedagogical_topics = topics.map((topic) => ({
  topic_id: `topic_d1_health_${topic.slug}`,
  title: topic.title,
  order: topic.order,
  official_curriculum_category: false,
  requirement_keys: [...new Set(topic.facts.map((fact) => fact[0]))],
  source_keys: [...new Set(topic.facts.map((fact) => fact[2]))],
  visual_asset_ids: topic.visual ? [topic.visual] : [],
  competency_tags: topic.competency_tags,
  status: 'published',
  notes: 'Pedagogical grouping derived from TSFS 2021:119, 3 kap. 18 § and supporting 1177 guidance.',
}));

function sourceReferencesFor(topicFacts) {
  const grouped = new Map();
  for (const fact of topicFacts) {
    if (!grouped.has(fact.source_id)) grouped.set(fact.source_id, new Set());
    grouped.get(fact.source_id).add(fact.exact_reference);
  }
  return [...grouped.entries()].map(([source_id, refs]) => ({ source_id, exact_references: [...refs] }));
}

const lessonBlocks = {
  ROLE: [
    ['heading', 'Föraren ska känna till, inte fastställa tillstånd'],
    ['paragraph', 'I det här ämnet handlar kunskapen om trygg transport. Du behöver förstå vilka praktiska behov som kan uppstå, men du ska inte avgöra vilket tillstånd en passagerare har.'],
    ['bullet_list', ['Fråga vad passageraren vill ha hjälp med.', 'Ge tid för svar och bekräfta nästa steg.', 'Dela bara information som behövs för uppdragets säkerhet.']],
    ['example', 'En passagerare verkar osäker på adressen. Ett bra svar är att lugnt kontrollera bokningen, läsa upp adressen kort och fråga om den stämmer.'],
    ['checkpoint', 'Kan du skilja mellan praktisk assistans och att försöka fastställa passagerarens tillstånd?'],
  ],
  URGENT: [
    ['heading', 'När resan behöver pausas eller avbrytas'],
    ['paragraph', 'Vissa förändringar under resan kan kräva snabb hjälp. Föraren ska då tänka säker plats, lugn kommunikation och rätt hjälp, inte fortsätta som om inget hänt.'],
    ['bullet_list', ['Misstänkt stroke: ring 112 direkt.', 'Krampanfall: skydda från skada, ta tiden och stoppa inget i munnen.', 'Mycket svår andning eller snabb allergisk försämring: prioritera akut hjälp.']],
    ['warning', 'Fortsätt inte köra när passagerarens tillstånd gör resan osäker. Stanna säkert innan du agerar.'],
    ['checkpoint', 'Vet du när 112 och säker stoppplats är viktigare än att hinna till destinationen?'],
  ],
  MOBILITY: [
    ['heading', 'Rörelse, balans och ork påverkar resans praktiska delar'],
    ['paragraph', 'Parkinsons sjukdom, MS, CP, stroke och reumatiska sjukdomar nämns i allmänna råden. För taxi betyder det framför allt att i- och urstigning, gångsträcka, tempo och hjälpmedel kan behöva anpassas.'],
    ['bullet_list', ['Parkera så stabilt och nära som möjligt utan att skapa trafikfara.', 'Fråga innan du tar tag i personen eller hjälpmedlet.', 'Ge extra tid och stressa inte vid dörren.']],
    ['example', 'En passagerare med rollator rör sig långsamt. Du öppnar dörren, frågar hur personen vill göra och väntar tills passageraren är redo.'],
    ['checkpoint', 'Kan du välja stöd som gör i- och urstigning tryggare utan att ta över?'],
  ],
  COG: [
    ['heading', 'Korta besked hjälper när minne eller orientering påverkas'],
    ['paragraph', 'Kognitiva svårigheter kan påverka minne, koncentration, orientering och planering. Föraren kan ofta göra resan tryggare genom tydlig struktur.'],
    ['bullet_list', ['Ge en instruktion i taget.', 'Bekräfta adress och avlämningsplats kort.', 'Använd lugnt tempo och ge tid för svar.']],
    ['info', 'Visuellt stöd kan vara så enkelt som att visa adressen i bokningen eller skriva ett kort meddelande.'],
    ['checkpoint', 'Kan du göra resan tydlig utan att tala ned till passageraren?'],
  ],
  MENTAL: [
    ['heading', 'Lugn och förutsägbarhet vid stark oro'],
    ['paragraph', 'Ångest, psykotiska tillstånd och neuropsykiatriska funktionsnedsättningar anges i allmänna råden. Föraren behöver kunna möta oro, misstänksamhet eller svårigheter med instruktioner på ett tryggt sätt.'],
    ['bullet_list', ['Undvik att argumentera om passagerarens upplevelse.', 'Håll röst och ordval lugna.', 'Beskriv nästa praktiska steg tydligt.']],
    ['example', 'En passagerare blir rädd och vill veta var bilen är. Du stannar om det behövs, förklarar lugnt var ni är och frågar om personen vill fortsätta eller kontakta någon.'],
    ['checkpoint', 'Kan du minska stress i situationen utan att diskutera om passageraren har rätt eller fel?'],
  ],
  ADAPT: [
    ['heading', 'Utgå från individen'],
    ['paragraph', 'Samma tillstånd kan påverka två personer på helt olika sätt. Därför ska föraren inte använda färdiga antaganden, utan anpassa efter personen, resan och säkerheten.'],
    ['bullet_list', ['Bekräfta passagerarens egna önskemål även när en ledsagare finns med.', 'Tänk på luftmiljö vid astma eller allergikänslighet.', 'Avbryt på säker plats om resan inte längre kan genomföras tryggt.']],
    ['info', 'Bra assistans är ofta enkel: tid, tydliga frågor, respekt och rätt hjälp när läget kräver det.'],
    ['checkpoint', 'Kan du välja individuellt stöd utan att förenkla bort säkerheten?'],
  ],
};

const lessons = topics.map((topic) => {
  const topicFacts = facts.filter((fact) => fact.topic_id === `topic_d1_health_${topic.slug}`);
  return {
    stable_key: `D1-HEALTH-${topic.prefix}-LESSON-001`,
    topic_id: `topic_d1_health_${topic.slug}`,
    title: topic.title,
    requirement_keys: [...new Set(topicFacts.map((fact) => fact.requirement_key))],
    fact_keys: topicFacts.map((fact) => fact.stable_key),
    source_references: sourceReferencesFor(topicFacts),
    estimated_study_time_minutes: 5,
    mobile_first: true,
    status: 'published',
    visual_metadata: topic.visual
      ? {
          requires_image: true,
          visual_asset_id: topic.visual,
          visual_correctness_depends_on_asset: false,
        }
      : undefined,
    content_blocks: lessonBlocks[topic.prefix].map(([type, value], index) => ({
      type,
      ...(Array.isArray(value) ? { items: value } : { text: value }),
      fact_keys: topicFacts.slice(Math.min(index, topicFacts.length - 1), Math.min(index + 2, topicFacts.length)).map((fact) => fact.stable_key),
    })),
  };
});

const questionSeeds = [
  ['ROLE', 'En kund berättar att hen ibland behöver extra tid för att förstå instruktioner. Vad är bäst?', 'Fråga lugnt vilken hjälp kunden vill ha och bekräfta nästa steg.', 'Försöka avgöra vilket tillstånd kunden har innan resan startar.', 'Ge många instruktioner samtidigt för att spara tid.', 'Vända dig bara till en anhörig även om kunden själv svarar.'],
  ['ROLE', 'Du märker att en passagerare verkar osäker på vart resan ska gå. Vad bör du göra?', 'Kontrollera bokningen och bekräfta adressen kort och respektfullt.', 'Fortsätta köra tills passageraren säger stopp.', 'Fråga andra kunder i kön vad de tror.', 'Kommentera högt att passageraren verkar förvirrad.'],
  ['ROLE', 'Vilken beskrivning passar bäst förarens roll i detta ämne?', 'Att känna igen praktiska behov och skapa trygg transport.', 'Att fastställa vilket sjukdomstillstånd passageraren har.', 'Att ge medicinska råd om läkemedel.', 'Att välja bort alla resor där kunden verkar osäker.'],
  ['ROLE', 'En ledsagare svarar snabbt åt passageraren, men passageraren verkar vilja säga något. Hur agerar du?', 'Ge passageraren tid och fråga hur personen vill kommunicera.', 'Tala bara med ledsagaren eftersom det går snabbast.', 'Avbryt passageraren för att hålla tidtabellen.', 'Be ledsagaren bestämma alla detaljer utan kontroll.'],
  ['ROLE', 'En passagerare berättar privat om sin sjukdom under färden. Vad är korrekt?', 'Hantera uppgiften diskret och använd den bara om den behövs för trygg hjälp.', 'Berätta för nästa kund för att förklara försening.', 'Skriva upp uppgiften för framtida körningar utan skäl.', 'Diskutera uppgiften med kollegor som allmän information.'],
  ['ROLE', 'En passagerare svarar långsamt när du frågar om hjälp behövs. Vad visar god kunskap?', 'Vänta in svaret och ge tid utan att pressa.', 'Tolka tystnad som att ingen hjälp behövs.', 'Höja rösten direkt för att skynda på.', 'Ta tag i passageraren utan att fråga.'],
  ['ROLE', 'Varför är korta, tydliga frågor viktiga vid oklara behov?', 'De gör nästa steg begripligt utan att föraren behöver tolka tillståndet.', 'De gör att föraren kan slippa fråga igen.', 'De ersätter behovet av passagerarens samtycke.', 'De gör medicinsk bedömning möjlig i bilen.'],

  ['URGENT', 'Under färden får en passagerare plötsligt svårt att tala och ena sidan av ansiktet hänger. Vad är bäst?', 'Stanna säkert och ring 112 direkt.', 'Köra klart resan eftersom det kan gå över.', 'Be passageraren vila och ringa senare.', 'Söka information på telefonen medan du kör.'],
  ['URGENT', 'En passagerare får ett krampanfall i bilen. Vad ska du undvika?', 'Att stoppa något i passagerarens mun.', 'Att skydda personen från hårda föremål.', 'Att ta tiden på anfallet.', 'Att ringa 112 vid långvarigt anfall.'],
  ['URGENT', 'En person med astmabesvär säger att stark parfym i bilen gör andningen sämre. Vad är klokast?', 'Ventilera om möjligt och minska doftpåverkan utan att ifrågasätta personen.', 'Säga att doften inte kan påverka resan.', 'Be personen andas mindre djupt och fortsätta.', 'Spraya mer doft för att dölja lukten.'],
  ['URGENT', 'En passagerare blir dåsig och förvirrad och säger att hen har diabetes. Vad är lämpligt om personen kan äta eller dricka?', 'Hjälpa personen att få något som höjer blodsockret och tillkalla hjälp vid behov.', 'Fortsätta resan utan paus för att inte skapa oro.', 'Be personen själv lösa det efter ankomst.', 'Ge råd om insulinmängd.'],
  ['URGENT', 'Ett krampanfall fortsätter i fem minuter. Vad är rätt prioritering?', 'Ring 112.', 'Vänta tills resan är framme.', 'Håll fast armar och ben hårt.', 'Lägg något i munnen så personen inte biter sig.'],
  ['URGENT', 'En passagerare får snabbt svullnad och andningspåverkan efter matkontakt. Hur ska du tänka?', 'Stanna säkert och sök akut hjälp.', 'Köra vidare om destinationen är nära.', 'Fråga andra passagerare vad orsaken är.', 'Be personen sova tills besvären minskar.'],
  ['URGENT', 'Vilken situation gör det mest motiverat att avbryta resan för hjälp?', 'Passageraren får plötsliga neurologiska tecken eller kraftig andningspåverkan.', 'Passageraren frågar om annan musik.', 'Passageraren vill kontrollera kvittot.', 'Passageraren ber om tystnad i bilen.'],

  ['MOBILITY', 'En passagerare med Parkinson rör sig mycket långsamt vid bilen. Vad är bäst?', 'Ge extra tid och fråga vilken hjälp som önskas.', 'Dra snabbt in personen i bilen för att spara tid.', 'Säga att långsam rörelse stoppar upp trafiken.', 'Lämna dörren stängd tills passageraren skyndar sig.'],
  ['MOBILITY', 'En passagerare med MS säger att orken är låg och vill bli avsläppt nära entrén. Vad bör du göra?', 'Välja en säker och så nära avlämningsplats som möjligt.', 'Stanna långt bort för att undvika omväg.', 'Förklara att trötthet inte påverkar taxiresan.', 'Be passageraren gå sista biten utan diskussion.'],
  ['MOBILITY', 'En passagerare använder rollator. Vad är rätt sätt att hjälpa?', 'Fråga hur hjälpmedlet ska hanteras innan du lyfter eller flyttar det.', 'Fälla ihop hjälpmedlet utan att fråga.', 'Lägga hjälpmedlet där det riskerar att skadas.', 'Be passageraren lämna hjälpmedlet kvar.'],
  ['MOBILITY', 'Varför behöver föraren förstå att rörelseförmåga kan variera?', 'För att anpassa tempo, parkering och hjälp efter situationen.', 'För att kunna rangordna passagerare efter behov.', 'För att slippa fråga passageraren.', 'För att själv bestämma hur kroppen fungerar.'],
  ['MOBILITY', 'En passagerare med CP talar otydligt men visar tydligt med handen hur hen vill sitta. Vad gör du?', 'Bekräftar önskemålet och frågar lugnt om något mer behövs.', 'Antar att passageraren inte kan bestämma själv.', 'Pratar bara med nästa person i kön.', 'Ignorerar gesten eftersom talet är otydligt.'],
  ['MOBILITY', 'Efter stroke kan en passagerare behöva hjälp med både tal och balans. Vilket svar är bäst?', 'Anpassa stödet efter det personen visar eller säger just då.', 'Utgå från att alla efter stroke behöver samma hjälp.', 'Fokusera bara på talet och bortse från balansen.', 'Kräva att personen går snabbt för att visa att resan fungerar.'],
  ['MOBILITY', 'Vilket val minskar risken vid i- och urstigning?', 'Stanna stabilt och ge passageraren tid innan rörelse påbörjas.', 'Stanna där dörren öppnas rakt ut i trafik.', 'Rusa momentet så bilen snabbt kan lämna platsen.', 'Lyfta personen utan föregående fråga.'],

  ['COG', 'En passagerare tappar bort sig i vilken entré som är rätt. Vad hjälper mest?', 'Visa eller läs upp adressen och ta ett steg i taget.', 'Ge en lång förklaring om hela området.', 'Bli irriterad och be kunden bestämma snabbare.', 'Köra till en annan adress utan bekräftelse.'],
  ['COG', 'Varför kan skriftlig eller visuell bekräftelse vara användbar?', 'Den kan stödja minne, planering och orientering.', 'Den gör att föraren slipper prata respektfullt.', 'Den ersätter alla säkerhetskontroller.', 'Den visar att passageraren inte får välja själv.'],
  ['COG', 'En person med demenssjukdom tar tid på sig att svara. Vad är lämpligt?', 'Ge tålamod, vänta in svaret och undvik stress.', 'Pressa fram ett snabbt beslut.', 'Argumentera om varför personen minns fel.', 'Avsluta resan direkt utan att fråga.'],
  ['COG', 'En passagerare blir osäker när du ger flera instruktioner samtidigt. Vad ändrar du?', 'Dela upp informationen och ge en sak i taget.', 'Upprepa allt snabbare.', 'Sluta informera helt.', 'Be passageraren skynda sig.'],
  ['COG', 'Vilken praktisk svårighet kan kognitiv påverkan skapa under en taxiresa?', 'Svårt att orientera sig eller planera nästa steg.', 'Automatiskt behov av fysisk lyftassistans.', 'Oförmåga att betala i alla situationer.', 'Alltid fullständig tystnad under resan.'],
  ['COG', 'En bokning innehåller särskild avlämningsinformation. Passageraren verkar osäker. Vad gör du?', 'Bekräftar informationen kort och frågar om den stämmer.', 'Hoppar över avlämningsinformationen.', 'Låter taxametern avgöra platsen.', 'Vägrar avlämning nära målet.'],
  ['COG', 'Vilket bemötande passar bäst när någon har svårt att hitta ord?', 'Lyssna, ge tid och använd korta kontrollfrågor.', 'Fylla i alla svar utan kontroll.', 'Höja tempot i samtalet.', 'Kommentera att personen pratar långsamt.'],

  ['MENTAL', 'En passagerare får stark panik och vill att bilen stannar en stund. Vad är bäst?', 'Stanna säkert om möjligt, håll dig lugn och fråga om nästa steg.', 'Säga att panik aldrig är farligt och fortsätta.', 'Argumentera om att personen överdriver.', 'Låsa dörrarna tills resan är klar.'],
  ['MENTAL', 'En passagerare verkar rädd och säger att någon följer efter bilen. Vad bör föraren undvika?', 'Att argumentera hårt om att upplevelsen är fel.', 'Att hålla rösten lugn.', 'Att stanna säkert vid behov.', 'Att beskriva nästa praktiska steg.'],
  ['MENTAL', 'En kund med ADHD tappar tråden när du förklarar flera moment. Vad är bäst?', 'Ge korta instruktioner i tydlig ordning.', 'Lägga till fler detaljer samtidigt.', 'Bli tyst och låta kunden gissa.', 'Säga att kunden måste koncentrera sig bättre.'],
  ['MENTAL', 'Varför är förutsägbarhet viktig för vissa neuropsykiatriska behov?', 'Den kan minska stress och göra resans moment tydligare.', 'Den gör att alla kunder ska behandlas exakt lika.', 'Den ersätter trafiksäkerheten.', 'Den låter föraren bortse från kundens önskemål.'],
  ['MENTAL', 'En passagerare upprepar samma fråga många gånger. Vad är lämpligt?', 'Svara kort och konsekvent utan att håna eller stressa.', 'Säga att frågan redan är besvarad och vägra mer samtal.', 'Byta destination utan att informera.', 'Be passageraren gå ur direkt.'],
  ['MENTAL', 'Vilket svar är bäst om passageraren blir misstänksam mot dig?', 'Håll fokus på trygghet, destination och valbara nästa steg.', 'Försök vinna en diskussion om upplevelsen.', 'Skämta om passagerarens oro.', 'Fortsätt köra fortare så resan tar slut.'],
  ['MENTAL', 'Vad är viktigast vid psykisk oro i bilen?', 'Lugn kommunikation och säker hantering av situationen.', 'Att sätta en etikett på tillståndet.', 'Att övertyga passageraren om att allt är inbillat.', 'Att ignorera alla önskemål tills resan är slut.'],

  ['ADAPT', 'Två passagerare har samma nämnda funktionsnedsättning men ber om olika hjälp. Vad visar rätt förståelse?', 'Behoven är individuella, så föraren frågar och anpassar efter personen.', 'Samma tillstånd betyder alltid samma hjälp.', 'Den ena passageraren måste ha fel.', 'Föraren ska välja standardhjälp utan fråga.'],
  ['ADAPT', 'En passagerare med allergikänslighet ber dig undvika doftspray i bilen. Vad är rimligt?', 'Respektera önskemålet och minska onödig doftpåverkan.', 'Använda mer spray för att bilen ska kännas fräsch.', 'Säga att allergi inte gäller i taxi.', 'Vägra resan utan att bedöma situationen.'],
  ['ADAPT', 'En anhörig följer med, men passageraren själv kan svara på frågor. Vad bör du göra?', 'Bekräfta passagerarens egna önskemål när det är möjligt.', 'Endast fråga anhörig om allt.', 'Bortse från båda och bestäm själv.', 'Be anhörig lämna bilen direkt.'],
  ['ADAPT', 'Vilket uttryck beskriver bäst trygg assistans?', 'Tid, respekt, tydliga frågor och rätt hjälp när situationen kräver det.', 'Snabba antaganden och samma rutiner för alla.', 'Medicinska råd under färden.', 'Att undvika kontakt med passageraren.'],
  ['ADAPT', 'En passagerare börjar må sämre och resan känns inte trygg att fortsätta. Vad är bäst?', 'Avbryt på säker plats och tillkalla hjälp enligt läget.', 'Köra snabbare till destinationen oavsett läge.', 'Säga åt passageraren att vänta tyst.', 'Fortsätta för att inte påverka körschemat.'],
  ['ADAPT', 'Varför ska föraren undvika antaganden om funktionsnedsättning?', 'För att praktiska behov varierar och passageraren ofta själv vet vilket stöd som behövs.', 'För att alla hjälpbehov är omöjliga att hantera.', 'För att frågor alltid gör situationen sämre.', 'För att ledsagare alltid ska fatta alla beslut.'],
  ['ADAPT', 'En passagerare vill ha hjälp till dörren men säger att väskan ska bäras på ett särskilt sätt. Vad gör du?', 'Följer önskemålet om det kan göras säkert.', 'Bär väskan på ditt vanliga sätt oavsett instruktion.', 'Säger att kunden inte får styra hjälpens utförande.', 'Lämnar väskan vid bilen.'],
];

const lessonByPrefix = new Map(topics.map((topic) => [topic.prefix, lessons.find((lesson) => lesson.topic_id === `topic_d1_health_${topic.slug}`)]));
const factsByPrefix = new Map(topics.map((topic) => [topic.prefix, facts.filter((fact) => fact.topic_id === `topic_d1_health_${topic.slug}`)]));
const topicByPrefix = new Map(topics.map((topic) => [topic.prefix, topic]));

const questions = questionSeeds.map(([prefix, prompt, correct, wrong1, wrong2, wrong3], index) => {
  const lesson = lessonByPrefix.get(prefix);
  const topicFacts = factsByPrefix.get(prefix);
  const usedFacts = topicFacts.slice(index % Math.max(1, topicFacts.length - 1), (index % Math.max(1, topicFacts.length - 1)) + 2);
  const finalFacts = usedFacts.length ? usedFacts : topicFacts.slice(0, 1);
  const topic = topicByPrefix.get(prefix);
  return {
    stable_key: `D1-HEALTH-${prefix}-Q-${String((index % 7) + 1).padStart(3, '0')}`,
    version: 1,
    topic_id: lesson.topic_id,
    lesson_key: lesson.stable_key,
    requirement_keys: [...new Set(finalFacts.map((fact) => fact.requirement_key))],
    fact_keys: finalFacts.map((fact) => fact.stable_key),
    question_type: index % 7 === 2 ? 'single_choice' : 'scenario',
    competency_tags: topic.competency_tags,
    difficulty: index % 7 > 4 ? 'medium' : 'easy',
    prompt,
    answer_choices: [
      { id: 'A', text: correct },
      { id: 'B', text: wrong1 },
      { id: 'C', text: wrong2 },
      { id: 'D', text: wrong3 },
    ],
    correct_answer_id: 'A',
    explanation: `Rätt: ${correct} Föraren ska använda kunskap om sjukdomar och funktionsnedsättningar för trygg praktisk assistans, med stöd i ${finalFacts.map((fact) => fact.exact_reference).join(' och ')}.`,
    source_references: finalFacts.map((fact) => ({ source_id: fact.source_id, exact_reference: fact.exact_reference })),
    medical_scope: 'practical_transport_awareness',
    diagnostic_style: false,
    status: 'published',
    visual_metadata: topic.visual
      ? {
          requires_image: true,
          visual_asset_id: topic.visual,
          visual_correctness_depends_on_asset: false,
        }
      : undefined,
    visual_asset_id: topic.visual ?? undefined,
    visual_correctness_depends_on_asset: topic.visual ? false : undefined,
  };
});

const topic_checkpoints = topics.map((topic) => ({
  stable_key: `D1-HEALTH-${topic.prefix}-CHECKPOINT-001`,
  title: `${topic.title} - checkpoint`,
  topic: `topic_d1_health_${topic.slug}`,
  question_count: 5,
  pass_threshold: 0.8,
  status: 'published',
}));

const subject_checkpoint = {
  stable_key: 'D1-HEALTH-SUBJECT-CHECKPOINT-001',
  title: 'Sjukdomar och funktionsnedsättningar - ämnescheckpoint',
  subject: 'D1_HEALTH_DISABILITIES',
  question_count: 18,
  pass_threshold: 0.8,
  status: 'published',
};

const metadata = {
  subject: 'D1_HEALTH_DISABILITIES',
  title: 'Sjukdomar och funktionsnedsättningar',
  verified_at: verifiedAt,
  reviewed_at: verifiedAt,
  status: 'published',
  requirement_count: 5,
  architecture: 'existing_vilotider_learning_pipeline',
  exclusions: ['no medical diagnosis', 'no treatment instruction beyond emergency/help boundary', 'no other D1 subjects', 'no full D1 mock exam'],
};

writeFileSync(
  'data/curriculum/d1-health-disabilities-sources.json',
  `${JSON.stringify({ metadata, source_catalog, requirement_source_map, pedagogical_topics }, null, 2)}\n`,
);
writeFileSync(
  `${contentDir}/health-disabilities-facts.json`,
  `${JSON.stringify({ metadata, sources, facts }, null, 2)}\n`,
);
writeFileSync(
  `${contentDir}/health-disabilities-lessons.json`,
  `${JSON.stringify({ metadata, lessons }, null, 2)}\n`,
);
writeFileSync(
  `${contentDir}/health-disabilities-visuals.json`,
  `${JSON.stringify({ metadata, visuals }, null, 2)}\n`,
);
writeFileSync(
  `${questionDir}/health-disabilities-questions.json`,
  `${JSON.stringify({ metadata, topic_checkpoints, subject_checkpoint, questions }, null, 2)}\n`,
);
