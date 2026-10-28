// The plain-text prompt files for the .NET port and their source. Shared by export-prompts.mjs and run-vectors.mjs.
import { WHISPER_HINT, CLASSIFY_PROMPT, INVOICE_PROMPT, ORDER_PROMPT } from '../docs/prompts.js';
import { catalog } from '../docs/fish-catalog.js';

export const PROMPT_DIR = new URL('./prompts/', import.meta.url);

export const PROMPT_FILES = {
  'whisper-hint.txt': WHISPER_HINT,
  'classify.txt': CLASSIFY_PROMPT,
  'invoice.txt': INVOICE_PROMPT,
  'order.txt': ORDER_PROMPT,
  'catalog.txt': catalog.catalogText,
};
