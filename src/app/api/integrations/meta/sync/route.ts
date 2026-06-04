import { NextResponse } from 'next/server';
import { syncMetaAds } from '@/lib/integrations/meta-ads';

export async function POST() {
  return NextResponse.json(await syncMetaAds());
}

export async function GET() {
  return NextResponse.json(await syncMetaAds());
}
