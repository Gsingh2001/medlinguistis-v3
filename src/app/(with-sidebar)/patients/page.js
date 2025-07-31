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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [newPatient, setNewPatient] = useState({
    Patient_ID: "",
    email: "",
    name: "",
    password: "",
    role: "patient",
    user_id: "",
    isReport: false,
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

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

  const handleOpenAdd = () => {
    setNewPatient({
      Patient_ID: "",
      email: "",
      name: "",
      password: "",
      role: "patient",
      user_id: "",
      isReport: false,
    });
    setAddError(null);
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    if (!adding) setOpenAdd(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = async () => {
    setAdding(true);
    setAddError(null);

    if (
      !newPatient.Patient_ID ||
      !newPatient.email ||
      !newPatient.name ||
      !newPatient.password ||
      !newPatient.role ||
      !newPatient.user_id
    ) {
      setAddError("All fields are required");
      setAdding(false);
      return;
    }

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPatient, isReport: false }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add patient");
      }

      setPatients((prev) => [...prev, { ...newPatient, isReport: false }]);
      setOpenAdd(false);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handlePdfUpload = async (patientId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/pdf/${patientId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`Upload failed: ${errData.error || res.statusText}`);
      } else {
        alert("PDF uploaded successfully");
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    }
  };

  if (loading) {
    return <Typography variant="h5" sx={{ padding: 4 }}>Loading patients...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="h5" sx={{ padding: 4, color: "red" }}>
        Failed to load patients: {error}
      </Typography>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: inter.style.fontFamily }}>
      <main style={{ padding: "2rem 1rem", width: "100%" }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#1e293b", fontWeight: 700, letterSpacing: 0.5, marginBottom: "1.5rem" }}>
          All Patients
        </Typography>

        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenAdd}>
          Add Patient
        </Button>

        <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                {["Patient ID", "Name", "Email", "Password", "Role", "User ID", "Action"].map((heading) => (
                  <TableCell key={heading} align="center" sx={{ fontWeight: 600 }}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {patients.map((p, index) => (
                <TableRow
                  key={`${p.Patient_ID || p.user_id}-${index}`}
                  sx={{ "&:hover": { backgroundColor: "#e2e8f0" }, transition: "background-color 0.25s ease-in-out" }}
                >
                  <TableCell align="center">{p.Patient_ID}</TableCell>
                  <TableCell align="center">{p.name}</TableCell>
                  <TableCell align="center">{p.email}</TableCell>
                  <TableCell align="center">{p.password}</TableCell>
                  <TableCell align="center" sx={{ textTransform: "capitalize" }}>{p.role}</TableCell>
                  <TableCell align="center">{p.user_id}</TableCell>
                  <TableCell align="center">
                    {p.isReport ? (
                      <Link href={`/reports/${p.Patient_ID}`}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            paddingX: 2,
                            boxShadow: "0 2px 6px rgba(71, 85, 105, 0.4)",
                            "&:hover": { backgroundColor: "#1e40af" },
                          }}
                        >
                          View Report
                        </Button>
                      </Link>
                    ) : (
                      <label htmlFor={`upload-pdf-${p.Patient_ID}`} style={{ cursor: "pointer" }}>
                        <input
                          type="file"
                          ref={(input) => input && (window[`fileInput_${p.Patient_ID}`] = input)}
                          accept="application/pdf"
                          style={{ display: "none" }}
                          onChange={(e) => handlePdfUpload(p.Patient_ID, e.target.files[0])}
                        />

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => window[`fileInput_${p.Patient_ID}`]?.click()}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            paddingX: 2,
                            boxShadow: "0 2px 6px rgba(71, 85, 105, 0.4)",
                            "&:hover": { backgroundColor: "#64748b", color: "#fff" },
                          }}
                        >
                          Upload PDF
                        </Button>

                      </label>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Patient Dialog */}
        <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogContent>
            {addError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {addError}
              </Typography>
            )}
            {["Patient_ID", "email", "name", "password", "role", "user_id"].map((field) => (
              <TextField
                key={field}
                label={field.replace("_", " ")}
                name={field}
                type={field === "password" ? "password" : "text"}
                value={newPatient[field]}
                onChange={handleChange}
                margin="normal"
                fullWidth
                required
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdd} disabled={adding}>Cancel</Button>
            <Button onClick={handleAddPatient} variant="contained" disabled={adding}>
              {adding ? "Adding..." : "Add Patient"}
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default PatientsPage;
