'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 280;
const collapsedWidth = 70;

export default function AppBarTop({ isSidebarOpen, toggleSidebar }) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        color: 'text.primary',
        width: `calc(100% - ${isSidebarOpen ? drawerWidth : collapsedWidth}px)`,
        ml: `${isSidebarOpen ? drawerWidth : collapsedWidth}px`,
        transition: 'width 0.3s ease, margin-left 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        height: 64,
      }}
    >
      <Toolbar disableGutters sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={toggleSidebar}
          edge="start"
          aria-label="Toggle sidebar"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Show text only when sidebar is collapsed */}
        {!isSidebarOpen && (
          <Typography
            variant="h6"
            noWrap
            fontWeight={800}
            color="primary.main"
            sx={{ flexGrow: 1 }}
          >
            Medlinguistis
          </Typography>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Add other AppBar content here like ThemeToggle */}
      </Toolbar>
    </AppBar>
  );
}
