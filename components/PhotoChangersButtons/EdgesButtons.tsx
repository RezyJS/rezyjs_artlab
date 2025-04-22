
import FileElement from "@/lib/structures";
import { EdgeEmpowerComponent } from "../FunctionsButtons/Edges/EdgeEmpowerComponent";
import { EdgeByShiftComponent } from "../FunctionsButtons/Edges/EdgeByShiftComponent";
import { CrossComponent } from "../FunctionsButtons/Edges/CrossComponent";
import { SobelComponent } from "../FunctionsButtons/Edges/SobelComponent";
import { PravitComponent } from "../FunctionsButtons/Edges/PravitComponent";
import { EmbossingComponent } from "../FunctionsButtons/Edges/EmbossingComponent";
import { KirschComponent } from "../FunctionsButtons/Edges/KirschComponent";

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
