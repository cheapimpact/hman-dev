"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// Interface untuk TypeScript (agar autocomplete jalan di frontend)
// export interface Pegawai {
//   id: number;
//   nip: string;
//   nama: string;
//   jabatan: string;
//   unit: string;
//   status: string;
//   created_at: string;
// }

// // 1. FUNGSI AMBIL DATA (SELECT)
// export async function getPegawai(keyword: string = "") {
//   // Gunakan tanda tanya (?) untuk mencegah SQL Injection (Parameterized Query)
//   // %keyword% artinya mencari teks yang mengandung keyword tersebut
//   const query = `
//     SELECT * FROM pegawai
//     WHERE nama LIKE ? OR nip LIKE ? OR unit LIKE ?
//     ORDER BY created_at DESC
//   `;

//   const searchTerm = `%${keyword}%`;

//   // .all() digunakan untuk mengambil banyak data
//   const data = db
//     .prepare(query)
//     .all(searchTerm, searchTerm, searchTerm) as Pegawai[];

//   return data;
// }

// 2. FUNGSI ISI DATA DUMMY (INSERT)
// export async function seedPegawai() {
//   // Cek apakah data sudah ada?
//   const check = db.prepare("SELECT count(*) as count FROM pegawai").get() as {
//     count: number;
//   };

//   if (check.count > 0) return; // Stop jika sudah ada isinya

//   // Siapkan statement INSERT
//   const insert = db.prepare(`
//     INSERT INTO pegawai (nip, nama, jabatan, unit, status)
//     VALUES (?, ?, ?, ?, ?)
//   `);

//   // Jalankan insert beberapa kali dalam satu transaksi (biar ngebut)
//   const insertMany = db.transaction((dataList) => {
//     for (const p of dataList)
//       insert.run(p.nip, p.nama, p.jabatan, p.unit, p.status);
//   });

//   insertMany([
//     {
//       nip: "19850101",
//       nama: "Budi Tanpa Prisma",
//       jabatan: "Kabid",
//       unit: "Umum",
//       status: "Aktif",
//     },
//     {
//       nip: "19900202",
//       nama: "Siti SQL",
//       jabatan: "Staff",
//       unit: "IT",
//       status: "Cuti",
//     },
//     {
//       nip: "19950303",
//       nama: "Andi Query",
//       jabatan: "Admin",
//       unit: "Keuangan",
//       status: "Aktif",
//     },
//   ]);

//   revalidatePath("/pencarian");
// }

export interface GoogleSheetParams {
  path: string;
  action: string;
  named_range: string;
}

export interface DasborKPIData {
  TRA: number;
  "Total Kegiatan": number;
  "Total Peserta": number;
}

export interface GoogleSheetResponse<T> {
  status: string;
  debugInfo?: string;
  data: T[];
}

export async function fetchGoogleSheetData<T>(
  params: GoogleSheetParams
): Promise<GoogleSheetResponse<T>> {
  const baseUrl =
    "https://script.google.com/macros/s/AKfycbyxbKTFxNsoxYLi8sUbC3SNtGm5-VS-PSzLAL4onUG9NTPGe_qK0Ik-znppCJ_9fsjWeg/exec";

  const url = new URL(baseUrl);
  url.searchParams.append("path", params.path);
  url.searchParams.append("action", params.action);
  url.searchParams.append("named_range", params.named_range);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      // Revalidasi cache setiap 60 detik (bisa disesuaikan atau gunakan cache: "no-store" jika harus realtime)
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari Google Sheet: ${response.statusText}`);
    }

    const result = await response.json();
    return result as GoogleSheetResponse<T>;
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error);
    throw error;
  }
}
