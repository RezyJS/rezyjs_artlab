import type { Metadata } from 'next';
import UiKit from '@/widgets/ui-kit';
export const metadata: Metadata = { title: 'ArtLab · UI Kit' };
export default function Page() { return <UiKit view="kit" />; }
