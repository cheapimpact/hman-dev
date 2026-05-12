"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

export default function HighlightedCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <InsightsRoundedIcon sx={{ color: "primary.main", mb: 1 }} />
        <Typography
          component="h2"
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Jelajahi Data Pelatihan
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: "8px" }} variant="body2">
          Temukan tren peserta dan efektivitas diklat dengan analitik mendalam.
        </Typography>
        <Button
          component={Link}
          href="/analitik"
          variant="contained"
          size="small"
          color="primary"
          endIcon={<ChevronRightRoundedIcon />}
          fullWidth={isSmallScreen}
        >
          Lihat Analitik
        </Button>
      </CardContent>
    </Card>
  );
}
