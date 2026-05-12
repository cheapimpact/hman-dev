"use client";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useColorScheme } from "@mui/material/styles";

export default function ColorModeToggle({
  sx,
}: {
  sx?: object;
}) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch — render nothing until mounted on client
  if (!mounted || !mode) {
    return (
      <IconButton size="small" sx={sx} disabled>
        <LightModeRoundedIcon fontSize="small" />
      </IconButton>
    );
  }

  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Mode Terang" : "Mode Gelap"} arrow>
      <IconButton
        size="small"
        onClick={() => setMode(isDark ? "light" : "dark")}
        aria-label="toggle color mode"
        sx={{
          color: "text.secondary",
          transition: "color 0.2s, transform 0.2s",
          "&:hover": {
            color: "primary.main",
            transform: "rotate(20deg)",
          },
          ...sx,
        }}
      >
        {isDark ? (
          <LightModeRoundedIcon fontSize="small" />
        ) : (
          <DarkModeRoundedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
