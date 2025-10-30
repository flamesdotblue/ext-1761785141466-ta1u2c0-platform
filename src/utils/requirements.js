function makeId(prefix, i, j, k) {
  const parts = [prefix, i + 1, j + 1, typeof k === 'number' ? k + 1 : null].filter((x) => x !== null);
  return parts.join('.');
}

export function buildRequirements(analysis, rawText) {
  const epics = [];

  const baseModules = analysis.modules.length ? analysis.modules : ['Core Platform', 'Identity & Access', 'Payments'];
  const objectives = analysis.objectives.slice(0, 5);

  const epicTitles = deriveEpicTitles(baseModules);
  epicTitles.forEach((et, ei) => {
    const features = deriveFeaturesForEpic(et, analysis);
    const featureObjs = features.map((ft, fi) => ({
      title: ft,
      description: featureDescription(ft, objectives),
      userStories: deriveUserStories(ft, objectives, ei, fi),
    }));

    epics.push({
      title: et,
      description: epicDescription(et, objectives),
      features: featureObjs,
    });
  });

  return { epics };
}

function deriveEpicTitles(modules) {
  const unique = uniqueStrings(modules).slice(0, 3);
  return unique.map((m) => normalizeTitle(m));
}

function deriveFeaturesForEpic(epicTitle, analysis) {
  const seeds = [
    'Authentication',
    'Authorization',
    'Data Ingestion',
    'Reporting & Analytics',
    'Notifications',
    'Audit & Compliance',
  ];
  const byHint = analysis.constraints.some((c) => /performance|latency|sla|slo/i.test(c)) ? ['Performance & Scalability'] : [];
  const byRisk = analysis.risks.some((r) => /security|privacy|breach|fraud/i.test(r)) ? ['Security Hardening'] : [];
  const features = uniqueStrings([epicTitle.split(' - ')[0], ...seeds, ...byHint, ...byRisk]).slice(0, 4);
  return features;
}

function deriveUserStories(feature, objectives, ei, fi) {
  const actorByFeature = pickActor(feature);
  const soThat = objectives[0] || 'deliver measurable business value';
  const templates = [
    { asA: actorByFeature, iWant: `access ${feature.toLowerCase()}`, soThat },
    { asA: actorByFeature, iWant: `view status and logs for ${feature.toLowerCase()}`, soThat: 'I can monitor and troubleshoot effectively' },
    { asA: actorByFeature, iWant: `configure settings for ${feature.toLowerCase()}`, soThat: 'the system aligns with our policies and needs' },
  ];

  return templates.map((t, ti) => ({
    id: `US-${makeId('E', ei, fi, ti)}`,
    ...t,
    acceptance: acceptanceCriteria(feature, t),
  }));
}

function epicDescription(epicTitle, objectives) {
  const obj = objectives[0] ? `Primary objective: ${objectives[0]}.` : 'Organizes related capabilities into a coherent deliverable.';
  return `${epicTitle} — ${obj}`;
}

function featureDescription(feature, objectives) {
  const match = objectives.find((o) => new RegExp(feature.split(' ')[0], 'i').test(o));
  if (match) return `Addresses goal: ${match}`;
  return `Provides ${feature.toLowerCase()} capabilities.`;
}

function acceptanceCriteria(feature, story) {
  const base = [
    `Given access to ${feature.toLowerCase()}, when I perform an allowed action, then the system persists results successfully`,
    'Given invalid input, when I submit, then I receive a descriptive error and no changes are committed',
    'Given concurrent usage, when load increases, then the system maintains acceptable response times',
  ];
  if (/security|auth|compliance/i.test(feature)) {
    base.push('Given policy enforcement, when a restricted action is attempted, then it is denied and logged for audit');
  }
  return base;
}

function pickActor(feature) {
  if (/auth|identity|login|sso/i.test(feature)) return 'End User';
  if (/report|analytics|dashboard/i.test(feature)) return 'Analyst';
  if (/api|integration|ingestion|gateway/i.test(feature)) return 'Integrator';
  if (/admin|config|settings|compliance|audit/i.test(feature)) return 'Administrator';
  return 'User';
}

function normalizeTitle(s) {
  return s.replace(/\s{2,}/g, ' ').replace(/\s*[-:–]\s*/g, ' - ').replace(/\b(module|component|service)\b/ig, '').trim() || 'Core Epic';
}

function uniqueStrings(arr) {
  const set = new Set();
  const out = [];
  for (const s of arr.map((x) => String(x).trim()).filter(Boolean)) {
    const key = s.toLowerCase();
    if (!set.has(key)) {
      set.add(key);
      out.push(s);
    }
  }
  return out;
}
