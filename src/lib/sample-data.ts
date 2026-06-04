import type { AppUser, Call, FleetClient, Job, Lead, MonthlyReport, Review } from '@/types/database';

const now = new Date();
const iso = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();
const date = (daysAgo: number) => iso(daysAgo).slice(0, 10);

export const users: AppUser[] = [
  { id: 'u-owner', name: 'Iulian', role: 'owner', email: 'iulian@365truckrepair.com' },
  { id: 'u-marketing', name: 'Alexandru', role: 'marketing_manager', email: 'alexandru@365truckrepair.com' },
  { id: 'u-channahon', name: 'Channahon Shop Manager', role: 'shop_manager', location: 'channahon', email: 'channahon@365truckrepair.com' },
  { id: 'u-markham', name: 'Markham Shop Manager', role: 'shop_manager', location: 'markham', email: 'markham@365truckrepair.com' },
  { id: 'u-admin', name: 'Admin', role: 'admin', email: 'admin@365truckrepair.com' },
];

export const activeUser = users[0];

export const leads: Lead[] = [
  { id: 'l1', created_at: iso(0), name: 'Victory Truck & Trailer Inc', phone: '708-555-0188', email: 'dispatch@victorytruck.com', source: 'google_ads', call_tracking_number: '630-277-3663', location: 'channahon', client_type: 'fleet', status: 'follow_up', assigned_to: 'u-marketing', truck_info: 'Fleet of 18 Freightliners', service_requested: 'Fleet PM service and brakes', estimated_value: 4800, actual_value: null, notes: 'Iulian wants this account watched closely.', follow_up_date: date(0), converted: false, updated_at: iso(0) },
  { id: 'l2', created_at: iso(0), name: 'TRS Express', phone: '815-555-0244', email: 'ops@trsexpress.com', source: 'meta_ads', call_tracking_number: '815-641-4718', location: 'markham', client_type: 'fleet', status: 'new', assigned_to: 'u-markham', truck_info: 'Volvo VNL 2021', service_requested: 'Company truck electrical diagnostic', estimated_value: 900, actual_value: null, notes: 'Asked for same-day slot.', follow_up_date: null, converted: false, updated_at: iso(0) },
  { id: 'l3', created_at: iso(1), name: 'Roadside driver Mike', phone: '312-555-0199', email: null, source: 'road_service', call_tracking_number: '815-641-4718', location: 'markham', client_type: 'emergency', status: 'in_progress', assigned_to: 'u-markham', truck_info: 'Peterbilt 579', service_requested: 'Road service - brake chamber leaking', estimated_value: 650, actual_value: null, notes: 'Orange road service flag.', follow_up_date: null, converted: true, updated_at: iso(0) },
  { id: 'l4', created_at: iso(2), name: 'Peaty Tire referral - Darius', phone: '779-555-0111', email: null, source: 'peaty_tire', call_tracking_number: '779-220-1180', location: 'channahon', client_type: 'regular', status: 'contacted', assigned_to: 'u-channahon', truck_info: 'Kenworth T680', service_requested: 'Tires plus alignment', estimated_value: 1400, actual_value: null, notes: 'Cross-referral from tire counter.', follow_up_date: date(-1), converted: false, updated_at: iso(1) },
  { id: 'l5', created_at: iso(3), name: 'Blue Line Logistics', phone: '630-555-0180', email: 'maintenance@blueline.com', source: 'google_maps', call_tracking_number: '630-277-3663', location: 'channahon', client_type: 'fleet', status: 'completed', assigned_to: 'u-channahon', truck_info: '7 trucks', service_requested: 'Fleet suspension inspection', estimated_value: 2500, actual_value: 3100, notes: 'Converted to job and paid.', follow_up_date: null, converted: true, updated_at: iso(1) },
  { id: 'l6', created_at: iso(4), name: 'North Star Produce', phone: '708-555-0133', email: 'fleet@northstarproduce.com', source: 'referral', call_tracking_number: null, location: 'markham', client_type: 'fleet', status: 'contacted', assigned_to: 'u-marketing', truck_info: 'Reefer fleet', service_requested: 'Company fleet diagnostics', estimated_value: 2200, actual_value: null, notes: 'Referral from existing client.', follow_up_date: date(1), converted: false, updated_at: iso(2) },
  { id: 'l7', created_at: iso(5), name: 'Jose Martinez', phone: '708-555-0166', email: null, source: 'direct_call', call_tracking_number: '815-641-4718', location: 'markham', client_type: 'regular', status: 'lost', assigned_to: 'u-markham', truck_info: 'International LT', service_requested: 'Transmission quote', estimated_value: 4200, actual_value: null, notes: 'Price shopping.', follow_up_date: null, converted: false, updated_at: iso(4) },
  { id: 'l8', created_at: iso(6), name: 'Express Midwest Carrier', phone: '630-555-0101', email: 'admin@emcarrier.com', source: 'google_organic', call_tracking_number: null, location: 'channahon', client_type: 'fleet', status: 'in_progress', assigned_to: 'u-channahon', truck_info: 'Company with 4 trucks', service_requested: 'Fleet PM service', estimated_value: 1800, actual_value: null, notes: 'Fleet detection should trigger.', follow_up_date: null, converted: true, updated_at: iso(0) },
  { id: 'l9', created_at: iso(7), name: 'Chicago Haul LLC', phone: '773-555-0190', email: 'owner@chicagohaul.com', source: 'meta_ads', call_tracking_number: '630-277-3663', location: 'channahon', client_type: 'fleet', status: 'new', assigned_to: 'u-marketing', truck_info: '3 dump trucks', service_requested: 'Brakes and DOT inspection', estimated_value: 2100, actual_value: null, notes: null, follow_up_date: null, converted: false, updated_at: iso(7) },
  { id: 'l10', created_at: iso(8), name: 'Samir Patel', phone: '224-555-0145', email: 'samir@example.com', source: 'repeat_client', call_tracking_number: null, location: 'markham', client_type: 'regular', status: 'completed', assigned_to: 'u-markham', truck_info: 'Mack Anthem', service_requested: 'Oil leak diagnostics', estimated_value: 700, actual_value: 920, notes: 'Repeat client.', follow_up_date: null, converted: true, updated_at: iso(2) },
  { id: 'l11', created_at: iso(9), name: 'Rapid Freight', phone: '630-555-0200', email: 'dispatch@rapidfreight.com', source: 'google_ads', call_tracking_number: '630-277-3663', location: 'channahon', client_type: 'fleet', status: 'follow_up', assigned_to: 'u-marketing', truck_info: '12 trucks', service_requested: 'Fleet contract pricing', estimated_value: 6000, actual_value: null, notes: 'Budget approval needed.', follow_up_date: date(0), converted: false, updated_at: iso(1) },
  { id: 'l12', created_at: iso(10), name: 'Owner Operator Elena', phone: '815-555-0130', email: null, source: 'google_maps', call_tracking_number: '815-641-4718', location: 'markham', client_type: 'regular', status: 'contacted', assigned_to: 'u-markham', truck_info: 'Freightliner Cascadia', service_requested: 'Check engine diagnostics', estimated_value: 350, actual_value: null, notes: null, follow_up_date: date(2), converted: false, updated_at: iso(3) },
  { id: 'l13', created_at: iso(11), name: 'Peaty Tire client - Omar', phone: '779-555-0140', email: null, source: 'peaty_tire', call_tracking_number: '779-333-9000', location: 'channahon', client_type: 'regular', status: 'new', assigned_to: 'u-channahon', truck_info: 'Box truck', service_requested: 'Tire sale and brake noise', estimated_value: 980, actual_value: null, notes: null, follow_up_date: null, converted: false, updated_at: iso(11) },
  { id: 'l14', created_at: iso(12), name: 'River Road Transport', phone: '708-555-0110', email: 'service@riverroad.com', source: 'referral', call_tracking_number: null, location: 'markham', client_type: 'fleet', status: 'in_progress', assigned_to: 'u-markham', truck_info: '6 trucks', service_requested: 'Company suspension repairs', estimated_value: 3200, actual_value: null, notes: null, follow_up_date: null, converted: true, updated_at: iso(1) },
  { id: 'l15', created_at: iso(13), name: 'Local driver Andre', phone: '630-555-0177', email: null, source: 'other', call_tracking_number: null, location: 'channahon', client_type: 'regular', status: 'lost', assigned_to: 'u-channahon', truck_info: 'Hino 268', service_requested: 'Exhaust repair estimate', estimated_value: 1100, actual_value: null, notes: 'No-show.', follow_up_date: null, converted: false, updated_at: iso(10) },
];

export const jobs: Job[] = [
  { id: 'j1', lead_id: 'l3', created_at: iso(1), location: 'markham', service_type: 'road_service', status: 'in_progress', technician_name: 'Carlos', start_date: date(0), completion_date: null, invoice_amount: 650, paid_amount: null, payment_method: null, notes: 'Mobile service truck dispatched.' },
  { id: 'j2', lead_id: 'l5', created_at: iso(3), location: 'channahon', service_type: 'suspension', status: 'paid', technician_name: 'Mihai', start_date: date(3), completion_date: date(2), invoice_amount: 3100, paid_amount: 3100, payment_method: 'fleet_account', notes: 'Fleet account approved.' },
  { id: 'j3', lead_id: 'l8', created_at: iso(2), location: 'channahon', service_type: 'pm_service', status: 'scheduled', technician_name: 'Nick', start_date: date(-1), completion_date: null, invoice_amount: 1800, paid_amount: null, payment_method: null, notes: 'Four trucks scheduled across two days.' },
  { id: 'j4', lead_id: 'l10', created_at: iso(4), location: 'markham', service_type: 'diagnostics', status: 'paid', technician_name: 'Dima', start_date: date(4), completion_date: date(2), invoice_amount: 920, paid_amount: 920, payment_method: 'card', notes: 'Oil leak repaired.' },
  { id: 'j5', lead_id: 'l14', created_at: iso(2), location: 'markham', service_type: 'suspension', status: 'waiting_parts', technician_name: 'Carlos', start_date: date(1), completion_date: null, invoice_amount: 3200, paid_amount: null, payment_method: null, notes: 'Waiting on bushings.' },
  { id: 'j6', lead_id: 'l1', created_at: iso(0), location: 'channahon', service_type: 'brakes', status: 'scheduled', technician_name: 'Mihai', start_date: date(0), completion_date: null, invoice_amount: 4800, paid_amount: null, payment_method: null, notes: 'Pending owner budget approval.' },
  { id: 'j7', lead_id: 'l4', created_at: iso(2), location: 'channahon', service_type: 'tires', status: 'invoiced', technician_name: 'Nick', start_date: date(2), completion_date: date(1), invoice_amount: 1400, paid_amount: null, payment_method: null, notes: 'Peaty Tire cross-referral.' },
  { id: 'j8', lead_id: 'l12', created_at: iso(1), location: 'markham', service_type: 'engine', status: 'completed', technician_name: 'Dima', start_date: date(1), completion_date: date(0), invoice_amount: 740, paid_amount: null, payment_method: null, notes: 'Needs invoice follow-up.' },
];

export const fleetClients: FleetClient[] = [
  { id: 'f1', company_name: 'Victory Truck & Trailer Inc', contact_person: 'Vlad', phone: '708-555-0188', email: 'dispatch@victorytruck.com', number_of_trucks: 18, contract_type: 'monthly', monthly_value: 12000, assigned_manager: 'Alexandru', location_preference: 'channahon', status: 'active', notes: 'Top-value fleet target.', created_at: iso(120), last_service_date: date(2) },
  { id: 'f2', company_name: 'TRS Express', contact_person: 'Roman', phone: '815-555-0244', email: 'ops@trsexpress.com', number_of_trucks: 9, contract_type: 'per_service', monthly_value: 5500, assigned_manager: 'Alexandru', location_preference: 'markham', status: 'active', notes: 'Growing account.', created_at: iso(90), last_service_date: date(8) },
  { id: 'f3', company_name: 'Blue Line Logistics', contact_person: 'Marta', phone: '630-555-0180', email: 'maintenance@blueline.com', number_of_trucks: 7, contract_type: 'monthly', monthly_value: 7200, assigned_manager: 'Iulian', location_preference: 'channahon', status: 'active', notes: 'Reliable payer.', created_at: iso(240), last_service_date: date(2) },
  { id: 'f4', company_name: 'River Road Transport', contact_person: 'Eddie', phone: '708-555-0110', email: 'service@riverroad.com', number_of_trucks: 6, contract_type: 'per_service', monthly_value: 4100, assigned_manager: 'Shop Manager', location_preference: 'markham', status: 'prospect', notes: 'Needs contract proposal.', created_at: iso(45), last_service_date: null },
  { id: 'f5', company_name: 'Rapid Freight', contact_person: 'Nate', phone: '630-555-0200', email: 'dispatch@rapidfreight.com', number_of_trucks: 12, contract_type: 'none', monthly_value: 9000, assigned_manager: 'Alexandru', location_preference: 'both', status: 'prospect', notes: 'Potential monthly plan.', created_at: iso(20), last_service_date: null },
];

export const calls: Call[] = Array.from({ length: 20 }, (_, index) => {
  const lead = leads[index % leads.length];
  const missed = index % 6 === 0;
  return {
    id: `c${index + 1}`,
    created_at: index === 0 ? new Date(Date.now() - 45 * 60000).toISOString() : iso(index % 12),
    lead_id: lead.id,
    phone_from: lead.phone,
    phone_to: lead.call_tracking_number || (lead.location === 'channahon' ? '630-277-3663' : '815-641-4718'),
    source: lead.source,
    location: lead.location,
    duration_seconds: missed ? 0 : 80 + index * 12,
    recording_url: missed ? null : 'https://callrail.example.com/recording',
    outcome: missed ? 'missed' : index % 5 === 0 ? 'converted' : 'answered',
    notes: missed ? 'Needs call back.' : 'Handled by shop.',
    handled_by: missed ? null : index % 2 === 0 ? 'Channahon desk' : 'Markham desk',
  };
});

export const reviews: Review[] = Array.from({ length: 12 }, (_, index) => ({
  id: `r${index + 1}`,
  created_at: iso(index * 3),
  platform: index % 3 === 0 ? 'google' : index % 3 === 1 ? 'facebook' : 'yelp',
  location: index % 2 === 0 ? 'channahon' : 'markham',
  author_name: ['Michael R', 'Jose L', 'Elena P', 'Darius M'][index % 4],
  rating: index % 5 === 0 ? 4 : 5,
  content: 'Fast truck repair, clear communication, and fair pricing. The shop got us back on the road quickly.',
  responded: index % 4 !== 0,
  response_text: index % 4 !== 0 ? 'Thank you for trusting 365 Truck Repair.' : null,
  responded_at: index % 4 !== 0 ? iso(index * 3 - 1) : null,
}));

export const monthlyReports: MonthlyReport[] = [
  { id: 'm1', month: '2026-04-01', location: 'both', total_leads: 58, total_jobs_completed: 31, total_revenue: 87200, meta_ads_spend: 4300, google_ads_spend: 5100, cost_per_lead: 162, notes: 'Strong Google Maps month.', created_at: iso(60) },
  { id: 'm2', month: '2026-05-01', location: 'both', total_leads: 64, total_jobs_completed: 36, total_revenue: 96400, meta_ads_spend: 4800, google_ads_spend: 5600, cost_per_lead: 162.5, notes: 'Fleet pipeline improved.', created_at: iso(30) },
  { id: 'm3', month: '2026-06-01', location: 'both', total_leads: 22, total_jobs_completed: 11, total_revenue: 38400, meta_ads_spend: 1600, google_ads_spend: 2100, cost_per_lead: 168, notes: 'Month in progress.', created_at: iso(0) },
];
