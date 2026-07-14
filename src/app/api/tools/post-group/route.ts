import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bearerToken, groupName, idList, apiUrl, payloadKey } = body as {
      bearerToken: string;
      groupName: string;
      idList: (string | number)[];
      apiUrl: string;
      payloadKey: string;
    };

    if (!bearerToken || !groupName || !idList?.length || !apiUrl || !payloadKey) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:143.0) Gecko/20100101 Firefox/143.0",
      Accept: "application/json, text/plain, */*",
      Authorization: bearerToken,
      roleId: "5",
      unitId: "17086",
      lat: "-6.2053671",
      long: "106.876853",
      "Content-Type": "application/json",
      Origin: "https://satu.kemenkeu.go.id",
      Connection: "keep-alive",
      Referer: "https://satu.kemenkeu.go.id/",
    };

    const payload = { Nama: groupName, [payloadKey]: idList };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    const responseText = await response.text();
    let responseData: unknown;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    if (response.status === 200 || response.status === 201) {
      return NextResponse.json({ success: true, data: responseData });
    } else {
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          data: responseData,
        },
        { status: response.status }
      );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
