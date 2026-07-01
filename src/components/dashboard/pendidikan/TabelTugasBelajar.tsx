"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TugasBelajar } from "./pendidikan-data";

// ─── Types ────────────────────────────────────────────────────────────────────
type Order = "asc" | "desc";

const statusColor: Record<string, "success" | "warning" | "info" | "error" | "default"> = {
  Aktif: "success",
  Lulus: "info",
  Cuti: "warning",
  Dropout: "error",
};

const statusKelulusanColor: Record<string, "success" | "warning" | "default" | "error"> = {
  Lulus: "success",
  "Belum Lulus": "warning",
  Proses: "default",
  "-": "default",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function TabelTugasBelajar({ data }: { data: TugasBelajar[] }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [filterLokasi, setFilterLokasi] = React.useState<string>("Semua");
  const [filterStatus, setFilterStatus] = React.useState<string>("Semua");
  const [filterJenjang, setFilterJenjang] = React.useState<string>("Semua");
  const [orderBy, setOrderBy] = React.useState<keyof TugasBelajar>("no");
  const [order, setOrder] = React.useState<Order>("asc");

  // Filter + Sort
  const filtered = React.useMemo(() => {
    let rows = [...data];

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.nama.toLowerCase().includes(q) ||
          r.nipBaru.includes(q) ||
          r.programJurusan.toLowerCase().includes(q) ||
          r.namaUniversitas.toLowerCase().includes(q) ||
          r.unitEselon2.toLowerCase().includes(q)
      );
    }
    if (filterLokasi !== "Semua") rows = rows.filter((r) => r.lokasi === filterLokasi);
    if (filterStatus !== "Semua") rows = rows.filter((r) => r.statusStudi === filterStatus);
    if (filterJenjang !== "Semua") rows = rows.filter((r) => r.jenjangPendidikan === filterJenjang);

    rows.sort((a, b) => {
      const av = a[orderBy] ?? "";
      const bv = b[orderBy] ?? "";
      return order === "asc"
        ? String(av).localeCompare(String(bv), "id")
        : String(bv).localeCompare(String(av), "id");
    });

    return rows;
  }, [data, search, filterLokasi, filterStatus, filterJenjang, order, orderBy]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSort = (col: keyof TugasBelajar) => {
    if (orderBy === col) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(col);
      setOrder("asc");
    }
    setPage(0);
  };

  const SortHeader = ({ col, label }: { col: keyof TugasBelajar; label: string }) => (
    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
      <TableSortLabel
        active={orderBy === col}
        direction={orderBy === col ? order : "asc"}
        onClick={() => handleSort(col)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        {/* ── Filter Bar ── */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ sm: "center" }}
          sx={{ mb: 2 }}
          flexWrap="wrap"
        >
          <TextField
            size="small"
            placeholder="Cari nama, NIP, universitas…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ flex: 1, minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListIcon fontSize="small" color="action" />
            <TextField
              select size="small" label="Lokasi" value={filterLokasi}
              onChange={(e) => { setFilterLokasi(e.target.value); setPage(0); }}
              sx={{ minWidth: 110 }}
            >
              {["Semua", "DN", "LN", "Linkage"].map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </TextField>
            <TextField
              select size="small" label="Status" value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
              sx={{ minWidth: 120 }}
            >
              {["Semua", "Aktif", "Lulus", "Cuti", "Dropout"].map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </TextField>
            <TextField
              select size="small" label="Jenjang" value={filterJenjang}
              onChange={(e) => { setFilterJenjang(e.target.value); setPage(0); }}
              sx={{ minWidth: 100 }}
            >
              {["Semua", "S1", "S2", "S3", "D4"].map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </TextField>
          </Stack>
          <Chip
            size="small"
            label={`${filtered.length} data`}
            variant="outlined"
            color="primary"
          />
        </Stack>

        {/* ── Table ── */}
        <TableContainer sx={{ maxHeight: 480, borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <SortHeader col="no" label="No" />
                <SortHeader col="nama" label="Nama" />
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>NIP</TableCell>
                <SortHeader col="jenjangPendidikan" label="Jenjang" />
                <SortHeader col="programJurusan" label="Program / Jurusan" />
                <SortHeader col="namaUniversitas" label="Universitas" />
                <SortHeader col="lokasi" label="Lokasi" />
                <SortHeader col="statusStudi" label="Status Studi" />
                <SortHeader col="pembiayaan" label="Pembiayaan" />
                <SortHeader col="sumberPendanaan" label="Sumber Dana" />
                <SortHeader col="tahunMulai" label="Mulai" />
                <SortHeader col="tahunLulus" label="Lulus" />
                <SortHeader col="statusKelulusan" label="Status Lulus" />
                <SortHeader col="unitEselon2" label="Unit Eselon II" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tidak ada data yang sesuai filter.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row) => (
                  <TableRow
                    key={row.nipBaru}
                    hover
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    <TableCell>{row.no}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 500 }}>
                      <Tooltip title={row.alamatEmail} arrow>
                        <span>{row.nama}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.75rem", color: "text.secondary" }}>
                      {row.nipBaru}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={row.jenjangPendidikan} variant="outlined" color="secondary" />
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.programJurusan}
                      </Typography>
                      {row.gelarAkademik && (
                        <Typography variant="caption" color="text.secondary">
                          Gelar: {row.gelarAkademik}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <Typography variant="body2">{row.namaUniversitas}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.lokasiUniversitas}
                      </Typography>
                      {row.lokasi === "Linkage" && row.namaUniversitasLinkage && (
                        <Typography variant="caption" color="primary.main" display="block">
                          ↔ {row.namaUniversitasLinkage}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.lokasi}
                        color={row.lokasi === "LN" ? "warning" : row.lokasi === "Linkage" ? "info" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.statusStudi}
                        color={statusColor[row.statusStudi] ?? "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.pembiayaan}
                        color={row.pembiayaan === "Full" ? "success" : "warning"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                      {row.sumberPendanaan}
                    </TableCell>
                    <TableCell>{row.tahunMulai}</TableCell>
                    <TableCell>{row.tahunLulus ?? "—"}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.statusKelulusan}
                        color={statusKelulusanColor[row.statusKelulusan] ?? "default"}
                        variant={row.statusKelulusan === "Lulus" ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                      {row.unitEselon2}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Baris:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count}`}
        />
      </CardContent>
    </Card>
  );
}
