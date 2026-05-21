import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
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
          mx: 3,
          pb: 5,
          mt: { xs: 8, md: 0 },
        }}
      >
        <Header />

        {/* ── Grafik Bulanan ── */}
        <Box>
          <Typography component="h2" variant="h6" sx={{ mb: 0.5 }}>
            Grafik Bulanan
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Data kegiatan dan peserta diklat tahun 2026 — diambil dari Google Sheets
          </Typography>
          <Divider sx={{ mt: 1.5, mb: 2.5 }} />

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
          <Typography component="h2" variant="h6" sx={{ mb: 0.5 }}>
            Kegiatan Berjalan
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Daftar kegiatan diklat yang sedang berlangsung — diambil dari Google Sheets
          </Typography>
          <Divider sx={{ mt: 1.5, mb: 2.5 }} />

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
