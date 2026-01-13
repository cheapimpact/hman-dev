"use client";

import React, { useState, useEffect } from "react";
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
  InputAdornment,
  LinearProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StorageIcon from "@mui/icons-material/Storage";

// Import dari Server Action yang baru (SQL Manual)
import { getPegawai, seedPegawai } from "@/actions/pegawai";

export default function CariPegawaiPage() {
  const [keyword, setKeyword] = useState("");
  const [dataPegawai, setDataPegawai] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchData = async (q: string) => {
    setLoading(true);
    try {
      const hasil = await getPegawai(q);
      setDataPegawai(hasil);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData("");
  }, []);

  const handleSearch = () => fetchData(keyword);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    await seedPegawai();
    await fetchData("");
    setIsSeeding(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Database Pegawai
        </Typography>
        <Chip
          icon={<StorageIcon />}
          label="SQLite (Native)"
          color="secondary"
          variant="outlined"
        />
      </Box>

      {/* SEARCH BOX */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="Cari Nama / NIP..."
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
            onClick={handleSearch}
            sx={{ px: 4, color: "white" }}
          >
            Cari
          </Button>
        </Box>
      </Paper>

      {/* ALERT DATABASE KOSONG */}
      {dataPegawai.length === 0 && !loading && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleSeed}
              disabled={isSeeding}
            >
              {isSeeding ? "Memproses..." : "Isi Data Dummy"}
            </Button>
          }
        >
          Database (kantor.db) kosong. Klik tombol untuk mengisi data.
        </Alert>
      )}

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>NIP</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Jabatan</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataPegawai.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {row.nip}
                  </TableCell>
                  <TableCell>{row.nama}</TableCell>
                  <TableCell>{row.jabatan}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === "Aktif" ? "success" : "default"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
