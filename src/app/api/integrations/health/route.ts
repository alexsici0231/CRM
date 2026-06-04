import { NextResponse } from 'next/server';
import { getIntegrationHealth } from '@/lib/integrations/config';

export async function GET() {
  return NextResponse.json({ integrations: getIntegrationHealth() });
}
