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

  const pixels: number[] = [];
  let amount = 0;

  imageData.forEach((val: number) => {
    if (pixels[val] === undefined) {
      pixels[val] = 0;
    }

    pixels[val] += 1;
    ++amount;
  });

  const answer: ChartData = [];
  for (let i = 0; i < pixels.length; ++i) {
    const value = pixels[i] / amount * 100;
    if (isNaN(value)) {
      answer.push({ pixel_id: i, value: 0 });
    } else {
      answer.push({ pixel_id: i, value: value });
    }
  }

  console.info(`pixels: ${pixels}`)
  console.info(answer);

  return answer;
}

export default function Histogram({ stacks }: { stacks: StackList }) {

  if (stacks.currentFile() === null || stacks.currentFile()!.isEmpty()) {
    return <p>Load a file!</p>;
  }

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