export function hasTwilioConfig(env: ImportMetaEnv = import.meta.env): boolean {
  return Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER);
}

export interface TwilioSmsRequest {
  to: string;
  body: string;
}

export async function sendTwilioSms(input: TwilioSmsRequest): Promise<{
  sid: string;
  status: string;
}> {
  const accountSid = import.meta.env.TWILIO_ACCOUNT_SID;
  const authToken = import.meta.env.TWILIO_AUTH_TOKEN;
  const fromNumber = import.meta.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials are missing.');
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: input.to,
        From: fromNumber,
        Body: input.body,
      }),
    },
  );

  const payload = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    throw new Error(String(payload.message ?? response.statusText));
  }

  return {
    sid: String(payload.sid ?? ''),
    status: String(payload.status ?? 'queued'),
  };
}
