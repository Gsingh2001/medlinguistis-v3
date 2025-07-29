'use client';
import { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Grid
} from '@mui/material';
import { Bar, Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import dynamic from "next/dynamic";
import { useUser } from '@/context/UserContext';

const WordCloudComponent = dynamic(() => import("@/components/WordCloud"), {
  ssr: false
});

export default function Dashboard() {
  const { user } = useUser();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user?.role) return;

    fetch('/api/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userrole: user.role,
        patient_id: user.patient_id
      })
    })
      .then(res => res.json())
      .then(json => setData(json.dashboard))
      .catch(err => console.error('Error:', err));
  }, [user]);

  if (!data) return <div className="p-6">Loading...</div>;

  const isDoctor = user.role === 'doctor';

  // ==== CHARTS ====
  const emotions = isDoctor ? data?.average_emotions : data?.sentiment_and_emotion_analysis?.['Top Emotions'] ?? {};
  const emotionChart = {
    labels: Object.keys(emotions),
    datasets: [{
      label: 'Emotion Score',
      data: Object.values(emotions),
      backgroundColor: ['#3b82f6', '#f87171', '#fbbf24', '#10b981']
    }]
  };

  const mental = isDoctor ? data?.average_theme_confidence : data?.zero_shot_classification ?? {};
  const mentalChart = {
    labels: Object.keys(mental),
    datasets: [{
      label: isDoctor ? 'Avg. Theme Confidence' : 'Mental Health Indicators',
      data: Object.values(mental),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: '#2563eb',
      borderWidth: 2
    }]
  };

  const wordcloud = isDoctor ? data?.aggregated_wordcloud : data?.wordcloud;

  return (
    <div>
      <Grid container spacing={2}>
        {isDoctor ? (
          <Grid item xs={12} sm={6}>
            <Card className="rounded-xl shadow-md h-full">
              <CardContent>
                <Typography variant="subtitle2" className="text-gray-500">Total Patients</Typography>
                <Typography variant="h5" className="font-bold">{data.total_patients}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <>
            {[
              ['Name', data?.metadata?.Name ?? 'N/A'],
              ['Age', data?.metadata?.Age ?? 'N/A'],
              ['Surgeries', data?.metadata?.MedicalHistory?.Prior_Major_Surgeries?.length ?? 0],
              ['Medications', Object.keys(data?.metadata?.Medications || {}).length]
            ].map(([title, value], i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card className="rounded-xl shadow-md h-full">
                  <CardContent>
                    <Typography variant="subtitle2" className="text-gray-500">{title}</Typography>
                    <Typography variant="h5" className="font-bold break-words">{value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>

      {/* Emotion Chart */}
      {Object.keys(emotions).length > 0 && (
        <Card className="shadow-md mt-4">
          <CardContent>
            <Typography variant="h6" className="mb-4">
              {isDoctor ? 'Average Emotions Across Patients' : 'Top Emotions'}
            </Typography>
            <div className="w-full overflow-x-auto">
              <Bar data={emotionChart} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Radar Chart */}
      {Object.keys(mental).length > 0 && (
        <Card className="shadow-md mt-4">
          <CardContent>
            <Typography variant="h6" className="mb-4">
              {isDoctor ? 'Average Theme Confidence' : 'Mental Health Indicators'}
            </Typography>
            <div className="w-full overflow-x-auto">
              <Radar data={mentalChart} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Word Cloud */}
      {wordcloud && wordcloud.length > 0 && (
        <Card className="shadow-md mt-4">
          <CardContent>
            <Typography variant="h6" className="mb-4">Word Cloud</Typography>
            <div className="w-full overflow-x-auto">
              <WordCloudComponent wordcloud={wordcloud} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {!isDoctor && data.qol_summary && (
        <Card className="shadow-md mt-4">
          <CardContent>
            <Typography variant="h6" className="mb-2">Quality of Life Summary</Typography>
            <Typography
              component="div"
              className="text-gray-800"
              dangerouslySetInnerHTML={{
                __html: data.qol_summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
