import { NextResponse } from 'next/server';
import { sendSmsNotification } from '@/lib/twilio';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { to?: string; message?: string } | null;
  if (!body?.to || !body?.message) {
    return NextResponse.json({ error: 'to and message are required' }, { status: 400 });
  }

  const result = await sendSmsNotification(body.to, body.message);
  return NextResponse.json({ ok: true, result });
}
