'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  ClickAwayListener,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useUser, defaultUser } from '@/context/UserContext';

const drawerWidth = 280;
const collapsedWidth = 70;

function getInitials(name = '') {
  const names = name.trim().split(' ');
  if (names.length === 0) return '';
  if (names.length === 1) return names[0][0]?.toUpperCase() || '';
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, active, setActive }) {
  const { user, setUser } = useUser();
  const { name, role, isReport } = user;
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    toast.success("Logged out");
    localStorage.removeItem('user');
    setUser(defaultUser);
    handleMenuClose();
    router.push('/');
  };

  useEffect(() => {
    if (!isSidebarOpen) handleMenuClose();
  }, [isSidebarOpen]);

  const getMenuItems = () => {
    if (role === 'patient') {
      return isReport
        ? [
            { text: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard', path: '/dashboard' },
            { text: 'My Report', icon: <AssessmentIcon />, key: 'myreport', path: '/myreport' },
            { text: 'Form', icon: <DescriptionIcon />, key: 'form', path: '/form' },
          ]
        : [{ text: 'Form', icon: <DescriptionIcon />, key: 'form', path: '/form' }];
    }

    if (role === 'doctor') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard', path: '/dashboard' },
        { text: 'Patients', icon: <PeopleIcon />, key: 'patients', path: '/patients' },
      ];
    }

    return [{ text: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard', path: '/dashboard' }];
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isSidebarOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isSidebarOpen ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'grey.300',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          zIndex: theme.zIndex.appBar - 1,
        },
      }}
    >
      {/* Top Branding */}
      <Box
        sx={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          px: isSidebarOpen ? 3 : 0,
          borderBottom: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Box
          component="img"
          src="/images/dark.png"
          alt="Logo"
          sx={{
            height: 48,
            width: 48,
            mr: isSidebarOpen ? 2 : 0,
            transition: 'margin 0.3s ease',
          }}
        />
        {isSidebarOpen && (
          <Typography variant="h6" fontWeight={800} color="primary.main" noWrap>
            Medlinguistis
          </Typography>
        )}
      </Box>

      {/* Navigation Links */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {menuItems.map(({ text, icon, key, path }) => {
            const isActive = active === key;
            return (
              <Tooltip title={!isSidebarOpen ? text : ''} placement="right" key={key} arrow>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={isActive}
                    onClick={() => {
                      setActive(key);
                      router.push(path);
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      mx: 1,
                      justifyContent: isSidebarOpen ? 'initial' : 'center',
                      px: isSidebarOpen ? 2 : 1,
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: isSidebarOpen ? 2 : 'auto' }}>
                      {icon}
                    </ListItemIcon>
                    {isSidebarOpen && (
                      <ListItemText
                        primary={text}
                        primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 500 }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* User Profile and Logout */}
      <ClickAwayListener onClickAway={handleMenuClose}>
        <Box sx={{ p: 2, flexShrink: 0 }}>
          <Box
            onClick={(e) => (openMenu ? handleMenuClose() : handleProfileClick(e))}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              bgcolor: 'grey.100',
              p: 1,
              borderRadius: 2,
              userSelect: 'none',
            }}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            aria-controls={openMenu ? 'profile-menu' : undefined}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              {getInitials(name)}
            </Avatar>
            {isSidebarOpen && (
              <Box>
                <Typography fontWeight="bold" noWrap>
                  {name || 'User'}
                </Typography>
                <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  {role || 'Role'}
                </Typography>
              </Box>
            )}
          </Box>

          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{ 'aria-labelledby': 'profile-button' }}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </ClickAwayListener>
    </Drawer>
  );
}
