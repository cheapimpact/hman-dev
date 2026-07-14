import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RiwayatDiklatItem {
  nip: string;
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
  // From JOIN pegawai table
  nama_pegawai: string;
  esl2: string;
  esl3: string;
  esl4: string;
}

// ─── Wildcard / Normalisasi helper ────────────────────────────────────────────
// Menghapus karakter non-alphanumeric (spasi, tanda hubung, titik, dll.)
// sehingga "x-ray" → "xray", "e learning" → "elearning"
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Cek apakah haystack mengandung semua token dari needle (wildcard: tiap token dicocokkan)
function wildcardMatch(haystack: string, needle: string): boolean {
  const normHaystack = normalize(haystack);
  // Split needle by pipe (|) for OR logic, space for token AND logic within each term
  const orTerms = needle.split("|").map((t) => t.trim()).filter(Boolean);
  return orTerms.some((term) => {
    const normTerm = normalize(term);
    return normHaystack.includes(normTerm);
  });
}

// ─── Dummy Data ─────────────────────────────────────────────────────────────
// TODO: Ganti dengan query ke database sesungguhnya (JOIN tabel pegawai via NIP)
// Contoh SQL:
//   SELECT d.*, p.nama, p.esl2, p.esl3, p.esl4
//   FROM riwayat_diklat d
//   JOIN pegawai p ON d.nip = p.nip
//   WHERE ...
const DUMMY_DATA: RiwayatDiklatItem[] = [
  {
    nip: "196501011990031001",
    nama_pegawai: "Budi Santoso",
    kd_diklat: "DK-2024-001",
    nm_diklat: "Pelatihan Manajemen ASN",
    tgl_awal: "2024-03-10",
    tgl_akhir: "2024-03-14",
    nm_lembaga: "BPSDM Kementerian Keuangan",
    no_sertifikat: "SERT/2024/001/DK",
    tgl_sertifikat: "2024-03-15",
    jml_jamlat: 40,
    id_identifikasi: "ID-2024-001",
    link_sertifikat: "https://example.com/sertifikat/001",
    esl2: "Sekretariat Jenderal",
    esl3: "Biro Sumber Daya Manusia",
    esl4: "Bagian Pengembangan SDM",
  },
  {
    nip: "196501011990031001",
    nama_pegawai: "Budi Santoso",
    kd_diklat: "DK-2024-012",
    nm_diklat: "Bimbingan Teknis Pengelolaan Keuangan Negara",
    tgl_awal: "2024-06-17",
    tgl_akhir: "2024-06-20",
    nm_lembaga: "Pusdiklat Anggaran dan Perbendaharaan",
    no_sertifikat: "SERT/2024/012/BT",
    tgl_sertifikat: "2024-06-21",
    jml_jamlat: 32,
    id_identifikasi: "ID-2024-012",
    link_sertifikat: "",
    esl2: "Sekretariat Jenderal",
    esl3: "Biro Sumber Daya Manusia",
    esl4: "Bagian Pengembangan SDM",
  },
  {
    nip: "197203151998031002",
    nama_pegawai: "Siti Rahayu",
    kd_diklat: "DK-2023-055",
    nm_diklat: "Diklat Kepemimpinan Tingkat III",
    tgl_awal: "2023-08-01",
    tgl_akhir: "2023-09-30",
    nm_lembaga: "LAN RI",
    no_sertifikat: "SERT/2023/055/PKA",
    tgl_sertifikat: "2023-10-01",
    jml_jamlat: 600,
    id_identifikasi: "ID-2023-055",
    link_sertifikat: "https://example.com/sertifikat/055",
    esl2: "Direktorat Jenderal Anggaran",
    esl3: "Direktorat Penyusunan APBN",
    esl4: "Subdirektorat Anggaran I",
  },
  {
    nip: "197203151998031002",
    nama_pegawai: "Siti Rahayu",
    kd_diklat: "DK-2024-030",
    nm_diklat: "E-Learning Penguatan Kompetensi Digital",
    tgl_awal: "2024-01-15",
    tgl_akhir: "2024-01-19",
    nm_lembaga: "BPSDM Kemenkeu",
    no_sertifikat: "SERT/2024/030/EL",
    tgl_sertifikat: "2024-01-20",
    jml_jamlat: 20,
    id_identifikasi: "ID-2024-030",
    link_sertifikat: "https://example.com/sertifikat/030",
    esl2: "Direktorat Jenderal Anggaran",
    esl3: "Direktorat Penyusunan APBN",
    esl4: "Subdirektorat Anggaran I",
  },
  {
    nip: "198509122010011015",
    nama_pegawai: "Ahmad Fauzi",
    kd_diklat: "DK-2024-007",
    nm_diklat: "Pelatihan Sistem Akuntansi Pemerintah",
    tgl_awal: "2024-04-22",
    tgl_akhir: "2024-04-26",
    nm_lembaga: "Pusdiklat Keuangan Umum",
    no_sertifikat: "SERT/2024/007/SAP",
    tgl_sertifikat: "2024-04-27",
    jml_jamlat: 40,
    id_identifikasi: "ID-2024-007",
    link_sertifikat: "",
    esl2: "Direktorat Jenderal Perbendaharaan",
    esl3: "Direktorat Akuntansi dan Pelaporan Keuangan",
    esl4: "Subdirektorat Akuntansi Pusat",
  },
  {
    nip: "198509122010011015",
    nama_pegawai: "Ahmad Fauzi",
    kd_diklat: "DK-2023-091",
    nm_diklat: "Workshop Reformasi Birokrasi",
    tgl_awal: "2023-11-06",
    tgl_akhir: "2023-11-08",
    nm_lembaga: "Kementerian PAN-RB",
    no_sertifikat: "SERT/2023/091/WRB",
    tgl_sertifikat: "2023-11-09",
    jml_jamlat: 24,
    id_identifikasi: "ID-2023-091",
    link_sertifikat: "https://example.com/sertifikat/091",
    esl2: "Direktorat Jenderal Perbendaharaan",
    esl3: "Direktorat Akuntansi dan Pelaporan Keuangan",
    esl4: "Subdirektorat Akuntansi Pusat",
  },
  {
    nip: "199001052015041001",
    nama_pegawai: "Dewi Kusuma",
    kd_diklat: "DK-2024-045",
    nm_diklat: "Pelatihan Pengadaan Barang dan Jasa",
    tgl_awal: "2024-02-05",
    tgl_akhir: "2024-02-09",
    nm_lembaga: "LKPP",
    no_sertifikat: "SERT/2024/045/PBJ",
    tgl_sertifikat: "2024-02-10",
    jml_jamlat: 40,
    id_identifikasi: "ID-2024-045",
    link_sertifikat: "https://example.com/sertifikat/045",
    esl2: "Sekretariat Jenderal",
    esl3: "Biro Umum",
    esl4: "Bagian Pengadaan",
  },
  {
    nip: "199001052015041001",
    nama_pegawai: "Dewi Kusuma",
    kd_diklat: "DK-2024-060",
    nm_diklat: "E-Learning Manajemen Kinerja ASN",
    tgl_awal: "2024-05-13",
    tgl_akhir: "2024-05-17",
    nm_lembaga: "BPSDM Kemenkeu",
    no_sertifikat: "SERT/2024/060/MK",
    tgl_sertifikat: "2024-05-18",
    jml_jamlat: 20,
    id_identifikasi: "ID-2024-060",
    link_sertifikat: "",
    esl2: "Sekretariat Jenderal",
    esl3: "Biro Umum",
    esl4: "Bagian Pengadaan",
  },
];

// ─── GET Handler ──────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // ── mode=options: kembalikan daftar pilihan untuk dropdown ──────────────
    if (searchParams.get("mode") === "options") {
      const uniq = <T>(arr: T[]) => Array.from(new Set(arr)).filter(Boolean).sort();
      return NextResponse.json({
        success: true,
        options: {
          esl2: uniq(DUMMY_DATA.map((d) => d.esl2)),
          esl3: uniq(DUMMY_DATA.map((d) => d.esl3)),
          esl4: uniq(DUMMY_DATA.map((d) => d.esl4)),
          nm_diklat: uniq(DUMMY_DATA.map((d) => d.nm_diklat)),
          nm_lembaga: uniq(DUMMY_DATA.map((d) => d.nm_lembaga)),
        },
      });
    }

    // ── Parameter filter ────────────────────────────────────────────────────
    const nip           = searchParams.get("nip")?.trim() ?? "";
    const esl2          = searchParams.get("esl2")?.trim() ?? "";
    const esl3          = searchParams.get("esl3")?.trim() ?? "";
    const esl4          = searchParams.get("esl4")?.trim() ?? "";
    const tgl_awal_from = searchParams.get("tgl_awal_from") ?? "";
    const tgl_awal_to   = searchParams.get("tgl_awal_to") ?? "";

    // nm_diklat: bisa berupa beberapa nilai dipisah "|"
    // Tiap nilai diperlakukan sebagai wildcard (contains, normalisasi spesial char)
    // Contoh: "pelatihan|e-learning" → cocok jika nm_diklat mengandung "pelatihan" ATAU "elearning"
    const nm_diklatRaw = searchParams.get("nm_diklat")?.trim() ?? "";

    // TODO: Ganti DUMMY_DATA dengan query DB sesungguhnya
    let data = [...DUMMY_DATA];

    if (nip) {
      data = data.filter((d) => d.nip.includes(nip));
    }
    if (esl2) {
      data = data.filter((d) => d.esl2 === esl2);
    }
    if (esl3) {
      data = data.filter((d) => d.esl3 === esl3);
    }
    if (esl4) {
      data = data.filter((d) => d.esl4 === esl4);
    }
    if (nm_diklatRaw) {
      // Wildcard: normalisasi dan cek contains, dengan OR antar term (pipe-separated)
      data = data.filter((d) => wildcardMatch(d.nm_diklat, nm_diklatRaw));
    }
    if (tgl_awal_from) {
      data = data.filter((d) => d.tgl_awal >= tgl_awal_from);
    }
    if (tgl_awal_to) {
      data = data.filter((d) => d.tgl_awal <= tgl_awal_to);
    }

    return NextResponse.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
