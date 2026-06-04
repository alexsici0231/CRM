import { mockAdMetrics, trackingNumbers } from '@/lib/integrations/mock-data';
import type { AdCampaignMetric } from '@/types/integrations';

export function summarizeMarketing(metrics: AdCampaignMetric[] = mockAdMetrics) {
  const spend = metrics.reduce((sum, item) => sum + item.spend, 0);
  const leads = metrics.reduce((sum, item) => sum + item.leads, 0);
  const bookedJobs = metrics.reduce((sum, item) => sum + item.booked_jobs, 0);
  const revenue = metrics.reduce((sum, item) => sum + item.revenue, 0);

  return {
    spend,
    leads,
    bookedJobs,
    revenue,
    cpl: leads ? spend / leads : 0,
    cpBookedJob: bookedJobs ? spend / bookedJobs : 0,
    roas: spend ? revenue / spend : 0,
    metrics,
    trackingNumbers,
  };
}
