"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import StackList from "@/lib/structures"

const chartConfig = {
  val: {
    label: "pixel",
    color: "#ffffff",
  },
} satisfies ChartConfig

type ChartData = Array<{ pixel_id: number, value: number }>;

const getPixels = (stacks: StackList): ChartData => {
  const photo = stacks.currentFile()!.getCurrentPhoto()!;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = photo.width;
  canvas.height = photo.height;

  ctx!.drawImage(photo, 0, 0);

  const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height).data;

  const pixels = [];
  let amount = 0;

  for (let i = 0; i < imageData.length; i += 4) {
    if (pixels[imageData[i]] === undefined) pixels[imageData[i]] = 1;
    else pixels[imageData[i]] += 1;
    ++amount;
  }

  const answer: ChartData = [];
  for (let i = 0; i < pixels.length; ++i) {
    answer.push({ pixel_id: i, value: pixels[i] / amount * 100 });
  }

  return answer;
}

export default function Histogram({ stacks }: { stacks: StackList }) {

  const data: ChartData = getPixels(stacks);

  return (
    <ChartContainer config={chartConfig} className="w-[80vw] h-[80vh]">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="pixel_id"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="value" fill="var(--light-accent-color)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}