export type UserRole = 'owner' | 'marketing_manager' | 'shop_manager' | 'admin';
export type Location = 'channahon' | 'markham';
export type ReportLocation = Location | 'both';
export type LeadSource =
  | 'meta_ads'
  | 'google_ads'
  | 'google_organic'
  | 'google_maps'
  | 'referral'
  | 'repeat_client'
  | 'peaty_tire'
  | 'road_service'
  | 'direct_call'
  | 'other';
export type ClientType = 'fleet' | 'emergency' | 'regular';
export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'completed' | 'lost' | 'follow_up';
export type ServiceType =
  | 'engine'
  | 'brakes'
  | 'suspension'
  | 'electrical'
  | 'tires'
  | 'transmission'
  | 'pm_service'
  | 'diagnostics'
  | 'exhaust'
  | 'alignment'
  | 'road_service'
  | 'other';
export type JobStatus = 'scheduled' | 'in_progress' | 'waiting_parts' | 'completed' | 'invoiced' | 'paid';
export type PaymentMethod = 'cash' | 'card' | 'check' | 'fleet_account' | 'other';
export type ContractType = 'monthly' | 'per_service' | 'none';
export type FleetStatus = 'active' | 'inactive' | 'prospect';
export type CallOutcome = 'answered' | 'missed' | 'voicemail' | 'converted';
export type ReviewPlatform = 'google' | 'yelp' | 'facebook' | 'other';
export type IntegrationProvider = 'meta_ads' | 'google_ads' | 'callrail' | 'twilio' | 'google_business';
export type IntegrationStatus = 'connected' | 'missing_env' | 'mock' | 'error';
export type SyncStatus = 'success' | 'warning' | 'error';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  location?: Location;
  email: string;
}

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  source: LeadSource;
  call_tracking_number: string | null;
  location: Location;
  client_type: ClientType;
  status: LeadStatus;
  assigned_to: string | null;
  truck_info: string | null;
  service_requested: string;
  estimated_value: number | null;
  actual_value: number | null;
  notes: string | null;
  follow_up_date: string | null;
  converted: boolean;
  updated_at: string;
}

export interface Job {
  id: string;
  lead_id: string;
  created_at: string;
  location: Location;
  service_type: ServiceType;
  status: JobStatus;
  technician_name: string | null;
  start_date: string;
  completion_date: string | null;
  invoice_amount: number | null;
  paid_amount: number | null;
  payment_method: PaymentMethod | null;
  notes: string;
}

export interface FleetClient {
  id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string | null;
  number_of_trucks: number | null;
  contract_type: ContractType;
  monthly_value: number | null;
  assigned_manager: string | null;
  location_preference: ReportLocation;
  status: FleetStatus;
  notes: string;
  created_at: string;
  last_service_date: string | null;
}

export interface Call {
  id: string;
  created_at: string;
  lead_id: string | null;
  phone_from: string;
  phone_to: string;
  source: LeadSource;
  location: Location;
  duration_seconds: number | null;
  recording_url: string | null;
  outcome: CallOutcome;
  notes: string | null;
  handled_by: string | null;
}

export interface Review {
  id: string;
  created_at: string;
  platform: ReviewPlatform;
  location: ReportLocation | 'general';
  author_name: string;
  rating: number;
  content: string;
  responded: boolean;
  response_text: string | null;
  responded_at: string | null;
}

export interface MonthlyReport {
  id: string;
  month: string;
  location: ReportLocation;
  total_leads: number;
  total_jobs_completed: number;
  total_revenue: number;
  meta_ads_spend: number | null;
  google_ads_spend: number | null;
  cost_per_lead: number | null;
  notes: string | null;
  created_at: string;
}

export interface IntegrationAccount {
  id: string;
  provider: IntegrationProvider;
  external_account_id: string | null;
  label: string;
  status: IntegrationStatus;
  last_sync_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface TrackingNumberRow {
  id: string;
  phone_number: string;
  location: Location;
  source: LeadSource;
  provider: IntegrationProvider;
  label: string;
  active: boolean;
  created_at: string;
}

export interface AdCampaign {
  id: string;
  provider: IntegrationProvider;
  external_campaign_id: string;
  account_id: string;
  campaign_name: string;
  location: ReportLocation;
  active: boolean;
  created_at: string;
}

export interface AdDailyMetric {
  id: string;
  provider: IntegrationProvider;
  campaign_id: string | null;
  metric_date: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  booked_jobs: number;
  revenue: number;
  raw_payload: Record<string, unknown>;
  created_at: string;
}

export interface LeadAttribution {
  id: string;
  lead_id: string | null;
  source: LeadSource;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_adset: string | null;
  utm_ad: string | null;
  gclid: string | null;
  fbclid: string | null;
  landing_page: string | null;
  first_touch_at: string | null;
  last_touch_at: string | null;
  created_at: string;
}

export interface IntegrationSyncLog {
  id: string;
  provider: IntegrationProvider;
  started_at: string;
  finished_at: string | null;
  status: SyncStatus;
  records_imported: number;
  message: string;
  error_details: Record<string, unknown>;
}

export interface WebhookEvent {
  id: string;
  provider: IntegrationProvider;
  event_type: string;
  external_id: string | null;
  payload: Record<string, unknown>;
  processed: boolean;
  received_at: string;
  processed_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      leads: { Row: Lead; Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Lead> };
      jobs: { Row: Job; Insert: Omit<Job, 'id' | 'created_at'>; Update: Partial<Job> };
      fleet_clients: { Row: FleetClient; Insert: Omit<FleetClient, 'id' | 'created_at'>; Update: Partial<FleetClient> };
      calls: { Row: Call; Insert: Omit<Call, 'id' | 'created_at'>; Update: Partial<Call> };
      reviews: { Row: Review; Insert: Omit<Review, 'id' | 'created_at'>; Update: Partial<Review> };
      monthly_reports: { Row: MonthlyReport; Insert: Omit<MonthlyReport, 'id' | 'created_at'>; Update: Partial<MonthlyReport> };
      integration_accounts: { Row: IntegrationAccount; Insert: Omit<IntegrationAccount, 'id' | 'created_at'>; Update: Partial<IntegrationAccount> };
      tracking_numbers: { Row: TrackingNumberRow; Insert: Omit<TrackingNumberRow, 'id' | 'created_at'>; Update: Partial<TrackingNumberRow> };
      ad_campaigns: { Row: AdCampaign; Insert: Omit<AdCampaign, 'id' | 'created_at'>; Update: Partial<AdCampaign> };
      ad_daily_metrics: { Row: AdDailyMetric; Insert: Omit<AdDailyMetric, 'id' | 'created_at'>; Update: Partial<AdDailyMetric> };
      lead_attribution: { Row: LeadAttribution; Insert: Omit<LeadAttribution, 'id' | 'created_at'>; Update: Partial<LeadAttribution> };
      integration_sync_logs: { Row: IntegrationSyncLog; Insert: Omit<IntegrationSyncLog, 'id'>; Update: Partial<IntegrationSyncLog> };
      webhook_events: { Row: WebhookEvent; Insert: Omit<WebhookEvent, 'id' | 'received_at'>; Update: Partial<WebhookEvent> };
    };
  };
}
