import { readJson, writeJson } from "@/components/lib/jsonDb";
import path from "path";

const dataPath = path.join( 'src/components/data/users.json');

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Missing fields: email, password, and name are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Read users.json, fallback to an object with users array
    const data = await readJson(dataPath, { users: [] });
    const users = data.users || [];

    // Check if user already exists by email
    const exists = users.find(user => user.email === email);
    if (exists) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new user with IDs padded as strings
    const newIndex = users.length + 1;
    const newUser = {
      user_id: `u${newIndex.toString().padStart(3, '0')}`,
      patient_id: newIndex.toString().padStart(4, '0'),
      email,
      password, // ⚠️ IMPORTANT: Hash password before storing in production
      name,
      role: 'patient',
      isReport: false,
    };

    // Append new user to the array
    users.push(newUser);

    // Write updated users object back to file
    await writeJson(dataPath, { users });

    return new Response(
      JSON.stringify({ message: 'User created successfully', user: newUser }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[POST /api/register] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
