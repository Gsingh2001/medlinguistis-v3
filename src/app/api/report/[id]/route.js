import database from "@/components/lib/firebase";
import { ref, get, child } from "firebase/database";

export async function GET(req, context) {
  try {
    const { params } = await context;
    const patientId = params?.id;

    if (!patientId) {
      return new Response(JSON.stringify({ error: 'Missing patient ID in params' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'reports'));

    if (!snapshot.exists()) {
      return new Response(JSON.stringify({ error: 'No reports found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const allReports = snapshot.val();
    const reportsArray = Object.values(allReports);

    const report = reportsArray.find(r => r.report?.metadata?.Patient_ID === patientId);

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
