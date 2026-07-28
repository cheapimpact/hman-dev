import { NextResponse } from "next/server";

/**
 * Diagnostic endpoint — DELETE after use.
 * GET /api/tools/ping-kemenkeu
 */
export async function GET() {
  const target = "https://service.kemenkeu.go.id/hris2/profil/api/Profile/GetAllPegawai?page=1&pageSize=1";
  const start = Date.now();

  try {
    const res = await fetch(target, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });
    const elapsed = Date.now() - start;

    return NextResponse.json({
      ok: true,
      status: res.status,
      statusText: res.statusText,
      elapsed_ms: elapsed,
      server_region: process.env.VERCEL_REGION ?? "unknown",
    });
  } catch (err: unknown) {
    const elapsed = Date.now() - start;
    const e = err as NodeJS.ErrnoException;
    const cause = e?.cause as NodeJS.ErrnoException | undefined;

    return NextResponse.json(
      {
        ok: false,
        error: e?.message ?? String(err),
        code: e?.code ?? "NO_CODE",
        cause: cause?.message ?? null,
        elapsed_ms: elapsed,
        server_region: process.env.VERCEL_REGION ?? "unknown",
      },
      { status: 502 }
    );
  }
}
