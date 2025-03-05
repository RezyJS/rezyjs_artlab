"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import FileElement from "@/lib/structures"

const chartConfig = {
  val: {
    label: "pixel",
    color: "#ffffff",
  },
} satisfies ChartConfig

type ChartData = Array<{ pixel_id: number, value: number }>;

const getPixels = (file: FileElement): ChartData => {
  const photo = file.getCurrentPhoto()!;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = photo.width;
  canvas.height = photo.height;

  ctx.drawImage(photo, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const myPixels: number[] = [];

  let amount = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    for (let j = i; j < i + 3; ++j) {
      if (myPixels[pixels[j]] === undefined) {
        myPixels[pixels[j]] = 0;
      }

      myPixels[pixels[j]] += 1;
      ++amount;
    }
  }

  const answer: ChartData = [];
  for (let i = 0; i < myPixels.length; ++i) {
    const value = myPixels[i] / amount * 100;
    if (isNaN(value)) {
      answer.push({ pixel_id: i, value: 0 });
    } else {
      answer.push({ pixel_id: i, value: value });
    }
  }

  return answer;
}

export default function Histogram({ file }: { file: FileElement }) {

  if (file.isEmpty()) {
    return <p>Load a file!</p>;
  }

  const data: ChartData = getPixels(file);

  return (
    <ChartContainer config={chartConfig} className="w-[80vw] h-[80vh]">
      <BarChart accessibilityLayer data={data}>
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
        <Bar dataKey="value" fill="var(--light-accent-color)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}