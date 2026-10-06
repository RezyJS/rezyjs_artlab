"use client"

import { Line, LineChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart"
import { FileElement, getHistogram } from "@/entities/image"
import { useState, useEffect, useSyncExternalStore } from "react"
import { Checkbox } from "@/shared/ui/checkbox"

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


export default function Histogram({ file }: { file: FileElement }) {

  const revision = useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const [result, setResult] = useState<{ revision: number; data: ChartData; error?: string } | null>(null);
  useEffect(() => {
    let active = true;
    getHistogram(file).then(data => { if (active) setResult({ revision, data }); })
      .catch(error => { if (active) setResult({ revision, data: [], error: String(error) }); });
    return () => { active = false; };
  }, [file, revision]);

  const [showRed, setShowRed] = useState(true);
  const [showGreen, setShowGreen] = useState(true);
  const [showBlue, setShowBlue] = useState(true);

  if (file.isEmpty()) {
    return <p>Load a file!</p>;
  }

  if (result?.revision !== revision) return <p>Loading histogram…</p>;
  if (result.error) return <p>{result.error}</p>;
  const data = result.data;

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
