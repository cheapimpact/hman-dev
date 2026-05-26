// ─── DUMMY DATA: MONEV IBADAH ─────────────────────────────────────────────────

export interface DailyRecord {
  date: string; // "YYYY-MM-DD"
  subuh: "tepat" | "telat" | "skip";
  dzuhur: "jamaah" | "sendiri" | "skip";
  ashar: "jamaah" | "sendiri" | "skip";
  maghrib: "tepat" | "telat" | "skip";
  isya: "tepat" | "telat" | "skip";
  dhuha: boolean;
  tahajud: boolean;
  rawatib: boolean;
  tilawahPages: number; // pages read
  puasaSunnah: boolean;
  sedekah: boolean;
  kajian: boolean;
}

export interface Member {
  id: string;
  name: string;
  initials: string;
  seksi: string;
  targetJuz: number; // target khatam
  currentJuz: number; // current progress
  records: DailyRecord[];
}

// Helper: generate random date records for 90 days back
function generateRecords(seed: number): DailyRecord[] {
  const records: DailyRecord[] = [];
  const today = new Date();

  const rng = (offset: number) => {
    // Seeded pseudo-random
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  for (let d = 89; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];

    const piety = 0.3 + rng(d * 7) * 0.7; // how pious this person is on this day

    const subuhOpts: DailyRecord["subuh"][] = ["tepat", "telat", "skip"];
    const shalatOpts: DailyRecord["dzuhur"][] = [
      "jamaah",
      "sendiri",
      "skip",
    ];

    records.push({
      date: dateStr,
      subuh:
        piety > 0.7
          ? "tepat"
          : piety > 0.4
          ? "telat"
          : rng(d * 3) > 0.6
          ? "skip"
          : "tepat",
      dzuhur:
        piety > 0.75
          ? "jamaah"
          : piety > 0.45
          ? "sendiri"
          : rng(d * 4) > 0.7
          ? "skip"
          : "sendiri",
      ashar:
        piety > 0.65
          ? "jamaah"
          : piety > 0.4
          ? "sendiri"
          : rng(d * 5) > 0.65
          ? "skip"
          : "sendiri",
      maghrib:
        piety > 0.6
          ? "tepat"
          : piety > 0.35
          ? "telat"
          : rng(d * 6) > 0.7
          ? "skip"
          : "tepat",
      isya:
        piety > 0.55
          ? "tepat"
          : piety > 0.3
          ? "telat"
          : rng(d * 8) > 0.72
          ? "skip"
          : "tepat",
      dhuha: piety > 0.6 && rng(d * 9) > 0.35,
      tahajud: piety > 0.7 && rng(d * 10) > 0.55,
      rawatib: piety > 0.5 && rng(d * 11) > 0.4,
      tilawahPages: Math.floor(piety * rng(d * 12) * 20),
      puasaSunnah:
        (date.getDay() === 1 || date.getDay() === 4) &&
        piety > 0.5 &&
        rng(d * 13) > 0.45,
      sedekah: piety > 0.45 && rng(d * 14) > 0.5,
      kajian: date.getDay() === 4 && piety > 0.5 && rng(d * 15) > 0.4,
    });
  }

  return records;
}

export const MEMBERS: Member[] = [
  {
    id: "1",
    name: "Amrul",
    initials: "AM",
    seksi: "Kepegawaian",
    targetJuz: 30,
    currentJuz: 22.5,
    records: generateRecords(101),
  },
  {
    id: "2",
    name: "Yulio",
    initials: "YL",
    seksi: "Keuangan",
    targetJuz: 30,
    currentJuz: 18.0,
    records: generateRecords(202),
  },
  {
    id: "3",
    name: "Hendar",
    initials: "HD",
    seksi: "Umum",
    targetJuz: 30,
    currentJuz: 27.3,
    records: generateRecords(303),
  },
  {
    id: "4",
    name: "Pak Haji",
    initials: "PH",
    seksi: "Pimpinan",
    targetJuz: 30,
    currentJuz: 30.0,
    records: generateRecords(404),
  },
  {
    id: "5",
    name: "Abox",
    initials: "AB",
    seksi: "IT",
    targetJuz: 30,
    currentJuz: 11.7,
    records: generateRecords(505),
  },
  {
    id: "6",
    name: "Prabowo",
    initials: "PB",
    seksi: "Perencanaan",
    targetJuz: 30,
    currentJuz: 25.1,
    records: generateRecords(606),
  },
  {
    id: "7",
    name: "Jokowi",
    initials: "JK",
    seksi: "Administrasi",
    targetJuz: 30,
    currentJuz: 16.8,
    records: generateRecords(707),
  },
  {
    id: "8",
    name: "Budi",
    initials: "BD",
    seksi: "Humas",
    targetJuz: 30,
    currentJuz: 9.4,
    records: generateRecords(808),
  },
  {
    id: "9",
    name: "Sari",
    initials: "SR",
    seksi: "Kepegawaian",
    targetJuz: 30,
    currentJuz: 20.2,
    records: generateRecords(909),
  },
  {
    id: "10",
    name: "Rizky",
    initials: "RZ",
    seksi: "Keuangan",
    targetJuz: 30,
    currentJuz: 14.5,
    records: generateRecords(1010),
  },
  {
    id: "11",
    name: "Dewi",
    initials: "DW",
    seksi: "IT",
    targetJuz: 30,
    currentJuz: 28.9,
    records: generateRecords(1111),
  },
  {
    id: "12",
    name: "Hasan",
    initials: "HS",
    seksi: "Umum",
    targetJuz: 30,
    currentJuz: 6.3,
    records: generateRecords(1212),
  },
];

// ─── COMPUTED HELPERS ─────────────────────────────────────────────────────────

export function getAmalanScore(record: DailyRecord): number {
  let score = 0;
  // Salat wajib (max 50)
  const salatMap = {
    tepat: 10,
    jamaah: 10,
    sendiri: 7,
    telat: 5,
    skip: 0,
  };
  score += salatMap[record.subuh] ?? 0;
  score += salatMap[record.dzuhur] ?? 0;
  score += salatMap[record.ashar] ?? 0;
  score += salatMap[record.maghrib] ?? 0;
  score += salatMap[record.isya] ?? 0;

  // Sunnah (max 30)
  if (record.dhuha) score += 10;
  if (record.tahajud) score += 12;
  if (record.rawatib) score += 8;

  // Tilawah (max 10)
  score += Math.min(10, record.tilawahPages * 0.5);

  // Lainnya (max 10)
  if (record.puasaSunnah) score += 5;
  if (record.sedekah) score += 3;
  if (record.kajian) score += 2;

  return Math.round((score / 100) * 100); // normalize to 100
}

export function getTodayRecord(member: Member): DailyRecord | undefined {
  const today = new Date().toISOString().split("T")[0];
  return member.records.find((r) => r.date === today);
}

export function getWeekRecords(member: Member): DailyRecord[] {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  return member.records.filter((r) => {
    const d = new Date(r.date);
    return d >= sevenDaysAgo && d <= today;
  });
}

export function getMemberHeatmapData(member: Member) {
  return member.records.map((r) => ({
    date: r.date,
    score: getAmalanScore(r),
  }));
}

// Weekly participation trend (last 30 days)
export function getParticipationTrend(): { date: string; pct: number }[] {
  const today = new Date();
  const result = [];
  for (let d = 29; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];
    const membersWithData = MEMBERS.filter((m) =>
      m.records.some((r) => r.date === dateStr && getAmalanScore(r) > 0)
    ).length;
    result.push({
      date: dateStr,
      pct: Math.round((membersWithData / MEMBERS.length) * 100),
    });
  }
  return result;
}

// Leaderboard: Bintang Dhuha (last 7 days)
export function getDhuhaStars(): { name: string; count: number; initials: string }[] {
  return MEMBERS.map((m) => {
    const week = getWeekRecords(m);
    return {
      name: m.name,
      initials: m.initials,
      count: week.filter((r) => r.dhuha).length,
    };
  })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

// Leaderboard: Inspirator Tilawah (last 7 days pages)
export function getTilawahInspirators(): {
  name: string;
  pages: number;
  initials: string;
}[] {
  return MEMBERS.map((m) => {
    const week = getWeekRecords(m);
    return {
      name: m.name,
      initials: m.initials,
      pages: week.reduce((s, r) => s + r.tilawahPages, 0),
    };
  })
    .sort((a, b) => b.pages - a.pages)
    .slice(0, 5);
}

// Tim aggregate today
export function getTeamAggregateToday() {
  const today = new Date().toISOString().split("T")[0];
  let dzuhurJamaah = 0;
  let dhuha = 0;
  let tilawahTotal = 0;
  let sedekah = 0;

  MEMBERS.forEach((m) => {
    const r = m.records.find((x) => x.date === today);
    if (!r) return;
    if (r.dzuhur === "jamaah") dzuhurJamaah++;
    if (r.dhuha) dhuha++;
    tilawahTotal += r.tilawahPages;
    if (r.sedekah) sedekah++;
  });

  return {
    dzuhurJamaahPct: Math.round((dzuhurJamaah / MEMBERS.length) * 100),
    dhuhaPct: Math.round((dhuha / MEMBERS.length) * 100),
    tilawahTotalPages: tilawahTotal,
    sedekahPct: Math.round((sedekah / MEMBERS.length) * 100),
  };
}
