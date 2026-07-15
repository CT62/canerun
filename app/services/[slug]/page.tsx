import { notFound } from 'next/navigation';
import { SERVICES_CATALOG } from '../../data/servicesCatalog';
import ServiceDetail from '@/components/ServiceDetail';

export function generateStaticParams() {
  return SERVICES_CATALOG.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);
  if (!service) notFound();

  return <ServiceDetail service={service} />;
}
