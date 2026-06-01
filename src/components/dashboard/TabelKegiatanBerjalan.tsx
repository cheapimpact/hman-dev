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

export default function TabelKegiatanBerjalan({ data }: Props) {
  const theme = useTheme();
  // Filter baris kosong dari Google Sheets padding
  const rows = data.filter((d) => d["NAMA KEGIATAN"] && String(d["NAMA KEGIATAN"]).trim() !== "");

  const totalPeserta = rows.reduce((s, d) => s + (Number(d["JUMLAH PESERTA"]) || 0), 0);

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 2.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                p: 0.75,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              📋
            </Box>
            <Box>
              <Typography component="h2" variant="subtitle2" sx={{ fontWeight: 700 }}>
                Kegiatan Berjalan
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Kegiatan yang sedang berlangsung saat ini (H+7 dan H-7)
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              label={`${rows.length} kegiatan`}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
            <Chip
              size="small"
              label={`${totalPeserta} peserta`}
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: "success.main",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
          </Stack>
        </Stack>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", minWidth: 40, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 260, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>Nama Kegiatan</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", bgcolor: alpha(theme.palette.primary.main, 0.04) }}>Jenis</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", bgcolor: alpha(theme.palette.primary.main, 0.04) }}>Penyelenggara</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", bgcolor: alpha(theme.palette.primary.main, 0.04) }}>Tgl Mulai</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", bgcolor: alpha(theme.palette.primary.main, 0.04) }}>Tgl Selesai</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", bgcolor: alpha(theme.palette.primary.main, 0.04) }}>Lokasi</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", textAlign: "right", bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                  Peserta
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", textAlign: "center", bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                  SPD?
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow
                  key={`${row["ID KEGIATAN"]}-${idx}`}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
