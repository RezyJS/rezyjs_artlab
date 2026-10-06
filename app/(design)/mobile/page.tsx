import type { Metadata } from 'next';
import UiKit from '@/widgets/ui-kit';
export const metadata: Metadata = { title: 'ArtLab · Mobile' };
export default function Page() { return <UiKit view="mobile" />; }
