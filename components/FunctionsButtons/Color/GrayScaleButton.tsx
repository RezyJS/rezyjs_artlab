import { defaultButtonNeeds, MyDefaultButton } from "@/components/FunctionsButtons/Color/Buttons";
import { makeGrayScale } from "@/lib/photosColor";

export const GrayScaleButton = ({ file }: defaultButtonNeeds) => (
  <MyDefaultButton
    text="GrayScale"
    callback={
      () => {
        makeGrayScale(file);
      }
    }
  />
)