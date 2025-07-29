'use client';

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Link,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const userData = {
        userId: data.user.user_id,
        patient_id: data.user.patient_id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        isReport: data.user.isReport || false,
        isLogin: true,
      };

      setUser(userData);

      toast.success(`Welcome back, ${userData.name || userData.email}!`);

      if (userData.role === "patient") {
        router.push(userData.isReport ? "/dashboard" : "/form");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h5" component="h1" align="center" gutterBottom fontWeight="bold">
        Login to Medlinguitis
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          label="Email Address"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoFocus
        />

        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2, textTransform: "none", fontWeight: "bold" }}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
          }}
        >
          <Link
            href="/forgot-password"
            underline="hover"
            variant="body2"
            tabIndex={loading ? -1 : 0}
            sx={{ cursor: loading ? "default" : "pointer" }}
          >
            Forgot password?
          </Link>
          <Link
            href="/signup"
            underline="hover"
            variant="body2"
            tabIndex={loading ? -1 : 0}
            sx={{ cursor: loading ? "default" : "pointer" }}
          >
            Create account
          </Link>
        </Box>
      </Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default LoginPage;
