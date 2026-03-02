# Chatterbot

[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?style=for-the-badge&logo=github)](https://github.com/raulk/chatterbot/generate)

Posts a fun, markdown-formatted discussion prompt to a Mattermost channel every workday morning via incoming webhook. Prompts are curated in a YAML file so the daily topic is a surprise.

## How it works

A GitHub Actions cron job runs at 9 AM UTC, Monday through Friday. The bot counts weekdays since a fixed epoch and uses that index to select a prompt from `prompts.yaml`. No external state is needed; the same date always produces the same prompt.

Once all prompts have been used, the bot enters a recycling mode: prompts repeat from the beginning and a recycling notice is prepended. Appending new prompts to the list extends the sequential runway without disrupting past assignments.

## Setup

1. Click the **Use this template** button above (or [here](https://github.com/raulk/chatterbot/generate)) to create your own repository.
2. Install [Bun](https://bun.sh) if you want to run the bot locally.
3. Create a Mattermost incoming webhook and note the URL.
4. Add repository secrets in GitHub:
   - `MATTERMOST_WEBHOOK_URL` (required)
   - `MATTERMOST_CHANNEL_ID` (optional, overrides the webhook's default channel)
5. Edit `prompts.yaml` to add your own prompts.
6. The cron workflow handles the rest.

For local testing, copy `.env.example` to `.env` and fill in the webhook URL:

```sh
cp .env.example .env
bun install
bun run post
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

## Manual firing

Trigger a post outside the schedule from the Actions tab, or locally:

```sh
# Post to the webhook's default channel
bun run post

# Post to a specific channel
bun run post --channel town-square
```
