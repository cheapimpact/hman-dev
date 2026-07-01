"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";

export type ChartItem = { name: string; value: number; color: string };

function MiniPieCard({ title, data }: { title: string; data: ChartItem[] }) {
  const series = data.map((d, i) => ({
    id: i,
    value: d.value,
    label: d.name,
    color: d.color,
  }));

  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 220, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Box sx={{ height: 200 }}>
          <PieChart
            series={[
              {
                data: series,
                innerRadius: 30,
                outerRadius: 70,
                paddingAngle: 3,
                cornerRadius: 4,
                highlightScope: { fade: "global", highlight: "item" },
                faded: { innerRadius: 30, additionalRadius: -5, color: "gray" },
              },
            ]}
            // position: horizontal uses 'start' | 'center' | 'end'
            // vertical uses 'top' | 'middle' | 'bottom'
            slotProps={{
              legend: {
                direction: "vertical",
                position: { vertical: "middle", horizontal: "end" },
              },
            }}
            margin={{ right: 120 }}
            height={200}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export type ChartData = {
  byJenjang: ChartItem[];
  byLokasi: ChartItem[];
  byStatus: ChartItem[];
  byPembiayaan: ChartItem[];
};

export default function PendidikanCharts({ data }: { data: ChartData }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        gap: 2,
      }}
    >
      <MiniPieCard title="Jenjang Pendidikan" data={data.byJenjang} />
      <MiniPieCard title="Lokasi Studi" data={data.byLokasi} />
      <MiniPieCard title="Status Studi" data={data.byStatus} />
      <MiniPieCard title="Pembiayaan" data={data.byPembiayaan} />
    </Box>
  );
}
