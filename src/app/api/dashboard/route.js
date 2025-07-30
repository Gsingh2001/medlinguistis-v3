import { promises as fs } from 'fs';
import jwt from 'jsonwebtoken';

const reportDataPath = '/data/report.json';

async function loadPatientsData() {
  try {
    console.log('Loading patient data...');
    const jsonData = await fs.readFile(reportDataPath, 'utf-8');
    const data = JSON.parse(jsonData);
    console.log(`Loaded ${data.length} patient records`);
    return data;
  } catch (err) {
    console.error('Error reading patient data:', err);
    return [];
  }
}

function aggregateDoctorData(patients) {
  console.log('Aggregating data for doctor dashboard...');
  const wordCounts = {};
  patients.forEach((p) => {
    if (Array.isArray(p.report.wordcloud)) {
      p.report.wordcloud.forEach(([word, count]) => {
        wordCounts[word] = (wordCounts[word] || 0) + count;
      });
    }
  });

  const aggregatedWordcloud = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
  console.log('Aggregated wordcloud:', aggregatedWordcloud.slice(0, 5)); // top 5 words preview

  const themeSums = {};
  const themeCounts = {};
  const emotionSums = {};
  const emotionCounts = {};

  patients.forEach((p) => {
    const confScores = p.report?.detected_themes?.Confidence_Scores || {};
    for (const theme in confScores) {
      themeSums[theme] = (themeSums[theme] || 0) + confScores[theme];
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    }

    const emotions = p.report?.sentiment_and_emotion_analysis?.Top_Emotions || {};
    for (const emotion in emotions) {
      emotionSums[emotion] = (emotionSums[emotion] || 0) + emotions[emotion];
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    }
  });

  const avgThemeConfidence = {};
  for (const theme in themeSums) {
    avgThemeConfidence[theme] = themeSums[theme] / themeCounts[theme];
  }
  console.log('Average theme confidence:', avgThemeConfidence);

  const avgEmotions = {};
  for (const emotion in emotionSums) {
    avgEmotions[emotion] = emotionSums[emotion] / emotionCounts[emotion];
  }
  console.log('Average emotions:', avgEmotions);

  return {
    total_patients: patients.length,
    aggregated_wordcloud: aggregatedWordcloud,
    average_theme_confidence: avgThemeConfidence,
    average_emotions: avgEmotions,
  };
}

export async function POST(request) {
  try {
    console.log('Received POST request for dashboard');

    // Step 1: Extract and verify JWT
    const authHeader = request.headers.get("authorization");
    console.log('Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error('Missing or invalid Authorization header');
      return new Response(JSON.stringify({ error: "Missing or invalid token" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log('Extracted token:', token);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded JWT payload:', decoded);
    } catch (err) {
      console.error('JWT verification failed:', err);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
    }

    const { role, Patient_ID } = decoded;
    console.log(`User role: ${role}, Patient ID: ${Patient_ID}`);

    if (!role) {
      console.error('userrole missing in token');
      return new Response(JSON.stringify({ error: "userrole missing in token" }), { status: 400 });
    }

    const patientsData = await loadPatientsData();

    if (role === "patient") {
      if (!Patient_ID) {
        console.error('Patient_ID missing in token');
        return new Response(JSON.stringify({ error: "Patient_ID missing in token" }), { status: 400 });
      }

      const patient = patientsData.find((p) => p.Patient_ID === Patient_ID);
      if (!patient) {
        console.error(`Patient with ID ${Patient_ID} not found`);
        return new Response(JSON.stringify({ error: "Patient not found" }), { status: 404 });
      }

      console.log(`Found patient data for ID ${Patient_ID}`);

      const { report } = patient;

      return new Response(
        JSON.stringify({
          role,
          Patient_ID,
          dashboard: {
            metadata: report.metadata,
            detected_themes: report.detected_themes,
            sentiment_and_emotion_analysis: report.sentiment_and_emotion_analysis,
            zero_shot_classification: report.zero_shot_classification,
            qol_summary: report.qol_summary,
            wordcloud: report.wordcloud,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (role === "doctor") {
      const doctorDashboard = aggregateDoctorData(patientsData);
      console.log('Responding with aggregated doctor dashboard');
      return new Response(
        JSON.stringify({ role, dashboard: doctorDashboard }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error('Invalid userrole:', role);
    return new Response(JSON.stringify({ error: "Invalid userrole" }), { status: 400 });

  } catch (error) {
    console.error('Error in POST /api/dashboard:', error);
    return new Response(
      JSON.stringify({ error: "Invalid request or server error", details: error.message }),
      { status: 500 }
    );
  }
}
