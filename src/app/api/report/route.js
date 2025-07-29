import { readJson } from "@/components/lib/jsonDb";

const reportDataPath = 'src/components/data/report.json';

export async function GET() {
  try {
    const reports = await readJson(reportDataPath, []);
    return new Response(JSON.stringify(reports), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
