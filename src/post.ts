import type { Config } from "./config";

interface WebhookPayload {
  text: string;
  channel?: string;
}

export async function postToWebhook(
  config: Config,
  text: string,
): Promise<void> {
  const payload: WebhookPayload = { text };
  if (config.channelId) {
    payload.channel = config.channelId;
  }

  const res = await fetch(config.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Webhook POST failed (${res.status}): ${body}`);
  }
}
