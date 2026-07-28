"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import * as XLSX from "xlsx";

// Icons
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import TerminalIcon from "@mui/icons-material/Terminal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import KeyIcon from "@mui/icons-material/Key";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface PegawaiResult {
  idPegawai: string;
  nama: string;
  nip: string;
  pangkat: string;
  golongan: string;
  esl1: string;
  esl2: string;
  esl3: string;
  esl4: string;
  kodeOrganisasi: string;
  kodeIndukOrganisasi: string;
  kodeSatker: string;
  status: "success" | "error";
  message?: string;
}

// ─── IDORG HELPER ─────────────────────────────────────────────────────────────
// Logic:
//   Kata pertama esl3 adalah "Bagian", "Bidang", "Subdirektorat", atau esl3 kosong
//   → ambil 6 digit pertama dari kodeOrganisasi
//   Selainnya → ambil 8 digit pertama
function getIdOrg(kodeOrganisasi: string, esl3: string): string {
  if (!kodeOrganisasi) return "";
  const firstWord = esl3.trim().split(/\s+/)[0] ?? "";
  const ENAM_DIGIT_KEYWORDS = ["Bagian", "Bidang", "Subdirektorat"];
  const takeLen =
    !firstWord || ENAM_DIGIT_KEYWORDS.includes(firstWord) ? 6 : 8;
  return kodeOrganisasi.slice(0, takeLen);
}

// ─── CLIENT-SIDE KEMENKEU API ────────────────────────────────────────────────
const API_GATEWAY_KEY = "8dd3f3bf-425b-4ab5-a9d6-0ae8212c8fc0";

async function fetchPegawaiByNip(
  nip: string,
  bearerToken: string
): Promise<PegawaiResult> {
  const errorResult = (msg: string): PegawaiResult => ({
    idPegawai: msg, nama: msg, nip,
    pangkat: "", golongan: "", esl1: "", esl2: "", esl3: "", esl4: "",
    kodeOrganisasi: "", kodeIndukOrganisasi: "", kodeSatker: "",
    status: "error", message: msg,
  });

  const headers: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    Authorization: bearerToken,
    "x-Gateway-APIKey": API_GATEWAY_KEY,
  };

  try {
    const searchUrl = new URL(
      "https://service.kemenkeu.go.id/hris2/profil/api/Profile/GetAllPegawai"
    );
    searchUrl.searchParams.set("page", "1");
    searchUrl.searchParams.set("pageSize", "1");
    searchUrl.searchParams.set("select", "idPegawai,nip18");
    searchUrl.searchParams.set("Filters", `nama|nip18@=*${nip}`);

    const searchRes = await fetch(searchUrl.toString(), {
      headers,
      signal: AbortSignal.timeout(20000),
    });

    if (searchRes.status === 401) return errorResult("Token Kedaluwarsa");
    if (!searchRes.ok) return errorResult(`Err Search: ${searchRes.status}`);

    const searchData = await searchRes.json();
    if (!searchData?.data?.length) return errorResult("Tidak Ditemukan");

    const pegawai = searchData.data[0];
    const idPegawai = pegawai?.idPegawai;
    const nipHasil = pegawai?.nip18 ?? "NIP Tdk Ada";

    if (!idPegawai) return { ...errorResult("ID Tdk Ada"), nip: nipHasil };

    const profilRes = await fetch(
      `https://service.kemenkeu.go.id/hris2/profil/api/Profile/GetBasicProfilById/${idPegawai}`,
      { headers, signal: AbortSignal.timeout(20000) }
    );

    if (!profilRes.ok) return errorResult(`Err Profil: ${profilRes.status}`);

    const profilData = await profilRes.json();
    const data = profilData?.data ?? {};
    const jabatanList: Record<string, string>[] = data?.jabatan ?? [];
    const nama: string = data?.nama ?? "";
    const kodeSatker: string = data?.kdSatker ?? "";
    const golongan: string = profilData?.golongan ?? "";
    const namaPangkat: string = data?.pangkat?.namaPangkat ?? "";
    const kodeGolongan: string = data?.pangkat?.kodeGolongan ?? "";
    const pangkat = `${namaPangkat} - ${kodeGolongan}`;

    if (jabatanList.length > 0) {
      const jabatan = jabatanList[0];
      return {
        idPegawai, nama, nip: nipHasil, pangkat, golongan,
        esl1: jabatan.esl1 ?? "", esl2: jabatan.esl2 ?? "",
        esl3: jabatan.esl3 ?? "", esl4: jabatan.esl4 ?? "",
        kodeOrganisasi: jabatan.kodeOrganisasi ?? "",
        kodeIndukOrganisasi: jabatan.kodeIndukOrganisasi ?? "",
        kodeSatker, status: "success",
      };
    }
    return {
      idPegawai, nama, nip: nipHasil, pangkat, golongan,
      esl1: "Jabatan Tdk Ada", esl2: "", esl3: "", esl4: "",
      kodeOrganisasi: "", kodeIndukOrganisasi: "", kodeSatker: "",
      status: "success",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResult(`[ERR] ${msg}`);
  }
}

interface LogEntry {
  time: string;
  message: string;
  type: "info" | "success" | "error" | "warn";
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function useConsole() {
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const log = React.useCallback(
    (msg: string, type: LogEntry["type"] = "info") => {
      const time = new Date().toLocaleTimeString("id-ID");
      setLogs((prev) => [...prev, { time, message: msg, type }]);
    },
    []
  );
  const clear = React.useCallback(() => setLogs([]), []);
  return { logs, log, clear };
}

// ─── SHARED TOKEN INPUT ───────────────────────────────────────────────────────
function TokenInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <KeyIcon sx={{ color: "warning.main", fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={600}>
          Bearer Token API
        </Typography>
      </Stack>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Paste Bearer Token di sini... (contoh: Bearer eyJhbGciOi...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: "monospace",
            fontSize: "0.8rem",
          },
        }}
      />
    </Paper>
  );
}

// ─── FILE UPLOAD BUTTON ───────────────────────────────────────────────────────
function FileUploadButton({
  label,
  fileName,
  onFileSelect,
  accept = ".xlsx,.xls",
}: {
  label: string;
  fileName: string;
  onFileSelect: (file: File) => void;
  accept?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180 }}>
        {label}
      </Typography>
      <Button
        variant="outlined"
        startIcon={<UploadFileIcon />}
        size="small"
        onClick={() => inputRef.current?.click()}
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Pilih File Excel
      </Button>
      {fileName && (
        <Chip
          icon={<CheckCircleIcon />}
          label={fileName}
          color="success"
          size="small"
          variant="outlined"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
          e.target.value = "";
        }}
      />
    </Stack>
  );
}

// ─── CONSOLE OUTPUT ────────────────────────────────────────────────────────────
function ConsoleOutput({
  logs,
  onClear,
}: {
  logs: LogEntry[];
  onClear: () => void;
}) {
  const [open, setOpen] = React.useState(true);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const colorMap: Record<LogEntry["type"], string> = {
    info: "inherit",
    success: "#4caf50",
    error: "#f44336",
    warn: "#ff9800",
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1,
          bgcolor: "grey.900",
          borderBottom: open ? "1px solid rgba(255,255,255,0.1)" : "none",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <TerminalIcon sx={{ color: "grey.400", fontSize: 18 }} />
          <Typography variant="caption" sx={{ color: "grey.400", fontWeight: 600 }}>
            Konsol Output
          </Typography>
          {logs.length > 0 && (
            <Chip
              label={logs.length}
              size="small"
              sx={{ height: 18, fontSize: "0.65rem", bgcolor: "grey.700", color: "grey.300" }}
            />
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          {logs.length > 0 && (
            <Button
              size="small"
              sx={{ color: "grey.400", fontSize: "0.7rem", textTransform: "none", minWidth: 0 }}
              onClick={onClear}
            >
              Bersihkan
            </Button>
          )}
          <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: "grey.400" }}>
            {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Stack>
      </Stack>
      <Collapse in={open}>
        <Box
          sx={{
            bgcolor: "#1a1a2e",
            p: 2,
            minHeight: 160,
            maxHeight: 300,
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "0.8rem",
          }}
        >
          {logs.length === 0 ? (
            <Typography variant="caption" sx={{ color: "grey.600" }}>
              Belum ada aktivitas...
            </Typography>
          ) : (
            logs.map((log, i) => (
              <Box key={i} sx={{ mb: 0.5 }}>
                <Box component="span" sx={{ color: "grey.600", mr: 1 }}>
                  [{log.time}]
                </Box>
                <Box component="span" sx={{ color: colorMap[log.type] }}>
                  {log.message}
                </Box>
              </Box>
            ))
          )}
          <div ref={bottomRef} />
        </Box>
      </Collapse>
    </Paper>
  );
}

// ─── TAB 1: GET INFO BY NIP ───────────────────────────────────────────────────
function TabGetInfoNIP({
  token,
  log,
}: {
  token: string;
  log: (msg: string, type?: LogEntry["type"]) => void;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [results, setResults] = React.useState<PegawaiResult[]>([]);
  const [concurrency, setConcurrency] = React.useState(5);

  const handleProcess = async () => {
    if (!token.trim()) {
      log("⚠️ Bearer Token belum diisi!", "warn");
      return;
    }
    if (!file) {
      log("⚠️ File Excel belum dipilih!", "warn");
      return;
    }

    setLoading(true);
    setProgress(0);
    setResults([]);

    try {
      log("📂 Membaca file Excel...", "info");
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      if (!rows.length || !("NIP" in rows[0])) {
        log("❌ Kolom 'NIP' tidak ditemukan di file Excel.", "error");
        return;
      }

      const nipList: string[] = rows.map((r) => String(r["NIP"]));
      log(`✅ Ditemukan ${nipList.length} NIP untuk diproses.`, "success");
      log(
        `🌐 Fetch langsung dari browser (${concurrency} worker paralel)...`,
        "info"
      );

      // Worker pool: `concurrency` workers share a shared index pointer
      const results: PegawaiResult[] = new Array(nipList.length);
      let idx = 0;
      let completedNIP = 0;
      const bearerToken = token.trim();

      const workers = Array.from({ length: concurrency }, async () => {
        while (idx < nipList.length) {
          const i = idx++;
          const nip = nipList[i];
          results[i] = await fetchPegawaiByNip(nip, bearerToken);
          completedNIP++;
          setProgress(Math.round((completedNIP / nipList.length) * 100));
          if (results[i].status === "error") {
            log(`❌ [${completedNIP}/${nipList.length}] ${nip} → ${results[i].message}`, "error");
          } else {
            log(`✅ [${completedNIP}/${nipList.length}] ${nip} → ${results[i].nama}`, "success");
          }
        }
      });

      await Promise.all(workers);

      const finalResults = results.filter(Boolean);
      setResults(finalResults);
      const successCount = finalResults.filter((r) => r.status === "success").length;
      log(
        `🏁 Selesai! ${successCount}/${finalResults.length} NIP berhasil diambil.`,
        "success"
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`❌ Error: ${msg}`, "error");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const handleDownload = () => {
    if (!results.length) return;
    const exportData = results.map((r) => ({
      "ID Pegawai": r.idPegawai,
      Nama: r.nama,
      NIP: r.nip,
      Pangkat: r.pangkat,
      Golongan: r.golongan,
      "Es. 1": r.esl1,
      "Es. 2": r.esl2,
      "Es. 3": r.esl3,
      "Es. 4": r.esl4,
      "Kode Organisasi": r.kodeOrganisasi,
      "IDORG": getIdOrg(r.kodeOrganisasi, r.esl3),
      "Kode Induk Organisasi": r.kodeIndukOrganisasi,
      "Kode Satker": r.kodeSatker,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hasil");
    XLSX.writeFile(wb, `hasil_nip_${Date.now()}.xlsx`);
    log("📥 File Excel berhasil diunduh.", "success");
  };

  const columns = [
    "ID Pegawai",
    "Nama",
    "NIP",
    "Pangkat",
    "Golongan",
    "Es. 1",
    "Es. 2",
    "Es. 3",
    "Es. 4",
    "Kode Org",
    "IDORG",
    "Kode Induk",
    "Satker",
  ];

  return (
    <Box>
      <Stack spacing={3}>
        {/* File Input */}
        <Paper
          elevation={0}
          sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            File Input
          </Typography>
          <FileUploadButton
            label="File Excel (kolom NIP):"
            fileName={file?.name ?? ""}
            onFileSelect={setFile}
          />
        </Paper>

        {/* Progress */}
        {loading && (
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Memproses...
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 1 }} />
          </Box>
        )}

        {/* Action Button */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<RocketLaunchIcon />}
            onClick={handleProcess}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}
          >
            {loading ? "Memproses..." : "Mulai Proses"}
          </Button>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
              Konkurensi:
            </Typography>
            {[3, 5, 10, 20].map((n) => (
              <Chip
                key={n}
                label={`${n}x`}
                size="small"
                clickable
                onClick={() => setConcurrency(n)}
                color={concurrency === n ? "primary" : "default"}
                variant={concurrency === n ? "filled" : "outlined"}
                disabled={loading}
                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
              />
            ))}
            <Tooltip title="Jumlah batch yang diproses secara paralel. Nilai lebih tinggi = lebih cepat, tapi berisiko rate limit.">
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ cursor: "help", borderBottom: "1px dashed", ml: 0.5 }}
              >
                ⓘ
              </Typography>
            </Tooltip>
          </Stack>
          {results.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Download Excel ({results.length} baris)
            </Button>
          )}
        </Stack>

        {/* Results Table */}
        {results.length > 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
              Hasil ({results.length} data)
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, maxHeight: 400 }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>#</TableCell>
                    {columns.map((col) => (
                      <TableCell key={col} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        bgcolor:
                          row.status === "error"
                            ? "error.main"
                            : i % 2 === 0
                            ? "action.hover"
                            : "transparent",
                        "& td": {
                          color: row.status === "error" ? "error.contrastText" : "inherit",
                        },
                      }}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.idPegawai}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.nama}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.nip}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.pangkat}</TableCell>
                      <TableCell>{row.golongan}</TableCell>
                      <TableCell>{row.esl1}</TableCell>
                      <TableCell>{row.esl2}</TableCell>
                      <TableCell>{row.esl3}</TableCell>
                      <TableCell>{row.esl4}</TableCell>
                      <TableCell>{row.kodeOrganisasi}</TableCell>
                      <TableCell>
                        <Chip
                          label={getIdOrg(row.kodeOrganisasi, row.esl3) || "-"}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>{row.kodeIndukOrganisasi}</TableCell>
                      <TableCell>{row.kodeSatker}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

// ─── TAB 2 & 3: POST GROUP ───────────────────────────────────────────────────
function TabPostGroup({
  token,
  log,
  tabConfig,
}: {
  token: string;
  log: (msg: string, type?: LogEntry["type"]) => void;
  tabConfig: {
    label: string;
    columnName: string;
    apiUrl: string;
    payloadKey: string;
    dataType: "int" | "str";
  };
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [groupName, setGroupName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [lastResponse, setLastResponse] = React.useState<string | null>(null);
  const [responseStatus, setResponseStatus] = React.useState<"success" | "error" | null>(null);

  const handleSend = async () => {
    if (!token.trim()) {
      log("⚠️ Bearer Token belum diisi!", "warn");
      return;
    }
    if (!file) {
      log("⚠️ File Excel belum dipilih!", "warn");
      return;
    }
    if (!groupName.trim()) {
      log("⚠️ Nama grup belum diisi!", "warn");
      return;
    }

    setLoading(true);
    setLastResponse(null);
    setResponseStatus(null);

    try {
      log(`📂 Membaca file Excel...`, "info");
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      const col = tabConfig.columnName;
      if (!rows.length || !(col in rows[0])) {
        log(`❌ Kolom '${col}' tidak ditemukan di file Excel.`, "error");
        return;
      }

      const rawList = rows.map((r) => r[col]).filter((v) => v != null && v !== "");
      let idList: (string | number)[];

      if (tabConfig.dataType === "int") {
        idList = rawList
          .map((v) => Number(v))
          .filter((n) => !isNaN(n))
          .map((n) => Math.round(n));
      } else {
        idList = rawList.map((v) => String(v));
      }

      if (!idList.length) {
        log("⚠️ Tidak ada data valid di kolom yang ditentukan.", "warn");
        return;
      }

      log(`✅ Membaca ${idList.length} data dari file Excel.`, "success");
      log(`🚀 Mengirim data untuk grup '${groupName}' dengan ${idList.length} item...`);

      // Fetch langsung dari browser ke Kemenkeu (bypass Vercel server)
      const payload = { Nama: groupName.trim(), [tabConfig.payloadKey]: idList };
      const res = await fetch(tabConfig.apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: token.trim(),
          "x-Gateway-APIKey": API_GATEWAY_KEY,
          roleId: "5",
          unitId: "17086",
          lat: "-6.2053671",
          long: "106.876853",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });

      const responseText = await res.text();
      let responseData: unknown;
      try { responseData = JSON.parse(responseText); } catch { responseData = responseText; }

      setLastResponse(JSON.stringify(responseData, null, 2));

      if (res.status === 200 || res.status === 201) {
        setResponseStatus("success");
        log(`✅ SUKSES! Grup '${groupName}' berhasil dikirim.`, "success");
        log(`Respon: ${JSON.stringify(responseData, null, 2)}`);
      } else {
        setResponseStatus("error");
        log(`❌ GAGAL! Status: ${res.status}`, "error");
        log(`Detail: ${JSON.stringify(responseData)}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`❌ Error Koneksi: ${msg}`, "error");
      setResponseStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Stack spacing={3}>
        {/* File & Group Input */}
        <Paper
          elevation={0}
          sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            Input Data
          </Typography>
          <Stack spacing={2.5}>
            <FileUploadButton
              label={`File Excel (kolom ${tabConfig.columnName}):`}
              fileName={file?.name ?? ""}
              onFileSelect={setFile}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 180, flexShrink: 0 }}
              >
                Nama Grup:
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Masukkan nama grup..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Stack>
          </Stack>
        </Paper>

        {/* Send Button */}
        <Box>
          <Button
            variant="contained"
            startIcon={<RocketLaunchIcon />}
            onClick={handleSend}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}
          >
            {loading ? "Mengirim..." : `Kirim Data Grup ${tabConfig.label}`}
          </Button>
        </Box>

        {/* Response */}
        {lastResponse && (
          <Alert
            severity={responseStatus === "success" ? "success" : "error"}
            icon={responseStatus === "success" ? <CheckCircleIcon /> : <ErrorIcon />}
            sx={{ borderRadius: 2 }}
          >
            <AlertTitle>{responseStatus === "success" ? "Berhasil!" : "Gagal"}</AlertTitle>
            <Box
              component="pre"
              sx={{
                fontSize: "0.75rem",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                mt: 1,
                m: 0,
              }}
            >
              {lastResponse}
            </Box>
          </Alert>
        )}
      </Stack>
    </Box>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [token, setToken] = React.useState("");
  const { logs, log, clear } = useConsole();

  const tabs = [
    {
      label: "Get Info by NIP",
      icon: <BadgeIcon fontSize="small" />,
    },
    {
      label: "Post Group Personal",
      icon: <PeopleIcon fontSize="small" />,
    },
    {
      label: "Post Group Kantor",
      icon: <BusinessIcon fontSize="small" />,
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={800}
          sx={{ mb: 0.5, color: "text.primary" }}
        >
          🛠️ API Multi-Tool
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Alat bantu untuk integrasi API Kemenkeu — Get Info Pegawai & Post Group
        </Typography>
      </Box>

      {/* Bearer Token (shared) */}
      <TokenInput value={token} onChange={setToken} />

      {/* Tab Navigation */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider", px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                minHeight: 52,
              },
            }}
          >
            {tabs.map((tab, i) => (
              <Tab key={i} label={tab.label} icon={tab.icon} iconPosition="start" />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <TabGetInfoNIP token={token} log={log} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <TabPostGroup
              token={token}
              log={log}
              tabConfig={{
                label: "Personal",
                columnName: "ID Pegawai",
                apiUrl: "https://service.kemenkeu.go.id/nadine-web/gateway/Rekam/GroupingPersonal",
                payloadKey: "IdsPegawai",
                dataType: "int",
              }}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <TabPostGroup
              token={token}
              log={log}
              tabConfig={{
                label: "Kantor",
                columnName: "IDORG",
                apiUrl: "https://service.kemenkeu.go.id/nadine-web/gateway/Rekam/GroupingUnits",
                payloadKey: "KodeOrgs",
                dataType: "str",
              }}
            />
          </TabPanel>
        </Box>
      </Paper>

      {/* Console Output (shared, always visible) */}
      <ConsoleOutput logs={logs} onClear={clear} />
    </Box>
  );
}
