import type { LeadSource, Location } from '@/types/database';

export type IntegrationProvider = 'meta_ads' | 'google_ads' | 'callrail' | 'twilio' | 'google_business';
export type IntegrationStatus = 'connected' | 'missing_env' | 'mock' | 'error';

export interface IntegrationHealth {
  provider: IntegrationProvider;
  label: string;
  status: IntegrationStatus;
  missingEnv: string[];
  lastSyncAt: string | null;
  message: string;
}

export interface TrackingNumber {
  id: string;
  phone_number: string;
  location: Location;
  source: LeadSource;
  label: string;
  active: boolean;
}

export interface AdCampaignMetric {
  id: string;
  provider: 'meta_ads' | 'google_ads';
  account_id: string;
  campaign_id: string;
  campaign_name: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  booked_jobs: number;
  revenue: number;
  location: Location | 'both';
}

export interface SyncLog {
  id: string;
  provider: IntegrationProvider;
  started_at: string;
  finished_at: string;
  status: 'success' | 'warning' | 'error';
  records_imported: number;
  message: string;
}

export interface IntegrationSyncResult {
  provider: IntegrationProvider;
  mode: 'mock' | 'live';
  metrics: AdCampaignMetric[];
  logs: SyncLog[];
}
