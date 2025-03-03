import { defaultButtonNeeds, MyDefaultButton } from "@/components/FunctionsButtons/Buttons";
import { processFile } from "@/lib/photos";

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