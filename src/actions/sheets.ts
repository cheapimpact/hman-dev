"use server";

import { DiklatData, DashboardStats } from "@/types/api";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyxbKTFxNsoxYLi8sUbC3SNtGm5-VS-PSzLAL4onUG9NTPGe_qK0Ik-znppCJ_9fsjWeg/exec";
export async function getDashboardData(named_range: string) {
  try {
    // 1. Fetch Data dari Google Script

    const url = new URL(API_URL);
    console.log("Fetching data from:", url);
    url.searchParams.append("path", "Dasbor");
    url.searchParams.append("action", "read");
    url.searchParams.append("named_range", named_range);
    console.log("Fetching data from:", url.toString());
    const res = await fetch(url, {
      cache: "no-store", // Selalu ambil data terbaru (Realtime)
      // Jika ingin cache (misal update tiap 1 jam), ganti jadi: next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error("Gagal mengambil data dari Google Sheets");

    const json = await res.json();
    console.log(json);

    // 2. Validasi format response
    // Google Script kadang mengembalikan { data: [...] } atau langsung [...]
    const rawData = json.data || json;
    console.log(rawData);

    return rawData as DiklatData[];
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}
