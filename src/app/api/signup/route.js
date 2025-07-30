import { readJson, writeJson } from "@/components/lib/jsonDb";
import path from "path";
import jwt from "jsonwebtoken";

const dataPath = path.join('/data/users.json');

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

    const data = await readJson(dataPath, { users: [] });
    const users = data.users || [];

    const exists = users.find(user => user.email === email);
    if (exists) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newIndex = users.length + 1;
    const newUser = {
      userId: `u${newIndex.toString().padStart(3, '0')}`,
      Patient_ID: newIndex.toString().padStart(4, '0'),
      email,
      password, // ⚠️ Hash in production!
      name,
      role: 'patient',
      isReport: false,
    };

    users.push(newUser);
    await writeJson(dataPath, { users });

    // ✅ JWT Token generation
    const token = jwt.sign(
      {
        userId: newUser.userId,
        email: newUser.email,
        Patient_ID: newUser.Patient_ID,
        role: newUser.role,
        isReport: newUser.isReport,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // optional expiry
    );

    const { password: _, ...userWithoutPassword } = newUser;

    return new Response(
      JSON.stringify({
        message: 'User created successfully',
        user: userWithoutPassword,
        token
      }),
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
