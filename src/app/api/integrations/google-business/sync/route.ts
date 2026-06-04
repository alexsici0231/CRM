import { NextResponse } from 'next/server';
import { syncGoogleBusinessProfile } from '@/lib/integrations/google-business';

export async function POST() {
  return NextResponse.json(await syncGoogleBusinessProfile());
}

export async function GET() {
  return NextResponse.json(await syncGoogleBusinessProfile());
}
