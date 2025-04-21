
import FileElement from "@/lib/structures";
import { LowFrequencyFilterComponent } from "../FunctionsButtons/Noise/LowFrequencyFilterComponent";
import { HighFrequencyFilterComponent } from "../FunctionsButtons/Noise/HighFrequencyFilterComponent";
import { MedianFilter } from "../FunctionsButtons/Noise/MedianFilter";

export default function ColorButtons({ file }: { file: FileElement }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 @md:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 @4xl:grid-cols-5 @6xl:grid-cols-6 gap-5 p-6 h-full">
        <LowFrequencyFilterComponent file={file} />
        <HighFrequencyFilterComponent file={file} />
        <MedianFilter file={file} />
      </div>
    </div>
  );
}
