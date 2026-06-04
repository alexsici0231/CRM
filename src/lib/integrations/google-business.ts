import { isLive } from '@/lib/integrations/config';
import { makeSyncLog } from '@/lib/integrations/mock-data';

export async function syncGoogleBusinessProfile() {
  const live = isLive('google_business');
  return {
    provider: 'google_business' as const,
    mode: live ? 'live' as const : 'mock' as const,
    reviews: [
      { location: 'channahon', rating: 4.8, reviews: 128, unanswered: 3 },
      { location: 'markham', rating: 4.7, reviews: 94, unanswered: 1 },
    ],
    logs: [makeSyncLog('google_business', 2, live ? 'success' : 'warning', live ? 'Google Business sync placeholder completed.' : 'GBP env отсутствуют, возвращен mock review summary.')],
  };
}
