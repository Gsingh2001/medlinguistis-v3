'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const NavBar = () => {
  const router = useRouter();

  return (
    <AppBar position="static" color="primary" className="shadow-md">
      <Container maxWidth="xl">
        <Toolbar disableGutters className="flex justify-between w-full">
          {/* Left: Logo */}
          <Image
  src="/images/dark.png"  // your logo path in public/
  alt="Medlinguitis"
  width={140}
  height={40}
  style={{ cursor: 'pointer' }}
  onClick={() => router.push('/')}
/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => router.push('/')}
          >
            Medlinguitis
          </Typography>

          {/* Right: Buttons */}
          <Box className="flex gap-4">
            <Button color="inherit" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button color="inherit" variant="outlined" onClick={() => router.push('/signup')}>
              Signup
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
