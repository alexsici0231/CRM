import { isLive } from '@/lib/integrations/config';
import { makeSyncLog, mockAdMetrics } from '@/lib/integrations/mock-data';
import type { IntegrationSyncResult } from '@/types/integrations';

export async function syncGoogleAds(): Promise<IntegrationSyncResult> {
  const live = isLive('google_ads');
  const metrics = mockAdMetrics.filter((metric) => metric.provider === 'google_ads');

  return {
    provider: 'google_ads',
    mode: live ? 'live' : 'mock',
    metrics,
    logs: [makeSyncLog('google_ads', metrics.length, live ? 'success' : 'warning', live ? 'Google Ads sync placeholder completed.' : 'GOOGLE_ADS env отсутствуют, возвращены mock-метрики.')],
  };
}
