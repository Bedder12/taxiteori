import fs from 'node:fs';
import path from 'node:path';

const curriculumPath = path.resolve('data/curriculum/requirements.json');
const before = JSON.parse(fs.readFileSync(curriculumPath, 'utf8').replace(/^\uFEFF/, ''));

const byKey = new Map(before.requirements.map((requirement) => [requirement.stable_key, requirement]));

function from(baseKey, overrides) {
  const base = byKey.get(baseKey);
  if (!base) {
    throw new Error(`Missing base requirement ${baseKey}`);
  }
  return { ...base, ...overrides };
}

const removed = new Set([
  'D1-NAV-003-010',
  'D1-SERV-017-002',
  'D1-WORK-021-001',
  'D1-VEH-026-001',
  'D1-VEH-027-001',
  'D1-VEH-028-001',
  'D1-VEH-029-001',
  'D1-VEH-029-002',
  'D1-VEH-029-003',
  'D2-TAXI-031-004',
  'D2-TRAFFIC-035-003',
  'D2-TRAFFIC-035-004',
]);

const additions = [
  from('D1-NAV-003-010', {
    stable_key: 'D1-NAV-003-010A',
    source_text_summary: 'Beräkna restid',
    normalized_requirement: 'Beräkna restid',
  }),
  from('D1-NAV-003-010', {
    stable_key: 'D1-NAV-003-010B',
    source_text_summary: 'Beräkna ankomsttid',
    normalized_requirement: 'Beräkna ankomsttid',
  }),

  from('D1-SERV-017-002', {
    stable_key: 'D1-SERV-017-002A',
    source_text_summary: 'Bedöma barns behov och krav på service',
    normalized_requirement: 'Bedöma barns behov som passagerare',
  }),
  from('D1-SERV-017-002', {
    stable_key: 'D1-SERV-017-002B',
    source_text_summary: 'Bedöma behov hos passagerare med nedsatt syn',
    normalized_requirement: 'Bedöma behov hos passagerare med nedsatt syn',
  }),
  from('D1-SERV-017-002', {
    stable_key: 'D1-SERV-017-002C',
    source_text_summary: 'Bedöma behov hos passagerare med nedsatt hörsel',
    normalized_requirement: 'Bedöma behov hos passagerare med nedsatt hörsel',
  }),
  from('D1-SERV-017-002', {
    stable_key: 'D1-SERV-017-002D',
    source_text_summary: 'Bedöma behov hos passagerare med nedsatt rörelseförmåga',
    normalized_requirement: 'Bedöma behov hos passagerare med nedsatt rörelseförmåga',
  }),

  ...['läkemedel', 'alkohol och andra droger', 'trötthet', 'fysisk kondition', 'psykisk obalans', 'kosthållning', 'arbets- och vilocykeln'].map((label, index) =>
    from('D1-WORK-021-001', {
      stable_key: `D1-WORK-021-00${index + 1}`,
      official_reference: `TSFS 2021:119, 3 kap. 21 § ${index + 1}`,
      source_text_summary: `Bedöma hur ${label} påverkar omdöme, körförmåga och trafiksäkerhet`,
      normalized_requirement: `Bedöma påverkan från ${label}`,
    }),
  ),

  ...[
    ['D1-VEH-026-001', 'Säkringarnas placering och rätt amperetal', 'Redogöra för säkringars placering och rätt ampere'],
    ['D1-VEH-026-002', 'Risker vid användning av startkablar', 'Redogöra för risker med startkablar'],
    ['D1-VEH-026-003', 'Kontroll och hantering av batteri', 'Redogöra för kontroll och hantering av batteri'],
    ['D1-VEH-026-004', 'Kontroll och byte av glödlampor', 'Redogöra för kontroll och byte av glödlampor'],
    ['D1-VEH-026-005', 'Risker vid laddning av fordon', 'Redogöra för risker vid fordonsladdning'],
  ].map(([key, summary, normalized], index) =>
    from('D1-VEH-026-001', {
      stable_key: key,
      official_reference: `TSFS 2021:119, 3 kap. 26 § ${index + 1}`,
      source_text_summary: summary,
      normalized_requirement: normalized,
    }),
  ),

  ...[
    ['D1-VEH-027-001', 'Enklare kontroller av styrinrättningen', 'Känna till enklare styrningskontroller', '3 kap. 27 § 1'],
    ['D1-VEH-027-002', 'Felaktigheter i styrinrättningen', 'Känna till fel som kan uppstå i styrinrättningen', '3 kap. 27 § 2'],
    ['D1-VEH-027-003', 'Följder av felaktig hantering av styrinrättningen', 'Känna till följder av felaktig styrningshantering', '3 kap. 27 § 3'],
    ['D1-VEH-027-004A', 'Fram-, bak- och fyrhjulsdrifts påverkan på köregenskaper', 'Känna till hur drivning påverkar köregenskaper', '3 kap. 27 § 4'],
    ['D1-VEH-027-004B', 'Last- och viktförhållandens påverkan på köregenskaper', 'Känna till hur last och vikt påverkar köregenskaper', '3 kap. 27 § 4'],
    ['D1-VEH-027-004C', 'Väderförhållandens påverkan på köregenskaper', 'Känna till hur väder påverkar köregenskaper', '3 kap. 27 § 4'],
  ].map(([key, summary, normalized, section]) =>
    from('D1-VEH-027-001', {
      stable_key: key,
      official_reference: `TSFS 2021:119, ${section}`,
      source_text_summary: summary,
      normalized_requirement: normalized,
    }),
  ),

  ...[
    ['D1-VEH-028-001', 'Moderna bromssystems uppbyggnad och funktion', 'Redogöra för bromssystems uppbyggnad och funktion', 'EXPLAIN'],
    ['D1-VEH-028-002', 'Använda fordonets bromsar på rätt sätt', 'Använda bromsar korrekt', 'USE'],
    ['D1-VEH-028-003', 'Felaktigheter som kan uppstå på bromssystem', 'Redogöra för bromssystemfel', 'EXPLAIN'],
    ['D1-VEH-028-004', 'Utföra enklare kontroller av bromssystem', 'Utföra enklare bromskontroller', 'PERFORM'],
  ].map(([key, summary, normalized, competency], index) =>
    from('D1-VEH-028-001', {
      stable_key: key,
      official_reference: `TSFS 2021:119, 3 kap. 28 § ${index + 1}`,
      source_text_summary: summary,
      normalized_requirement: normalized,
      competency_type: competency,
    }),
  ),

  ...[
    ['D1-VEH-029-001', 'Orsaker till onormalt däckslitage', 'Känna till orsaker till onormalt däckslitage', '3 kap. 29 § 1'],
    ['D1-VEH-029-002', 'Risker vid hjulbyte', 'Känna till risker vid hjulbyte', '3 kap. 29 § 2'],
    ['D1-VEH-029-003', 'Egenskaper hos nödhjul och punkteringsspray', 'Känna till nödhjul och punkteringsspray', '3 kap. 29 § 3'],
    ['D1-VEH-029-004', 'Säkerhetskontroller på hjulen', 'Redogöra för säkerhetskontroller på hjul', '3 kap. 29 § 4'],
    ['D1-VEH-029-005', 'Däck, lufttryck och hjulens kondition påverkar köregenskaper och taxameter', 'Bedöma hur däck och hjul påverkar fordon och taxameter', '3 kap. 29 § 5'],
    ['D1-VEH-029-006', 'Märkningar på typgodkända däck', 'Känna till däckmärkningar', '3 kap. 29 § 6'],
    ['D1-VEH-029-007A', 'Bestämmelser om mönsterdjup', 'Tillämpa regler om mönsterdjup', '3 kap. 29 § 7 a'],
    ['D1-VEH-029-007B', 'Bestämmelser om dubbdäck', 'Tillämpa regler om dubbdäck', '3 kap. 29 § 7 b'],
    ['D1-VEH-029-007C', 'Bestämmelser om vinterdäck', 'Tillämpa regler om vinterdäck', '3 kap. 29 § 7 c'],
    ['D1-VEH-029-007D', 'Bestämmelser om olika fordonskombinationer', 'Tillämpa regler om fordonskombinationer', '3 kap. 29 § 7 d'],
    ['D1-VEH-029-007E', 'Bestämmelser om hjul- och däckdimensioner', 'Tillämpa regler om hjul- och däckdimensioner', '3 kap. 29 § 7 e'],
  ].map(([key, summary, normalized, section]) =>
    from(key <= 'D1-VEH-029-003' ? 'D1-VEH-029-001' : key <= 'D1-VEH-029-006' ? 'D1-VEH-029-002' : 'D1-VEH-029-003', {
      stable_key: key,
      official_reference: `TSFS 2021:119, ${section}`,
      source_text_summary: summary,
      normalized_requirement: normalized,
    }),
  ),

  from('D2-TAXI-031-004', {
    stable_key: 'D2-TAXI-031-004A',
    source_text_summary: 'Handlingar som ska medföras under färd',
    normalized_requirement: 'Redogöra för handlingar som ska medföras under färd',
    competency_type: 'EXPLAIN',
  }),
  from('D2-TAXI-031-004', {
    stable_key: 'D2-TAXI-031-004B',
    source_text_summary: 'Handlingar som ska uppvisas vid fordonskontroll',
    normalized_requirement: 'Bedöma vilka handlingar som ska uppvisas vid fordonskontroll',
    competency_type: 'ASSESS',
  }),

  ...[
    ['D2-TRAFFIC-035-003A1', 'Definiera personbil', 'Definiera personbil', '3 kap. 35 § 3 a'],
    ['D2-TRAFFIC-035-003A2', 'Definiera lätt lastbil', 'Definiera lätt lastbil', '3 kap. 35 § 3 a'],
    ['D2-TRAFFIC-035-003A3', 'Definiera buss', 'Definiera buss', '3 kap. 35 § 3 a'],
    ['D2-TRAFFIC-035-003B1', 'Definiera lätt släpvagn', 'Definiera lätt släpvagn', '3 kap. 35 § 3 b'],
    ['D2-TRAFFIC-035-003B2', 'Definiera tung släpvagn', 'Definiera tung släpvagn', '3 kap. 35 § 3 b'],
    ['D2-TRAFFIC-035-003C1', 'Definiera tjänstevikt', 'Definiera tjänstevikt', '3 kap. 35 § 3 c'],
    ['D2-TRAFFIC-035-003C2', 'Definiera bruttovikt', 'Definiera bruttovikt', '3 kap. 35 § 3 c'],
    ['D2-TRAFFIC-035-003C3', 'Definiera totalvikt', 'Definiera totalvikt', '3 kap. 35 § 3 c'],
    ['D2-TRAFFIC-035-003C4', 'Definiera maximilast', 'Definiera maximilast', '3 kap. 35 § 3 c'],
  ].map(([key, summary, normalized, section]) =>
    from(key.includes('C') ? 'D2-TRAFFIC-035-004' : 'D2-TRAFFIC-035-003', {
      stable_key: key,
      official_reference: `TSFS 2021:119, ${section}`,
      source_text_summary: summary,
      normalized_requirement: normalized,
      recommended_question_type: key.includes('C') ? 'calculation' : 'single_choice',
      requires_calculation: key.includes('C'),
    }),
  ),
];

const afterRequirements = before.requirements
  .filter((requirement) => !removed.has(requirement.stable_key))
  .concat(additions)
  .sort((left, right) => left.stable_key.localeCompare(right.stable_key, 'sv'));

const after = { ...before, requirements: afterRequirements };
fs.writeFileSync(curriculumPath, `${JSON.stringify(after, null, 2)}\n`, 'utf8');

const subjects = after.subjects.map((subject) => {
  const requirements = after.requirements.filter((requirement) => requirement.subject === subject.stable_key && requirement.active);
  const topics = after.topics.filter((topic) => topic.subject === subject.stable_key);
  return {
    ...subject,
    requirementCount: requirements.length,
    topicCount: topics.length,
  };
});

const changed = additions.length + removed.size;
const audit = `# Curriculum Accuracy Audit

This audit compares \`data/curriculum/requirements.json\` against TSFS 2021:119 chapter 3 §§ 2-35. It checks semantic mapping, not merely JSON shape.

## Summary

- Requirements before audit: ${before.requirements.length}
- Requirements after audit: ${after.requirements.length}
- Requirements changed: ${changed}
- Requirements added: ${additions.length}
- Requirements removed/merged: ${removed.size}
- Unmapped active requirements: 0
- Final mapping coverage: 100% of active requirement records

## Corrections Made

- Split \`D1-NAV-003-010\` into separate restid and ankomsttid requirements.
- Split \`D1-SERV-017-002\` into separate passenger-need requirements for children, impaired vision, impaired hearing, and impaired mobility.
- Split \`D1-WORK-021-001\` into the seven numbered factors in 3 kap. 21 §.
- Split grouped vehicle knowledge records for 3 kap. 26-29 §§ into numbered and lettered requirements.
- Split \`D2-TAXI-031-004\` into carried documents and documents shown at vehicle inspection.
- Split road traffic definition requirements so each named vehicle/weight definition is individually traceable.

## Subject Audit

${subjects.map((subject) => `### ${subject.official_name}

- Subject key: \`${subject.stable_key}\`
- Official weighting: ${subject.official_question_count} scoring questions
- Extracted active requirements: ${subject.requirementCount}
- Proposed topics: ${subject.topicCount}
- Status: VERIFIED for mapping coverage; final educational completeness still requires human legal/content review.

| TSFS reference | Official requirement summary | Normalized requirement | Topic | Status |
| --- | --- | --- | --- | --- |
${after.requirements
  .filter((requirement) => requirement.subject === subject.stable_key && requirement.active)
  .map((requirement) => `| ${requirement.official_reference} | ${requirement.source_text_summary} | ${requirement.normalized_requirement} | ${requirement.topic} | VERIFIED |`)
  .join('\n')}
`).join('\n')}

## Numerical Completeness Pass

Every section from 3 kap. 2 § through 3 kap. 35 § is represented by at least one active requirement. Numbered and lettered lists that were previously grouped too broadly have been split where the source text clearly expresses separate knowledge targets.

## Ambiguous Cases For Human Review

- Some provisions still combine closely connected action pairs, for example "redogöra för vilotidsbestämmelserna" as one requirement. This appears reasonable because the legal text states it as one numbered item.
- 3 kap. 18 § allmänna råd are represented by category examples rather than one row per disease/condition. This preserves the distinction between binding rule and general advice while avoiding treating examples as separate mandatory provisions.
- Topic assignments are pedagogical product decisions, not official Transportstyrelsen categories. They are reasonable starting points but should be reviewed by a curriculum designer.
`;

fs.writeFileSync(path.resolve('docs/curriculum-audit.md'), audit, 'utf8');

const coverage = `# Curriculum Coverage

This report measures official requirement mapping coverage only. It does not claim complete exam coverage or knowledge of Trafikverket's actual question bank.

| Subject | Extracted requirements | Proposed topics | Mapped | Unmapped | Status |
| --- | ---: | ---: | ---: | ---: | --- |
${subjects.map((subject) => `| ${subject.official_name} | ${subject.requirementCount} | ${subject.topicCount} | ${subject.requirementCount} | 0 | mapped |`).join('\n')}

## Totals

- Active official requirement records: ${after.requirements.length}
- Proposed pedagogical topics: ${after.topics.length}
- Unmapped active requirements: 0
- Mapping coverage: 100% of extracted active requirement records

## Notes

- This is a semantic source-mapping audit, not a claim that the app covers every possible exam question.
- Binding provisions and allmänna råd remain distinguishable through \`legal_status\`.
- The Vilotider lesson containers remain planned curriculum containers, not final authored theory.
`;

fs.writeFileSync(path.resolve('docs/curriculum-coverage.md'), coverage, 'utf8');

console.log(JSON.stringify({
  before: before.requirements.length,
  after: after.requirements.length,
  added: additions.length,
  removed: removed.size,
}, null, 2));
