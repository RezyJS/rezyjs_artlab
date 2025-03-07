"use client"

import { Line, LineChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import FileElement from "@/lib/structures"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

const chartConfig = {
  red: {
    label: "Red",
    color: '#ff0000'
  },
  green: {
    label: "Green",
    color: '#00ff00'
  },
  blue: {
    label: "Blue",
    color: '#0000ff'
  },
} satisfies ChartConfig

type ChartData = Array<{ pixel_id: number, red: number, green: number, blue: number }>;

const getPixels = (file: FileElement): ChartData => {
  const photo = file.getCurrentPhoto()!;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = photo.width;
  canvas.height = photo.height;

  ctx.drawImage(photo, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const redPixels: number[] = [];
  const greenPixels: number[] = [];
  const bluePixels: number[] = [];

  const amount = { red: 0, green: 0, blue: 0 };

  for (let i = 0; i < pixels.length; i += 4) {
    if (redPixels[pixels[i]] === undefined) {
      redPixels[pixels[i]] = 0;
    }

    redPixels[pixels[i]] += 1;
    ++amount.red;

    if (greenPixels[pixels[i + 1]] === undefined) {
      greenPixels[pixels[i + 1]] = 0;
    }

    greenPixels[pixels[i + 1]] += 1;
    ++amount.green;

    if (bluePixels[pixels[i + 2]] === undefined) {
      bluePixels[pixels[i + 2]] = 0;
    }

    bluePixels[pixels[i + 2]] += 1;
    ++amount.blue;
  }

  const answer: ChartData = [];
  for (let i = 0; i < redPixels.length; ++i) {
    answer.push({ pixel_id: i, red: redPixels[i] || 0, green: greenPixels[i] || 0, blue: bluePixels[i] || 0 });
  }

  return answer;
}

export default function Histogram({ file }: { file: FileElement }) {

  const [showRed, setShowRed] = useState(true);
  const [showGreen, setShowGreen] = useState(true);
  const [showBlue, setShowBlue] = useState(true);

  if (file.isEmpty()) {
    return <p>Load a file!</p>;
  }

  const data: ChartData = getPixels(file);

  return (
    <div className="flex flex-col gap-5 w-[80vw] h-[80vh]">
      <ChartContainer config={chartConfig} className="w-[80vw] h-[70vh]">
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="pixel_id"
            tickLine={true}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={true}
            content={<ChartTooltipContent hideLabel />}
          />
          {
            showRed ?
              <Line dataKey="red" fill="#ff0000" radius={4} type={'linear'} dot={false} stroke='#ff0000' />
              : <></>
          }
          {
            showGreen ?
              <Line dataKey="green" fill="#00ff00" radius={4} type={'linear'} dot={false} stroke='#00ff00' />
              : <></>
          }
          {
            showBlue ?
              <Line dataKey="blue" fill="#0000ff" radius={4} type={'linear'} dot={false} stroke='#0000ff' />
              : <></>
          }
        </LineChart>
      </ChartContainer>
      <div className="flex justify-center items-center gap-5">
        <label className="flex items-center justify-center gap-2">
          <Checkbox checked={showRed} onCheckedChange={() => setShowRed((val) => !val)} />
          Red
        </label>
        <label className="flex items-center justify-center gap-2">
          <Checkbox checked={showGreen} onCheckedChange={() => setShowGreen((val) => !val)} />
          Green
        </label>
        <label className="flex items-center justify-center gap-2">
          <Checkbox checked={showBlue} onCheckedChange={() => setShowBlue((val) => !val)} />
          Blue
        </label>
      </div>
    </div>
  );
}