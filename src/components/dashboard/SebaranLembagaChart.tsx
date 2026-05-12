"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import CircleIcon from "@mui/icons-material/Circle";

const dataLembaga = [
  { id: 0, value: 420, label: "Internal" },
  { id: 1, value: 310, label: "Udemy" },
  { id: 2, value: 280, label: "Coursera" },
  { id: 3, value: 180, label: "Lainnya" },
];

export default function SebaranLembagaChart() {
  const theme = useTheme();

  const palette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.grey[500],
  ];

  return (
    <Card variant="outlined" sx={{ width: "100%", height: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Sebaran Lembaga Diklat
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <PieChart
            colors={palette}
            series={[
              {
                data: dataLembaga,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
                innerRadius: 40,
                outerRadius: 90,
                paddingAngle: 3,
                cornerRadius: 5,
                arcLabel: (item) => `${item.value}`,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
              },
            }}
            slotProps={{ legend: { hidden: true } }}
            height={200}
          />
        </Box>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {dataLembaga.map((item, i) => (
            <Box
              key={item.id}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircleIcon sx={{ fontSize: 10, color: palette[i] }} />
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {item.label}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
