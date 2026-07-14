import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY_KEY = "8dd3f3bf-425b-4ab5-a9d6-0ae8212c8fc0";

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

async function getInfoPegawai(
  nip: string,
  bearerToken: string
): Promise<PegawaiResult> {
  const placeholder = "Tidak Ditemukan";
  const errorResult = (msg: string): PegawaiResult => ({
    idPegawai: msg,
    nama: msg,
    nip,
    pangkat: "",
    golongan: "",
    esl1: "",
    esl2: "",
    esl3: "",
    esl4: "",
    kodeOrganisasi: "",
    kodeIndukOrganisasi: "",
    kodeSatker: "",
    status: "error",
    message: msg,
  });

  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:143.0) Gecko/20100101 Firefox/143.0",
    Accept: "application/json, text/plain, */*",
    Authorization: bearerToken,
    "x-Gateway-APIKey": API_GATEWAY_KEY,
    Origin: "https://satu.kemenkeu.go.id",
    Referer: "https://satu.kemenkeu.go.id/",
  };

  try {
    // Step 1: Search by NIP
    const searchUrl = new URL(
      "https://service.kemenkeu.go.id/hris2/profil/api/Profile/GetAllPegawai"
    );
    searchUrl.searchParams.set("page", "1");
    searchUrl.searchParams.set("pageSize", "1");
    searchUrl.searchParams.set("select", "idPegawai,nip18");
    searchUrl.searchParams.set("Filters", `nama|nip18@=*${nip}`);

    const searchRes = await fetch(searchUrl.toString(), {
      headers,
      signal: AbortSignal.timeout(15000),
    });

    if (searchRes.status === 401) {
      return errorResult("Token Kedaluwarsa");
    }

    if (!searchRes.ok) {
      return errorResult(`Err Search: ${searchRes.status}`);
    }

    const searchData = await searchRes.json();

    if (!searchData?.data?.length) {
      return errorResult(placeholder);
    }

    const pegawai = searchData.data[0];
    const idPegawai = pegawai?.idPegawai;
    const nipHasil = pegawai?.nip18 ?? "NIP Tdk Ada";

    if (!idPegawai) {
      return { ...errorResult("ID Tdk Ada"), nip: nipHasil };
    }

    // Step 2: Get detail profile
    const profilRes = await fetch(
      `https://service.kemenkeu.go.id/hris2/profil/api/Profile/GetBasicProfilById/${idPegawai}`,
      { headers, signal: AbortSignal.timeout(15000) }
    );

    if (!profilRes.ok) {
      return errorResult(`Err Profil: ${profilRes.status}`);
    }

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
        idPegawai,
        nama,
        nip: nipHasil,
        pangkat,
        golongan,
        esl1: jabatan.esl1 ?? "",
        esl2: jabatan.esl2 ?? "",
        esl3: jabatan.esl3 ?? "",
        esl4: jabatan.esl4 ?? "",
        kodeOrganisasi: jabatan.kodeOrganisasi ?? "",
        kodeIndukOrganisasi: jabatan.kodeIndukOrganisasi ?? "",
        kodeSatker,
        status: "success",
      };
    } else {
      return {
        idPegawai,
        nama,
        nip: nipHasil,
        pangkat,
        golongan,
        esl1: "Jabatan Tdk Ada",
        esl2: "",
        esl3: "",
        esl4: "",
        kodeOrganisasi: "",
        kodeIndukOrganisasi: "",
        kodeSatker: "",
        status: "success",
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResult(`Error Koneksi: ${msg}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nipList, bearerToken } = body as {
      nipList: string[];
      bearerToken: string;
    };

    if (!nipList?.length || !bearerToken) {
      return NextResponse.json(
        { error: "nipList dan bearerToken wajib diisi." },
        { status: 400 }
      );
    }

    // Process concurrently with max 10 workers (same as Python version)
    const CONCURRENCY = 10;
    const results: PegawaiResult[] = new Array(nipList.length);

    for (let i = 0; i < nipList.length; i += CONCURRENCY) {
      const chunk = nipList.slice(i, i + CONCURRENCY);
      const chunkResults = await Promise.all(
        chunk.map((nip) => getInfoPegawai(nip, bearerToken))
      );
      chunkResults.forEach((r, j) => {
        results[i + j] = r;
      });
    }

    return NextResponse.json({ results });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
