const SECTION_HINTS = {
  objectives: ['objective', 'goal', 'business context', 'problem statement', 'vision'],
  modules: ['module', 'component', 'capability', 'feature', 'service'],
  architecture: ['architecture', 'system overview', 'high-level design', 'context diagram', 'data flow', 'sequence'],
  dependencies: ['dependency', 'integration', 'external system', 'third-party', 'api'],
  constraints: ['constraint', 'limitation', 'non-functional', 'nfr', 'sla', 'slo', 'performance', 'security', 'compliance'],
  risks: ['risk', 'issue', 'challenge'],
  assumptions: ['assumption', 'out of scope', 'scope'],
};

export function analyzeHLD(text) {
  const clean = normalize(text || '');
  const lines = clean.split(/\r?\n/);

  const headings = extractHeadings(lines);
  const bullets = extractBullets(lines);

  const result = {
    objectives: pickByHints(headings, bullets, SECTION_HINTS.objectives),
    modules: pickByHints(headings, bullets, SECTION_HINTS.modules),
    architecture: pickByHints(headings, bullets, SECTION_HINTS.architecture),
    dependencies: pickByHints(headings, bullets, SECTION_HINTS.dependencies),
    constraints: pickByHints(headings, bullets, SECTION_HINTS.constraints),
    risks: pickByHints(headings, bullets, SECTION_HINTS.risks),
    assumptions: pickByHints(headings, bullets, SECTION_HINTS.assumptions),
  };

  // If some sections empty, attempt heuristic extraction
  if (result.modules.length === 0) {
    result.modules = inferModulesFromText(clean).slice(0, 10);
  }
  if (result.objectives.length === 0) {
    result.objectives = inferObjectivesFromText(clean).slice(0, 6);
  }

  return result;
}

function normalize(t) {
  return t.replace(/\u0000/g, ' ').replace(/\t/g, '    ');
}

function extractHeadings(lines) {
  const hs = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s*#{1,6}\s+/.test(l)) {
      const text = l.replace(/^\s*#{1,6}\s+/, '').trim();
      const next = collectFollowing(lines, i + 1);
      hs.push({ heading: text, items: next });
    } else if (/^\s*(?:[A-Z][A-Z\s]{3,}|[\w\s]{3,}):\s*$/.test(l)) {
      const text = l.replace(/:\s*$/, '').trim();
      const next = collectFollowing(lines, i + 1);
      hs.push({ heading: text, items: next });
    }
  }
  return hs;
}

function collectFollowing(lines, start) {
  const out = [];
  for (let j = start; j < Math.min(lines.length, start + 30); j++) {
    const ll = lines[j];
    if (/^\s*$/.test(ll)) break;
    if (/^\s*[-*+]\s+/.test(ll)) out.push(ll.replace(/^\s*[-*+]\s+/, '').trim());
    else if (/^\s*\d+[.)]\s+/.test(ll)) out.push(ll.replace(/^\s*\d+[.)]\s+/, '').trim());
    else if (ll.length > 12 && out.length < 5) out.push(ll.trim());
  }
  return out;
}

function extractBullets(lines) {
  return lines
    .filter((l) => /^\s*([-*+]|\d+[.)])\s+/.test(l))
    .map((l) => l.replace(/^\s*([-*+]|\d+[.)])\s+/, '').trim())
    .slice(0, 200);
}

function pickByHints(headings, bullets, hints) {
  const bag = [];
  const h = hints.join('|');
  const rx = new RegExp(`\\b(${h})s?\\b`, 'i');
  for (const sec of headings) {
    if (rx.test(sec.heading)) {
      bag.push(...sec.items);
    }
  }
  if (bag.length === 0) {
    for (const b of bullets) if (rx.test(b)) bag.push(b);
  }
  return uniqueStrings(bag).slice(0, 20);
}

function inferModulesFromText(t) {
  const candidates = [];
  const rx = /(module|component|service|api|engine|gateway|adapter|ui|dashboard|processor)\s+([A-Z][\w-]+|[a-z][\w-]+)/gi;
  let m;
  while ((m = rx.exec(t))) {
    const phrase = `${capitalize(m[2])} ${capitalize(m[1])}`.trim();
    candidates.push(phrase);
  }
  // Also extract from headings like "X Module"
  const rx2 = /^(?:#+\s+)?([\w\s-]{3,})\s+(module|component|service)\b/im;
  const m2 = t.match(rx2);
  if (m2) candidates.push(`${capitalize(m2[1])} ${capitalize(m2[2])}`);
  return uniqueStrings(candidates);
}

function inferObjectivesFromText(t) {
  const lines = t.split(/\r?\n/).filter(Boolean);
  const keyPhrases = ['increase', 'reduce', 'improve', 'enable', 'provide', 'deliver', 'support'];
  const out = [];
  for (const l of lines) {
    for (const k of keyPhrases) {
      if (l.toLowerCase().includes(k)) {
        out.push(l.trim());
        break;
      }
    }
  }
  return uniqueStrings(out);
}

function uniqueStrings(arr) {
  const set = new Set();
  const out = [];
  for (const s of arr.map((x) => x.trim()).filter(Boolean)) {
    const key = s.toLowerCase();
    if (!set.has(key)) {
      set.add(key);
      out.push(s);
    }
  }
  return out;
}

function capitalize(s = '') {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
