"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Link } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const LoginForm = ({ onSwitchForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useUser(); // ✅ useUser context

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

      // ✅ Set user context from response
      const userData = {
        userId: data.user.user_id,
        patient_id: data.user.patient_id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        isReport: data.user.isReport || false,
        isLogin: true,
      };

      setUser(userData); // ✅ Save to context (also goes to localStorage)

      toast.success(`Login successful for ${userData.name || userData.email}`);

      // ✅ Redirect logic
      if (userData.role === "patient") {
        if (userData.isReport) {
          router.push("/dashboard");
        } else {
          router.push("/form");
        }
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
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 400 }}>
      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 1 }}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => onSwitchForm("forgotPassword")}
          sx={{ cursor: "pointer" }}
          disabled={loading}
        >
          Forgot Password?
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => onSwitchForm("signup")}
          sx={{ cursor: "pointer" }}
          disabled={loading}
        >
          Create Account
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm;
