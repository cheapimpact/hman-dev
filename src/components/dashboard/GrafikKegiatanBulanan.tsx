"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { DasborGrafikBulanan } from "@/actions/data";

// ─── helper ──────────────────────────────────────────────────────────────────
const shortMonth = (label: string) => label.split(" ")[0].slice(0, 3);

// ─── KPI Summary Card ─────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 130 }}>
      <CardContent sx={{ p: "12px 16px !important" }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color, mt: 0.5 }}>
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props {
  data: DasborGrafikBulanan[];
}

export default function GrafikKegiatanBulanan({ data }: Props) {
  const theme = useTheme();

  // Hanya tampilkan bulan yang ada data
  const activeData = data.filter(
    (d) => d["Jumlah Kegiatan per Bulan"] > 0 || d["Jumlah Peserta Per Bulan"] > 0
  );

  const labels = activeData.map((d) => shortMonth(d["Tren Waktu"]));
  const seriesPelatihan = activeData.map((d) => d["Jumlah Kegiatan per Bulan (Pelatihan)"]);
  const seriesLainnya = activeData.map((d) => d["Jumlah Kegiatan per Bulan (Lain-lain)"]);
  const seriesPeserta = activeData.map((d) => d["Jumlah Peserta Per Bulan"]);

  // KPI agregat
  const totalKegiatan = data.reduce((s, d) => s + d["Jumlah Kegiatan per Bulan"], 0);
  const totalPeserta = data.reduce((s, d) => s + d["Jumlah Peserta Per Bulan"], 0);
  const totalPelatihan = data.reduce(
    (s, d) => s + d["Jumlah Kegiatan per Bulan (Pelatihan)"],
    0
  );
  const peakMonth = [...data].sort(
    (a, b) => b["Jumlah Peserta Per Bulan"] - a["Jumlah Peserta Per Bulan"]
  )[0];

  const colorPelatihan =
    theme.palette.mode === "light" ? theme.palette.primary.main : theme.palette.primary.light;
  const colorLainnya =
    theme.palette.mode === "light" ? theme.palette.warning.main : theme.palette.warning.light;
  const colorPeserta =
    theme.palette.mode === "light" ? theme.palette.success.main : theme.palette.success.light;

  return (
    <Box sx={{ width: "100%" }}>
      {/* ── KPI Strip ── */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 3 }}>
        <KpiCard
          label="Total Kegiatan YTD"
          value={totalKegiatan}
          sub={`${totalPelatihan} pelatihan`}
          color={colorPelatihan}
        />
        <KpiCard
          label="Total Peserta YTD"
          value={totalPeserta.toLocaleString("id-ID")}
          color={colorPeserta}
        />
        <KpiCard
          label="Bulan Paling Aktif"
          value={shortMonth(peakMonth["Tren Waktu"])}
          sub={`${peakMonth["Jumlah Peserta Per Bulan"].toLocaleString("id-ID")} peserta`}
          color={colorLainnya}
        />
      </Stack>

      {/* ── Charts: bersampingan ── */}
      <Grid container spacing={2}>
        {/* Bar Chart: Kegiatan */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}
              >
                <Box>
                  <Typography component="h2" variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Jumlah Kegiatan per Bulan
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Tahun 2026 — Pelatihan vs Lain-lain
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={`${totalKegiatan} total`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>
              <BarChart
                height={240}
                xAxis={[{ scaleType: "band", data: labels, categoryGapRatio: 0.4 }]}
                series={[
                  {
                    data: seriesPelatihan,
                    label: "Pelatihan",
                    stack: "kegiatan",
                    color: colorPelatihan,
                  },
                  {
                    data: seriesLainnya,
                    label: "Lain-lain",
                    stack: "kegiatan",
                    color: colorLainnya,
                  },
                ]}
                grid={{ horizontal: true }}
                margin={{ left: 36, right: 16, top: 8, bottom: 32 }}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "bottom", horizontal: "middle" },
                    itemMarkWidth: 8,
                    itemMarkHeight: 8,
                    labelStyle: { fontSize: 12 },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart: Peserta */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}
              >
                <Box>
                  <Typography component="h2" variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Tren Jumlah Peserta per Bulan
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Tahun 2026 — kumulatif peserta kegiatan diklat
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={`${totalPeserta.toLocaleString("id-ID")} peserta`}
                  color="success"
                  variant="outlined"
                />
              </Stack>
              <LineChart
                height={240}
                xAxis={[{ scaleType: "band", data: labels }]}
                series={[
                  {
                    data: seriesPeserta,
                    label: "Peserta",
                    color: colorPeserta,
                    area: true,
                    showMark: true,
                  },
                ]}
                grid={{ horizontal: true }}
                margin={{ left: 48, right: 16, top: 8, bottom: 32 }}
                slotProps={{
                  legend: { hidden: true },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
