"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";

type StatusType = "Lulus" | "Proses" | "Tidak Lulus";

const rows: {
  nip: string;
  nama: string;
  diklat: string;
  bulan: string;
  lembaga: string;
  status: StatusType;
}[] = [
  {
    nip: "199001010001",
    nama: "Budi Santoso",
    diklat: "Leadership & Management",
    bulan: "Jan 2025",
    lembaga: "Internal",
    status: "Lulus",
  },
  {
    nip: "199002020002",
    nama: "Siti Rahayu",
    diklat: "Data Science Fundamentals",
    bulan: "Jan 2025",
    lembaga: "Coursera",
    status: "Proses",
  },
  {
    nip: "199003030003",
    nama: "Ahmad Fauzi",
    diklat: "Public Speaking",
    bulan: "Feb 2025",
    lembaga: "Internal",
    status: "Lulus",
  },
  {
    nip: "199004040004",
    nama: "Dewi Lestari",
    diklat: "Cyber Security Essentials",
    bulan: "Feb 2025",
    lembaga: "Udemy",
    status: "Lulus",
  },
  {
    nip: "199005050005",
    nama: "Eko Prasetyo",
    diklat: "Manajemen Proyek",
    bulan: "Mar 2025",
    lembaga: "Internal",
    status: "Proses",
  },
  {
    nip: "199006060006",
    nama: "Fitri Handayani",
    diklat: "Komunikasi Efektif",
    bulan: "Mar 2025",
    lembaga: "Lainnya",
    status: "Tidak Lulus",
  },
  {
    nip: "199007070007",
    nama: "Gunawan Hidayat",
    diklat: "Leadership & Management",
    bulan: "Apr 2025",
    lembaga: "Internal",
    status: "Lulus",
  },
  {
    nip: "199008080008",
    nama: "Hendra Wijaya",
    diklat: "Data Science Fundamentals",
    bulan: "Apr 2025",
    lembaga: "Coursera",
    status: "Proses",
  },
];

const statusColor: Record<StatusType, "success" | "warning" | "error"> = {
  Lulus: "success",
  Proses: "warning",
  "Tidak Lulus": "error",
};

export default function PesertaTable() {
  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography component="h2" variant="subtitle2">
            Daftar Peserta Diklat
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {rows.length} peserta
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>NIP</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Nama Diklat</TableCell>
                <TableCell>Bulan</TableCell>
                <TableCell>Lembaga</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.nip}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: "text.secondary",
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                    }}
                  >
                    {row.nip}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.nama}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {row.diklat}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {row.bulan}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {row.lembaga}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.status}
                      color={statusColor[row.status]}
                      size="small"
                      variant="outlined"
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
