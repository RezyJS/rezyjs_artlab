import { defaultButtonNeeds, MyDefaultButton } from "@/components/FunctionsButtons/Buttons";
import { processFile } from "@/lib/photos";

export const GrayScaleButton = ({ stacks, setPicture }: defaultButtonNeeds) => (
  <MyDefaultButton
    text="GrayScale"
    callback={
      () => {
        processFile('grayScale', stacks.currentFile()!, setPicture);
        stacks.setCurrentFile(stacks.currentFileId);
      }
    }
  />
)