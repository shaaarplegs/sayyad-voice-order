// Runs integration/test-vectors.json against the JavaScript reference implementation.
// Rule checks always run; conversations call the live model when DEEPSEEK_API_KEY is set.
//   npm test                                   rules only
//   DEEPSEEK_API_KEY=sk-... npm test           rules + live conversations
import { readFileSync } from 'node:fs';
import { interpret, evaluateDraft } from '../docs/pipeline.js';
import { fixRialAnd, priceInRials } from '../docs/rules.js';
import { catalog } from '../docs/fish-catalog.js';
import { chatJson } from '../docs/providers.js';
import { PROMPT_DIR, PROMPT_FILES } from './prompt-files.mjs';

const vectors = JSON.parse(readFileSync(new URL('./test-vectors.json', import.meta.url), 'utf8'));
let pass = 0, fail = 0;
function check(name, ok, detail) {
  ok ? pass++ : fail++;
  if (!ok) console.log(`FAIL  ${name}\n      ${detail}`);
}
const near = (a, b) => (a === null || b === null ? a === b : Math.abs(a - b) < 1e-9);

// The .txt prompts must match the source, so the .NET resources never drift.
for (const [name, text] of Object.entries(PROMPT_FILES)) {
  let file = '';
  try { file = readFileSync(new URL(name, PROMPT_DIR), 'utf8'); } catch {}
  check(`prompts/${name} is up to date`, file === text + '\n', 'run: npm run export-prompts');
}

for (const v of vectors.fixRialAnd) check(`fixRialAnd "${v.in}"`, fixRialAnd(v.in) === v.out, `got "${fixRialAnd(v.in)}"`);
for (const v of vectors.priceInRials) check(`priceInRials ${JSON.stringify(v.price)}`, near(priceInRials(v.price), v.rials), `got ${priceInRials(v.price)}`);

for (const v of vectors.resolveFish) {
  const r = catalog.resolveFish(v.name);
  const got = !r ? null : r.candidates ? { candidates: r.candidates.map((f) => f.name) } : { fish: r.fish.name, size: r.size };
  const want = v.candidates ? { candidates: v.candidates } : v.fish ? { fish: v.fish, size: v.size ?? null } : null;
  check(`resolveFish "${v.name}"`, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}`);
}

// Compare only the fields an expectation names.
function matches(result, expect) {
  const problems = [];
  const eq = (key, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) problems.push(`${key}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`); };
  const items = result.items || [];
  for (const [key, want] of Object.entries(expect)) {
    if (key === 'status' || key === 'intent' || key === 'completeCount' || key === 'canUseCompleteOnly' || key === 'type') eq(key, result[key], want);
    else if (key === 'total' || key === 'totalKg') { if (!near(result[key], want)) problems.push(`${key}: got ${result[key]}, want ${want}`); }
    else if (key === 'itemCount') eq(key, items.length, want);
    else if (key === 'fishNames') eq(key, items.map((i) => i.fishName ?? null), want);
    else if (key === 'productIds') eq(key, items.map((i) => i.productId ?? null), want);
    else if (key === 'sizes') eq(key, items.map((i) => i.size ?? null), want);
    else if (key === 'pricesPerKg') { const got = items.map((i) => i.pricePerKg ?? null); if (got.length !== want.length || got.some((g, i) => !near(g, want[i]))) problems.push(`pricesPerKg: got ${JSON.stringify(got)}`); }
    else if (key === 'missing') eq(key, (result.missing || []).map((m) => `${m.index}:${m.field}`), want);
    else if (key === 'missingFields') for (const f of want) { if (!(result.missing || []).some((m) => m.field === f)) problems.push(`missing has no "${f}"`); }
    else if (key === 'candidatesInclude') for (const c of want) { if (!items.some((i) => (i.candidates || []).some((x) => x.en === c))) problems.push(`no candidate "${c}"`); }
    else if (key === 'buyerNameMatches') { if (!new RegExp(want, 'i').test(result.buyerName || '')) problems.push(`buyerName "${result.buyerName}"`); }
    else if (key === 'apiPath') eq(key, result.apiRequest?.path, want);
    else if (key === 'apiBodyKeys') eq(key, result.apiRequest && Object.keys(result.apiRequest.body), want);
    else problems.push(`unknown expectation "${key}"`);
  }
  return problems;
}

for (const v of vectors.evaluateDraft) {
  const problems = matches(evaluateDraft(v.draft), v.expect);
  check(`evaluateDraft: ${v.name}`, !problems.length, problems.join('; '));
}
const rulePass = pass, ruleFail = fail;
console.log(`rules: ${rulePass} passed, ${ruleFail} failed`);

if (!process.env.DEEPSEEK_API_KEY) {
  console.log(`conversations: skipped (${vectors.conversations.length}); set DEEPSEEK_API_KEY to run them against the live model`);
} else {
  const settings = { deepseekKey: process.env.DEEPSEEK_API_KEY, deepseekModel: process.env.DEEPSEEK_MODEL || 'deepseek-flash' };
  const deps = { chatJson: (system, payload) => chatJson(system, payload, settings) };
  for (const c of vectors.conversations) {
    let draft = null;
    for (const [i, turn] of c.turns.entries()) {
      const r = await interpret(turn.say, { role: c.role, draft }, deps);
      const problems = matches(r, turn.expect);
      check(`conversation: ${c.name} [turn ${i + 1}: "${turn.say}"]`, !problems.length, problems.join('; '));
      if (r.status === 'ready' || r.status === 'needs_details') draft = r.draft;
      if (r.status === 'confirm') draft = null;
    }
  }
  console.log(`conversations: ${pass - rulePass} passed, ${fail - ruleFail} failed`);
}
process.exitCode = fail ? 1 : 0;
