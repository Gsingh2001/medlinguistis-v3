import { promises as fs } from 'fs';

const reportDataPath = 'src/components/data/report.json';

async function loadPatientsData() {
  try {
    const jsonData = await fs.readFile(reportDataPath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (err) {
    console.error('Error reading patient data:', err);
    return [];
  }
}

function aggregateDoctorData(patients) {
  const wordCounts = {};
  patients.forEach((p) => {
    if (Array.isArray(p.report.wordcloud)) {
      p.report.wordcloud.forEach(([word, count]) => {
        wordCounts[word] = (wordCounts[word] || 0) + count;
      });
    }
  });
  const aggregatedWordcloud = Object.entries(wordCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const themeSums = {};
  const themeCounts = {};
  patients.forEach((p) => {
    const confScores = p.report?.detected_themes?.Confidence_Scores || {};
    for (const theme in confScores) {
      themeSums[theme] = (themeSums[theme] || 0) + confScores[theme];
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    }
  });

  const avgThemeConfidence = {};
  for (const theme in themeSums) {
    avgThemeConfidence[theme] = themeSums[theme] / themeCounts[theme];
  }

  const emotionSums = {};
  const emotionCounts = {};
  patients.forEach((p) => {
    const emotions = p.report?.sentiment_and_emotion_analysis?.Top_Emotions || {};
    for (const emotion in emotions) {
      emotionSums[emotion] = (emotionSums[emotion] || 0) + emotions[emotion];
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    }
  });

  const avgEmotions = {};
  for (const emotion in emotionSums) {
    avgEmotions[emotion] = emotionSums[emotion] / emotionCounts[emotion];
  }

  return {
    total_patients: patients.length,
    aggregated_wordcloud: aggregatedWordcloud,
    average_theme_confidence: avgThemeConfidence,
    average_emotions: avgEmotions,
  };
}


export async function POST(request) {
  try {
    const { userrole, patient_id } = await request.json();

    if (!userrole) {
      return new Response(
        JSON.stringify({ error: "userrole is required" }),
        { status: 400 }
      );
    }

    // Load data from JSON file
    const patientsData = await loadPatientsData();

    if (userrole === "patient") {
      if (!patient_id) {
        return new Response(
          JSON.stringify({ error: "patient_id is required for patient role" }),
          { status: 400 }
        );
      }

      const patient = patientsData.find((p) => p.Patient_ID === patient_id);
      if (!patient) {
        return new Response(
          JSON.stringify({ error: "Patient not found" }),
          { status: 404 }
        );
      }

      return new Response(
        JSON.stringify({
          userrole,
          patient_id,
          dashboard: {
            metadata: patient.report.metadata,
            detected_themes: patient.report.detected_themes,
            sentiment_and_emotion_analysis:
              patient.report.sentiment_and_emotion_analysis,
            zero_shot_classification: patient.report.zero_shot_classification,
            qol_summary: patient.report.qol_summary,
            wordcloud: patient.report.wordcloud,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (userrole === "doctor") {
      const data = aggregateDoctorData(patientsData);
      return new Response(
        JSON.stringify({
          userrole,
          dashboard: data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid userrole" }),
      { status: 400 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON or server error", details: error.message }),
      { status: 500 }
    );
  }
}
