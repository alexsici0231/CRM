import type { AdCampaignMetric, SyncLog, TrackingNumber } from '@/types/integrations';

export const trackingNumbers: TrackingNumber[] = [
  { id: 'tn-1', phone_number: '630-277-3663', location: 'channahon', source: 'google_ads', label: 'Channahon Google / CallRail', active: true },
  { id: 'tn-2', phone_number: '815-641-4718', location: 'markham', source: 'meta_ads', label: 'Markham Meta / CallRail', active: true },
  { id: 'tn-3', phone_number: '779-220-1180', location: 'channahon', source: 'peaty_tire', label: 'Peaty Tire referral', active: true },
];

export const mockAdMetrics: AdCampaignMetric[] = [
  { id: 'am-1', provider: 'google_ads', account_id: 'demo-google', campaign_id: 'g-1', campaign_name: 'Truck Repair Channahon Search', date: '2026-06-01', spend: 920, impressions: 11800, clicks: 420, leads: 12, booked_jobs: 5, revenue: 14800, location: 'channahon' },
  { id: 'am-2', provider: 'google_ads', account_id: 'demo-google', campaign_id: 'g-2', campaign_name: 'Emergency Road Service Markham', date: '2026-06-01', spend: 760, impressions: 9300, clicks: 310, leads: 9, booked_jobs: 4, revenue: 8700, location: 'markham' },
  { id: 'am-3', provider: 'meta_ads', account_id: 'demo-meta', campaign_id: 'm-1', campaign_name: 'Fleet Repair Retargeting', date: '2026-06-01', spend: 640, impressions: 22100, clicks: 260, leads: 7, booked_jobs: 2, revenue: 6200, location: 'both' },
  { id: 'am-4', provider: 'meta_ads', account_id: 'demo-meta', campaign_id: 'm-2', campaign_name: 'Owner Operators Promo', date: '2026-06-01', spend: 480, impressions: 17400, clicks: 210, leads: 5, booked_jobs: 1, revenue: 1800, location: 'markham' },
];

export function makeSyncLog(provider: SyncLog['provider'], records: number, status: SyncLog['status'] = 'success', message = 'Mock sync completed.') {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), provider, started_at: now, finished_at: now, status, records_imported: records, message };
}
