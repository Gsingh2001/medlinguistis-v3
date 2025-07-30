import { readJson, writeJson } from "@/components/lib/jsonDb";
import path from "path";
import jwt from "jsonwebtoken";

const FORM_PATH = path.join("/data/form.json");
const REPORT_PATH = path.join("/data/report.json");
const MODEL_URL = process.env.MODEL_URL;

// Save form data to form.json
const saveFormData = async (data) => {
  let existing = await readJson(FORM_PATH, []);
  if (!Array.isArray(existing)) existing = [];

  // Remove old entry for the patient
  existing = existing.filter(item => item.Patient_ID !== data.Patient_ID);

  // Add new form data
  existing.push(data);
  await writeJson(FORM_PATH, existing);
};

// Save AI-generated report data to report.json
const saveReportData = async (newData) => {
  let existing = await readJson(REPORT_PATH, []);
  if (!Array.isArray(existing)) existing = [];

  if (newData?.Patient_ID) {
    existing = existing.filter(item => item.Patient_ID !== newData.Patient_ID);
    existing.push(newData);
  } else {
    existing.push(newData);
  }

  await writeJson(REPORT_PATH, existing);
};

// Call fake AI model API
const callFakeModelAPI = async (formData) => {
  let retries = 5;
  const delay = 2000;

  while (retries--) {
    try {
      const res = await fetch(`${MODEL_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Fake model API failed with status ${res.status}`);

      const result = await res.json();
      return result;

    } catch (err) {
      if (retries === 0) throw new Error('Failed to get response from fake model API after retries');
      await new Promise(r => setTimeout(r, delay));
    }
  }
};

export async function POST(req) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
    }

    // Extract Patient_ID, role, and name from token
    const { Patient_ID, role, name } = decoded;
    if (!Patient_ID || !role) {
      return new Response(JSON.stringify({ error: "Token missing required fields" }), { status: 401 });
    }

    // Parse form data from body, ignore any Patient_ID client sent
    const formData = await req.json();

    // Overwrite formData.Patient_ID with token Patient_ID to ensure authenticity
    formData.Patient_ID = Patient_ID;

    // Add name from token to formData if available
    if (name) {
      formData.name = name;
    }

    // Save form data
    await saveFormData(formData);

    // Call fake AI model with formData
    const aiResult = await callFakeModelAPI(formData);

    // Save AI-generated report
    await saveReportData(aiResult);

    // <-- Removed isReport API call here -->

    return new Response(JSON.stringify({
      message: 'Form submitted and AI report saved',
      aiResult,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
