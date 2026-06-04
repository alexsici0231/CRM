import { NextResponse } from 'next/server';
import { syncGoogleAds } from '@/lib/integrations/google-ads';

export async function POST() {
  return NextResponse.json(await syncGoogleAds());
}

export async function GET() {
  return NextResponse.json(await syncGoogleAds());
}
