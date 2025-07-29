'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";

import WordCloudComponent from "@/components/WordCloud";

const COLORS = ["#4763b8", "#929ee3", "#4962f3", "#1c286d", "#0c25b6", "#6e8bf0"];

// Helper: Convert value [0-1] to heatmap color (red to green gradient)
const getHeatmapColor = (value) => {
  const red = Math.floor(255 * (1 - value));
  const green = Math.floor(255 * value);
  return `rgba(${red}, ${green}, 0, 0.7)`; // slightly transparent strong color
};

// Heatmap component: grid of labeled colored squares
function Heatmap({ data, title }) {
  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          color="text.primary"
          sx={{ borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`, pb: 1 }}
        >
          {title}
        </Typography>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 2,
          maxWidth: 700,
          mx: "auto",
        }}
      >
        {Object.entries(data).map(([key, value]) => {
          const score = typeof value === "number" ? value : 0;
          const bgColor = getHeatmapColor(score);
          const textColor = score > 0.5 ? "black" : "white";
          return (
            <Box
              key={key}
              sx={{
                bgcolor: bgColor,
                borderRadius: 2,
                boxShadow: 1,
                cursor: "default",
                userSelect: "none",
                height: 80,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: textColor,
                fontWeight: "bold",
                textTransform: "capitalize",
                fontSize: "1.1rem",
                px: 1,
                textAlign: "center",
              }}
              title={`${key.replace(/_/g, " ")}: ${(score * 100).toFixed(1)}%`}
            >
              <Typography sx={{ fontWeight: "bold", mb: 0.5, fontSize: "0.95rem" }}>
                {key.replace(/_/g, " ")}
              </Typography>
              <Typography>{(score * 100).toFixed(1)}%</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

const MyReport = () => {
  const router = useRouter();
  const theme = useTheme();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) return;

      let id = null;
      try {
        const parsed = JSON.parse(storedUser);
        id = parsed.patient_id;
      } catch (e) {
        console.error("Invalid user data in localStorage");
        return;
      }

      if (!id) return;

      setLoading(true);

      try {
        const response = await fetch(`/api/report/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );

  if (!patient)
    return (
      <Box className="p-8 text-red-600 text-center">
        <Typography variant="h6">Your report is not available.</Typography>
      </Box>
    );

  const metadata = patient?.report?.metadata || {};
  const themes = patient?.report?.detected_themes || {};
  const emotions = patient?.report?.sentiment_and_emotion_analysis?.["Top Emotions"] || {};
  const zeroShot = patient?.report?.zero_shot_classification || {};
  const emotionData = Object.entries(emotions).map(([name, value]) => ({ name, value }));
  const summary = patient?.report?.qol_summary || "Not available";
  const wordcloud = patient?.report?.wordcloud || [];

  // Extract theme confidence scores for heatmap (normalized 0-1)
  const themeScores = themes["Confidence Scores"] || {};

  return (
    <>
      <Box
        component="header"
        sx={{
          display: 'none',
          '@media print': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            mb: 3,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            pb: 1,
            px: 2,
          }
        }}
      >
        <Box
          component="img"
          src="/images/dark.png"
          alt="Logo"
          sx={{
            height: 80,
            mr: 2,
            objectFit: 'contain',
          }}
        />
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.primary"
          sx={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '1.5rem',
          }}
        >
          Medlinguitis
        </Typography>
      </Box>
      {/* Print styles injected globally */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background: white !important;
                color: black !important;
                font-family: Arial, sans-serif !important;
              }
              /* Hide interactive UI */
              button, .no-print, .MuiTooltip-root, .recharts-legend-wrapper {
                display: none !important;
              }
              /* Remove shadows and backgrounds */
              .MuiPaper-root {
                box-shadow: none !important;
                background-color: transparent !important;
              }
              /* Make sure container fits page */
              #__next, html, body {
                width: 100% !important;
                overflow: visible !important;
              }
              /* Avoid page break inside items */
              .avoid-page-break {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              /* Fix charts container size */
              .recharts-responsive-container {
                height: 300px !important;
                width: 100% !important;
              }
              /* Adjust margins and padding */
              .MuiBox-root {
                margin: 0 !important;
                padding: 0 !important;
              }
            }
          `,
        }}
      />

      {/* Header + print button */}
      <Box
        className="mb-6 flex items-center justify-between flex-wrap gap-4 no-print"
        sx={{
          print: { display: 'none' },
          px: 2,
          pt: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="text.primary"
          sx={{ fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' } }}
        >
          Patient Information
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            boxShadow: '0 3px 8px rgba(71, 99, 184, 0.4)',
            '&:hover': { backgroundColor: '#3b54a5' },
          }}
        >
          Print Report
        </Button>
      </Box>

      <Section>
        <InfoGrid>
          <InfoItem label="Name" value={metadata['Name'] || 'N/A'} />
          <InfoItem label="Age" value={metadata['Age'] || 'N/A'} />
          <InfoItem label="Gender" value={metadata['Gender'] || 'N/A'} />
          <InfoItem label="Ethnicity" value={metadata['Ethnicity'] || 'N/A'} />
          <InfoItem label="Marital Status" value={metadata['Marital Status'] || 'N/A'} />
          <InfoItem label="Occupation" value={metadata['Occupation']?.['Job Title'] || 'N/A'} />
        </InfoGrid>
      </Section>

      <Divider sx={{ my: 6 }} />

      <Section title="Medical History">
        <List dense disablePadding>
          {metadata["Medical History"] &&
            Object.entries(metadata["Medical History"]).map(([key, value]) => {
              const formattedKey = key.replace(/_/g, " ");
              return Array.isArray(value) ? (
                <ListItem key={key} sx={{ py: 0.5 }} className="avoid-page-break">
                  <ListItemText
                    primaryTypographyProps={{ fontWeight: "medium", color: "text.primary" }}
                    primary={formattedKey + ":"}
                    secondary={value.join(", ")}
                  />
                </ListItem>
              ) : (
                <ListItem key={key} sx={{ py: 0.5 }} className="avoid-page-break">
                  <ListItemText
                    primaryTypographyProps={{ fontWeight: "medium", color: "text.primary" }}
                    primary={`${formattedKey}: ${value}`}
                  />
                </ListItem>
              );
            })}
          {metadata["Previous Hernia Repairs"]?.length > 0 && (
            <ListItem sx={{ py: 0.5 }} className="avoid-page-break">
              <ListItemText
                primaryTypographyProps={{ fontWeight: "medium", color: "text.primary" }}
                primary="Previous Hernia Repairs:"
                secondary={metadata["Previous Hernia Repairs"].join(", ")}
              />
            </ListItem>
          )}
        </List>
      </Section>

      <Divider sx={{ my: 6 }} />

      <Section title="Prior Major Surgeries">
        <List dense disablePadding>
          {(metadata["Medical History"]?.Prior_Major_Surgeries || []).map((surgery, idx) => (
            <ListItem key={idx} sx={{ py: 0.5 }} className="avoid-page-break">
              <ListItemText primary={surgery} />
            </ListItem>
          ))}
        </List>
      </Section>

      <Divider sx={{ my: 6 }} />

      <Section title="Current Medications">
        <List dense disablePadding>
          {metadata["Medications"] &&
            Object.entries(metadata["Medications"]).map(([med, dose]) => (
              <ListItem key={med} sx={{ py: 0.5 }} className="avoid-page-break">
                <ListItemText
                  primaryTypographyProps={{ fontWeight: "medium", color: "text.primary" }}
                  primary={`${med}: ${dose}`}
                />
              </ListItem>
            ))}
        </List>
      </Section>

      <Divider sx={{ my: 6 }} />

      <Section title="Quality of Life Areas Affected">
        <List dense disablePadding>
          {(metadata["QoL Areas Affected"] || []).map((area, idx) => (
            <ListItem key={idx} sx={{ py: 0.5 }} className="avoid-page-break">
              <ListItemText primary={area} />
            </ListItem>
          ))}
        </List>
      </Section>

      <Divider sx={{ my: 8 }} />

      <Section title="Sentiment & Emotions">
        <Typography mb={2} fontWeight="medium" color="text.secondary">
          <strong>Overall Sentiment: </strong>
          {patient?.report?.sentiment_and_emotion_analysis?.["Overall Sentiment"]?.Label || "N/A"}
        </Typography>

        {emotionData.length > 0 && (
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={emotionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Section>

      <Divider sx={{ my: 8 }} />

      {/* Zero-Shot Classification Scores List */}
      <Section title="Zero-Shot Classification Scores">
        <List dense disablePadding>
          {Object.entries(zeroShot).map(([label, score]) => (
            <ListItem key={label} sx={{ py: 0.5 }} className="avoid-page-break">
              <ListItemText
                primaryTypographyProps={{ fontWeight: "medium", color: "text.primary" }}
                primary={`${label}: ${(score * 100).toFixed(1)}%`}
              />
            </ListItem>
          ))}
        </List>
      </Section>

      <Divider sx={{ my: 8 }} />

      {/* Theme Confidence Heatmap */}
      <Heatmap data={themeScores} title="Theme Confidence Heatmap" />

      <Divider sx={{ my: 8 }} />

      {/* Zero-Shot Classification Heatmap */}
      <Heatmap data={zeroShot} title="Zero-Shot Classification Heatmap" />

      <Divider sx={{ my: 8 }} />

      {/* Word Cloud */}
      <WordCloudComponent wordcloud={wordcloud} />

      <Divider sx={{ my: 8 }} />

      {/* Quality of Life Summary */}
      <Section title="Quality of Life Summary">
        <Box
          sx={{
            whiteSpace: "pre-wrap",
            fontFamily: "Roboto, sans-serif",
            color: "text.primary",
            fontSize: "1rem",
            lineHeight: 1.6,
            m: 0,
            userSelect: "text",
            borderRadius: 2,
            p: 3,
            bgcolor: "grey.50",
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.05)",
            '@media print': {
              boxShadow: 'none',
              bgcolor: 'transparent',
              padding: 0,
            }
          }}
          dangerouslySetInnerHTML={{
            __html: (summary || "")
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold**
              .replace(/\n/g, '<br />'),                       // Preserve new lines
          }}
        />
      </Section>
    </>
  );
};

export default MyReport;

// ----------------- Helper Components ---------------------

function Section({ title, children }) {
  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          color="text.primary"
          sx={{ borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`, pb: 1 }}
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

function InfoGrid({ children }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
        gap: 3,
        color: "text.secondary",
      }}
    >
      {children}
    </Box>
  );
}

function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight="medium" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" color="text.primary">
        {value}
      </Typography>
    </Box>
  );
}
