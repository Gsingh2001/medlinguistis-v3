import { readJson } from '@/components/lib/jsonDb';
import path from 'path';

const reportDataPath = path.join('src/components/data/report.json');

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const patientId = resolvedParams.id;

    if (!patientId) {
      return new Response(JSON.stringify({ error: 'Missing patient ID in params' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Reading report data from:', reportDataPath);

    const data = await readJson(reportDataPath, []);

    const report = data.find(r => r.report?.metadata?.Patient_ID === patientId);

    if (!report) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[GET /api/report/[id]] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
