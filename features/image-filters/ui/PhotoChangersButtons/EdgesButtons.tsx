
import { FileElement } from '@/entities/image';
import { EdgeEmpowerComponent } from "@/features/image-filters/ui/FunctionsButtons/Edges/EdgeEmpowerComponent";
import { EdgeByShiftComponent } from "@/features/image-filters/ui/FunctionsButtons/Edges/EdgeByShiftComponent";
import { CrossComponent } from "@/features/image-filters/ui/FunctionsButtons/Edges/CrossComponent";
import { SobelComponent } from "@/features/image-filters/ui/FunctionsButtons/Edges/SobelComponent";
import { PravitComponent } from "@/features/image-filters/ui/FunctionsButtons/Edges/PravitComponent";
import { EmbossingComponent } from "@/features/image-filters/ui/FunctionsButtons/Edges/EmbossingComponent";
import { KirschComponent } from "@/features/image-filters/ui/FunctionsButtons/Edges/KirschComponent";

export default function EdgesButtons({ file }: { file: FileElement }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 @md:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 @4xl:grid-cols-5 @6xl:grid-cols-6 gap-5 p-6 h-full">
        <EdgeEmpowerComponent file={file} />
        <EdgeByShiftComponent file={file} />
        <CrossComponent file={file} />
        <SobelComponent file={file} />
        <PravitComponent file={file} />
        <EmbossingComponent file={file} />
        <KirschComponent file={file} />
      </div>
    </div>
  );
}
