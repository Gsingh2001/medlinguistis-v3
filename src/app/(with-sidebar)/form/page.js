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

const steps = [
  "Metadata",
  "Medical History",
  "Medications",
  "Narratives",
];

const emptyInitialData = {
  Metadata: {
    Age: 56,
    Gender: "Female",
    Weight_Current_Kg: 100,
    Weight_Lowest_Kg: 62,
    Weight_Highest_Kg: 100,
    Weight_Status: "staying the same",
    Previous_Hernia_Repairs: [
      {
        Year: 2007,
        Hospital: "Maryland Hospital",
        Type: "Laparoscopic Incisional Hernia",
        Mesh_Used: "Yes",
        Wound_Breakdown: "No",
        Healing_Time: null,
      },
      {
        Year: 2018,
        Hospital: "Hull Royal Infirmary",
        Type: "Open Recurrent Incisional Hernia Repair",
        Mesh_Used: "Yes",
        Wound_Breakdown: "Yes",
        Healing_Time: "4 months",
      },
    ],
    Medical_History: {
      Prior_Major_Surgeries: [
        "Laparoscopic cholecystectomy (2005, Maryland Hospital)",
      ],
      Diabetes: "No",
      Smoking_Status: "Yes (1 cigarette a day for 30 years)",
      High_Blood_Pressure: "No",
      Thyroid_Disease: "No",
      Kidney_Disease: "No",
      Heart_Disease_History: "No",
      Asthma_COPD: "No",
      Sleep_Apnoea: "No",
      Arthritis: "No",
      Neurological_Disorder: "No",
      Immunosuppressed: "No",
      Cancer_History: "No",
      Alcohol_Consumption: "No",
      Abdominal_Wound_Infections_Past: "Yes (after last surgery)",
      Serious_Infection_History: null,
      Stoma: "No",
      Able_to_lie_flat_comfortably: "Yes",
    },
    Medications: {
      None: "None, None",
    },
    QoL_Areas_Affected: [
      "Symptoms",
      "Body Image",
      "Mental Health",
      "Relationships (social and sexual)",
    ],
  },
  Narratives: {
    Symptoms_Restrictions_Activities:
      "It can do but I get by wearing an abdominal binder. It allows me to get on with life. I have bled but have finally found something I love. [cite_start]I run dancing classes too. [cite: 231, 232, 233]",
    Symptoms_Adaptations_Face:
      "Yes, as above, I use an abdominal binder/corset. [cite_start]It helps me a lot but is difficult to wear in hot weather. [cite: 234]",
    Symptoms_Affect_Movement:
      "It can do, it is quite large. [cite_start]However, when it starts becoming difficult I put on the corset. [cite: 236]",
    Symptoms_Pain_Coping:
      "Yes, as described above. I try to wear a corset regularly and am quick to act with it. [cite_start]But I feel like I'm wearing a hot corset. [cite: 237, 238]",
    BodyImage_SelfConscious_Embarrassed:
      "Definitely so. I try to hide it by wearing a corset. I wouldn't want to go without it as otherwise it is quite visible and I feel obvious. [cite_start]I hate being seen by everyone in the street. [cite: 240, 241, 242, 243]",
    BodyImage_Others_Noticing:
      "Oh definitely they do. If I don't have my corset and someone comes home late, women in my village I can see they are quite shocked & want to comment but are trying to be polite. It leads to awkward silences. [cite_start]I laugh it off and sometimes draw attention to it myself but I cringe that I have to do so and feel 'Here we go again...' I hate that feeling of having to explain myself. [cite: 244, 245]",
    MentalHealth_Affected_Elaborate:
      "Yes it has. I used to be incredibly fit. Over time this has reduced and I feel terrible about it. [cite_start]I considered giving up my job of giving dance lessons but I have feelings of low mood but have never been diagnosed to have depression. [cite: 247, 248, 249, 250]",
    MentalHealth_Coping_Strategies:
      "Not being able to act on feeling, I was forced to give up being a dance teacher. I read more to face the statistics. [cite_start]I think I'm better adjusted to the situation and that is just how it is. [cite: 251, 252]",
    Relationships_Social_Affected:
      "I try not to let it affect my social life. As I said, I find using a corset very helpful. I put it on & go out for activities. [cite_start]Social activities help me cope with the hernia so I have to get myself out there and do what it takes. [cite: 255, 256, 257]",
    Relationships_Intimate_Affected:
      "I have a supportive partner. [cite_start]Our relationship is one of companionship rather than intimacy. [cite: 258, 259]",
    Employment_What_Do_You_Do:
      "I teach dance. [cite_start]I run a small dancing school & have students (adults really) who come regularly. [cite: 261, 262]",
    Employment_Ability_To_Work_Affected:
      "I don't let it affect my ability to work as I cannot afford not to work. [cite: 263, 264]",
    Employment_Changed_Work:
      "I used to be very fit & run a coach athletics but that seems a long time ago. [cite: 265]",
    Employment_Financial_Affected:
      "It would if I did not work but I use the binder and get on with it. [cite_start]I simply cannot afford not earning money. [cite: 266]",
    SharedDecisionMaking_Questions:
      "If anything can be done by surgery. Will surgery be a high risk? [cite_start]Will surgery fail again? [cite: 269]",
    SharedDecisionMaking_Hopes: "That I can be on the best for surgery. [cite: 270]",
    SharedDecisionMaking_Matters_To_You:
      "To have this monstrosity gone! [cite: 271]",
  },
};


export default function PatientForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(emptyInitialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // Handle input changes on nested keys like "Metadata.Age"
  const handleChange = (path) => (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)); // deep copy
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

  // For Prior_Major_Surgeries convert between array <-> multiline string for UI
  const getSurgeriesString = () =>
    Array.isArray(formData.Metadata.Medical_History.Prior_Major_Surgeries)
      ? formData.Metadata.Medical_History.Prior_Major_Surgeries.join("\n")
      : "";

  const setSurgeriesString = (str) => {
    const arr = str
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      Metadata: {
        ...prev.Metadata,
        Medical_History: {
          ...prev.Metadata.Medical_History,
          Prior_Major_Surgeries: arr,
        },
      },
    }));
  };

  // Validation per step
  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Metadata
        return (
          formData.Metadata.Age.toString().trim() !== "" &&
          formData.Metadata.Gender.trim() !== "" &&
          formData.Metadata.Weight_Current_Kg.toString().trim() !== ""
        );
      case 1: // Medical History (array must have at least 1 surgery)
        return (
          Array.isArray(formData.Metadata.Medical_History.Prior_Major_Surgeries) &&
          formData.Metadata.Medical_History.Prior_Major_Surgeries.length > 0
        );
      case 2: // Medications (at least one non-empty)
        return Object.values(formData.Metadata.Medications).some(
          (val) => val.trim() !== ""
        );
      case 3: // Narratives (at least one non-empty)
        return Object.values(formData.Narratives).some((val) => val.trim() !== "");
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

  // Submit form data with token in header
  const handleSubmit = async () => {
    if (!isStepValid()) {
      toast.error("Please complete required fields.");
      return;
    }
    if (!token) {
      toast.error("User token not found. Please login.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Submission failed");
      await res.json();
      toast.success("Form submitted successfully!");

      const updateReportRes = await fetch("/api/isreport", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isReport: true }),
      });

      if (!updateReportRes.ok) {
        const errData = await updateReportRes.json();
        console.warn("Failed to update isReport:", errData.error);
      }

      // Option B: Full page reload navigation (simpler)
      window.location.href = "/myreport";
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
        maxWidth: "100%",
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

      {activeStep === 1 && (
        <Box>
          <TextField
            label="Prior Major Surgeries (one per line)"
            value={getSurgeriesString()}
            onChange={(e) => setSurgeriesString(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            placeholder="Appendicectomy (1984, Maryland Hospital)"
          />
        </Box>
      )}

      {activeStep === 2 && (
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

      {activeStep === 3 && (
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
