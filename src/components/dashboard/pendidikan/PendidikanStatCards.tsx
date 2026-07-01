"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type StatItemProps = {
  value: string | number;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
};

function StatItem({ value, label, color, bgColor, icon }: StatItemProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 140,
        borderRadius: 3,
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
      }}
    >
      <CardContent sx={{ p: "16px !important" }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ lineHeight: 1.1, color }}
            >
              {value}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", lineHeight: 1.3 }}
            >
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export type SummaryStats = {
  total: number;
  aktif: number;
  lulus: number;
  cuti: number;
  s2: number;
  s3: number;
  dn: number;
  ln: number;
  linkage: number;
  apbn: number;
  lpdp: number;
};

export default function PendidikanStatCards({ stats }: { stats: SummaryStats }) {
  const items: StatItemProps[] = [
    {
      value: stats.total,
      label: "Total Peserta TB",
      color: "primary.main",
      bgColor: "rgba(25,118,210,0.12)",
      icon: "🎓",
    },
    {
      value: stats.aktif,
      label: "Sedang Aktif",
      color: "success.main",
      bgColor: "rgba(46,125,50,0.12)",
      icon: "✅",
    },
    {
      value: stats.lulus,
      label: "Telah Lulus",
      color: "info.main",
      bgColor: "rgba(2,136,209,0.12)",
      icon: "🏆",
    },
    {
      value: stats.cuti,
      label: "Cuti / Dropout",
      color: "warning.main",
      bgColor: "rgba(245,124,0,0.12)",
      icon: "⏸️",
    },
    {
      value: stats.s2,
      label: "Program S2",
      color: "secondary.main",
      bgColor: "rgba(156,39,176,0.12)",
      icon: "📖",
    },
    {
      value: stats.s3,
      label: "Program S3",
      color: "error.main",
      bgColor: "rgba(211,47,47,0.12)",
      icon: "🔬",
    },
    {
      value: stats.ln,
      label: "Luar Negeri",
      color: "warning.dark",
      bgColor: "rgba(230,81,0,0.12)",
      icon: "✈️",
    },
    {
      value: stats.lpdp,
      label: "Didanai LPDP",
      color: "success.dark",
      bgColor: "rgba(27,94,32,0.12)",
      icon: "💰",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(4, 1fr)",
          lg: "repeat(8, 1fr)",
        },
        gap: 2,
      }}
    >
      {items.map((item) => (
        <StatItem key={item.label} {...item} />
      ))}
    </Box>
  );
}
