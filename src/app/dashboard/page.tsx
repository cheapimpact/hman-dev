"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, Button, Alert } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function AnalitikPage() {
  // Ganti URL ini dengan URL Tableau Server/Public milik kantor Anda nanti
  // Pastikan URL-nya adalah link untuk "Embed" atau "Share"
  const tableauUrl =
    "https://public.tableau.com/views/Superstore_24/Overview?:showVizHome=no&:embed=true";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "85vh" }}>
      {/* 1. Header Halaman */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#1e293b">
            Executive Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualisasi data kinerja pegawai dan diklat (Sumber: Tableau).
          </Typography>
        </Box>

        {/* Tombol Optional: Buka Fullscreen */}
        <Button
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          href={tableauUrl}
          target="_blank"
        >
          Buka Fullscreen
        </Button>
      </Box>

      {/* 2. Container Tableau (Responsive) */}
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          borderRadius: 2,
          position: "relative",
          bgcolor: "#f8fafc",
        }}
      >
        {/* Teknik Responsive Iframe:
           Kita menggunakan iframe agar isolasi style aman dan loading cepat.
        */}
        <iframe
          src={tableauUrl}
          width="100%"
          height="100%"
          style={{
            border: "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          title="Tableau Dashboard"
        />
      </Paper>

      {/* 3. Catatan Kaki (Optional) */}
      <Alert severity="info" sx={{ mt: 2 }}>
        Data diperbarui setiap hari pukul 00:00 WIB. Jika grafik tidak muncul,
        pastikan Anda terhubung ke VPN kantor.
      </Alert>
    </Box>
  );
}
