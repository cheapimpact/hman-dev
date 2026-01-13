"use client";

import * as React from "react";
import {
  styled,
  Theme,
  CSSObject,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// ICONS
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Link from "next/link";

const drawerWidth = 240;

// --- 1. TEMA DARK MODE SELARAS DENGAN DASHBOARD ---
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0b1219", // Background Utama (Deep Dark)
      paper: "#0F1924", // Warna Sidebar & Header
    },
    primary: { main: "#3399FF" }, // Biru Terang (MUI Blue)
    text: {
      primary: "#fff",
      secondary: "#B2BAC2",
    },
    divider: "rgba(255, 255, 255, 0.08)", // Garis pemisah sangat halus
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h6: { fontWeight: 600 },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Sudut tombol sidebar sedikit membulat
          margin: "4px 8px", // Memberi jarak antar tombol
          "&.Mui-selected": {
            backgroundColor: "rgba(51, 153, 255, 0.16)", // Biru transparan saat aktif
            color: "#3399FF",
            "&:hover": {
              backgroundColor: "rgba(51, 153, 255, 0.24)",
            },
            "& .MuiListItemIcon-root": {
              color: "#3399FF", // Icon jadi biru saat aktif
            },
          },
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          },
        },
      },
    },
  },
});

// --- MIXINS (Logika Animasi Sidebar) ---
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: theme.palette.background.paper,
  borderRight: "1px solid rgba(255,255,255,0.08)", // Border kanan halus
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: theme.palette.background.paper,
  borderRight: "1px solid rgba(255,255,255,0.08)",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.default, // Header menyatu dengan background body
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "none", // Flat design
  backdropFilter: "blur(8px)", // Sedikit blur jika konten scroll lewat bawah header
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true); // Default sidebar TERBUKA agar terlihat menu

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" }, // Arahkan ke /dashboard
    { text: "Cari Data", icon: <SearchIcon />, href: "/pencarian" },
    { text: "Analitik", icon: <AnalyticsIcon />, href: "/analitik" },
    { text: "Laporan", icon: <DescriptionIcon />, href: "/laporan" },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* --- HEADER --- */}
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
                color: "#3399FF", // Icon menu biru
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "#fff", fontWeight: 700 }}
            >
              KANTOR APP
            </Typography>
          </Toolbar>
        </AppBar>

        {/* --- SIDEBAR --- */}
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton
              onClick={handleDrawerClose}
              sx={{ color: "text.secondary" }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />

          <List sx={{ mt: 1 }}>
            {menuItems.map((item) => (
              <Link
                key={item.text}
                href={item.href}
                passHref
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "text.secondary", // Default icon abu-abu
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>

        {/* --- KONTEN UTAMA --- */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <DrawerHeader /> {/* Spacer */}
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
