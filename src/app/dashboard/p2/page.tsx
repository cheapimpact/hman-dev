"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function DashboardP2Page() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: "auto",
        minHeight: "100vh",
        p: { xs: 3, md: 4 },
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Dashboard P2
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
        Halaman ini sedang dalam pengembangan.
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 2 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Typography>

      <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 2, mt: 2 }}>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt.
      </Typography>
    </Box>
  );
}
