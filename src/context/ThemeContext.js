'use client';

import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  // Load from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('appThemeMode');
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('appThemeMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#4763b8' },
                background: { default: '#f8f9fc' },
                text: { primary: '#05060a' },
              }
            : {
                primary: { main: '#4763b8' },
                background: { default: '#030407' },
                text: { primary: '#f5f6fa' },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
