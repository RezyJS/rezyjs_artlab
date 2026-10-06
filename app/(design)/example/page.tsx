import type { Metadata } from 'next';
import UiKit from '@/widgets/ui-kit';
export const metadata: Metadata = { title: 'ArtLab · Example' };
export default async function Page({ searchParams }: { searchParams: Promise<{ embed?: string }> }) {
  return <UiKit view="example" embedded={(await searchParams).embed === '1'} />;
}
