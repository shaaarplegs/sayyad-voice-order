// Orchestrator: transcript + account type + open draft -> intent -> extracted draft -> evaluated result.
// The chat model is injected (deps.chatJson), so the same flow runs in the browser, in Node, or ported to .NET.
import { transcribe, chatJson } from './providers.js';
import { WHISPER_HINT, CLASSIFY_PROMPT, INVOICE_PROMPT, ORDER_PROMPT, renderPrompt } from './prompts.js';
import { catalog as defaultCatalog } from './fish-catalog.js';
import { ALLOWED, fixRialAnd, evaluateDraft as evaluate, completeOnly as keepComplete } from './rules.js';

export { ALLOWED };
export const evaluateDraft = (draft, catalog = defaultCatalog) => evaluate(draft, catalog);
export const completeOnly = (draft, catalog = defaultCatalog) => keepComplete(draft, catalog);

// Understand one transcript in context: the account type and the draft still being completed (if any).
// Returns status 'ready' | 'needs_details' | 'confirm' | 'not_allowed' | 'unrelated'. 'confirm' means the
// speaker approved a complete draft. On 'not_allowed' and 'unrelated' the open draft comes back unchanged.
// deps.chatJson(systemPrompt, payload) calls the chat model and returns its parsed JSON; deps.catalog is optional.
export async function interpret(transcript, { role = 'both', draft = null } = {}, deps, onStep = () => {}) {
  const catalog = deps.catalog || defaultCatalog;
  if (!transcript) return { transcript, intent: 'unrelated', status: 'unrelated', reason: 'Empty transcript.', draft };
  transcript = fixRialAnd(transcript);

  onStep('understanding');
  let { intent, reason } = await deps.chatJson(CLASSIFY_PROMPT, { transcript, openDraft: draft });
  if ((intent === 'continue' || intent === 'confirm') && !draft) intent = 'unrelated';
  if (intent === 'confirm') {
    const evaluation = evaluate(draft, catalog);
    return { transcript, intent, reason, type: draft.type, draft, ...evaluation, status: evaluation.status === 'ready' ? 'confirm' : evaluation.status };
  }
  if (!['create_invoice', 'create_order', 'continue'].includes(intent)) {
    return { transcript, intent: 'unrelated', status: 'unrelated', reason, draft };
  }

  const type = intent === 'continue' ? draft.type : intent === 'create_order' ? 'order' : 'invoice';
  if (!ALLOWED[role].includes(type)) return { transcript, intent, type, status: 'not_allowed', reason, draft };

  onStep('extracting');
  const { type: _type, ...currentDraft } = intent === 'continue' ? draft : {};
  const out = await deps.chatJson(renderPrompt(type === 'order' ? ORDER_PROMPT : INVOICE_PROMPT, catalog.catalogText), {
    transcript,
    currentDraft: intent === 'continue' ? currentDraft : null,
  });
  const next = type === 'order'
    ? { type, items: out.items || [] }
    : { type, buyerName: out.buyerName || null, items: out.items || [] };
  return { transcript, intent, reason, type, draft: next, ...evaluate(next, catalog) };
}

// Browser entry point: settings come from the Service keys dialog. onStep reports 'transcribing',
// 'understanding' and 'extracting' for the progress bar.
export async function runPipeline(audio, filename, mimeType, settings, context, onStep = () => {}) {
  onStep('transcribing');
  const transcript = await transcribe(audio, filename, settings, WHISPER_HINT);
  return interpret(transcript, context, { chatJson: (system, payload) => chatJson(system, payload, settings) }, onStep);
}
