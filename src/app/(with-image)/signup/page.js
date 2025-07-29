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

const SignupPage = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Signup failed");
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

      toast.success(`Welcome, ${userData.name || userData.email}! Your account has been created.`);

      // Redirect after signup
      router.push("/dashboard");

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
        Create a new account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          label="Full Name"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          autoFocus
        />

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

        <TextField
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 1,
          }}
        >
          <Typography variant="body2" sx={{ mr: 1 }}>
            Already have an account?
          </Typography>
          <Link href="/login" underline="hover" variant="body2" sx={{ cursor: "pointer" }}>
            Login
          </Link>
        </Box>
      </Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default SignupPage;
