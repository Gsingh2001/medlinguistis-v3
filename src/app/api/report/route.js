import { readJson } from "@/components/lib/jsonDb";
import path from "path";
import jwt from "jsonwebtoken";

const reportDataPath = '/data/report.json';

export async function GET(request) {
  console.log("[GET /api/reports] Incoming request");

  try {
    // 1. Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn("[Auth] Missing or invalid Authorization header");
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    console.log("[Auth] Extracted token:", token);

    // 2. Verify and decode JWT
    let decoded;
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error("[JWT] Missing JWT_SECRET in environment");
        throw new Error("JWT_SECRET not defined");
      }

      decoded = jwt.verify(token, secret);
      console.log("[JWT] Decoded token:", decoded);
    } catch (err) {
      console.error("[JWT] Token verification failed:", err.message);
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const patientId = decoded.Patient_ID;
    console.log("[User] Extracted Patient_ID:", patientId);

    // 3. Read all reports
    let reports = [];
    try {
      reports = await readJson(reportDataPath, []);
      console.log(`[Reports] Total reports loaded: ${reports.length}`);
    } catch (readErr) {
      console.error("[Reports] Failed to read reports.json:", readErr.message);
      return new Response(JSON.stringify({ error: 'Failed to read reports' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Filter reports by user's Patient_ID
    const userReports = reports.filter(report => report.Patient_ID === patientId);
    console.log(`[Reports] Filtered reports for Patient_ID=${patientId}:`, userReports.length);

    // 5. Return filtered reports
    return new Response(JSON.stringify(userReports), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[API ERROR] Unexpected failure in /api/reports:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
