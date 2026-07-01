"use client";

import * as React from "react";
import {
  styled,
  Theme,
  CSSObject,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";


// ICONS
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SchoolIcon from "@mui/icons-material/School";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MosqueIcon from "@mui/icons-material/Mosque";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Collapse from "@mui/material/Collapse";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ColorModeToggle from "@/components/ColorModeToggle";

const drawerWidth = 240;

// ─── MIXINS ───────────────────────────────────────────────────────────────────
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  boxSizing: "border-box",
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
  boxSizing: "border-box",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 2),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundImage: "none",
  backgroundColor: (theme.vars || theme).palette.background.default,
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
  [`& .${drawerClasses.paper}`]: {
    backgroundColor: (theme.vars || theme).palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// ─── MENU ITEMS ───────────────────────────────────────────────────────────────
type MenuItem =
  | { text: string; icon: React.ReactNode; href: string; children?: never }
  | {
      text: string;
      icon: React.ReactNode;
      href?: never;
      children: { text: string; icon: React.ReactNode; href: string }[];
    };

const menuItems: MenuItem[] = [
  { text: "Home", icon: <HomeRoundedIcon />, href: "/" },
  {
    text: "Dashboard P1",
    icon: <DashboardIcon />,
    children: [
      { text: "Dashboard Pelatihan", icon: <FitnessCenterIcon />, href: "/dashboard/p1" },
      { text: "Dashboard Pendidikan", icon: <MenuBookIcon />, href: "/dashboard/p1/pendidikan" },
    ],
  },
  { text: "Dashboard P2", icon: <AnalyticsIcon />, href: "/dashboard/p2" },
  { text: "Dashboard JF", icon: <DescriptionIcon />, href: "/dashboard/jf" },
  { text: "Diklat", icon: <SchoolIcon />, href: "/dashboard/jf" },
  // { text: "MonevIbadah", icon: <MosqueIcon />, href: "/dashboard/monev-ibadah" },
];

// ─── OPTIONS MENU (user profile) ─────────────────────────────────────────────
function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  return (
    <>
      <Tooltip title="Pengaturan akun">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Profil</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Pengaturan</MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)}>Keluar</MenuItem>
      </Menu>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({"Dashboard P1": true});
  const pathname = usePathname();

  const toggleExpand = (text: string) => {
    setExpandedMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* ── APP BAR (mobile) ── */}
      <AppBar
        position="fixed"
        open={open}
        sx={{ display: { md: "none" } }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
            HRD App
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ── SIDEBAR ── */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        {/* Header Sidebar — Logo + Toggle */}
        <DrawerHeader sx={{ justifyContent: open ? "space-between" : "center" }}>
          {open && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon sx={{ color: "primary.main", fontSize: 22 }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "text.primary", whiteSpace: "nowrap" }}
              >
                HRD App
              </Typography>
            </Box>
          )}
          <IconButton onClick={() => setOpen(!open)} size="small">
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        {/* Menu Items */}
        <Box sx={{ overflow: "auto", flexGrow: 1, mt: 1 }}>
          <List>
            {menuItems.map((item) => {
              // ── Item dengan children (collapsible) ──
              if (item.children) {
                const isExpanded = !!expandedMenus[item.text];
                const isAnyChildActive = item.children.some((c) => pathname === c.href);
                return (
                  <React.Fragment key={item.text}>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <Tooltip title={!open ? item.text : ""} placement="right" arrow>
                        <ListItemButton
                          onClick={() => toggleExpand(item.text)}
                          sx={{
                            minHeight: 44,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                            mx: 1,
                            borderRadius: 2,
                            mb: 0.5,
                            bgcolor: isAnyChildActive ? "action.selected" : undefined,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 2 : "auto",
                              justifyContent: "center",
                              color: isAnyChildActive ? "primary.main" : "text.secondary",
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                            sx={{
                              opacity: open ? 1 : 0,
                              "& .MuiListItemText-primary": {
                                fontSize: "0.875rem",
                                fontWeight: isAnyChildActive ? 600 : 400,
                                color: isAnyChildActive ? "text.primary" : "text.secondary",
                              },
                            }}
                          />
                          {open && (isExpanded ? <ExpandLessIcon fontSize="small" sx={{ color: "text.secondary" }} /> : <ExpandMoreIcon fontSize="small" sx={{ color: "text.secondary" }} />)}
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>

                    {/* Submenu */}
                    <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
                      <List disablePadding>
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.text}
                              href={child.href}
                              passHref
                              style={{ textDecoration: "none", color: "inherit" }}
                            >
                              <ListItem disablePadding sx={{ display: "block" }}>
                                <ListItemButton
                                  selected={isChildActive}
                                  sx={{
                                    minHeight: 40,
                                    justifyContent: "initial",
                                    pl: 4.5,
                                    pr: 2.5,
                                    mx: 1,
                                    borderRadius: 2,
                                    mb: 0.5,
                                  }}
                                >
                                  <ListItemIcon
                                    sx={{
                                      minWidth: 0,
                                      mr: 1.5,
                                      justifyContent: "center",
                                      color: isChildActive ? "primary.main" : "text.secondary",
                                      "& svg": { fontSize: 18 },
                                    }}
                                  >
                                    {child.icon}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={child.text}
                                    sx={{
                                      "& .MuiListItemText-primary": {
                                        fontSize: "0.8125rem",
                                        fontWeight: isChildActive ? 600 : 400,
                                        color: isChildActive ? "text.primary" : "text.secondary",
                                      },
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            </Link>
                          );
                        })}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              }

              // ── Item biasa (tanpa children) ──
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.text}
                  href={item.href}
                  passHref
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <Tooltip
                      title={!open ? item.text : ""}
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        selected={isActive}
                        sx={{
                          minHeight: 44,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                          mx: 1,
                          borderRadius: 2,
                          mb: 0.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : "auto",
                            justifyContent: "center",
                            color: isActive
                              ? "primary.main"
                              : "text.secondary",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            opacity: open ? 1 : 0,
                            "& .MuiListItemText-primary": {
                              fontSize: "0.875rem",
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? "text.primary" : "text.secondary",
                            },
                          }}
                        />
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </Box>

        <Divider />

        {/* User Profile Footer */}
        <Stack
          direction="row"
          sx={{
            p: 2,
            gap: 1,
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Avatar
            sizes="small"
            alt="Admin HRD"
            sx={{
              width: 34,
              height: 34,
              bgcolor: "primary.main",
              fontSize: "0.875rem",
              flexShrink: 0,
            }}
          >
            AH
          </Avatar>
          <Box
            sx={{
              minWidth: 0,
              opacity: open ? 1 : 0,
              transition: "opacity 0.2s",
              flexGrow: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, lineHeight: "16px", whiteSpace: "nowrap" }}
            >
              Admin HRD
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            >
              admin@hrd.go.id
            </Typography>
          </Box>
          {open && <ColorModeToggle />}
          {open && <OptionsMenu />}
        </Stack>
      </Drawer>

      {/* ── MAIN CONTENT ── */}
      <Box
        component="div"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "background.default",
          mt: { xs: "56px", md: 0 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
