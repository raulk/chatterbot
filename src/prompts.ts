import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { parse } from "yaml";

const EPOCH = new Date("2026-02-18");
const PROMPT_PLACEHOLDER = "{{prompt}}";
const DATE_PLACEHOLDER = "{{date}}";

interface PromptsFile {
  template: string;
  prompts: string[];
}

export interface PromptBank {
  template: string;
  prompts: string[];
}

export function loadPrompts(path?: string): PromptBank {
  const file = path ?? resolve(dirname(import.meta.dir), "prompts.yaml");
  const raw = readFileSync(file, "utf-8");
  const data = parse(raw) as PromptsFile;

  if (!data.template || !data.template.includes(PROMPT_PLACEHOLDER)) {
    throw new Error(
      `Template must contain ${PROMPT_PLACEHOLDER} placeholder in ${file}`,
    );
  }
  if (!Array.isArray(data.prompts) || data.prompts.length === 0) {
    throw new Error(`No prompts found in ${file}`);
  }

  return { template: data.template, prompts: data.prompts };
}

// Count weekdays (Mon-Fri) from epoch to date, inclusive of both, 0-based.
// epoch itself = 0, next weekday = 1, etc.
export function countWeekdays(from: Date, to: Date): number {
  let count = 0;
  const d = new Date(from);
  d.setUTCHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setUTCHours(0, 0, 0, 0);

  if (end < d) return 0;

  // Advance day-by-day from the day after epoch to `to`.
  // epoch itself is weekday 0, so we count additional weekdays after it.
  const cursor = new Date(d);
  cursor.setUTCDate(cursor.getUTCDate() + 1);
  while (cursor <= end) {
    const day = cursor.getUTCDay();
    if (day >= 1 && day <= 5) count++;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
}

export interface PromptSelection {
  text: string;
  index: number;
  recycled: boolean;
}

export function selectPrompt(
  bank: PromptBank,
  today?: Date,
): PromptSelection {
  const now = today ?? new Date();
  const weekdays = countWeekdays(EPOCH, now);
  const n = bank.prompts.length;
  const index = weekdays % n;
  const recycled = weekdays >= n;

  return { text: bank.prompts[index], index, recycled };
}

const RECYCLING_NOTICE =
  ":recycle: *This is a recycled prompt. Still a banger though.*\n\n";

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatPrompt(
  selection: PromptSelection,
  template: string,
  today?: Date,
): string {
  const date = formatDate(today ?? new Date());
  const rendered = template
    .replace(PROMPT_PLACEHOLDER, selection.text)
    .replace(DATE_PLACEHOLDER, date);
  if (selection.recycled) {
    return RECYCLING_NOTICE + rendered;
  }
  return rendered;
}
