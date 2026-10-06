import { defaultButtonNeeds, MyDefaultButton } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { makeGrayScale } from "@/features/image-filters/model/photosColor";

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