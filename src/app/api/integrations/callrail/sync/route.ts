import { NextResponse } from 'next/server';
import { syncCallRail } from '@/lib/integrations/callrail';

export async function POST() {
  return NextResponse.json(await syncCallRail());
}

export async function GET() {
  return NextResponse.json(await syncCallRail());
}
