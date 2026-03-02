export interface Config {
  webhookUrl: string;
  channelId?: string;
}

export function loadConfig(channelOverride?: string): Config {
  const webhookUrl = process.env.MATTERMOST_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("MATTERMOST_WEBHOOK_URL is not set");
  }

  const channelId = channelOverride ?? process.env.MATTERMOST_CHANNEL_ID;

  return { webhookUrl, channelId };
}
