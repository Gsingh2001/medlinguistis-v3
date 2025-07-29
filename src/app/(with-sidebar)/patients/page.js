"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch("/api/patients");
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setPatients(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <Typography variant="h5" sx={{ padding: 4 }}>
        Loading patients...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h5" sx={{ padding: 4, color: "red" }}>
        Failed to load patients: {error}
      </Typography>
    );
  }

  if (!patients.length) {
    return (
      <Typography variant="h5" sx={{ padding: 4 }}>
        No patients found.
      </Typography>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        fontFamily: inter.style.fontFamily,
      }}
    >
      <main style={{ padding: "2rem 1rem", width: "100%" }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: "#1e293b",
            fontWeight: 700,
            letterSpacing: 0.5,
            marginBottom: "1.5rem",
          }}
        >
          All Patients
        </Typography>

        <TableContainer
          component={Paper}
          elevation={4}
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                {[
                  "Patient ID",
                  "Name",
                  "Phone Number",
                  "Email",
                  "Age",
                  "Gender",
                  "Date of Surgery",
                  "Type of Surgery",
                  "Priority Level",
                  "Report",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    align={heading === "Report" ? "center" : "left"}
                    sx={{
                      color: "#334155",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      borderBottom: "none",
                      paddingY: 1.5,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {patients.map((p, index) => (
                <TableRow
                  key={`${p.patient_id || p.id}-${index}`} // <-- unique key fix here
                  sx={{
                    "&:hover": { backgroundColor: "#e2e8f0" },
                    cursor: "pointer",
                    transition: "background-color 0.25s ease-in-out",
                  }}
                >
                  <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                    {p.patient_id || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                    {p.name || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                    {p.phoneNumber || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                    {p.email || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                    {p.age || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                    {p.gender || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                    {p.dateOfSurgery || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                    {p.typeOfSurgery || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#475569",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {p.priorityLevel || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <Link href={`/reports/${p.patient_id}`}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          paddingX: 2,
                          boxShadow: "0 2px 6px rgba(71, 85, 105, 0.4)",
                          "&:hover": {
                            backgroundColor: "#1e40af",
                          },
                        }}
                      >
                        View Report
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </div>
  );
};

export default PatientsPage;
