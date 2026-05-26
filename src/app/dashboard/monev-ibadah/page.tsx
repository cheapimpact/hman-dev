import MonevIbadahDashboard from "@/components/dashboard/MonevIbadah";

export const metadata = {
  title: "MonevIbadah – Dashboard Monitoring Ibadah Harian",
  description:
    "Dashboard monitoring dan evaluasi amalan ibadah harian tim, mencakup salat, tilawah Al-Quran, puasa sunnah, dan amalan lainnya.",
};

export default function MonevIbadahPage() {
  return <MonevIbadahDashboard />;
}
