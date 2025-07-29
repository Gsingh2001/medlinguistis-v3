'use client';

import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeContext } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeContext();

  return (
    <IconButton onClick={toggleMode} color="inherit">
      {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
