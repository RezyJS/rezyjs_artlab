import { GrayScaleButton } from "@/features/image-filters/ui/FunctionsButtons/Color/GrayScaleButton";
import { BrightnessButton } from "@/features/image-filters/ui/FunctionsButtons/Color/BrightnessButton";
import { NegativeButton } from "@/features/image-filters/ui/FunctionsButtons/Color/NegativeButton";
import { BinarizationButton } from "@/features/image-filters/ui/FunctionsButtons/Color/BinarizationButton";
import { HistogramButton } from "@/features/image-filters/ui/FunctionsButtons/Color/HistogramButton";
import { ContrastButton } from "@/features/image-filters/ui/FunctionsButtons/Color/ContrastButton";
import { GammaButton } from "@/features/image-filters/ui/FunctionsButtons/Color/GammaButton";
import { KvantationButton } from "@/features/image-filters/ui/FunctionsButtons/Color/KvantationButton";
import { PseudoColoringButton } from "@/features/image-filters/ui/FunctionsButtons/Color/PseudoColoringButton";
import { FileElement } from '@/entities/image';
import { SolarizationButton } from "@/features/image-filters/ui/FunctionsButtons/Color/SolarizationButton";

export default function ColorButtons({ file }: { file: FileElement }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 @md:grid-cols-3 @xl:grid-cols-4 @3xl:grid-cols-5 @4xl:grid-cols-6 @6xl:grid-cols-7 gap-5 p-6 h-full">
        <GrayScaleButton file={file} />
        <BrightnessButton file={file} />
        <NegativeButton file={file} />
        <BinarizationButton file={file} />
        <ContrastButton file={file} />
        <HistogramButton file={file} />
        <GammaButton file={file} />
        <KvantationButton file={file} />
        <PseudoColoringButton file={file} />
        <SolarizationButton file={file} />
      </div>
    </div>
  );
}
