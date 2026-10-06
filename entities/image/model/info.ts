import type { ImageMetadata } from '@/shared/lib/image-processing';

export type ImageFileInfo = { bytes: number; mimeType: string };
export type ImageSourceInfo = ImageFileInfo & { name: string; lastModified?: number; url?: string; metadata: ImageMetadata };
export type ImageImport = { file: File; original: File; url?: string };
