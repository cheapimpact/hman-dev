"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Header from "@/components/dashboard/Header";
import PendidikanStatCards, { SummaryStats } from "@/components/dashboard/pendidikan/PendidikanStatCards";
import PendidikanCharts, { ChartData } from "@/components/dashboard/pendidikan/PendidikanCharts";
import TabelTugasBelajar from "@/components/dashboard/pendidikan/TabelTugasBelajar";
import { dummyTugasBelajar } from "@/components/dashboard/pendidikan/pendidikan-data";

// ─── Pre-compute stats dari dummy data ───────────────────────────────────────
function buildStats() {
  const data = dummyTugasBelajar;
  const stats: SummaryStats = {
    total: data.length,
    aktif: data.filter((d) => d.statusStudi === "Aktif").length,
    lulus: data.filter((d) => d.statusStudi === "Lulus").length,
    cuti: data.filter((d) => d.statusStudi === "Cuti" || d.statusStudi === "Dropout").length,
    s2: data.filter((d) => d.jenjangPendidikan === "S2").length,
    s3: data.filter((d) => d.jenjangPendidikan === "S3").length,
    dn: data.filter((d) => d.lokasi === "DN").length,
    ln: data.filter((d) => d.lokasi === "LN").length,
    linkage: data.filter((d) => d.lokasi === "Linkage").length,
    apbn: data.filter((d) => d.sumberPendanaan.includes("APBN")).length,
    lpdp: data.filter((d) => d.sumberPendanaan.includes("LPDP")).length,
  };
  return stats;
}

function buildChartData(): ChartData {
  const data = dummyTugasBelajar;

  const count = (arr: typeof data, key: keyof typeof data[0]) => {
    const map: Record<string, number> = {};
    arr.forEach((d) => {
      const v = String(d[key]);
      map[v] = (map[v] ?? 0) + 1;
    });
    return map;
  };

  const jenjangMap = count(data, "jenjangPendidikan");
  const lokasiMap = count(data, "lokasi");
  const statusMap = count(data, "statusStudi");
  const pembiayaanMap = count(data, "pembiayaan");

  const jenjangColors: Record<string, string> = {
    S1: "#42a5f5", S2: "#7e57c2", S3: "#ef5350", D4: "#26a69a",
  };
  const lokasiColors: Record<string, string> = {
    DN: "#66bb6a", LN: "#ffa726", Linkage: "#26c6da",
  };
  const statusColors: Record<string, string> = {
    Aktif: "#4caf50", Lulus: "#2196f3", Cuti: "#ff9800", Dropout: "#f44336",
  };
  const pembiayaanColors: Record<string, string> = {
    Full: "#43a047", "Sharing Cost": "#fb8c00",
  };

  return {
    byJenjang: Object.entries(jenjangMap).map(([name, value]) => ({
      name, value, color: jenjangColors[name] ?? "#90a4ae",
    })),
    byLokasi: Object.entries(lokasiMap).map(([name, value]) => ({
      name, value, color: lokasiColors[name] ?? "#90a4ae",
    })),
    byStatus: Object.entries(statusMap).map(([name, value]) => ({
      name, value, color: statusColors[name] ?? "#90a4ae",
    })),
    byPembiayaan: Object.entries(pembiayaanMap).map(([name, value]) => ({
      name, value, color: pembiayaanColors[name] ?? "#90a4ae",
    })),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPendidikanPage() {
  const stats = buildStats();
  const chartData = buildChartData();

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, overflow: "auto", minHeight: "100vh" }}
    >
      <Stack
        spacing={3}
        sx={{
          alignItems: "stretch",
          mx: { xs: 2, md: 3 },
          pb: 5,
          mt: { xs: 8, md: 0 },
          maxWidth: 1500,
        }}
      >
        <Header />

        {/* ── Hero Banner ── */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(126,87,194,0.12) 0%, rgba(2,136,209,0.08) 50%, rgba(46,125,50,0.06) 100%)",
            border: "1px solid",
            borderColor: "rgba(126,87,194,0.20)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circle */}
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              bgcolor: "rgba(126,87,194,0.07)",
              pointerEvents: "none",
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2.5,
                bgcolor: "rgba(126,87,194,0.12)",
                display: "flex",
                width: "fit-content",
                fontSize: 36,
                lineHeight: 1,
              }}
            >
              📚
            </Box>
            <Box flexGrow={1}>
              <Typography variant="h5" fontWeight={800}>
                Dashboard Pendidikan — Tugas Belajar
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                Monitoring peserta tugas belajar ASN · Data: Prototype Dummy
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Chip label="Prototype" color="secondary" variant="outlined" size="small" />
              <Chip label={`${dummyTugasBelajar.length} Peserta`} color="primary" variant="outlined" size="small" />
              <Chip label="Dummy Data" color="warning" variant="outlined" size="small" />
            </Stack>
          </Stack>
        </Box>

        {/* ── Summary Stats ── */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 1, borderRadius: 2, bgcolor: "rgba(126,87,194,0.12)",
                display: "flex", fontSize: 20, lineHeight: 1,
              }}
            >
              📊
            </Box>
            <Box>
              <Typography component="h2" variant="subtitle1" fontWeight={700}>
                Ringkasan Data
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Statistik keseluruhan peserta tugas belajar
              </Typography>
            </Box>
          </Stack>
          <PendidikanStatCards stats={stats} />
        </Box>

        {/* ── Charts ── */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 1, borderRadius: 2, bgcolor: "rgba(2,136,209,0.12)",
                display: "flex", fontSize: 20, lineHeight: 1,
              }}
            >
              🥧
            </Box>
            <Box>
              <Typography component="h2" variant="subtitle1" fontWeight={700}>
                Distribusi Data
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Proporsi per jenjang, lokasi, status studi, dan pembiayaan
              </Typography>
            </Box>
          </Stack>
          <PendidikanCharts data={chartData} />
        </Box>

        {/* ── Tabel ── */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 1, borderRadius: 2, bgcolor: "rgba(46,125,50,0.12)",
                display: "flex", fontSize: 20, lineHeight: 1,
              }}
            >
              📋
            </Box>
            <Box>
              <Typography component="h2" variant="subtitle1" fontWeight={700}>
                Daftar Peserta Tugas Belajar
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Data lengkap semua peserta — bisa difilter, dicari, dan diurutkan
              </Typography>
            </Box>
          </Stack>
          <TabelTugasBelajar data={dummyTugasBelajar} />
        </Box>
      </Stack>
    </Box>
  );
}
