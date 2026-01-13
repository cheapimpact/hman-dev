"use client";

import React from "react";
import { Grid, Paper, Typography, Box, Card, CardContent } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

// --- IMPORT MUI X CHARTS ---
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

// --- DATA DUMMY ---
const dataPopuler = [
  { nama: "Leadership", peserta: 120 },
  { nama: "Manajemen Proyek", peserta: 98 },
  { nama: "Data Science", peserta: 86 },
  { nama: "Public Speaking", peserta: 75 },
  { nama: "Cyber Security", peserta: 65 },
];

const dataLembaga = [
  { id: 0, value: 400, label: "Internal" },
  { id: 1, value: 300, label: "Udemy" },
  { id: 2, value: 300, label: "Coursera" },
  { id: 3, value: 200, label: "Lainnya" },
];

// Palet Warna Chart
const palette = ["#00ADB5", "#007980", "#005459", "#718096"];

export default function DashboardVisuals() {
  return (
    <Box>
      {/* --- BAGIAN 1: KPI CARDS (TETAP SAMA) --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: "#393E46",
              color: "#EEEEEE",
              borderLeft: "4px solid #00ADB5",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#b0bec5" }}>
                    TOTAL PESERTA
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    1,240
                  </Typography>
                </Box>
                <PeopleAltIcon
                  sx={{ fontSize: 60, color: "#00ADB5", opacity: 0.5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: "#393E46",
              color: "#EEEEEE",
              borderLeft: "4px solid #FFD700",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#b0bec5" }}>
                    JUDUL DIKLAT
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    45
                  </Typography>
                </Box>
                <SchoolIcon
                  sx={{ fontSize: 60, color: "#FFD700", opacity: 0.5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: "#393E46",
              color: "#EEEEEE",
              borderLeft: "4px solid #FC5C7D",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#b0bec5" }}>
                    SERTIFIKAT
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    1,105
                  </Typography>
                </Box>
                <WorkspacePremiumIcon
                  sx={{ fontSize: 60, color: "#FC5C7D", opacity: 0.5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* --- BAGIAN 2: GRAFIK (MUI X CHARTS) --- */}
      <Grid container spacing={3}>
        {/* Grafik 1: Bar Chart */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{ p: 3, bgcolor: "#393E46", color: "#EEEEEE", borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Diklat Paling Populer
            </Typography>
            <Box sx={{ width: "100%", height: 350 }}>
              <BarChart
                dataset={dataPopuler}
                xAxis={[
                  {
                    scaleType: "band",
                    dataKey: "nama",
                    // Styling Label Sumbu X agar putih
                    tickLabelStyle: { fill: "#EEEEEE" },
                  },
                ]}
                yAxis={[
                  {
                    // Styling Label Sumbu Y agar putih
                    tickLabelStyle: { fill: "#EEEEEE" },
                  },
                ]}
                series={[
                  {
                    dataKey: "peserta",
                    label: "Jumlah Peserta",
                    color: "#00ADB5", // Warna Cyan Utama
                  },
                ]}
                // Styling Garis Grid & Axis Line
                sx={{
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                      stroke: "#EEEEEE",
                      strokeWidth: 1,
                    },
                    [`.${axisClasses.text}`]: {
                      fill: "#EEEEEE",
                    },
                  },
                }}
                height={300}
                borderRadius={10} // Bar membulat
              />
            </Box>
          </Paper>
        </Grid>

        {/* Grafik 2: Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              bgcolor: "#393E46",
              color: "#EEEEEE",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Sebaran Lembaga
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: 350,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <PieChart
                colors={palette} // Terapkan palet warna kita
                series={[
                  {
                    data: dataLembaga,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                    innerRadius: 30, // Donut style
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 5,
                    arcLabel: (item) => `${item.value}`, // Label angka di dalam
                  },
                ]}
                // Styling Label Angka di dalam Pie
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: "white",
                    fontWeight: "bold",
                  },
                }}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "bottom", horizontal: "middle" },
                    padding: 0,
                    labelStyle: {
                      fill: "#EEEEEE", // Text Legend Putih
                      fontSize: 14,
                    },
                  },
                }}
                height={300}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
