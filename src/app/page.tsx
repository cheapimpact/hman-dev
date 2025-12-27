"use client";

import * as React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ClassIcon from "@mui/icons-material/Class";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <Box>
      {/* 1. Judul Halaman */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1e293b" }}
      >
        Dashboard Overview
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "#64748b" }}>
        Selamat datang di Sistem Informasi Data Peserta Diklat.
      </Typography>

      {/* 2. Kartu Statistik (Grid System) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Kartu 1: Total Peserta */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: "100%", borderLeft: "5px solid #1976d2" }}
            elevation={2}
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
                  <Typography color="text.secondary" gutterBottom>
                    Total Peserta
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    1,240
                  </Typography>
                </Box>
                <PeopleAltIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Kartu 2: Diklat Aktif */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: "100%", borderLeft: "5px solid #2e7d32" }}
            elevation={2}
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
                  <Typography color="text.secondary" gutterBottom>
                    Diklat Aktif
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    3
                  </Typography>
                </Box>
                <ClassIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Kartu 3: Menunggu Verifikasi */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: "100%", borderLeft: "5px solid #ed6c02" }}
            elevation={2}
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
                  <Typography color="text.secondary" gutterBottom>
                    Verifikasi Pending
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    15
                  </Typography>
                </Box>
                <PendingActionsIcon sx={{ fontSize: 40, color: "#ed6c02" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 3. Area Konten Bawah (Grid 2 Kolom) */}
      <Grid container spacing={3}>
        {/* Kolom Kiri: Akses Cepat */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Akses Cepat
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              Silakan pilih menu di bawah ini untuk memulai pengelolaan data.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Link href="/pencarian" passHref>
                <Button variant="contained" startIcon={<PeopleAltIcon />}>
                  Cari Data Peserta
                </Button>
              </Link>
              <Button variant="outlined" startIcon={<ClassIcon />}>
                Jadwal Diklat (Coming Soon)
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Kolom Kanan: Aktivitas Terbaru (List) */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 0, height: "100%" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
              <Typography variant="h6" fontWeight="bold">
                Peserta Terbaru
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#1976d2" }}>AB</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Ahmad Budi"
                  secondary="Terdaftar: 27 Des 2025"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#ed6c02" }}>SR</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Siti Rahma"
                  secondary="Terdaftar: 26 Des 2025"
                />
              </ListItem>
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Button endIcon={<ArrowForwardIcon />} size="small">
                  Lihat Semua
                </Button>
              </Box>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
