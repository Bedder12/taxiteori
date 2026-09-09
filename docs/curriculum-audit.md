# Curriculum Accuracy Audit

This audit compares `data/curriculum/requirements.json` against TSFS 2021:119 chapter 3 §§ 2-35. It checks semantic mapping, not merely JSON shape.

## Summary

- Requirements before audit: 98
- Requirements after audit: 136
- Requirements changed: 62
- Requirements added: 50
- Requirements removed/merged: 12
- Unmapped active requirements: 0
- Final mapping coverage: 100% of active requirement records

## Corrections Made

- Split `D1-NAV-003-010` into separate restid and ankomsttid requirements.
- Split `D1-SERV-017-002` into separate passenger-need requirements for children, impaired vision, impaired hearing, and impaired mobility.
- Split `D1-WORK-021-001` into the seven numbered factors in 3 kap. 21 §.
- Split grouped vehicle knowledge records for 3 kap. 26-29 §§ into numbered and lettered requirements.
- Split `D2-TAXI-031-004` into carried documents and documents shown at vehicle inspection.
- Split road traffic definition requirements so each named vehicle/weight definition is individually traceable.

## Subject Audit

### Navigering

- Subject key: `D1_NAVIGATION`
- Official weighting: 10 scoring questions
- Extracted active requirements: 12
- Proposed topics: 3
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 2 § | Använda kartor, navigationssystem och andra hjälpmedel för effektiva köruppdrag | Använda navigeringshjälpmedel för att utföra köruppdrag effektivt | D1_NAV_TOOLS | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 1 | Känna till hjälpmedel för färdplanering | Känna till olika hjälpmedel för färdplanering | D1_NAV_TOOLS | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 2 | Ta emot muntlig beskrivning av färdväg | Ta emot en muntlig färdbeskrivning | D1_NAV_ORAL_ROUTE | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 2 | Ställa kompletterande frågor | Ställa kompletterande frågor vid oklar färdbeskrivning | D1_NAV_ORAL_ROUTE | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 2 | Hitta till angiven plats | Hitta till en angiven plats utifrån färdbeskrivning | D1_NAV_ORAL_ROUTE | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 3 a | Hitta och använda information | Hitta och använda navigeringsinformation | D1_NAV_MAP_READING | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 3 b | Lokalisera rätt kartbild | Lokalisera rätt kartbild | D1_NAV_MAP_READING | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 3 b | Avläsa kartbild korrekt | Avläsa en kartbild korrekt | D1_NAV_MAP_READING | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 3 c | Förstå och utnyttja teckenförklaringar | Förstå och använda kartors teckenförklaringar | D1_NAV_MAP_READING | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 3 d | Bedöma avstånd | Bedöma avstånd | D1_NAV_MAP_READING | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 3 e | Beräkna restid | Beräkna restid | D1_NAV_MAP_READING | VERIFIED |
| TSFS 2021:119, 3 kap. 3 § 3 e | Beräkna ankomsttid | Beräkna ankomsttid | D1_NAV_MAP_READING | VERIFIED |

### Körekonomi

- Subject key: `D1_ECO_DRIVING`
- Official weighting: 6 scoring questions
- Extracted active requirements: 4
- Proposed topics: 2
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 4 § | Ha kunskap om hur bästa körekonomin kan uppnås | Förstå hur god körekonomi kan uppnås | D1_ECO_FACTORS | VERIFIED |
| TSFS 2021:119, 3 kap. 5 § 1 | Redogöra för faktorer som främjar ekonomisk körning | Redogöra för faktorer som främjar ekonomisk körning | D1_ECO_FACTORS | VERIFIED |
| TSFS 2021:119, 3 kap. 5 § 2 | Redogöra för andra faktorer som påverkar bränsleförbrukning | Redogöra för faktorer som påverkar bränsleförbrukning | D1_ECO_FACTORS | VERIFIED |
| TSFS 2021:119, 3 kap. 5 § 3 | Bedöma samband mellan förebyggande fordonsunderhåll och god körekonomi | Bedöma hur förebyggande fordonsunderhåll påverkar körekonomin | D1_ECO_MAINTENANCE | VERIFIED |

### Miljö

- Subject key: `D1_ENVIRONMENT`
- Official weighting: 6 scoring questions
- Extracted active requirements: 8
- Proposed topics: 2
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 6 § | Ha kunskap om hur ett fordon påverkar miljön | Förstå fordonets miljöpåverkan | D1_ENV_VEHICLE_IMPACT | VERIFIED |
| TSFS 2021:119, 3 kap. 7 § 1 | Motorer, bränslen och andra vätskor påverkar miljö och hälsa | Känna till miljö- och hälsoeffekter av motorer, bränslen och fordonsvätskor | D1_ENV_VEHICLE_IMPACT | VERIFIED |
| TSFS 2021:119, 3 kap. 7 § 2 | Känna till hur avgasreningssystem fungerar | Känna till avgasreningssystems funktion | D1_ENV_VEHICLE_IMPACT | VERIFIED |
| TSFS 2021:119, 3 kap. 7 § 3 | Redogöra för miljöegenskaper hos olika däcktyper | Redogöra för däcktypers miljöegenskaper | D1_ENV_VEHICLE_IMPACT | VERIFIED |
| TSFS 2021:119, 3 kap. 8 § | Sköta fordon så miljöpåverkan minimeras | Redogöra för miljöanpassad fordonsskötsel | D1_ENV_VEHICLE_IMPACT | VERIFIED |
| TSFS 2021:119, 3 kap. 8 § | Omhänderta restprodukter efter rengöring, service och reparationer | Redogöra för hantering av restprodukter från fordonsskötsel | D1_ENV_VEHICLE_IMPACT | VERIFIED |
| TSFS 2021:119, 3 kap. 9 § 1 | Bedöma effekter av kallstart, varmstart, motorvärmare, tomgång och buller | Bedöma miljöeffekter av start, uppvärmning, tomgång och buller | D1_ENV_DRIVING_STYLE | VERIFIED |
| TSFS 2021:119, 3 kap. 9 § 2 | Hastighet, växelval, acceleration, planerad körning och vägval påverkar bränsleförbrukning och miljö | Bedöma hur körsätt och vägval påverkar bränsleförbrukning och miljö | D1_ENV_DRIVING_STYLE | VERIFIED |

### Säkerhet

- Subject key: `D1_SAFETY`
- Official weighting: 10 scoring questions
- Extracted active requirements: 19
- Proposed topics: 4
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 10 § | Ta ansvar för egen, passagerares och andra medtrafikanters säkerhet | Ta ansvar för säkerheten i samband med färden | D1_SAFE_TRIP | VERIFIED |
| TSFS 2021:119, 3 kap. 10 § | Utföra uppdrag så resan upplevs trygg, säker och bekväm | Utföra köruppdrag på ett tryggt, säkert och bekvämt sätt | D1_SAFE_TRIP | VERIFIED |
| TSFS 2021:119, 3 kap. 11 § 1 | Bedöma agerande vid hot och våld i arbetet | Bedöma lämpligt agerande vid hot och våld | D1_SAFE_EMERGENCIES | VERIFIED |
| TSFS 2021:119, 3 kap. 11 § 2 | Tillämpa första hjälpen och hjärt-lungräddning | Tillämpa första hjälpen och HLR | D1_SAFE_EMERGENCIES | VERIFIED |
| TSFS 2021:119, 3 kap. 11 § 3 | Redogöra för agerande när man kommer först till olycksplats | Redogöra för första åtgärder vid olycksplats | D1_SAFE_EMERGENCIES | VERIFIED |
| TSFS 2021:119, 3 kap. 11 § 4 | Tillämpa kunskaper om risker vid nödsituation på vägen | Tillämpa riskkunskap vid vägnödsituation | D1_SAFE_EMERGENCIES | VERIFIED |
| TSFS 2021:119, 3 kap. 12 § 1 | Bedöma risker vid på- och avstigningsplatser | Bedöma risker vid passagerares på- och avstigning | D1_SAFE_PASSENGERS_LOAD | VERIFIED |
| TSFS 2021:119, 3 kap. 12 § 2 | Använda skyddsutrustning för barn i bil | Använda skyddsutrustning för barn | D1_SAFE_PASSENGERS_LOAD | VERIFIED |
| TSFS 2021:119, 3 kap. 12 § 3 | Redogöra för bestämmelser om bilbälte | Redogöra för bilbältesbestämmelser | D1_SAFE_PASSENGERS_LOAD | VERIFIED |
| TSFS 2021:119, 3 kap. 12 § 4 | Använda bilbälten och hjälpmedel samt sätta fast rullstolar och bårar | Använda bilbälte och säkra hjälpmedel, rullstolar och bårar | D1_SAFE_PASSENGERS_LOAD | VERIFIED |
| TSFS 2021:119, 3 kap. 12 § 5 | Tillämpa bestämmelser om lastsäkring i personbil och lätt lastbil | Tillämpa lastsäkringsbestämmelser | D1_SAFE_PASSENGERS_LOAD | VERIFIED |
| TSFS 2021:119, 3 kap. 13 § 1 | Redogöra för risker som barn utsätts för i trafiken | Redogöra för barns trafikrisker | D1_SAFE_VULNERABLE_ROAD_USERS | VERIFIED |
| TSFS 2021:119, 3 kap. 13 § 2 | Barns mognad påverkar förmåga att hantera trafikrisker | Redogöra för hur barns mognad påverkar riskhantering | D1_SAFE_VULNERABLE_ROAD_USERS | VERIFIED |
| TSFS 2021:119, 3 kap. 13 § 3 | Bedöma uppmärksamhet vid körning i miljöer där barn vistas | Bedöma risker i miljöer där barn vistas | D1_SAFE_VULNERABLE_ROAD_USERS | VERIFIED |
| TSFS 2021:119, 3 kap. 13 § 4 | Bedöma trafikproblem för personer med funktionsnedsättning | Bedöma trafikproblem för personer med funktionsnedsättning | D1_SAFE_VULNERABLE_ROAD_USERS | VERIFIED |
| TSFS 2021:119, 3 kap. 14 § 1 | Samband mellan hastighet, kollisionshastighet och personskador | Bedöma skaderisk kopplad till hastighet och kollisionshastighet | D1_SAFE_VULNERABLE_ROAD_USERS | VERIFIED |
| TSFS 2021:119, 3 kap. 14 § 2 | Skadereducerande effekt hos bilens inre skyddsutrustning | Bedöma skyddseffekt hos inre skyddsutrustning | D1_SAFE_PASSENGERS_LOAD | VERIFIED |
| TSFS 2021:119, 3 kap. 15 § 1 | Känna till Nollvisionens huvudmål och inriktning | Känna till Nollvisionens mål och inriktning | D1_SAFE_VULNERABLE_ROAD_USERS | VERIFIED |
| TSFS 2021:119, 3 kap. 15 § 2 | Vad taxiförare kan göra för Nollvisionens trafiksäkerhetsmål | Känna till hur taxiförare kan bidra till Nollvisionen | D1_SAFE_VULNERABLE_ROAD_USERS | VERIFIED |

### Bemötande

- Subject key: `D1_SERVICE`
- Official weighting: 12 scoring questions
- Extracted active requirements: 14
- Proposed topics: 3
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 16 § 1 | Serviceinriktning och diskretion | Förstå serviceinriktning och vikten av diskretion | D1_SERVICE_COMMUNICATION | VERIFIED |
| TSFS 2021:119, 3 kap. 16 § 2 | Kommunicera med passagerare för behov och önskemål | Kommunicera med passagerare utifrån behov och önskemål | D1_SERVICE_COMMUNICATION | VERIFIED |
| TSFS 2021:119, 3 kap. 16 § 3 | Förstå och respektera olika människors förutsättningar och behov | Respektera olika passagerares förutsättningar och behov | D1_SERVICE_PASSENGER_NEEDS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 1 | Hantera situationer med alkohol- eller drogpåverkade passagerare | Redogöra för lämpligt bemötande av påverkade passagerare | D1_SERVICE_PASSENGER_NEEDS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 2 | Bedöma barns behov och krav på service | Bedöma barns behov som passagerare | D1_SERVICE_PASSENGER_NEEDS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 2 | Bedöma behov hos passagerare med nedsatt syn | Bedöma behov hos passagerare med nedsatt syn | D1_SERVICE_PASSENGER_NEEDS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 2 | Bedöma behov hos passagerare med nedsatt hörsel | Bedöma behov hos passagerare med nedsatt hörsel | D1_SERVICE_PASSENGER_NEEDS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 2 | Bedöma behov hos passagerare med nedsatt rörelseförmåga | Bedöma behov hos passagerare med nedsatt rörelseförmåga | D1_SERVICE_PASSENGER_NEEDS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 3 | Bedöma bemötande när ledsagare medföljer | Bedöma bemötande när passagerare har ledsagare | D1_SERVICE_PASSENGER_NEEDS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 4 | Bedöma vikten av rent fordon | Bedöma vikten av fordonets renhet | D1_SERVICE_PRICE_CLEANLINESS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 5 | Starka dofter, tobaksrök och allergiframkallande ämnen kan påverka passagerare | Bedöma hur dofter, rök och allergener påverkar passagerare | D1_SERVICE_PRICE_CLEANLINESS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 6 | Redogöra för lagstiftningen om rökförbud | Redogöra för rökförbudslagstiftning | D1_SERVICE_PRICE_CLEANLINESS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 7 | Hantera rullstolar, rollatorer och andra hjälpmedel | Hantera passagerares rullstolar, rollatorer och hjälpmedel | D1_SERVICE_PASSENGER_NEEDS | VERIFIED |
| TSFS 2021:119, 3 kap. 17 § 8 | Beräkna ungefärligt pris utifrån fordonets prisinformation | Beräkna ungefärligt respris utifrån prisinformation | D1_SERVICE_PRICE_CLEANLINESS | VERIFIED |

### Sjukdomar och funktionsnedsättningar

- Subject key: `D1_HEALTH_DISABILITIES`
- Official weighting: 8 scoring questions
- Extracted active requirements: 5
- Proposed topics: 1
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 18 § | Känna till vanligt förekommande sjukdomar och fysiska, psykiska och neuropsykiatriska funktionsnedsättningar | Känna till sjukdomar och funktionsnedsättningar för trygg assistans | D1_HEALTH_DISEASES | VERIFIED |
| TSFS 2021:119, allmänna råd till 3 kap. 18 § | Exempel: diabetes, astma, allergi, epilepsi, demens och hjärtbesvär | Känna igen exempel på vanligt förekommande sjukdomar | D1_HEALTH_DISEASES | VERIFIED |
| TSFS 2021:119, allmänna råd till 3 kap. 18 § | Exempel: reumatiska sjukdomar, Parkinsons sjukdom, stroke, cerebral pares och multipel skleros | Känna igen exempel på fysiska funktionsnedsättningar eller associerade tillstånd | D1_HEALTH_DISEASES | VERIFIED |
| TSFS 2021:119, allmänna råd till 3 kap. 18 § | Exempel: ångesttillstånd, tvångstillstånd och psykotiska tillstånd som schizofreni | Känna igen exempel på psykiska funktionsnedsättningar | D1_HEALTH_DISEASES | VERIFIED |
| TSFS 2021:119, allmänna råd till 3 kap. 18 § | Exempel: autismspektrumtillstånd, ADHD och Tourettes syndrom | Känna igen exempel på neuropsykiatriska funktionsnedsättningar | D1_HEALTH_DISEASES | VERIFIED |

### Arbetsmiljö, omdömesförmåga och riskmedvetenhet

- Subject key: `D1_WORK_ENVIRONMENT_RISK`
- Official weighting: 6 scoring questions
- Extracted active requirements: 12
- Proposed topics: 3
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 19 § | Ha kunskap om risker med arbetet | Förstå risker i taxiförarens arbete | D1_WORK_ERGONOMICS | VERIFIED |
| TSFS 2021:119, 3 kap. 20 § 1 | Bedöma risker för belastningsskador | Bedöma risker för belastningsskador | D1_WORK_ERGONOMICS | VERIFIED |
| TSFS 2021:119, 3 kap. 20 § 2 | Rätt teknik och hjälpmedel vid förflyttning och lyft av passagerare och gods | Redogöra för teknik och hjälpmedel vid förflyttning och lyft | D1_WORK_ERGONOMICS | VERIFIED |
| TSFS 2021:119, 3 kap. 20 § 3 | Redogöra för rätt körställning | Redogöra för rätt körställning | D1_WORK_ERGONOMICS | VERIFIED |
| TSFS 2021:119, 3 kap. 21 § 1 | Bedöma hur läkemedel påverkar omdöme, körförmåga och trafiksäkerhet | Bedöma påverkan från läkemedel | D1_WORK_JUDGEMENT | VERIFIED |
| TSFS 2021:119, 3 kap. 21 § 2 | Bedöma hur alkohol och andra droger påverkar omdöme, körförmåga och trafiksäkerhet | Bedöma påverkan från alkohol och andra droger | D1_WORK_JUDGEMENT | VERIFIED |
| TSFS 2021:119, 3 kap. 21 § 3 | Bedöma hur trötthet påverkar omdöme, körförmåga och trafiksäkerhet | Bedöma påverkan från trötthet | D1_WORK_JUDGEMENT | VERIFIED |
| TSFS 2021:119, 3 kap. 21 § 4 | Bedöma hur fysisk kondition påverkar omdöme, körförmåga och trafiksäkerhet | Bedöma påverkan från fysisk kondition | D1_WORK_JUDGEMENT | VERIFIED |
| TSFS 2021:119, 3 kap. 21 § 5 | Bedöma hur psykisk obalans påverkar omdöme, körförmåga och trafiksäkerhet | Bedöma påverkan från psykisk obalans | D1_WORK_JUDGEMENT | VERIFIED |
| TSFS 2021:119, 3 kap. 21 § 6 | Bedöma hur kosthållning påverkar omdöme, körförmåga och trafiksäkerhet | Bedöma påverkan från kosthållning | D1_WORK_JUDGEMENT | VERIFIED |
| TSFS 2021:119, 3 kap. 21 § 7 | Bedöma hur arbets- och vilocykeln påverkar omdöme, körförmåga och trafiksäkerhet | Bedöma påverkan från arbets- och vilocykeln | D1_WORK_JUDGEMENT | VERIFIED |
| TSFS 2021:119, 3 kap. 22 § | Lagstiftning och risker vid mobiltelefon, kommunikationsutrustning, taxameter och navigation under färd | Redogöra för regler och risker vid utrustningsanvändning under färd | D1_WORK_EQUIPMENT_RISK | VERIFIED |

### Fordonskännedom

- Subject key: `D1_VEHICLE_KNOWLEDGE`
- Official weighting: 7 scoring questions
- Extracted active requirements: 35
- Proposed topics: 4
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 23 § | Personbilars och lätta lastbilars uppbyggnad, funktion och fordonslagstiftning | Förstå uppbyggnad, funktion och lagstiftning för personbil och lätt lastbil | D1_VEHICLE_BASICS | VERIFIED |
| TSFS 2021:119, 3 kap. 23 § | Avgöra brister, hur fel kan avhjälpas och vilka åtgärder som bör vidtas | Bedöma fordonsbrister och lämpliga åtgärder | D1_VEHICLE_BASICS | VERIFIED |
| TSFS 2021:119, 3 kap. 24 § 1 | Kontroller enligt fordonslagstiftningen | Redogöra för lagstadgade fordonskontroller | D1_VEHICLE_BASICS | VERIFIED |
| TSFS 2021:119, 3 kap. 24 § 2 | Ta reda på fakta och tekniska uppgifter om fordonet | Hitta nödvändiga tekniska fordonsuppgifter | D1_VEHICLE_BASICS | VERIFIED |
| TSFS 2021:119, 3 kap. 24 § 3 | Aktiva och passiva system och deras funktion | Redogöra för aktiva och passiva fordonsystem | D1_VEHICLE_BASICS | VERIFIED |
| TSFS 2021:119, 3 kap. 24 § 4 | Ã…tgärder när indikeringar varnar eller fel uppstår | Bedöma åtgärder vid varningsindikeringar och fel | D1_VEHICLE_BASICS | VERIFIED |
| TSFS 2021:119, 3 kap. 25 § 1 | Identifiera olika läckage | Identifiera fordonsläckage | D1_VEHICLE_FLUIDS_ELECTRICAL | VERIFIED |
| TSFS 2021:119, 3 kap. 25 § 2 | Risker med olika läckage | Känna till risker med fordonsläckage | D1_VEHICLE_FLUIDS_ELECTRICAL | VERIFIED |
| TSFS 2021:119, 3 kap. 25 § 3 | Kontrollera och fylla på vätskor | Redogöra för kontroll och påfyllning av fordonsvätskor | D1_VEHICLE_FLUIDS_ELECTRICAL | VERIFIED |
| TSFS 2021:119, 3 kap. 26 § 1 | Säkringarnas placering och rätt amperetal | Redogöra för säkringars placering och rätt ampere | D1_VEHICLE_FLUIDS_ELECTRICAL | VERIFIED |
| TSFS 2021:119, 3 kap. 26 § 2 | Risker vid användning av startkablar | Redogöra för risker med startkablar | D1_VEHICLE_FLUIDS_ELECTRICAL | VERIFIED |
| TSFS 2021:119, 3 kap. 26 § 3 | Kontroll och hantering av batteri | Redogöra för kontroll och hantering av batteri | D1_VEHICLE_FLUIDS_ELECTRICAL | VERIFIED |
| TSFS 2021:119, 3 kap. 26 § 4 | Kontroll och byte av glödlampor | Redogöra för kontroll och byte av glödlampor | D1_VEHICLE_FLUIDS_ELECTRICAL | VERIFIED |
| TSFS 2021:119, 3 kap. 26 § 5 | Risker vid laddning av fordon | Redogöra för risker vid fordonsladdning | D1_VEHICLE_FLUIDS_ELECTRICAL | VERIFIED |
| TSFS 2021:119, 3 kap. 27 § 1 | Enklare kontroller av styrinrättningen | Känna till enklare styrningskontroller | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 27 § 2 | Felaktigheter i styrinrättningen | Känna till fel som kan uppstå i styrinrättningen | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 27 § 3 | Följder av felaktig hantering av styrinrättningen | Känna till följder av felaktig styrningshantering | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 27 § 4 | Fram-, bak- och fyrhjulsdrifts påverkan på köregenskaper | Känna till hur drivning påverkar köregenskaper | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 27 § 4 | Last- och viktförhållandens påverkan på köregenskaper | Känna till hur last och vikt påverkar köregenskaper | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 27 § 4 | Väderförhållandens påverkan på köregenskaper | Känna till hur väder påverkar köregenskaper | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 28 § 1 | Moderna bromssystems uppbyggnad och funktion | Redogöra för bromssystems uppbyggnad och funktion | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 28 § 2 | Använda fordonets bromsar på rätt sätt | Använda bromsar korrekt | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 28 § 3 | Felaktigheter som kan uppstå på bromssystem | Redogöra för bromssystemfel | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 28 § 4 | Utföra enklare kontroller av bromssystem | Utföra enklare bromskontroller | D1_VEHICLE_STEERING_BRAKES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 1 | Orsaker till onormalt däckslitage | Känna till orsaker till onormalt däckslitage | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 2 | Risker vid hjulbyte | Känna till risker vid hjulbyte | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 3 | Egenskaper hos nödhjul och punkteringsspray | Känna till nödhjul och punkteringsspray | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 4 | Säkerhetskontroller på hjulen | Redogöra för säkerhetskontroller på hjul | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 5 | Däck, lufttryck och hjulens kondition påverkar köregenskaper och taxameter | Bedöma hur däck och hjul påverkar fordon och taxameter | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 6 | Märkningar på typgodkända däck | Känna till däckmärkningar | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 7 a | Bestämmelser om mönsterdjup | Tillämpa regler om mönsterdjup | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 7 b | Bestämmelser om dubbdäck | Tillämpa regler om dubbdäck | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 7 c | Bestämmelser om vinterdäck | Tillämpa regler om vinterdäck | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 7 d | Bestämmelser om olika fordonskombinationer | Tillämpa regler om fordonskombinationer | D1_VEHICLE_WHEELS_TYRES | VERIFIED |
| TSFS 2021:119, 3 kap. 29 § 7 e | Bestämmelser om hjul- och däckdimensioner | Tillämpa regler om hjul- och däckdimensioner | D1_VEHICLE_WHEELS_TYRES | VERIFIED |

### Taxitrafiklagstiftning

- Subject key: `D2_TAXI_LAW`
- Official weighting: 23 scoring questions
- Extracted active requirements: 14
- Proposed topics: 6
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 30 § | Lagstiftning som reglerar taxitrafik samt sanktioner och påföljder | Ha kunskap om taxitrafiklagstiftning, sanktioner och påföljder | D2_TAXI_LICENSE_RULES | VERIFIED |
| TSFS 2021:119, 3 kap. 31 § 1 | Tillämpa bestämmelser om taxiförarlegitimation | Tillämpa regler om taxiförarlegitimation | D2_TAXI_LICENSE_RULES | VERIFIED |
| TSFS 2021:119, 3 kap. 31 § 2 | Förutsättningar för återkallelse av taxiförarlegitimation | Känna till när taxiförarlegitimation kan återkallas | D2_TAXI_LICENSE_RULES | VERIFIED |
| TSFS 2021:119, 3 kap. 31 § 3 | Definitioner och begrepp i taxitrafiklagstiftningen | Känna till definitioner och begrepp i taxitrafiklagstiftningen | D2_TAXI_LICENSE_RULES | VERIFIED |
| TSFS 2021:119, 3 kap. 31 § 4 | Handlingar som ska medföras under färd | Redogöra för handlingar som ska medföras under färd | D2_TAXI_DOCUMENTS_CONTROLS | VERIFIED |
| TSFS 2021:119, 3 kap. 31 § 4 | Handlingar som ska uppvisas vid fordonskontroll | Bedöma vilka handlingar som ska uppvisas vid fordonskontroll | D2_TAXI_DOCUMENTS_CONTROLS | VERIFIED |
| TSFS 2021:119, 3 kap. 31 § 5 | Bestämmelser om taxitrafiktillstånd | Känna till regler om taxitrafiktillstånd | D2_TAXI_LICENSE_RULES | VERIFIED |
| TSFS 2021:119, 3 kap. 31 § 6 | Tillämpa bestämmelser om taxameterutrustning | Tillämpa regler om taxameterutrustning | D2_TAXI_EQUIPMENT_PRICE | VERIFIED |
| TSFS 2021:119, 3 kap. 31 § 7 | Bestämmelser om särskild utrustning för taxifordon | Känna till regler om särskild utrustning för taxifordon | D2_TAXI_EQUIPMENT_PRICE | VERIFIED |
| TSFS 2021:119, 3 kap. 31 § 8 | Tillämpa bestämmelser om prisinformation | Tillämpa regler om prisinformation | D2_TAXI_EQUIPMENT_PRICE | VERIFIED |
| TSFS 2021:119, 3 kap. 32 § 1 | Redogöra för vilotidsbestämmelserna | Redogöra för vilotidsbestämmelser | D2_TAXI_REST_TIME | VERIFIED |
| TSFS 2021:119, 3 kap. 32 § 2 | Bedöma hur arbetstidslagstiftning påverkar förares och arbetsgivares skyldigheter och ansvar | Bedöma arbetstidslagstiftningens påverkan på förare och arbetsgivare | D2_TAXI_WORK_TIME_RESPONSIBILITY | VERIFIED |
| TSFS 2021:119, 3 kap. 32 § 3 | Beräkna och anteckna dygnsvilan | Beräkna och anteckna dygnsvila | D2_TAXI_REST_TIME | VERIFIED |
| TSFS 2021:119, 3 kap. 33 § | Känna till lagstiftning om skolskjuts och redogöra för innehållet | Känna till och redogöra för skolskjutslagstiftning | D2_TAXI_SCHOOL_TRANSPORT | VERIFIED |

### Trafiklagstiftning

- Subject key: `D2_TRAFFIC_LAW`
- Official weighting: 23 scoring questions
- Extracted active requirements: 13
- Proposed topics: 3
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
| TSFS 2021:119, 3 kap. 34 § | Trafikregler och deras tillämpning för trafiksäker körning | Ha kunskap om trafikregler och deras tillämpning | D2_TRAFFIC_RULES | VERIFIED |
| TSFS 2021:119, 3 kap. 34 § | Vägmärken och andra anordningar för anvisningar till trafiken | Ha kunskap om vägmärken och trafikanordningar | D2_TRAFFIC_SIGNS_DEVICES | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 1 | Tillämpa kunskaper om vägmärkesförordningen (2007:90) | Tillämpa vägmärkesförordningen | D2_TRAFFIC_SIGNS_DEVICES | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 2 | Tillämpa relevanta bestämmelser i trafikförordningen (1998:1276) | Tillämpa relevanta bestämmelser i trafikförordningen | D2_TRAFFIC_RULES | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 3 a | Definiera personbil | Definiera personbil | D2_TRAFFIC_DEFINITIONS | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 3 a | Definiera lätt lastbil | Definiera lätt lastbil | D2_TRAFFIC_DEFINITIONS | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 3 a | Definiera buss | Definiera buss | D2_TRAFFIC_DEFINITIONS | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 3 b | Definiera lätt släpvagn | Definiera lätt släpvagn | D2_TRAFFIC_DEFINITIONS | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 3 b | Definiera tung släpvagn | Definiera tung släpvagn | D2_TRAFFIC_DEFINITIONS | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 3 c | Definiera tjänstevikt | Definiera tjänstevikt | D2_TRAFFIC_DEFINITIONS | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 3 c | Definiera bruttovikt | Definiera bruttovikt | D2_TRAFFIC_DEFINITIONS | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 3 c | Definiera totalvikt | Definiera totalvikt | D2_TRAFFIC_DEFINITIONS | VERIFIED |
| TSFS 2021:119, 3 kap. 35 § 3 c | Definiera maximilast | Definiera maximilast | D2_TRAFFIC_DEFINITIONS | VERIFIED |


## Numerical Completeness Pass

Every section from 3 kap. 2 § through 3 kap. 35 § is represented by at least one active requirement. Numbered and lettered lists that were previously grouped too broadly have been split where the source text clearly expresses separate knowledge targets.

## Ambiguous Cases For Human Review

- Some provisions still combine closely connected action pairs, for example "redogöra för vilotidsbestämmelserna" as one requirement. This appears reasonable because the legal text states it as one numbered item.
- 3 kap. 18 § allmänna råd are represented by category examples rather than one row per disease/condition. This preserves the distinction between binding rule and general advice while avoiding treating examples as separate mandatory provisions.
- Topic assignments are pedagogical product decisions, not official Transportstyrelsen categories. They are reasonable starting points but should be reviewed by a curriculum designer.
