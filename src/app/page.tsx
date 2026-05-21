"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const theme = useTheme();

  return (
    <Box sx={{ 
      minHeight: "80vh", 
      display: "flex", 
      alignItems: "center",
      py: 4,
      px: { xs: 4, md: 8, lg: 12 }
    }}>
      <Grid container spacing={6} alignItems="center">
        {/* Teks Intro */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ pr: { md: 4 } }}>
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                letterSpacing: 1.5,
                mb: 1,
                display: "block",
              }}
            >
              Selamat Datang di
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              Aplikasi Mandiri Pengembangan
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 4,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              Sistem informasi terpusat untuk mengelola, melacak, dan menganalisis 
              seluruh program pengembangan kompetensi serta pendidikan dan pelatihan (Diklat) pegawai. 
              Pantau distribusi kegiatan, tren peserta, dan penyerapan anggaran dengan mudah melalui dasbor eksekutif kami.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/dashboard/p1"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5
                }}
              >
                Mulai Eksplorasi Dasbor
              </Button>
            </Stack>
          </Box>
        </Grid>

        {/* Gambar Ilustrasi */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 300, sm: 400, md: 500 },
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: theme.shadows[10],
            }}
          >
            <Image
              src="/landing_image.jpeg"
              alt="Ilustrasi Aplikasi Mandiri Pengembangan"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
