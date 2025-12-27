"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Ikon mata untuk detail
import RefreshIcon from "@mui/icons-material/Refresh";

// 1. DATA DUMMY (Contoh Data Pegawai)
// Nanti bagian ini akan diganti dengan data dari Program/Database Anda
const dataPegawaiAwal = [
  {
    id: 1,
    nip: "198501012010011001",
    nama: "Budi Santoso",
    jabatan: "Kepala Bidang IT",
    unit: "Pusdatin",
    status: "Aktif",
  },
  {
    id: 2,
    nip: "199005122015022002",
    nama: "Siti Aminah",
    jabatan: "Analis Kepegawaian",
    unit: "Biro SDM",
    status: "Aktif",
  },
  {
    id: 3,
    nip: "198811202012011005",
    nama: "Rahmat Hidayat",
    jabatan: "Pranata Komputer",
    unit: "Pusdatin",
    status: "Cuti",
  },
  {
    id: 4,
    nip: "199503152019032001",
    nama: "Dewi Sartika",
    jabatan: "Arsiparis",
    unit: "Sekretariat",
    status: "Aktif",
  },
  {
    id: 5,
    nip: "198207072008011003",
    nama: "Joko Widodo",
    jabatan: "Kasubag Umum",
    unit: "Umum",
    status: "Pensiun",
  },
];

export default function CariPegawaiPage() {
  // 2. STATE MANAGEMENT
  const [keyword, setKeyword] = useState(""); // Menyimpan apa yang diketik user
  const [dataTampil, setDataTampil] = useState(dataPegawaiAwal); // Menyimpan data yang sedang ditampilkan di tabel

  // 3. LOGIKA PENCARIAN
  const handleSearch = () => {
    // Filter data berdasarkan Nama ATAU NIP
    const hasil = dataPegawaiAwal.filter(
      (pegawai) =>
        pegawai.nama.toLowerCase().includes(keyword.toLowerCase()) ||
        pegawai.nip.includes(keyword)
    );
    setDataTampil(hasil);
  };

  // Fungsi Reset Pencarian
  const handleReset = () => {
    setKeyword("");
    setDataTampil(dataPegawaiAwal);
  };

  // Fungsi menangani enter saat mengetik
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", color: "#1e293b" }}
      >
        Pencarian Data Pegawai
      </Typography>

      {/* SECTION 1: KOTAK PENCARIAN */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextField
            fullWidth
            label="Cari Nama atau NIP..."
            variant="outlined"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            sx={{ px: 4, fontWeight: "bold" }}
          >
            Cari
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleReset}
            startIcon={<RefreshIcon />}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      {/* SECTION 2: TABEL HASIL */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tabel pegawai">
            <TableHead sx={{ bgcolor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>NIP</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nama Pegawai</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Jabatan</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Unit Kerja</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTampil.length > 0 ? (
                dataTampil.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { bgcolor: "#f8fafc" },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {row.nip}
                    </TableCell>
                    <TableCell>{row.nama}</TableCell>
                    <TableCell>{row.jabatan}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>
                      {/* Chip Status Berwarna */}
                      <Chip
                        label={row.status}
                        size="small"
                        color={
                          row.status === "Aktif"
                            ? "success"
                            : row.status === "Cuti"
                            ? "warning"
                            : "default"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" aria-label="lihat detail">
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Tampilan jika data tidak ditemukan
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Data pegawai tidak ditemukan.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Tabel (Jumlah Data) */}
        <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
          <Typography variant="body2" color="text.secondary">
            Menampilkan {dataTampil.length} data pegawai
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
