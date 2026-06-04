import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    provider: 'callrail',
    receivedAt: new Date().toISOString(),
    payload,
    note: 'Webhook endpoint prepared. Add signature validation before production use.',
  });
}
