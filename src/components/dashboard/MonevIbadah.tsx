"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { useTheme, alpha } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";

import MosqueIcon from "@mui/icons-material/Mosque";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LightModeIcon from "@mui/icons-material/LightMode";
import WhatshotIcon from "@mui/icons-material/Whatshot";

import {
  MEMBERS,
  getAmalanScore,
  getMemberHeatmapData,
  getParticipationTrend,
  getDhuhaStars,
  getTilawahInspirators,
  getTeamAggregateToday,
  getWeekRecords,
} from "./monev-ibadah-data";

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────
function scoreToColor(score: number, isDark: boolean): string {
  if (score === 0) return isDark ? "#1e2a1e" : "#eef4ee";
  if (score < 25) return isDark ? "#1a4a1a" : "#c6e8c6";
  if (score < 50) return isDark ? "#1f6b1f" : "#7ec87e";
  if (score < 75) return isDark ? "#2d9e2d" : "#4cb94c";
  return isDark ? "#3ed63e" : "#1a7a1a";
}

// ─── HEATMAP COMPONENT ────────────────────────────────────────────────────────
function HabitHeatmap({ memberId }: { memberId: string }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const member = MEMBERS.find((m) => m.id === memberId)!;
  const data = getMemberHeatmapData(member);

  // Build 13 weeks x 7 days grid
  const weeks: { date: string; score: number }[][] = [];
  let currentWeek: { date: string; score: number }[] = [];

  // Pad first week
  const firstDate = new Date(data[0].date);
  const firstDay = firstDate.getDay(); // 0=Sun
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push({ date: "", score: -1 });
  }

  data.forEach((d) => {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push({ date: "", score: -1 });
    weeks.push(currentWeek);
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const days = ["M", "S", "R", "K", "J", "S", "M"];

  return (
    <Box>
      <Box sx={{ display: "flex", gap: "3px", mb: 0.5, ml: "18px" }}>
        {weeks.map((_, wi) => {
          const d = _.find((x) => x.date)?.date;
          const m = d ? new Date(d).getMonth() : null;
          const isFirstOfMonth =
            d &&
            (wi === 0 || new Date(d).getDate() <= 7);
          return (
            <Box key={wi} sx={{ width: 12, fontSize: "8px", color: "text.disabled", textAlign: "center" }}>
              {isFirstOfMonth && m !== null ? months[m] : ""}
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "3px", mr: "2px" }}>
          {days.map((d, i) => (
            <Box key={i} sx={{ height: 12, fontSize: "8px", color: "text.disabled", lineHeight: "12px" }}>
              {i % 2 === 1 ? d : ""}
            </Box>
          ))}
        </Box>
        {weeks.map((week, wi) => (
          <Box key={wi} sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {week.map((day, di) => (
              <Tooltip
                key={di}
                title={
                  day.score >= 0 && day.date
                    ? `${day.date}: Skor ${day.score}/100`
                    : ""
                }
                arrow
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "2px",
                    bgcolor:
                      day.score < 0
                        ? "transparent"
                        : scoreToColor(day.score, isDark),
                    cursor: day.score >= 0 ? "pointer" : "default",
                    transition: "transform 0.1s",
                    "&:hover": day.score >= 0 ? { transform: "scale(1.3)" } : {},
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── QURAN PROGRESS BAR ───────────────────────────────────────────────────────
function QuranProgressCard() {
  const theme = useTheme();
  const sorted = [...MEMBERS].sort((a, b) => b.currentJuz - a.currentJuz);

  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.12),
              display: "flex",
            }}
          >
            <AutoStoriesIcon sx={{ color: "warning.main", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Progres Tilawah Al-Quran
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Target: Khatam 30 Juz
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1.5}>
          {sorted.map((m) => {
            const pct = Math.min(100, (m.currentJuz / 30) * 100);
            const isKhatam = m.currentJuz >= 30;
            return (
              <Box key={m.id}>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.65rem",
                        bgcolor: isKhatam
                          ? alpha(theme.palette.success.main, 0.2)
                          : alpha(theme.palette.primary.main, 0.12),
                        color: isKhatam ? "success.main" : "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      {m.initials}
                    </Avatar>
                    <Typography variant="body2" fontWeight={500}>
                      {m.name}
                    </Typography>
                    {isKhatam && (
                      <Chip
                        label="Khatam ✓"
                        size="small"
                        color="success"
                        sx={{ height: 18, fontSize: "0.65rem" }}
                      />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {m.currentJuz.toFixed(1)} / 30 Juz
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(
                      isKhatam
                        ? theme.palette.success.main
                        : theme.palette.primary.main,
                      0.12
                    ),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      background: isKhatam
                        ? `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.success.main})`
                        : `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── PARTICIPATION TREND ──────────────────────────────────────────────────────
function ParticipationTrendCard() {
  const theme = useTheme();
  const data = getParticipationTrend();
  const xLabels = data.map((d) => {
    const date = new Date(d.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
  const values = data.map((d) => d.pct);

  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.12),
              display: "flex",
            }}
          >
            <PeopleAltIcon sx={{ color: "info.main", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Tingkat Partisipasi Harian
            </Typography>
            <Typography variant="caption" color="text.secondary">
              % anggota yang mengisi log amalan (30 hari terakhir)
            </Typography>
          </Box>
        </Stack>
        <LineChart
          height={200}
          series={[
            {
              data: values,
              label: "% Partisipasi",
              color: theme.palette.info.main,
              area: true,
              showMark: false,
            },
          ]}
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
              tickLabelInterval: (_, index) => index % 5 === 0,
            },
          ]}
          yAxis={[{ min: 0, max: 100 }]}
          sx={{
            "& .MuiAreaElement-root": {
              fillOpacity: 0.15,
            },
            "& .MuiChartsAxis-tickLabel": {
              fontSize: "0.65rem",
            },
          }}
          margin={{ left: 35, right: 10, top: 10, bottom: 30 }}
        />
      </CardContent>
    </Card>
  );
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
function LeaderboardCard({
  title,
  icon,
  color,
  items,
  valueLabel,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: { name: string; initials: string; value: number }[];
  valueLabel: string;
}) {
  const theme = useTheme();
  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(color, 0.12),
              display: "flex",
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          {items.map((item, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
              <Typography sx={{ fontSize: "1.1rem", width: 24 }}>{medals[i]}</Typography>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.7rem",
                  bgcolor: alpha(color, 0.15),
                  color: color,
                  fontWeight: 700,
                }}
              >
                {item.initials}
              </Avatar>
              <Typography variant="body2" fontWeight={500} flexGrow={1}>
                {item.name}
              </Typography>
              <Chip
                label={`${item.value} ${valueLabel}`}
                size="small"
                sx={{
                  bgcolor: alpha(color, 0.1),
                  color: color,
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── TEAM AGGREGATE ───────────────────────────────────────────────────────────
function TeamAggregateCard() {
  const theme = useTheme();
  const agg = getTeamAggregateToday();

  const metrics = [
    {
      label: "Dzuhur Berjamaah",
      value: agg.dzuhurJamaahPct,
      icon: <MosqueIcon />,
      color: theme.palette.primary.main,
      suffix: "%",
    },
    {
      label: "Dhuha Hari Ini",
      value: agg.dhuhaPct,
      icon: <LightModeIcon />,
      color: theme.palette.warning.main,
      suffix: "%",
    },
    {
      label: "Tilawah (Halaman)",
      value: agg.tilawahTotalPages,
      icon: <AutoStoriesIcon />,
      color: theme.palette.success.main,
      suffix: "hal",
    },
    {
      label: "Bersedekah",
      value: agg.sedekahPct,
      icon: <FavoriteIcon />,
      color: theme.palette.error.main,
      suffix: "%",
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.success.main, 0.05)})`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              display: "flex",
            }}
          >
            <PeopleAltIcon sx={{ color: "primary.main", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Agregat Tim Hari Ini
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pencapaian kolektif {MEMBERS.length} anggota tim
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          {metrics.map((m, i) => (
            <Grid key={i} size={{ xs: 6, sm: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(m.color, 0.08),
                  textAlign: "center",
                  border: `1px solid ${alpha(m.color, 0.15)}`,
                }}
              >
                <Box sx={{ color: m.color, mb: 0.5 }}>{m.icon}</Box>
                <Typography variant="h5" fontWeight={800} sx={{ color: m.color }}>
                  {m.value}
                  <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                    {m.suffix}
                  </Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {m.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 2.5,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.success.main, 0.08),
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          <Typography variant="body2" color="success.main" fontWeight={600} textAlign="center">
            🤲 Alhamdulillah, {agg.dzuhurJamaahPct}% tim hari ini salat Dzuhur berjamaah
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── HEATMAP GRID ─────────────────────────────────────────────────────────────
function HeatmapSection() {
  const theme = useTheme();

  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.12),
              display: "flex",
            }}
          >
            <LocalFireDepartmentIcon sx={{ color: "success.main", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Habit Heatmap Individu
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Konsistensi amalan 90 hari terakhir — semakin hijau semakin lengkap
            </Typography>
          </Box>
          <Box flexGrow={1} />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="caption" color="text.disabled">Kurang</Typography>
            {[0, 20, 45, 70, 90].map((s) => (
              <Box
                key={s}
                sx={{
                  width: 11,
                  height: 11,
                  borderRadius: "2px",
                  bgcolor: scoreToColor(s, theme.palette.mode === "dark"),
                }}
              />
            ))}
            <Typography variant="caption" color="text.disabled">Banyak</Typography>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          {MEMBERS.map((m) => {
            const weekRecords = getWeekRecords(m);
            const weekScore = weekRecords.length
              ? Math.round(
                  weekRecords.reduce((s, r) => s + getAmalanScore(r), 0) /
                    weekRecords.length
                )
              : 0;

            return (
              <Grid key={m.id} size={{ xs: 12, md: 6 }}>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: "0.7rem",
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      {m.initials}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>
                      {m.name}
                    </Typography>
                    <Chip
                      label={m.seksi}
                      size="small"
                      sx={{ height: 16, fontSize: "0.6rem", bgcolor: alpha(theme.palette.divider, 0.5) }}
                    />
                    <Box flexGrow={1} />
                    <Chip
                      label={`Avg ${weekScore}/100`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.65rem",
                        bgcolor: alpha(
                          weekScore > 70
                            ? theme.palette.success.main
                            : weekScore > 40
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                          0.12
                        ),
                        color:
                          weekScore > 70
                            ? "success.main"
                            : weekScore > 40
                            ? "warning.main"
                            : "error.main",
                      }}
                    />
                  </Stack>
                  <HabitHeatmap memberId={m.id} />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function MonevIbadahDashboard() {
  const theme = useTheme();
  const today = new Date();
  const dayNames = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  const dhuhaStars = getDhuhaStars().map((d) => ({ ...d, value: d.count }));
  const tilawahInspirators = getTilawahInspirators().map((d) => ({ ...d, value: d.pages }));

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: "auto" }}>
      {/* ── HEADER ── */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.success.main, 0.08)} 50%, ${alpha(theme.palette.warning.main, 0.06)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.primary.main, 0.06),
          }}
        />
        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              width: "fit-content",
            }}
          >
            <MosqueIcon sx={{ fontSize: 36, color: "primary.main" }} />
          </Box>
          <Box flexGrow={1}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              Dashboard MonevIbadah
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitoring & Evaluasi Amalan Harian Tim • {dateStr}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <Chip
              icon={<PeopleAltIcon sx={{ fontSize: 16 }} />}
              label={`${MEMBERS.length} Anggota`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<WhatshotIcon sx={{ fontSize: 16 }} />}
              label="Streak Aktif"
              color="success"
              variant="outlined"
              size="small"
            />
          </Stack>
        </Stack>
      </Box>

      {/* ── TEAM AGGREGATE ── */}
      <TeamAggregateCard />

      <Box sx={{ mt: 3 }} />

      {/* ── ROW 2: PARTICIPATION + QURAN ── */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <ParticipationTrendCard />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <QuranProgressCard />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }} />

      {/* ── ROW 3: LEADERBOARDS ── */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <LeaderboardCard
            title="⭐ Bintang Dhuha Minggu Ini"
            icon={<LightModeIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />}
            color={theme.palette.warning.main}
            items={dhuhaStars}
            valueLabel="hari"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LeaderboardCard
            title="📖 Inspirator Tilawah Minggu Ini"
            icon={<AutoStoriesIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />}
            color={theme.palette.success.main}
            items={tilawahInspirators}
            valueLabel="hal"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }} />

      {/* ── ROW 4: HEATMAP ── */}
      <HeatmapSection />

      {/* ── FOOTER ── */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="caption" color="text.disabled">
          🤲 "Sesungguhnya Allah tidak melihat kepada rupa dan harta kalian, tetapi Dia melihat kepada hati dan amal kalian." — HR. Muslim
        </Typography>
      </Box>
    </Box>
  );
}
