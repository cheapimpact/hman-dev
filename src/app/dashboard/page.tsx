"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "@/components/dashboard/Header";
import MainGrid from "@/components/dashboard/MainGrid";

export default function DashboardPage() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: "auto",
        minHeight: "100vh",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          mx: 3,
          pb: 5,
          mt: { xs: 8, md: 0 },
        }}
      >
        <Header />
        <MainGrid />
      </Stack>
    </Box>
  );
}
