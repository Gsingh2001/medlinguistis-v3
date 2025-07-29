"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';

const steps = [
  "Basic Info",
  "Metadata",
  "Medical History",
  "Medications",
  "Narratives",
];

const emptyInitialData = {
  Patient_ID: "",
  Metadata: {
    Age: "",
    Gender: "",
    Weight_Current_Kg: "",
    Weight_Lowest_Kg: "",
    Weight_Highest_Kg: "",
    Weight_Status: "",
    Medical_History: {
      Prior_Major_Surgeries: "",
    },
    Medications: {
      Metformin: "",
      "Vit D3": "",
      Sertraline: "",
      Lactulose: "",
    },
  },
  Narratives: {
    Symptoms_Restrictions_Activities: "",
    Symptoms_Adaptations_Face: "",
    Symptoms_Affect_Movement: "",
    Symptoms_Pain_Coping: "",
    BodyImage_SelfConscious_Embarrassed: "",
    BodyImage_Others_Noticing: "",
    MentalHealth_Affected_Elaborate: "",
    MentalHealth_Coping_Strategies: "",
    Relationships_Social_Affected: "",
    Relationships_Intimate_Affected: "",
    Employment_What_Do_You_Do: "",
    Employment_Ability_To_Work_Affected: "",
    Employment_Changed_Work: "",
    Employment_Financial_Affected: "",
    SharedDecisionMaking_Questions: "",
    SharedDecisionMaking_Hopes: "",
    SharedDecisionMaking_Matters_To_You: "",
  },
};


export default function PatientForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(emptyInitialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();
 useEffect(() => {
    if (user?.patient_id) {
      setFormData((prev) => ({
        ...prev,
        Patient_ID: user.patient_id,
      }));
    }
  }, [user]);
  // Handlers
  const handleChange = (path) => (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      // Deep copy
      const newData = JSON.parse(JSON.stringify(prev));
      // Navigate path like "Metadata.Age"
      const keys = path.split(".");
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in obj)) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Validation per step
  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.Patient_ID.trim() !== "";
      case 1:
        return (
          formData.Metadata.Age.trim() !== "" &&
          formData.Metadata.Gender.trim() !== "" &&
          formData.Metadata.Weight_Current_Kg.trim() !== ""
        );
      case 2:
        return formData.Metadata.Medical_History.Prior_Major_Surgeries.trim() !== "";
      case 3:
        return Object.values(formData.Metadata.Medications).some(
          (val) => val.trim() !== ""
        );
      case 4:
        return Object.values(formData.Narratives).some(
          (val) => val.trim() !== ""
        );
      default:
        return false;
    }
  };

  // Step navigation
  const handleNext = () => {
    if (activeStep < steps.length - 1 && isStepValid()) {
      setActiveStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  // Submit mock
const handleSubmit = async () => {
  if (!isStepValid()) return;
  setLoading(true);
  try {
    // 1) Submit the main form data
    const res = await fetch("/api/form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Submission failed");
    await res.json();
    toast.success("Form submitted successfully!");

    // 2) Call /api/isreport to update isReport flag
    const updateReportRes = await fetch("/api/isreport", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: formData.Patient_ID,
        isReport: true,
      }),
    });
    if (!updateReportRes.ok) {
      const errData = await updateReportRes.json();
      console.warn("Failed to update isReport:", errData.error);
    } else {
      const updatedUser = await updateReportRes.json();
      console.log("isReport updated:", updatedUser);
      // Update user context with isReport: true
      setUser((prevUser) => ({
        ...prevUser,
        isReport: true,
      }));
    }

    router.push("/myreport");
  } catch (e) {
    toast.error(e.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        boxSizing: "border-box",
        p: 3,
        maxWidth: "100%", // no limit
      }}
    >
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Patient Information Form
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step content */}
      {activeStep === 0 && (
        <Box sx={{ width: "100%" }}>
          <TextField
            label="Patient ID"
            value={formData.Patient_ID}
            onChange={handleChange("Patient_ID")}
            fullWidth
            required
            autoFocus
          />
        </Box>
      )}


      {activeStep === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Age"
              type="number"
              value={formData.Metadata.Age}
              onChange={handleChange("Metadata.Age")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Gender"
              value={formData.Metadata.Gender}
              onChange={handleChange("Metadata.Gender")}
              fullWidth
              required
              helperText="e.g. Female, Male, Other"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Current Weight (Kg)"
              type="number"
              value={formData.Metadata.Weight_Current_Kg}
              onChange={handleChange("Metadata.Weight_Current_Kg")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Lowest Weight (Kg)"
              type="number"
              value={formData.Metadata.Weight_Lowest_Kg}
              onChange={handleChange("Metadata.Weight_Lowest_Kg")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Highest Weight (Kg)"
              type="number"
              value={formData.Metadata.Weight_Highest_Kg}
              onChange={handleChange("Metadata.Weight_Highest_Kg")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Weight Status"
              value={formData.Metadata.Weight_Status}
              onChange={handleChange("Metadata.Weight_Status")}
              fullWidth
              helperText="e.g. staying the same, losing weight"
            />
          </Grid>
        </Grid>
      )}

      {activeStep === 2 && (
        <Box>
          <TextField
            label="Prior Major Surgeries (one per line)"
            value={formData.Metadata.Medical_History.Prior_Major_Surgeries}
            onChange={handleChange("Metadata.Medical_History.Prior_Major_Surgeries")}
            multiline
            rows={4}
            fullWidth
            required
            placeholder="Appendicectomy (1984, Manchester)"
          />
        </Box>
      )}

      {activeStep === 3 && (
        <Box>
          {Object.entries(formData.Metadata.Medications).map(([med, dose]) => (
            <TextField
              key={med}
              label={`${med} Dosage`}
              value={dose}
              onChange={handleChange(`Metadata.Medications.${med}`)}
              fullWidth
              margin="normal"
              multiline
              rows={1}
              placeholder="e.g. 1g, twice a day"
            />
          ))}
        </Box>
      )}

      {activeStep === 4 && (
        <Box>
          {Object.entries(formData.Narratives).map(([field, text]) => (
            <TextField
              key={field}
              label={field.replace(/_/g, " ")}
              value={text}
              onChange={handleChange(`Narratives.${field}`)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              placeholder="Please enter details"
            />
          ))}
        </Box>
      )}

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 4,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Button
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isStepValid() || loading}
            endIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            Next
          </Button>
        )}
      </Box>
    </Paper>
  );
}
