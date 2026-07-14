"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ClearIcon from "@mui/icons-material/Clear";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import Header from "@/components/dashboard/Header";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RiwayatDiklatItem {
  nip: string;
  nama_pegawai: string;
  kd_diklat: string;
  nm_diklat: string;
  tgl_awal: string;
  tgl_akhir: string;
  nm_lembaga: string;
  no_sertifikat: string;
  tgl_sertifikat: string;
  jml_jamlat: number;
  id_identifikasi: string;
  link_sertifikat: string;
  esl2: string;
  esl3: string;
  esl4: string;
}

interface FilterOptions {
  esl2: string[];
  esl3: string[];
  esl4: string[];
  nm_diklat: string[];
  nm_lembaga: string[];
}

type SortField = keyof RiwayatDiklatItem;
type SortOrder = "asc" | "desc";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
    }).format(new Date(dateStr));
  } catch { return dateStr; }
}

function getDurasiHari(tglAwal: string, tglAkhir: string) {
  try {
    const a = new Date(tglAwal), b = new Date(tglAkhir);
    const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? `${diff} hari` : "-";
  } catch { return "-"; }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function MiniStatCard({ label, value, color, emoji }: {
  label: string; value: string | number; color: string; emoji: string;
}) {
  return (
    <Paper elevation={0} sx={{
      p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider",
      display: "flex", alignItems: "center", gap: 1.5,
      flex: "1 1 160px", minWidth: 140,
    }}>
      <Box sx={{ p: 1, borderRadius: 2, bgcolor: color, fontSize: 22, lineHeight: 1, flexShrink: 0 }}>
        {emoji}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={700} lineHeight={1.2}>{value}</Typography>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
      </Box>
    </Paper>
  );
}

// ─── Columns ──────────────────────────────────────────────────────────────────
const COLUMNS: { field: SortField; label: string; minWidth?: number; align?: "center" | "right" }[] = [
  { field: "nip", label: "NIP", minWidth: 150 },
  { field: "nama_pegawai", label: "Nama Pegawai", minWidth: 160 },
  { field: "esl2", label: "Unit Eselon 2", minWidth: 200 },
  { field: "esl3", label: "Unit Eselon 3", minWidth: 220 },
  { field: "esl4", label: "Unit Eselon 4", minWidth: 180 },
  { field: "kd_diklat", label: "Kode Diklat", minWidth: 120 },
  { field: "nm_diklat", label: "Nama Diklat", minWidth: 240 },
  { field: "tgl_awal", label: "Tgl Awal", minWidth: 110 },
  { field: "tgl_akhir", label: "Tgl Akhir", minWidth: 140 },
  { field: "nm_lembaga", label: "Lembaga Penyelenggara", minWidth: 200 },
  { field: "no_sertifikat", label: "No. Sertifikat", minWidth: 160 },
  { field: "tgl_sertifikat", label: "Tgl Sertifikat", minWidth: 120 },
  { field: "jml_jamlat", label: "Jam Lat", minWidth: 80, align: "right" },
  { field: "id_identifikasi", label: "ID Identifikasi", minWidth: 130 },
  { field: "link_sertifikat", label: "Sertifikat", minWidth: 100, align: "center" },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function RiwayatDiklatPage() {
  const [data, setData] = React.useState<RiwayatDiklatItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasFetched, setHasFetched] = React.useState(false);

  // Options untuk dropdown
  const [options, setOptions] = React.useState<FilterOptions>({
    esl2: [], esl3: [], esl4: [], nm_diklat: [], nm_lembaga: [],
  });

  // Filter state
  const [filterNip, setFilterNip] = React.useState("");
  const [filterEsl2, setFilterEsl2] = React.useState("");
  const [filterEsl3, setFilterEsl3] = React.useState("");
  const [filterEsl4, setFilterEsl4] = React.useState("");
  // Multi-select + wildcard untuk nama diklat
  // Tiap item bisa berupa nama diklat dari list, ATAU wildcard custom yang diketik user
  const [filterDiklatTerms, setFilterDiklatTerms] = React.useState<string[]>([]);
  const [filterTglFrom, setFilterTglFrom] = React.useState("");
  const [filterTglTo, setFilterTglTo] = React.useState("");
  const [showFilter, setShowFilter] = React.useState(true);

  // Tabel state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("tgl_awal");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  // ─── Load options sekali saat mount ────────────────────────────────────────
  React.useEffect(() => {
    fetch("/api/diklat/riwayat?mode=options")
      .then((r) => r.json())
      .then((j) => { if (j.success) setOptions(j.options); })
      .catch(() => {});
  }, []);

  // ─── Filtered ESL3 berdasarkan ESL2 yang dipilih ───────────────────────────
  const availableEsl3 = React.useMemo(() => {
    if (!filterEsl2) return options.esl3;
    // Idealnya filter dari data real; untuk dummy, kembalikan semua ESL3
    return options.esl3;
  }, [filterEsl2, options.esl3]);

  const availableEsl4 = React.useMemo(() => {
    if (!filterEsl3) return options.esl4;
    return options.esl4;
  }, [filterEsl3, options.esl4]);

  // ─── Fetch Data ────────────────────────────────────────────────────────────
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterNip.trim()) params.set("nip", filterNip.trim());
      if (filterEsl2) params.set("esl2", filterEsl2);
      if (filterEsl3) params.set("esl3", filterEsl3);
      if (filterEsl4) params.set("esl4", filterEsl4);
      // Gabung terms dengan pipe sebagai pemisah OR
      if (filterDiklatTerms.length > 0) {
        params.set("nm_diklat", filterDiklatTerms.join("|"));
      }
      if (filterTglFrom) params.set("tgl_awal_from", filterTglFrom);
      if (filterTglTo) params.set("tgl_awal_to", filterTglTo);

      const res = await fetch(`/api/diklat/riwayat?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Gagal mengambil data");
      setData(json.data);
      setHasFetched(true);
      setPage(0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [filterNip, filterEsl2, filterEsl3, filterEsl4, filterDiklatTerms, filterTglFrom, filterTglTo]);

  // ─── Sort & Global search ─────────────────────────────────────────────────
  const filteredData = React.useMemo(() => {
    let rows = [...data];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    rows.sort((a, b) => {
      const va = a[sortField], vb = b[sortField];
      if (va < vb) return sortOrder === "asc" ? -1 : 1;
      if (va > vb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [data, searchQuery, sortField, sortOrder]);

  const paginatedData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const totalJamlat = data.reduce((s, d) => s + (d.jml_jamlat || 0), 0);
  const uniqueNip = new Set(data.map((d) => d.nip)).size;
  const withSertifikat = data.filter((d) => !!d.link_sertifikat).length;

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortOrder("asc"); }
  };

  const handleExportCSV = () => {
    const header = COLUMNS.map((c) => c.label).join(",");
    const rows = filteredData.map((r) =>
      [r.nip, `"${r.nama_pegawai}"`, `"${r.esl2}"`, `"${r.esl3}"`, `"${r.esl4}"`,
       r.kd_diklat, `"${r.nm_diklat}"`, r.tgl_awal, r.tgl_akhir, `"${r.nm_lembaga}"`,
       r.no_sertifikat, r.tgl_sertifikat, r.jml_jamlat, r.id_identifikasi, r.link_sertifikat
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riwayat_diklat_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetFilter = () => {
    setFilterNip("");
    setFilterEsl2("");
    setFilterEsl3("");
    setFilterEsl4("");
    setFilterDiklatTerms([]);
    setFilterTglFrom("");
    setFilterTglTo("");
  };

  const activeFilterCount = [
    filterNip, filterEsl2, filterEsl3, filterEsl4, filterTglFrom, filterTglTo,
  ].filter(Boolean).length + filterDiklatTerms.length;

  return (
    <Box component="main" sx={{ flexGrow: 1, overflow: "auto", minHeight: "100vh" }}>
      <Stack spacing={3} sx={{
        alignItems: "stretch",
        mx: { xs: 2, md: 3 },
        pb: 5, mt: { xs: 8, md: 0 },
        maxWidth: 1600,
      }}>
        <Header />

        {/* ── Hero Banner ── */}
        <Box sx={{
          p: 3, borderRadius: 3,
          background: "linear-gradient(135deg, rgba(25,118,210,0.10) 0%, rgba(0,150,136,0.07) 50%, rgba(123,31,162,0.05) 100%)",
          border: "1px solid", borderColor: "rgba(25,118,210,0.18)",
          position: "relative", overflow: "hidden",
        }}>
          <Box sx={{
            position: "absolute", top: -50, right: -50,
            width: 200, height: 200, borderRadius: "50%",
            bgcolor: "rgba(25,118,210,0.06)", pointerEvents: "none",
          }} />
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={2}>
            <Box sx={{
              p: 1.5, borderRadius: 2.5, bgcolor: "rgba(25,118,210,0.12)",
              display: "flex", width: "fit-content", fontSize: 36, lineHeight: 1,
            }}>🎓</Box>
            <Box flexGrow={1}>
              <Typography variant="h5" fontWeight={800}>Riwayat Diklat Pegawai</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                Data riwayat pendidikan dan pelatihan pegawai · Filter unit organisasi &amp; nama diklat
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Chip label="Dashboard P1" color="primary" variant="outlined" size="small"
                icon={<HistoryEduIcon sx={{ fontSize: "14px !important" }} />} />
              {hasFetched && (
                <Chip label={`${filteredData.length} record`} color="success" variant="outlined" size="small" />
              )}
              {activeFilterCount > 0 && (
                <Chip label={`${activeFilterCount} filter aktif`} color="warning" variant="outlined" size="small" />
              )}
            </Stack>
          </Stack>
        </Box>

        {/* ── Panel Filter ── */}
        <Paper elevation={0} sx={{
          borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden",
        }}>
          {/* Header filter */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, py: 1.5 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={600}>Filter &amp; Pencarian</Typography>
              {activeFilterCount > 0 && (
                <Chip label={activeFilterCount} size="small" color="primary" sx={{ height: 18, fontSize: "0.7rem" }} />
              )}
            </Stack>
            <Button
              size="small"
              onClick={() => setShowFilter((v) => !v)}
              variant="text"
              sx={{ textTransform: "none", fontSize: "0.8125rem" }}
            >
              {showFilter ? "Sembunyikan" : "Tampilkan Filter"}
            </Button>
          </Stack>

          <Collapse in={showFilter}>
            <Divider />
            <Box sx={{ p: 2.5 }}>
              <Stack spacing={2.5}>

                {/* Row 1: NIP + Rentang Tanggal */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap" useFlexGap>
                  <TextField
                    label="NIP"
                    size="small"
                    value={filterNip}
                    onChange={(e) => setFilterNip(e.target.value)}
                    placeholder="Contoh: 19650101..."
                    sx={{ flex: "1 1 200px", minWidth: 180 }}
                  />
                  <TextField
                    label="Tgl Awal (dari)"
                    size="small" type="date"
                    value={filterTglFrom}
                    onChange={(e) => setFilterTglFrom(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: "1 1 160px", minWidth: 150 }}
                  />
                  <TextField
                    label="Tgl Awal (sampai)"
                    size="small" type="date"
                    value={filterTglTo}
                    onChange={(e) => setFilterTglTo(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: "1 1 160px", minWidth: 150 }}
                  />
                </Stack>

                {/* Row 2: Unit Eselon 2 / 3 / 4 */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <AccountTreeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="caption" fontWeight={600} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
                      Unit Organisasi
                    </Typography>
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap" useFlexGap>
                    <TextField
                      select
                      label="Unit Eselon 2"
                      size="small"
                      value={filterEsl2}
                      onChange={(e) => { setFilterEsl2(e.target.value); setFilterEsl3(""); setFilterEsl4(""); }}
                      sx={{ flex: "1 1 220px", minWidth: 200 }}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value=""><em>— Semua Eselon 2 —</em></MenuItem>
                      {options.esl2.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </TextField>
                    <TextField
                      select
                      label="Unit Eselon 3"
                      size="small"
                      value={filterEsl3}
                      onChange={(e) => { setFilterEsl3(e.target.value); setFilterEsl4(""); }}
                      sx={{ flex: "1 1 240px", minWidth: 200 }}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value=""><em>— Semua Eselon 3 —</em></MenuItem>
                      {availableEsl3.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </TextField>
                    <TextField
                      select
                      label="Unit Eselon 4"
                      size="small"
                      value={filterEsl4}
                      onChange={(e) => setFilterEsl4(e.target.value)}
                      sx={{ flex: "1 1 220px", minWidth: 200 }}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value=""><em>— Semua Eselon 4 —</em></MenuItem>
                      {availableEsl4.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </TextField>
                  </Stack>
                </Box>

                {/* Row 3: Multi-select Nama Diklat + Wildcard */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <HistoryEduIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="caption" fontWeight={600} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
                      Nama Diklat
                    </Typography>
                    <Tooltip title={
                      <Box sx={{ p: 0.5, fontSize: "0.75rem", lineHeight: 1.6 }}>
                        <strong>Pilihan:</strong> pilih dari daftar atau ketik sendiri (Enter).<br />
                        <strong>Wildcard:</strong> ketik sebagian kata — sistem akan cocokkan semua diklat yang mengandung kata tersebut.<br />
                        Contoh: ketik <em>e-learning</em> → menemukan semua diklat yang ada kata &quot;elearning&quot;.
                      </Box>
                    } arrow>
                      <InfoOutlinedIcon sx={{ fontSize: 15, color: "text.disabled", cursor: "help" }} />
                    </Tooltip>
                  </Stack>
                  <Autocomplete
                    multiple
                    freeSolo
                    size="small"
                    options={options.nm_diklat}
                    value={filterDiklatTerms}
                    onChange={(_, newVal) => setFilterDiklatTerms(newVal as string[])}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const isWildcard = !options.nm_diklat.includes(option);
                        return (
                          <Chip
                            {...getTagProps({ index })}
                            key={option}
                            label={option}
                            size="small"
                            color={isWildcard ? "warning" : "primary"}
                            variant={isWildcard ? "outlined" : "filled"}
                            sx={{ fontWeight: isWildcard ? 500 : 400 }}
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={filterDiklatTerms.length === 0 ? "Pilih dari daftar atau ketik kata kunci lalu tekan Enter…" : ""}
                        helperText={
                          filterDiklatTerms.length > 0
                            ? `${filterDiklatTerms.length} term aktif · Chip kuning = wildcard custom · Chip biru = nama persis`
                            : "Tip: Ketik sebagian nama diklat (misal: manajemen, e-learning) dan tekan Enter untuk wildcard"
                        }
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Typography variant="body2">{option}</Typography>
                      </Box>
                    )}
                    filterOptions={(opts, { inputValue }) => {
                      if (!inputValue) return opts.slice(0, 50);
                      // normalisasi input untuk wildcard matching di dropdown
                      const norm = inputValue.toLowerCase().replace(/[^a-z0-9]/g, "");
                      return opts.filter((o) =>
                        o.toLowerCase().replace(/[^a-z0-9]/g, "").includes(norm)
                      ).slice(0, 50);
                    }}
                    sx={{ width: "100%" }}
                  />
                </Box>

              </Stack>

              {/* Action buttons */}
              <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={fetchData}
                  disabled={loading}
                  startIcon={<RefreshIcon />}
                  sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
                >
                  Tarik Data
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleResetFilter}
                  disabled={loading || activeFilterCount === 0}
                  startIcon={<ClearIcon />}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Reset Filter
                </Button>
              </Stack>
            </Box>
          </Collapse>

          {/* Quick Tarik Data jika filter disembunyikan */}
          {!showFilter && (
            <Box sx={{ px: 2.5, pb: 1.5 }}>
              <Button
                variant="contained" size="small"
                onClick={fetchData} disabled={loading}
                startIcon={<RefreshIcon />}
                sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
              >
                Tarik Data
              </Button>
            </Box>
          )}
        </Paper>

        {/* ── Loading ── */}
        {loading && <LinearProgress sx={{ borderRadius: 1 }} />}

        {/* ── Error ── */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <strong>Gagal memuat data:</strong> {error}
          </Alert>
        )}

        {/* ── Stats ── */}
        {hasFetched && !loading && (
          <Stack direction="row" flexWrap="wrap" gap={2} useFlexGap>
            <MiniStatCard label="Total Record" value={data.length} color="rgba(25,118,210,0.10)" emoji="📋" />
            <MiniStatCard label="Pegawai Unik" value={uniqueNip} color="rgba(0,150,136,0.10)" emoji="👤" />
            <MiniStatCard label="Total Jam Latihan" value={totalJamlat.toLocaleString("id-ID")} color="rgba(255,152,0,0.10)" emoji="⏱️" />
            <MiniStatCard label="Ada Sertifikat" value={withSertifikat} color="rgba(76,175,80,0.10)" emoji="🏆" />
          </Stack>
        )}

        {/* ── Tabel ── */}
        {hasFetched && !loading && (
          <Paper elevation={0} sx={{
            borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden",
          }}>
            {/* Toolbar */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
              spacing={1.5}
              sx={{ px: 2.5, py: 1.5 }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>Data Riwayat Diklat</Typography>
                <Typography variant="caption" color="text.secondary">
                  {filteredData.length} dari {data.length} record
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Cari di tabel..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 220 }}
                />
                <Tooltip title="Export CSV">
                  <span>
                    <IconButton size="small" onClick={handleExportCSV} disabled={filteredData.length === 0}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>

            <Divider />

            <TableContainer sx={{ maxHeight: 560 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, bgcolor: "background.paper" }}>No</TableCell>
                    {COLUMNS.map((col) => (
                      <TableCell
                        key={col.field}
                        align={col.align ?? "left"}
                        sortDirection={sortField === col.field ? sortOrder : false}
                        sx={{ fontWeight: 700, minWidth: col.minWidth, bgcolor: "background.paper", whiteSpace: "nowrap" }}
                      >
                        <TableSortLabel
                          active={sortField === col.field}
                          direction={sortField === col.field ? sortOrder : "asc"}
                          onClick={() => handleSort(col.field)}
                        >
                          {col.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary" variant="body2">
                          {searchQuery ? "Tidak ada data yang cocok" : "Tidak ada data"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row, idx) => (
                      <TableRow
                        key={`${row.nip}-${row.kd_diklat}-${idx}`}
                        hover
                        sx={{ "&:hover": { bgcolor: "action.hover" }, transition: "background 0.15s" }}
                      >
                        <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                          {page * rowsPerPage + idx + 1}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}>{row.nip}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem", whiteSpace: "nowrap" }}>{row.nama_pegawai}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
                            {row.esl2 || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
                            {row.esl3 || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
                            {row.esl4 || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={row.kd_diklat} size="small" variant="outlined"
                            sx={{ fontSize: "0.7rem", fontFamily: "monospace" }} />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="body2" sx={{ fontSize: "0.8125rem", lineHeight: 1.4 }}>
                            {row.nm_diklat}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.8125rem" }}>
                          {formatDate(row.tgl_awal)}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.8125rem" }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <span>{formatDate(row.tgl_akhir)}</span>
                            <Chip
                              label={getDurasiHari(row.tgl_awal, row.tgl_akhir)}
                              size="small"
                              sx={{ fontSize: "0.68rem", height: 18, bgcolor: "rgba(25,118,210,0.08)", color: "primary.main", fontWeight: 600 }}
                            />
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 220, fontSize: "0.8125rem" }}>{row.nm_lembaga}</TableCell>
                        <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}>{row.no_sertifikat || "-"}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.8125rem" }}>{formatDate(row.tgl_sertifikat)}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                            <AccessTimeIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                            <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.8125rem" }}>
                              {row.jml_jamlat.toLocaleString("id-ID")}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}>{row.id_identifikasi || "-"}</TableCell>
                        <TableCell align="center">
                          {row.link_sertifikat ? (
                            <Tooltip title="Buka sertifikat">
                              <IconButton size="small" component="a"
                                href={row.link_sertifikat} target="_blank" rel="noopener noreferrer" color="primary">
                                <WorkspacePremiumIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Sertifikat tidak tersedia">
                              <LinkOffIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider />
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[10, 25, 50, 100]}
              labelRowsPerPage="Baris per halaman:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count}`}
              sx={{ "& .MuiTablePagination-toolbar": { py: 0.5 } }}
            />
          </Paper>
        )}

        {/* ── Empty state ── */}
        {!hasFetched && !loading && !error && (
          <Paper elevation={0} sx={{
            borderRadius: 3, border: "1px solid", borderColor: "divider",
            p: 6, textAlign: "center",
          }}>
            <Box sx={{ fontSize: 56, mb: 1.5 }}>🎓</Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>Belum Ada Data</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Atur filter yang diinginkan lalu klik <strong>Tarik Data</strong>.<br />
              Tanpa filter, semua data riwayat diklat akan ditampilkan.
            </Typography>
            <Button
              variant="contained"
              startIcon={<HistoryEduIcon />}
              onClick={fetchData}
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
            >
              Tarik Semua Data
            </Button>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
