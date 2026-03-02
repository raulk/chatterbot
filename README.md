# Chatterbot

[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?style=for-the-badge&logo=github)](https://github.com/raulk/chatterbot/generate)

Posts a fun, markdown-formatted discussion prompt to a Mattermost channel every workday morning via incoming webhook. Prompts are curated in a YAML file so the daily topic is a surprise.

## How it works

A GitHub Actions cron job runs at 9 AM UTC, Monday through Friday. The bot counts weekdays since a fixed epoch and uses that index to select a prompt from `prompts.yaml`. No external state is needed; the same date always produces the same prompt.

Once all prompts have been used, the bot enters a recycling mode: prompts repeat from the beginning and a recycling notice is prepended. Appending new prompts to the list extends the sequential runway without disrupting past assignments.

## Dependencies

This bot deliberately minimizes third-party dependencies to reduce exposure to supply chain attacks. The full runtime dependency set:

| Package | Purpose |
|---------|---------|
| `yaml` | Parse the prompts YAML file |

Everything else (HTTP, CLI arg parsing, date arithmetic) uses Bun/Node built-ins.

## Setup

1. Fork this repository.
2. Create a Mattermost incoming webhook and note the URL.
3. Add repository secrets in GitHub:
   - `MATTERMOST_WEBHOOK_URL` (required)
   - `MATTERMOST_CHANNEL_ID` (optional, overrides the webhook's default channel)
4. Edit `prompts.yaml` to add your own prompts.
5. The cron workflow handles the rest.

For local testing, copy `.env.example` to `.env` and fill in the webhook URL:

```sh
cp .env.example .env
# edit .env with your webhook URL
```

## Usage

```sh
# Post today's prompt to the webhook's default channel
bun run post

# Post to a specific channel
bun run post --channel town-square
```

## Adding prompts

Edit `prompts.yaml`. The file has two fields:

- `template`: the wrapper applied to every prompt, with `{{prompt}}` as the placeholder for the varying content and `{{date}}` for the current date.
- `prompts`: an append-only list of prompt texts. New entries go at the end.

```yaml
template: |-
  **Daily chatter thread ({{date}})** :thread:
  _"{{prompt}}"_

prompts:
  - "Tabs vs spaces. This will not be settled today. :keyboard:"
  - "Your new prompt here :sparkles:"
```

Mattermost markdown and shortcode emojis (`:rocket:`, `:fire:`) are supported in both the template and individual prompts.

## Prerequisites

- [Bun](https://bun.sh)
