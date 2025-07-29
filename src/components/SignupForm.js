"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Link } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const SignupForm = ({ onSwitchForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, name }),
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

      toast.success(`Account created successfully. Welcome, ${userData.name || userData.email}!`);
      setLoading(false);

      // Redirect after signup - usually to form or dashboard depending on role
      if (userData.role === "patient") {
        router.push("/form");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 400 }}
    >
      <TextField
        fullWidth
        label="Name"
        type="text"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={loading}
      />
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
        {loading ? "Signing up..." : "Sign Up"}
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => !loading && onSwitchForm("login")}
          sx={{ cursor: loading ? "default" : "pointer" }}
        >
          Already have an account? Login
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => !loading && onSwitchForm("forgotPassword")}
          sx={{ cursor: loading ? "default" : "pointer" }}
        >
          Forgot Password?
        </Link>
      </Box>
    </Box>
  );
};

export default SignupForm;
