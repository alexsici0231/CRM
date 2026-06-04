import { NextResponse } from 'next/server';
import { summarizeMarketing } from '@/lib/integrations/marketing-summary';

export async function GET() {
  return NextResponse.json(summarizeMarketing());
}
