// Writes the prompts and the rendered fish list to integration/prompts/ as plain text for the .NET port.
// Run after changing docs/prompts.js or the product list: npm run export-prompts
import { writeFileSync, mkdirSync } from 'node:fs';
import { PROMPT_DIR, PROMPT_FILES } from './prompt-files.mjs';

mkdirSync(PROMPT_DIR, { recursive: true });
for (const [name, text] of Object.entries(PROMPT_FILES)) writeFileSync(new URL(name, PROMPT_DIR), text + '\n', 'utf8');
console.log(`wrote ${Object.keys(PROMPT_FILES).length} files to integration/prompts/`);
