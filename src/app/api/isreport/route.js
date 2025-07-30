import { readJson, writeJson } from '@/components/lib/jsonDb';
import path from 'path';
import jwt from 'jsonwebtoken';

const USERS_JSON_PATH = path.join('/data/users.json');

export async function PUT(req) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { Patient_ID: tokenPatientId } = decoded;
    if (!tokenPatientId) {
      return new Response(JSON.stringify({ error: 'Token missing Patient_ID' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const body = await req.json();
    const { isReport } = body;

    if (typeof isReport !== 'boolean') {
      return new Response(JSON.stringify({ error: 'isReport must be a boolean' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Read user data
    const data = await readJson(USERS_JSON_PATH, { users: [] });

    const userIndex = data.users.findIndex(user => user.Patient_ID === tokenPatientId);
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
