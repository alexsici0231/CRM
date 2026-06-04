import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await request.json().catch(() => ({}))
    : Object.fromEntries((await request.formData()).entries());

  return NextResponse.json({
    ok: true,
    provider: 'twilio',
    receivedAt: new Date().toISOString(),
    payload,
    note: 'Webhook endpoint prepared. Add Twilio signature validation before production use.',
  });
}
