import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { defaultButtonNeeds } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import Histogram from "@/features/image-filters/ui/FunctionsButtons/Color/HistogramComponent";
import { Button } from "@/shared/ui/button";

export const HistogramButton = ({ file }: defaultButtonNeeds) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        className="flex justify-center items-center font-semibold w-[130px]"
      >
        <p>Histogram</p>
      </Button>
    </DialogTrigger>
    <DialogContent className="min-w-[90vw] max-w-[90vw] h-[90vh] flex flex-col justify-center items-center">
      <DialogTitle>Histogram</DialogTitle>
      <Histogram file={file} />
    </DialogContent>
  </Dialog >
)