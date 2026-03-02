import { loadConfig } from "./config";
import { loadPrompts, selectPrompt, formatPrompt } from "./prompts";
import { postToWebhook } from "./post";
import { parseArgs } from "util";

function usage(): never {
  console.error("Usage: chatterbot post [--channel <channel-id>]");
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const subcommand = args[0];

  if (subcommand !== "post") {
    usage();
  }

  const { values } = parseArgs({
    args: args.slice(1),
    options: {
      channel: { type: "string", short: "c" },
    },
    strict: true,
  });

  const config = loadConfig(values.channel);
  const today = new Date();
  const bank = loadPrompts();
  const selection = selectPrompt(bank, today);
  const text = formatPrompt(selection, bank.template, today);

  console.log(`Prompt #${selection.index} (recycled: ${selection.recycled})`);
  console.log(text);
  console.log("---");

  await postToWebhook(config, text);
  console.log("Posted successfully.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
