import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Header from "@/components/dashboard/Header";
import GrafikKegiatanBulanan from "@/components/dashboard/GrafikKegiatanBulanan";
import TabelKegiatanBerjalan from "@/components/dashboard/TabelKegiatanBerjalan";
import {
  fetchGoogleSheetData,
  DasborGrafikBulanan,
  DasborKegiatanBerjalan,
} from "@/actions/data";

export default async function DashboardP1Page() {
  // ── Fetch kedua data secara paralel ──────────────────────────────────────
  const [grafikResult, kegiatanResult] = await Promise.allSettled([
    fetchGoogleSheetData<DasborGrafikBulanan>({
      path: "Dasbor",
      action: "read",
      named_range: "DASBOR_GRAFIK_BULANAN",
    }),
    fetchGoogleSheetData<DasborKegiatanBerjalan>({
      path: "Dasbor",
      action: "read",
      named_range: "DASBOR_KEGIATAN_BERJALAN",
    }),
  ]);

  const grafikData: DasborGrafikBulanan[] =
    grafikResult.status === "fulfilled" && grafikResult.value.status === "success"
      ? grafikResult.value.data
      : [];

  const kegiatanData: DasborKegiatanBerjalan[] =
    kegiatanResult.status === "fulfilled" && kegiatanResult.value.status === "success"
      ? kegiatanResult.value.data
      : [];

  const grafikError = grafikResult.status === "rejected";
  const kegiatanError = kegiatanResult.status === "rejected";

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: "auto",
        minHeight: "100vh",
      }}
    >
      <Stack
        spacing={3}
        sx={{
          alignItems: "stretch",
          mx: { xs: 2, md: 3 },
          pb: 5,
          mt: { xs: 8, md: 0 },
          maxWidth: 1400,
        }}
      >
        <Header />

        {/* ── Hero Banner ── */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(25,118,210,0.10) 0%, rgba(46,125,50,0.07) 50%, rgba(245,124,0,0.05) 100%)",
            border: "1px solid",
            borderColor: "rgba(25,118,210,0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 160,
              height: 160,
              borderRadius: "50%",
              bgcolor: "rgba(25,118,210,0.06)",
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2.5,
                bgcolor: "rgba(25,118,210,0.10)",
                display: "flex",
                width: "fit-content",
                fontSize: 36,
                lineHeight: 1,
              }}
            >
              🎓
            </Box>
            <Box flexGrow={1}>
              <Typography variant="h5" fontWeight={800}>
                Dashboard P1 — Diklat & Kegiatan
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                Monitoring kegiatan diklat dan peserta tahun 2026 • Data: Google Sheets
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Chip label="Live Data" color="primary" variant="outlined" size="small" />
              <Chip label="Tahun 2026" color="success" variant="outlined" size="small" />
            </Stack>
          </Stack>
        </Box>

        {/* ── Grafik Bulanan ── */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "rgba(25,118,210,0.10)",
                display: "flex",
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              📊
            </Box>
            <Box>
              <Typography component="h2" variant="subtitle1" fontWeight={700}>
                Grafik Bulanan
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Data kegiatan dan peserta diklat tahun 2026 — diambil dari Google Sheets
              </Typography>
            </Box>
          </Stack>

          {grafikError ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              Gagal mengambil data grafik dari Google Sheets.
            </Alert>
          ) : grafikData.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Tidak ada data grafik tersedia.
            </Alert>
          ) : (
            <GrafikKegiatanBulanan data={grafikData} />
          )}
        </Box>

        {/* ── Tabel Kegiatan Berjalan ── */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "rgba(46,125,50,0.10)",
                display: "flex",
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              📋
            </Box>
            <Box>
              <Typography component="h2" variant="subtitle1" fontWeight={700}>
                Kegiatan Berjalan
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Daftar kegiatan diklat yang sedang berlangsung — diambil dari Google Sheets
              </Typography>
            </Box>
          </Stack>

          {kegiatanError ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              Gagal mengambil data kegiatan berjalan.
            </Alert>
          ) : (
            <TabelKegiatanBerjalan data={kegiatanData} />
          )}
        </Box>
      </Stack>
    </Box>
  );
}
