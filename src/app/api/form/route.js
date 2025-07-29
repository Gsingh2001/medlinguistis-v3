import { readJson, writeJson } from "@/components/lib/jsonDb";
import path from "path";

const FORM_PATH = path.join("src/components/data/form.json");
const REPORT_PATH = path.join("src/components/data/report.json");
const BASE_URL = 'http://localhost:3000/';

// Save form data to form.json
const saveFormData = async (data) => {
  console.log("[saveFormData] Reading existing form data...");
  let existing = await readJson(FORM_PATH, []);
  if (!Array.isArray(existing)) {
    console.warn("[saveFormData] Existing data is not an array. Resetting...");
    existing = [];
  }

  // Remove any entries with same patient_id
  existing = existing.filter(item => item.patient_id !== data.patient_id);

  // Add the new data
  existing.push(data);

  await writeJson(FORM_PATH, existing);
  console.log("[saveFormData] Form data saved successfully.");
};


// Save AI-generated report data to report.json
const saveReportData = async (newData) => {
  console.log("[saveReportData] Reading existing report data...");
  let existing = await readJson(REPORT_PATH, []);
  if (!Array.isArray(existing)) {
    console.warn("[saveReportData] Existing report data is not an array. Resetting...");
    existing = [];
  }

  if (newData?.patient_id) {
    // Remove any existing entry with the same patient_id
    existing = existing.filter(item => item.patient_id !== newData.patient_id);

    // Add new report object
    existing.push(newData);

    console.log(`[saveReportData] Report for patient_id ${newData.patient_id} replaced/added.`);
  } else {
    console.warn("[saveReportData] No patient_id found in new data. Appending anyway.");
    existing.push(newData);
  }

  await writeJson(REPORT_PATH, existing);
  console.log("[saveReportData] Report data saved successfully.");
};



// Simulate API call to fake model
const callFakeModelAPI = async (formData) => {
  let retries = 5;
  const delay = 2000;

  while (retries--) {
    try {
      console.log(`[callFakeModelAPI] Sending request to fake model API (${5 - retries}/5)...`);
      const res = await fetch("http://127.0.0.1:8000/generate_report/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Fake model API failed with status ${res.status}`);

      const result = await res.json();
      console.log("[callFakeModelAPI] Received response:", result);
      return result;

    } catch (err) {
      console.warn(`[callFakeModelAPI] Retry failed: ${err.message} (${retries} retries left)`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw new Error('Failed to get response from fake model API after retries');
};

// Handle POST request
export async function POST(req) {
  try {
    console.log("[POST] New request received");

    const formData = await req.json();
    console.log("[POST] Parsed formData:", formData);

    const { Patient_ID } = formData;

    if (!Patient_ID) {
      console.warn("[POST] Missing Patient_ID in request");
      return new Response(JSON.stringify({ error: 'Patient_ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[POST] Saving form data for Patient_ID: ${Patient_ID}`);
    await saveFormData(formData);

    console.log("[POST] Calling fake AI model with formData...");
    const aiResult = await callFakeModelAPI(formData);

    console.log("[POST] Saving AI-generated report...");
    await saveReportData(aiResult);

    if (aiResult?.report.metadata.Patient_ID) {
      console.log("[POST] Notifying backend: setting isReport = true");
      const patient_id = aiResult?.report.metadata.Patient_ID
      const notifyRes = await fetch(`${BASE_URL}/api/isreport`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id, isReport: true }),
      });
      console.log(`[POST] isreport PUT status: ${notifyRes.status}`);
    }

    console.log("[POST] All steps completed successfully.");
    return new Response(JSON.stringify({
      message: 'Form submitted and AI report saved',
      aiResult,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[POST /api/form] Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
