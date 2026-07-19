-- Staging D1: remove publicly visible verification placeholder copy.
-- Does NOT modify verificationNotes, rightsNotes, or VerificationItem tables.
--
-- Usage (WSL, after auth):
--   npx wrangler d1 execute orammedia-staging --remote --env staging \
--     --file=scripts/staging-d1-public-placeholder-remediation.sql

-- ─── INSPECT Production (public routes: /projects/[slug]) ────────────
SELECT id, slug, published, workflowStatus,
  CASE
    WHEN instr(lower(coalesce(story,'')), 'needs verification') > 0
      OR instr(lower(coalesce(story,'')), 'requires verification') > 0 THEN 'story'
    WHEN instr(lower(coalesce(productionProcess,'')), 'needs verification') > 0
      OR instr(lower(coalesce(productionProcess,'')), 'requires verification') > 0 THEN 'productionProcess'
    WHEN instr(lower(coalesce(oramRole,'')), 'needs verification') > 0
      OR instr(lower(coalesce(oramRole,'')), 'requires verification') > 0 THEN 'oramRole'
    WHEN instr(lower(coalesce(interestingFactsJson,'')), 'needs verification') > 0
      OR instr(lower(coalesce(interestingFactsJson,'')), 'requires verification') > 0 THEN 'interestingFactsJson'
    WHEN instr(lower(coalesce(yearNote,'')), 'needs verification') > 0
      OR instr(lower(coalesce(yearNote,'')), 'requires verification') > 0 THEN 'yearNote'
    ELSE 'other_public_field'
  END AS matched_field
FROM Production
WHERE
  instr(lower(coalesce(story,'') || coalesce(synopsis,'') || coalesce(productionProcess,'') || coalesce(oramRole,'') || coalesce(owasRole,'') || coalesce(challenge,'') || coalesce(creativeDirection,'') || coalesce(behindTheScenes,'') || coalesce(productionNotes,'') || coalesce(interestingFactsJson,'') || coalesce(yearNote,'')), 'needs verification') > 0
  OR instr(lower(coalesce(story,'') || coalesce(synopsis,'') || coalesce(productionProcess,'') || coalesce(oramRole,'') || coalesce(owasRole,'') || coalesce(challenge,'') || coalesce(creativeDirection,'') || coalesce(behindTheScenes,'') || coalesce(productionNotes,'') || coalesce(interestingFactsJson,'') || coalesce(yearNote,'')), 'requires verification') > 0;

-- ─── INSPECT FilmographyEntry (admin filmography; clean oramInvolvement if polluted) ──
SELECT id, title, year, published,
  CASE
    WHEN instr(lower(coalesce(oramInvolvement,'')), 'verification') > 0 THEN 'oramInvolvement'
    WHEN instr(lower(coalesce(notes,'')), 'verification') > 0 THEN 'notes'
    WHEN instr(lower(coalesce(yearNote,'')), 'verification') > 0 THEN 'yearNote'
    ELSE 'other'
  END AS matched_field
FROM FilmographyEntry
WHERE
  instr(lower(coalesce(oramInvolvement,'') || coalesce(notes,'') || coalesce(yearNote,'')), 'needs verification') > 0
  OR instr(lower(coalesce(oramInvolvement,'') || coalesce(notes,'') || coalesce(yearNote,'')), 'requires verification') > 0;

-- ─── UPDATES: Production public fields only ──────────────────────────
UPDATE Production SET
  story = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    coalesce(story, ''),
    ' Exact episode totals and the full producer/writer credit block remain NEEDS VERIFICATION from MultiChoice records before publishing numeric claims beyond “eight seasons.”', ''),
    ' — treat the exact public-release vs premiere-night distinction as NEEDS VERIFICATION until the premiere programme is published on this site.', ''),
    ' — treat thematic framing beyond the poster as REQUIRES VERIFICATION against the finished film.', ''),
    ' — treat the precise premiere date as REQUIRES VERIFICATION.', ''),
    ' Exact ORAM Media Dynamics contractual production role beyond directing credit remains REQUIRES VERIFICATION from MultiChoice / ORAM contracts.', ''),
  productionProcess = REPLACE(REPLACE(
    coalesce(productionProcess, ''),
    ' Exact episode totals and the full producer/writer credit block remain NEEDS VERIFICATION from MultiChoice records before publishing numeric claims beyond “eight seasons.”', ''),
    ' Exact ORAM Media Dynamics contractual production role beyond directing credit remains REQUIRES VERIFICATION from MultiChoice / ORAM contracts.', ''),
  oramRole = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    coalesce(oramRole, ''),
    'Full ORAM Media Dynamics production-company credit REQUIRES VERIFICATION — classified as Directed by Owas Ray Mwape until contracts confirm otherwise.',
    'Classified as Directed by Owas Ray Mwape.'),
    'ORAM Media Dynamics production-company credit beyond directing — REQUIRES VERIFICATION. Classified as Directed by Owas Ray Mwape.',
    'Classified as Directed by Owas Ray Mwape.'),
    'ORAM Media Dynamics production-company credit beyond directing — REQUIRES VERIFICATION. Do not inflate.',
    'Director credit established in public network materials. Classified as Directed by Owas Ray Mwape.'),
    'ORAM Media Dynamics production-company credit beyond directing — REQUIRES VERIFICATION.',
    'Director credit established in public materials. Classified as Directed by Owas Ray Mwape.'),
    'Full ORAM Media Dynamics production-company credit REQUIRES VERIFICATION.',
    'Classified as Directed by Owas Ray Mwape.'),
    ' Corporate ORAM claim REQUIRES VERIFICATION.', ''),
    ' ORAM Media Dynamics corporate credit REQUIRES VERIFICATION; do not publish as ORAM production.',
    ' Not published as an ORAM Media Dynamics company production.'),
    'Vault poster exists — ORAM company role REQUIRES VERIFICATION. Do not claim as ORAM production yet.',
    'Vault poster on file — not claimed as an ORAM Media Dynamics company production.'),
    'None as production company. Associate-producer claims REQUIRES VERIFICATION.',
    'None as production company.'),
  interestingFactsJson = REPLACE(
    coalesce(interestingFactsJson, ''),
    ' — not printed on poster (REQUIRES VERIFICATION).',
    ' — not printed on the theatrical poster.'),
  yearNote = REPLACE(
    coalesce(yearNote, ''),
    ' — exact premiere REQUIRES VERIFICATION',
    ''),
  updatedAt = datetime('now')
WHERE
  instr(lower(coalesce(story,'') || coalesce(productionProcess,'') || coalesce(oramRole,'') || coalesce(interestingFactsJson,'') || coalesce(yearNote,'')), 'needs verification') > 0
  OR instr(lower(coalesce(story,'') || coalesce(productionProcess,'') || coalesce(oramRole,'') || coalesce(interestingFactsJson,'') || coalesce(yearNote,'')), 'requires verification') > 0;

-- ─── UPDATES: FilmographyEntry public-ish text fields (not verificationNotes) ──
UPDATE FilmographyEntry SET
  oramInvolvement = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    coalesce(oramInvolvement, ''),
    'Full ORAM Media Dynamics production-company credit REQUIRES VERIFICATION.',
    'Classified as Directed by Owas Ray Mwape.'),
    'ORAM Media Dynamics production-company credit beyond directing — REQUIRES VERIFICATION. Do not inflate.',
    'Director credit established in public network materials. Classified as Directed by Owas Ray Mwape.'),
    'ORAM Media Dynamics production-company credit beyond directing — REQUIRES VERIFICATION.',
    'Director credit established in public materials. Classified as Directed by Owas Ray Mwape.'),
    ' Corporate ORAM claim REQUIRES VERIFICATION.', ''),
    'Vault poster exists — ORAM company role REQUIRES VERIFICATION. Do not claim as ORAM production yet.',
    'Vault poster on file — not claimed as an ORAM Media Dynamics company production.'),
    'None as production company. Associate-producer claims REQUIRES VERIFICATION.',
    'None as production company.'),
    ' — commissioning client / scope REQUIRES VERIFICATION',
    ''),
  notes = REPLACE(
    coalesce(notes, ''),
    ' — exact credit REQUIRES VERIFICATION',
    ''),
  yearNote = REPLACE(
    coalesce(yearNote, ''),
    ' — exact premiere REQUIRES VERIFICATION',
    ''),
  updatedAt = datetime('now')
WHERE
  instr(lower(coalesce(oramInvolvement,'') || coalesce(notes,'') || coalesce(yearNote,'')), 'needs verification') > 0
  OR instr(lower(coalesce(oramInvolvement,'') || coalesce(notes,'') || coalesce(yearNote,'')), 'requires verification') > 0;

UPDATE FilmographyEntry SET
  oramInvolvement = 'Vault holds The Lawyer key art — acting credit in public profiles.',
  updatedAt = datetime('now')
WHERE instr(coalesce(oramInvolvement, ''), 'production vs acting REQUIRES VERIFICATION') > 0;

-- ─── VERIFY CLEAN (public fields) ────────────────────────────────────
SELECT 'Production_remaining' AS check_name, COUNT(*) AS n
FROM Production
WHERE
  instr(lower(coalesce(story,'') || coalesce(synopsis,'') || coalesce(productionProcess,'') || coalesce(oramRole,'') || coalesce(owasRole,'') || coalesce(interestingFactsJson,'') || coalesce(yearNote,'') || coalesce(challenge,'') || coalesce(creativeDirection,'') || coalesce(behindTheScenes,'') || coalesce(productionNotes,'')), 'needs verification') > 0
  OR instr(lower(coalesce(story,'') || coalesce(synopsis,'') || coalesce(productionProcess,'') || coalesce(oramRole,'') || coalesce(owasRole,'') || coalesce(interestingFactsJson,'') || coalesce(yearNote,'') || coalesce(challenge,'') || coalesce(creativeDirection,'') || coalesce(behindTheScenes,'') || coalesce(productionNotes,'')), 'requires verification') > 0;

SELECT 'Filmography_remaining' AS check_name, COUNT(*) AS n
FROM FilmographyEntry
WHERE
  instr(lower(coalesce(oramInvolvement,'') || coalesce(notes,'') || coalesce(yearNote,'')), 'needs verification') > 0
  OR instr(lower(coalesce(oramInvolvement,'') || coalesce(notes,'') || coalesce(yearNote,'')), 'requires verification') > 0;

SELECT 'verificationNotes_preserved' AS check_name, COUNT(*) AS rows_with_notes
FROM Production
WHERE verificationNotes IS NOT NULL AND length(verificationNotes) > 0;
