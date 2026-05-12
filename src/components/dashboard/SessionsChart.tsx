"use client";

import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("id-ID", { month: "short" });
  const daysInMonth = date.getDate();
  const days: string[] = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function SessionsChart() {
  const theme = useTheme();
  const data = getDaysInMonth(4, 2025);

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Peserta Aktif
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              3.842
            </Typography>
            <Chip size="small" color="success" label="+18%" />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Peserta aktif per hari selama 30 hari terakhir
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data,
              tickInterval: (_index: number, i: number) => (i + 1) % 5 === 0,
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: "pelatihan",
              label: "Pelatihan",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: [
                80, 120, 95, 150, 180, 200, 240, 210, 270, 300, 260, 330,
                360, 390, 420, 450, 400, 480, 510, 540, 500, 570, 600,
                630, 660, 690, 720, 750, 780, 810,
              ],
            },
            {
              id: "assessment",
              label: "Assessment",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: [
                30, 50, 40, 70, 60, 90, 120, 100, 130, 150, 120, 160,
                175, 190, 210, 220, 145, 235, 250, 265, 280, 295, 310,
                325, 280, 340, 355, 370, 385, 400,
              ],
            },
            {
              id: "mandiri",
              label: "Mandiri",
              showMark: false,
              curve: "linear",
              stack: "total",
              stackOrder: "ascending",
              data: [
                50, 75, 60, 85, 65, 100, 120, 110, 130, 140, 125,
                150, 170, 185, 160, 195, 205, 175, 215, 225, 200, 235,
                250, 260, 240, 270, 280, 295, 305, 315,
              ],
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-mandiri": {
              fill: "url('#mandiri')",
            },
            "& .MuiAreaElement-series-assessment": {
              fill: "url('#assessment')",
            },
            "& .MuiAreaElement-series-pelatihan": {
              fill: "url('#pelatihan')",
            },
          }}
          hideLegend
        >
          <AreaGradient color={theme.palette.primary.dark} id="mandiri" />
          <AreaGradient color={theme.palette.primary.main} id="assessment" />
          <AreaGradient color={theme.palette.primary.light} id="pelatihan" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
