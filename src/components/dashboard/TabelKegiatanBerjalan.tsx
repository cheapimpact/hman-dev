"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useTheme, alpha } from "@mui/material/styles";
import { DasborKegiatanBerjalan } from "@/actions/data";

// ─── Helper: Format tanggal ISO → DD MMM YYYY ─────────────────────────────────
function formatTanggal(iso: string): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── Warna badge jenis kegiatan ───────────────────────────────────────────────
const jenisColor: Record<string, "primary" | "warning" | "success" | "error" | "default"> = {
  "Diklat BPPK": "primary",
  "Pelatihan Internasional": "success",
  "Internasional Non Pelatihan": "warning",
  "Diklat Non BPPK": "default",
  "Assessment Center": "error",
};

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props {
  data: DasborKegiatanBerjalan[];
}

type OrderByField = keyof DasborKegiatanBerjalan;

export default function TabelKegiatanBerjalan({ data }: Props) {
  const theme = useTheme();
  // Filter baris kosong dari Google Sheets padding
  const baseRows = React.useMemo(() => {
    return data.filter((d) => d["NAMA KEGIATAN"] && String(d["NAMA KEGIATAN"]).trim() !== "");
  }, [data]);

  // State untuk interaksi
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [orderBy, setOrderBy] = React.useState<OrderByField | "">("");
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(0);
  };

  // Search input handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(0);
  };

  // Sorting handler
  const handleRequestSort = (property: OrderByField) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Paginasi handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 1. Data per Tab (untuk sementara disamakan datanya)
  const tabData = React.useMemo(() => {
    // Sesuai requirement: "sementara disamakan dulu"
    // Di masa depan bisa difilter misal: activeTab === 0 ? berjalan : semua
    return baseRows;
  }, [baseRows, activeTab]);

  // 2. Pencarian dinamis
  const filteredRows = React.useMemo(() => {
    if (!searchQuery) return tabData;
    const q = searchQuery.toLowerCase();
    return tabData.filter((row) => {
      return (
        String(row["ID KEGIATAN"] || "").toLowerCase().includes(q) ||
        String(row["NAMA KEGIATAN"] || "").toLowerCase().includes(q) ||
        String(row["JENIS KEGIATAN"] || "").toLowerCase().includes(q) ||
        String(row["PENYELENGGARA"] || "").toLowerCase().includes(q) ||
        String(row["LOKASI PENYELENGGARAAN"] || "").toLowerCase().includes(q) ||
        String(row["Perlu SPD?"] || "").toLowerCase().includes(q)
      );
    });
  }, [tabData, searchQuery]);

  // 3. Pengurutan data (Sorting)
  const sortedRows = React.useMemo(() => {
    if (!orderBy) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";

      if (orderBy === "JUMLAH PESERTA") {
        const aNum = Number(aVal) || 0;
        const bNum = Number(bVal) || 0;
        return order === "asc" ? aNum - bNum : bNum - aNum;
      }

      if (orderBy === "TANGGAL MULAI" || orderBy === "TANGGAL SELESAI") {
        const aTime = aVal ? new Date(aVal).getTime() : 0;
        const bTime = bVal ? new Date(bVal).getTime() : 0;
        return order === "asc" ? aTime - bTime : bTime - aTime;
      }

      const aStr = String(aVal).toLowerCase().trim();
      const bStr = String(bVal).toLowerCase().trim();
      if (aStr < bStr) return order === "asc" ? -1 : 1;
      if (aStr > bStr) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, orderBy, order]);

  // Total peserta terhitung dari data yang terfilter
  const totalPeserta = React.useMemo(() => {
    return sortedRows.reduce((s, d) => s + (Number(d["JUMLAH PESERTA"]) || 0), 0);
  }, [sortedRows]);

  // Sliced data untuk pagination
  const paginatedRows = React.useMemo(() => {
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
        >
          <Box>
            <Typography component="h2" variant="subtitle2" sx={{ fontWeight: 700 }}>
              Kegiatan Berjalan
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Kegiatan yang sedang berlangsung saat ini (H+7 dan H-7)
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>

            <Chip size="small" label={`${totalPeserta} peserta`} color="success" variant="outlined" />
          </Stack>
        </Stack>

        {/* Table Container */}
        <TableContainer sx={{ maxHeight: 440, borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap", minWidth: 40 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 260 }}>Nama Kegiatan</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Jenis</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Penyelenggara</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Tgl Mulai</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Tgl Selesai</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Lokasi</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "right" }}>
                  Peserta
                </TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "center" }}>
                  SPD?
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Tidak ada data kegiatan yang cocok dengan kriteria pencarian.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row, idx) => (
                  <TableRow
                    key={`${row["ID KEGIATAN"]}-${idx}`}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem", fontFamily: "monospace" }}>
                      {row["ID KEGIATAN"]}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          maxWidth: 320,
                        }}
                      >
                        {row["NAMA KEGIATAN"]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row["JENIS KEGIATAN"] || "-"}
                        color={jenisColor[row["JENIS KEGIATAN"]] ?? "default"}
                        variant="outlined"
                        sx={{ fontSize: "0.65rem", height: 20 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {row["PENYELENGGARA"] || "-"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {formatTanggal(row["TANGGAL MULAI"])}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {formatTanggal(row["TANGGAL SELESAI"])}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>
                      {row["LOKASI PENYELENGGARAAN"] || "-"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", textAlign: "right", fontWeight: 600 }}>
                      {row["JUMLAH PESERTA"]}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        size="small"
                        label={row["Perlu SPD?"] || "-"}
                        color={row["Perlu SPD?"] === "Ya" ? "warning" : "default"}
                        sx={{ fontSize: "0.65rem", height: 20 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
        />
      </CardContent>
    </Card>
  );
}
