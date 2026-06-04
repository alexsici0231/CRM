import { isLive } from '@/lib/integrations/config';
import { makeSyncLog, mockAdMetrics } from '@/lib/integrations/mock-data';
import type { IntegrationSyncResult } from '@/types/integrations';

export async function syncMetaAds(): Promise<IntegrationSyncResult> {
  const live = isLive('meta_ads');
  const metrics = mockAdMetrics.filter((metric) => metric.provider === 'meta_ads');

  return {
    provider: 'meta_ads',
    mode: live ? 'live' : 'mock',
    metrics,
    logs: [makeSyncLog('meta_ads', metrics.length, live ? 'success' : 'warning', live ? 'Meta Ads sync placeholder completed.' : 'META env отсутствуют, возвращены mock-метрики.')],
  };
}
