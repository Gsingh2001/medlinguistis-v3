'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { Box } from '@mui/material';
import NavBar from './NavBar';

export default function RootClientLayout({ children }) {

  return (
    <ThemeProvider>
      <UserProvider>
        <Box className="no-print">
          <NavBar
          />
        </Box>
        <main>{children}</main>
      </UserProvider>
    </ThemeProvider>
  );
}
