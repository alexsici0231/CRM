import { isLive } from '@/lib/integrations/config';
import { makeSyncLog, trackingNumbers } from '@/lib/integrations/mock-data';
import type { IntegrationSyncResult } from '@/types/integrations';

export async function syncCallRail(): Promise<IntegrationSyncResult & { trackingNumbers: typeof trackingNumbers }> {
  const live = isLive('callrail');

  return {
    provider: 'callrail',
    mode: live ? 'live' : 'mock',
    metrics: [],
    trackingNumbers,
    logs: [makeSyncLog('callrail', trackingNumbers.length, live ? 'success' : 'warning', live ? 'CallRail sync placeholder completed.' : 'CALLRAIL env отсутствуют, возвращены mock tracking numbers.')],
  };
}
