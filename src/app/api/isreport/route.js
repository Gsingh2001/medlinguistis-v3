import { readJson, writeJson } from '@/components/lib/jsonDb';
import path from 'path';

// Use absolute path for safety in production builds
const USERS_JSON_PATH = path.join('src/components/data/users.json');

export async function PUT(req) {
  try {
    const { patient_id, isReport } = await req.json();

    if (!patient_id) {
      return new Response(JSON.stringify({ error: 'patient_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (typeof isReport !== 'boolean') {
      return new Response(JSON.stringify({ error: 'isReport must be a boolean' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Read user data
    const data = await readJson(USERS_JSON_PATH, { users: [] });

    const userIndex = data.users.findIndex(user => user.patient_id === patient_id);
    if (userIndex === -1) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update isReport value
    data.users[userIndex].isReport = isReport;

    // Save changes
    await writeJson(USERS_JSON_PATH, data);

    return new Response(JSON.stringify({
      message: 'isReport updated successfully',
      user: data.users[userIndex]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('[PUT /api/isreport] Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
