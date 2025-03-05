import { ChartColumnBig } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { defaultButtonNeeds } from "./Buttons";
import Histogram from "./HistogramComponent";
import { Button } from "../ui/button";

export const HistogramButton = ({ file }: defaultButtonNeeds) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        className="flex justify-center items-center font-semibold"
      >
        <p>Histogram</p>
        <ChartColumnBig />
      </Button>
    </DialogTrigger>
    <DialogContent className="min-w-[90vw] max-w-[90vw] h-[90vh] flex flex-col justify-center items-center">
      <DialogTitle>Histogram</DialogTitle>
      <Histogram file={file} />
    </DialogContent>
  </Dialog >
)