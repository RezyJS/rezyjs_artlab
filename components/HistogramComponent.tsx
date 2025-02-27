"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  val: {
    label: "pixel",
    color: "#ffffff",
  },
} satisfies ChartConfig

export default function Histogram({ data }: { data: Array<{ pixel_id: number, value: number }> }) {
  return (
    <ChartContainer config={chartConfig} className="w-[768px] h-[200px]">
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