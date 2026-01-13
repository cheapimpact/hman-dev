"use client";

import CircleIcon from "@mui/icons-material/Circle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  createTheme,
  CssBaseline,
  Grid,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { LineChart } from "@mui/x-charts/LineChart";
import React from "react";

function ActivityAccordion() {
  // Data Detail
  const details = [
    { label: "Pelatihan", value: 7, color: "#3399FF" }, // Biru
    { label: "Assesment", value: 2, color: "#FFBB28" }, // Kuning
    { label: "Lain-lain", value: 1, color: "#00C49F" }, // Hijau Teal
  ];
  return (
    <Accordion
      disableGutters
      defaultExpanded // Agar langsung terbuka saat dimuat (opsional)
      sx={{
        bgcolor: "#101923", // Warna kartu dashboard
        color: "#fff",
        border: "1px solid #1E2932", // Border halus
        borderRadius: "12px !important", // Sudut membulat
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        "&:before": { display: "none" }, // Hilangkan garis pemisah default MUI
        "&.Mui-expanded": { margin: 0 }, // Hilangkan margin default saat expand
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#3399FF" }} />}
        sx={{
          minHeight: 60,
          "& .MuiAccordionSummary-content": { margin: "12px 0" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            pr: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
            Jumlah Kegiatan
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#3399FF" }}
          >
            10
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ borderTop: "1px solid #1E2932", pt: 2, pb: 3 }}>
        <Stack spacing={2}>
          {details.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {/* Dot Indikator Warna */}
                <CircleIcon sx={{ fontSize: 10, color: item.color }} />
                <Typography variant="body2" sx={{ color: "#B2BAC2" }}>
                  {item.label}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
// --- 1. TEMA DARK MODE (MUI STYLE) ---
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0b1219", // Sangat gelap (mirip referensi MUI)
      paper: "#101923", // Sedikit lebih terang untuk kartu
    },
    primary: { main: "#3399FF" }, // Biru khas MUI
    secondary: { main: "#538491" }, // Warna dari palet Anda
    text: { primary: "#fff", secondary: "#B2BAC2" },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h6: { fontWeight: 600, fontSize: "1rem" },
    h3: { fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0F1924", // Warna kartu spesifik
          border: "1px solid #1E2932", // Border tipis halus
          borderRadius: 12,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
});

// --- KOMPONEN KARTU KECIL (KPI) ---
function StatCard({
  title,
  value,
  color,
  data,
}: {
  title: string;
  value: string;
  color: string;
  data: number[];
}) {
  return (
    <Paper
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ height: 50, mt: 2 }}>
        {/* Sparkline Mini */}
        <LineChart
          series={[{ data, color: color, area: true, showMark: false }]}
          xAxis={[
            { data: [1, 2, 3, 4, 5], scaleType: "point", hideTooltip: true },
          ]}
          leftAxis={null}
          bottomAxis={null}
          margin={{ top: 5, bottom: 0, left: 0, right: 0 }}
          sx={{ ".MuiAreaElement-root": { fillOpacity: 0.1 } }} // Transparansi area
        />
      </Box>
    </Paper>
  );
}

// --- KOMPONEN HEATMAP (SIMULASI CSS GRID) ---
// Karena MUI X Charts belum punya Heatmap native, kita buat manual dengan CSS Grid agar mirip referensi
function HeatmapGrid() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const hours = ["6am", "10am", "12am", "5pm", "8pm"];

  // Fungsi generate warna acak biru
  const getColor = () => {
    const opacity = Math.random();
    return `rgba(51, 153, 255, ${opacity > 0.2 ? opacity : 0.1})`;
  };

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 0.5,
        }}
      >
        <Box></Box> {/* Spacer pojok kiri atas */}
        {days.map((d) => (
          <Typography
            key={d}
            variant="caption"
            align="center"
            color="text.secondary"
          >
            {d}
          </Typography>
        ))}
        {hours.map((h, i) => (
          <React.Fragment key={h}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ alignSelf: "center" }}
            >
              {h}
            </Typography>
            {days.map((_, j) => (
              <Box
                key={`${i}-${j}`}
                sx={{
                  width: "100%",
                  paddingTop: "100%", // Aspect ratio 1:1
                  bgcolor: getColor(),
                  borderRadius: 0.5,
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

export default function MuiDashboardPage() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, minHeight: "100vh" }}>
        <Grid container spacing={3}>
          {/* === KOLOM KIRI (UTAMA) === */}
          <Grid size={{ xs: 6, md: 6, lg: 6 }}>
            <Box>
              <ActivityAccordion />
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 6, lg: 6 }}>
            <Box>
              <ActivityAccordion />
            </Box>
          </Grid>
          <Grid size={{ xs: 8, md: 8, lg: 8 }}>
            <Stack
              direction="row"
              spacing={3}
              sx={{ xs: 12, md: 12, height: "100%" }}
            >
              {/* 1. ROW ATAS: 3 KPI CARDS */}
              <Grid>
                <StatCard
                  title="Total Peserta"
                  value="144k"
                  color="#3399FF"
                  data={[10, 15, 12, 20, 18]}
                />
              </Grid>
              <Grid>
                <StatCard
                  title="Sertifikat Terbit"
                  value="325k"
                  color="#00C49F"
                  data={[20, 18, 25, 22, 30]}
                />
              </Grid>
              <Grid>
                <StatCard
                  title="Diklat Aktif"
                  value="200k"
                  color="#FFBB28"
                  data={[5, 8, 12, 10, 15]}
                />
              </Grid>
            </Stack>
          </Grid>

          <Grid size={{ xs: 4, md: 4 }}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  Target Realisasi Anggaran
                </Typography>
                <Box sx={{ width: "100%", height: 150, position: "relative" }}>
                  <Gauge
                    value={75}
                    startAngle={-110}
                    endAngle={110}
                    sx={{
                      [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 24,
                        transform: "translate(0px, 0px)",
                        fill: "#fff",
                      },
                      [`& .${gaugeClasses.valueArc}`]: {
                        fill: "#3399FF",
                      },
                    }}
                    text={({ value }) => `${value}%`}
                  />
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: -2 }}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CircleIcon sx={{ fontSize: 10, color: "#3399FF" }} />{" "}
                    <Typography variant="caption">Terpakai</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CircleIcon sx={{ fontSize: 10, color: "#2D3748" }} />{" "}
                    <Typography variant="caption">Sisa</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <Grid size={{ xs: 8, md: 8, lg: 8 }}>
              {/* 2. AREA TENGAH: GRAFIK BESAR (MAIN CHART) */}
              <Paper sx={{ p: 3, flexGrow: 1, minHeight: 400 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      Statistik Peserta Tahunan
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Growth (+15%)
                    </Typography>
                  </Box>
                  <Chip label="Tahun 2025" size="small" variant="outlined" />
                </Box>

                <Box sx={{ width: "100%", height: 350 }}>
                  <LineChart
                    series={[
                      {
                        data: [
                          20, 50, 80, 200, 300, 450, 400, 380, 500, 600, 550,
                          700,
                        ],
                        label: "Peserta",
                        area: true,
                        showMark: false,
                        color: "#3399FF",
                      },
                      {
                        data: [
                          10, 30, 40, 100, 150, 200, 220, 210, 300, 350, 320,
                          400,
                        ],
                        label: "Lulus",
                        area: true,
                        showMark: false,
                        color: "#FFBB28",
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "point",
                        data: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "Mei",
                          "Jun",
                          "Jul",
                          "Agu",
                          "Sep",
                          "Okt",
                          "Nov",
                          "Des",
                        ],
                      },
                    ]}
                    sx={{
                      ".MuiLineElement-root": { strokeWidth: 3 },
                      ".MuiAreaElement-series-Peserta": {
                        fill: "url('#gradientBlue')",
                        fillOpacity: 0.3,
                      },
                      ".MuiAreaElement-series-Lulus": {
                        fill: "url('#gradientYellow')",
                        fillOpacity: 0.3,
                      },
                    }}
                    grid={{ horizontal: true }}
                  >
                    <defs>
                      <linearGradient
                        id="gradientBlue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3399FF"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="100%"
                          stopColor="#3399FF"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="gradientYellow"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#FFBB28"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="100%"
                          stopColor="#FFBB28"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 4, md: 4, lg: 4 }}>
              {/* 2. BAR CHART HARIAN */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Peserta Login Harian
                </Typography>
                <Box sx={{ width: "100%", height: 200 }}>
                  <BarChart
                    series={[
                      {
                        data: [35, 44, 24, 34, 50, 10, 5],
                        color: "#3399FF",
                        borderRadius: 4,
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "band",
                        data: ["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"],
                        categoryGapRatio: 0.4,
                      },
                    ]}
                    leftAxis={null} // Hilangkan sumbu Y agar bersih
                    margin={{ top: 10, bottom: 20, left: 0, right: 0 }}
                  />
                </Box>
              </Paper>

              {/* 3. HEATMAP (AKTIVITAS JAM) */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Waktu Akses Terpadat
                </Typography>
                <HeatmapGrid />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
