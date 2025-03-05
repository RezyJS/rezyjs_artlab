import { defaultButtonNeeds, MyDefaultButton } from "@/components/FunctionsButtons/Color/Buttons";
import { processFile } from "@/lib/photosHandlers";

export const GrayScaleButton = ({ file }: defaultButtonNeeds) => (
  <MyDefaultButton
    text="GrayScale"
    callback={
      () => {
        processFile('grayScale', file);
      }
    }
  />
)