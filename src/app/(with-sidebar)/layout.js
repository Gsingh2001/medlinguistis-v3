"use client";

import { useState, useEffect } from "react";
import { Box, Toolbar } from "@mui/material";
import AppBarTop from "@/components/AppBarTop";
import Sidebar from "@/components/SideBar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(null);
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    const stored = localStorage.getItem("sidebarOpen");
    setIsSidebarOpen(stored === null ? true : stored === "true");
  }, []);

  useEffect(() => {
    if (isSidebarOpen !== null) {
      localStorage.setItem("sidebarOpen", isSidebarOpen.toString());
    }
  }, [isSidebarOpen]);

  if (isSidebarOpen === null) {
    return null; // avoid hydration issues
  }

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh"}}>
      {/* AppBar */}
      <Box className="no-print">
        <AppBarTop
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
      </Box>

      {/* Sidebar */}
      <Box className="no-print">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          active={active}
          setActive={setActive}
        />
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
        
          width: "100%",      // take all horizontal space left by sidebar
          height: "100vh",
          bgcolor: "grey.50",
          boxSizing: "border-box",
          p: 0,               // REMOVE padding to allow 100% width
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}

        {/* Full width container */}
        <Box
          sx={{
          
            width: "100%",   // VERY IMPORTANT: no maxWidth limit here
            maxWidth: "100%",
            boxSizing: "border-box",
            px: 2,          // optional horizontal padding, adjust as needed
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
