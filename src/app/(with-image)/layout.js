"use client";

import React from "react";
import { Box, Container, Paper } from "@mui/material";

export default function LoginLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f9fafb",
      }}
    >
      {/* Left side image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" }, // hide on small screens
        }}
      />

      {/* Right side form container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{ p: 4, borderRadius: 2, boxShadow: 4, bgcolor: "white" }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
