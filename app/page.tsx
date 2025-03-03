'use client'

import Container from "@/components/ResizableContainer/ResizableContainer";
import { useState } from "react";
import FileElement from "@/lib/structures";

export default function App() {

  const [picture, setPicture] = useState<string>('/placeholder.jpg');
  const [file,] = useState<FileElement>(new FileElement(setPicture));

  if (file === undefined) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <Container
      file={file}
      picture={picture}
    />
  );
}