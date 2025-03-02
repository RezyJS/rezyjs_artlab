/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { loadNewPhoto } from "@/lib/photos";
import StackList from "@/lib/structures";
import { toast } from "sonner";


export const Input = ({ files, setPicture }: { files: StackList, setPicture: Function }) => (
  <input
    type="file"
    name="input"
    id="input"
    className='hidden'
    onClick={
      (e) => {
        e.currentTarget.value = "";
      }
    }
    onInput={
      (e) => {
        e.preventDefault();
        if (!e.currentTarget.files) {
          toast.error("No data", {
            description: 'No images were provided'
          });
          return;
        }

        if (!files.currentFile()) {
          e.currentTarget.value = "";
          toast.error("No file", {
            description: "Create a File to continue",
          });
          return;
        }

        const file = e.currentTarget.files[0];
        if (!file.type.startsWith('image')) {
          toast.error('Wrong format', {
            description: 'This file is not an image',
          });
          return;
        }

        loadNewPhoto(file, files.currentFile()!, setPicture);
      }
    }
  />
)