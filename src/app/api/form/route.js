import { ref, get, set, push, update } from 'firebase/database';
import database from '@/components/lib/firebase'; // Your firebase init
import jwt from 'jsonwebtoken';

const MODEL_URL = process.env.MODEL_URL;

const callFakeModelAPI = async (formData) => {
  let retries = 5;
  const delay = 2000;

  while (retries--) {
    try {
      console.log("[callFakeModelAPI] Sending data to AI model API...", formData);
      const res = await fetch(`${MODEL_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        console.error(`[callFakeModelAPI] AI model API failed with status ${res.status}`);
        throw new Error(`Fake model API failed with status ${res.status}`);
      }

      const result = await res.json();
      console.log("[callFakeModelAPI] Received AI model API response:", result);
      return result;

    } catch (err) {
      console.error("[callFakeModelAPI] Error calling AI model API:", err.message);
      if (retries === 0) throw new Error('Failed to get response from fake model API after retries');
      console.log(`[callFakeModelAPI] Retrying... attempts left: ${retries}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
};

export async function POST(req) {
  try {
    console.log("[POST /api/form] Request received");

    // Extract token from Authorization header
    const authHeader = req.headers.get("authorization");
    console.log("[POST /api/form] Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("[POST /api/form] Missing or invalid Authorization header");
      return new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    console.log("[POST /api/form] Extracted token:", token);

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[POST /api/form] Decoded JWT token:", decoded);
    } catch (err) {
      console.error("[POST /api/form] JWT verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
    }

    // Extract Patient_ID, role, and name from token
    const { Patient_ID, role, name } = decoded;
    if (!Patient_ID || !role) {
      console.warn("[POST /api/form] Token missing required fields:", { Patient_ID, role });
      return new Response(JSON.stringify({ error: "Token missing required fields" }), { status: 401 });
    }
    console.log(`[POST /api/form] Token fields - Patient_ID: ${Patient_ID}, Role: ${role}, Name: ${name}`);

    // Parse form data from body, ignore any Patient_ID client sent
    const formData = await req.json();
    console.log("[POST /api/form] Received form data:", formData);

    // Overwrite formData.Patient_ID with token Patient_ID to ensure authenticity
    formData.Patient_ID = Patient_ID;

    // Add name from token to formData if available
    if (name) {
      formData.name = name;
    }
    console.log("[POST /api/form] Form data after adding Patient_ID and name:", formData);

    // 1. Save form data to Firebase under 'forms/{Patient_ID}'
    console.log(`[POST /api/form] Saving form data to Firebase at forms/${Patient_ID}`);
    await set(ref(database, `forms/${Patient_ID}`), formData);
    console.log("[POST /api/form] Form data saved successfully");

    // 2. Call fake AI model with formData
    const aiResult = await callFakeModelAPI(formData);

    if (!aiResult.Patient_ID) {
      // Ensure AI result has Patient_ID to identify uniquely in DB
      aiResult.Patient_ID = Patient_ID;
      console.log("[POST /api/form] Added Patient_ID to AI result");
    }
    console.log("[POST /api/form] AI model result:", aiResult);

    // 3. Save AI-generated report to Firebase under 'reports/{Patient_ID}'
    console.log(`[POST /api/form] Saving AI report to Firebase at reports/${Patient_ID}`);
    await set(ref(database, `reports/${Patient_ID}`), aiResult);
    console.log("[POST /api/form] AI report saved successfully");

    return new Response(JSON.stringify({
      message: 'Form submitted and AI report saved',
      aiResult,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error("[POST /api/form] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
