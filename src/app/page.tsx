"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import DashboardVisuals from "@/components/DashboardVisuals"; // Import komponen yg baru dibuat

export default function DashboardPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#EEEEEE" }}>
          Dashboard Diklat
        </Typography>
        <Typography variant="body1" sx={{ color: "#b0bec5" }}>
          Ringkasan eksekutif data pengembangan kompetensi pegawai.
        </Typography>
      </Box>

      {/* Panggil Komponen Visualisasi Data Dummy */}
      <DashboardVisuals />
    </Box>
  );
}
