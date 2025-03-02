import { ChartColumnBig } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { defaultButtonNeeds, MyDefaultButton } from "./Buttons";
import Histogram from "./HistogramComponent";

export const HistogramButton = ({ stacks }: defaultButtonNeeds) => (
  <Dialog>
    <DialogTrigger asChild>
      <div className='flex justify-evenly'>
        <MyDefaultButton
          text='Histogram'
          callback={() => { }}
        >
          <ChartColumnBig />
        </MyDefaultButton>
      </div>
    </DialogTrigger>
    <DialogContent className="min-w-[90vw] max-w-[90vw] h-[90vh] flex flex-col justify-center items-center">
      <DialogTitle>Histogram</DialogTitle>
      <Histogram stacks={stacks} />
    </DialogContent>
  </Dialog>
)