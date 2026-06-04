import { TruckCrmPage } from '@/components/truck-crm';

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  return <TruckCrmPage page="lead-detail" leadId={params.id} />;
}
