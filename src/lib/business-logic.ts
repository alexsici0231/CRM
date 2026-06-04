import type { Call, ClientType, Lead, LeadSource, Location, Job } from '@/types/database';

export function detectLocationFromTrackingNumber(phone: string | null): Location | null {
  if (!phone) return null;
  if (phone.includes('630-277-3663')) return 'channahon';
  if (phone.includes('815-641-4718')) return 'markham';
  if (phone.replace(/\D/g, '').startsWith('779')) return 'channahon';
  return null;
}

export function detectSourceFromTrackingNumber(phone: string | null): LeadSource | null {
  if (!phone) return null;
  if (phone.replace(/\D/g, '').startsWith('779')) return 'peaty_tire';
  return null;
}

export function suggestClientType(serviceRequested: string, truckInfo?: string | null): ClientType {
  const haystack = `${serviceRequested} ${truckInfo || ''}`.toLowerCase();
  if (haystack.includes('fleet') || haystack.includes('company') || haystack.match(/\b[2-9]\s+trucks?\b/)) return 'fleet';
  if (haystack.includes('road') || haystack.includes('emergency') || haystack.includes('stuck')) return 'emergency';
  return 'regular';
}

export function applyLeadAttribution(lead: Lead): Lead {
  const location = detectLocationFromTrackingNumber(lead.call_tracking_number) || lead.location;
  const source = detectSourceFromTrackingNumber(lead.call_tracking_number) || lead.source;
  return {
    ...lead,
    location,
    source,
    client_type: suggestClientType(lead.service_requested, lead.truck_info),
  };
}

export function getFollowUpsDueToday(leads: Lead[]) {
  const today = new Date().toISOString().slice(0, 10);
  return leads.filter((lead) => lead.status === 'follow_up' && !!lead.follow_up_date && lead.follow_up_date <= today);
}

export function getRecentMissedCalls(calls: Call[]) {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  return calls.filter((call) => call.outcome === 'missed' && new Date(call.created_at).getTime() > cutoff);
}

export function monthlyRevenue(jobs: Job[], month: string, location?: Location) {
  return jobs
    .filter((job) => {
      if (location && job.location !== location) return false;
      return job.completion_date?.startsWith(month.slice(0, 7));
    })
    .reduce((sum, job) => sum + (job.paid_amount || 0), 0);
}
