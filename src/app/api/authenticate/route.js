import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const USERS_JSON_PATH = path.join(process.cwd(), '/data/users.json');

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization token missing' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Read users.json
    const fileContent = await fs.readFile(USERS_JSON_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    const users = data.users || [];

    // Find user by userId or email in token payload
    const user = users.find(u => u.userId === decoded.userId || u.email === decoded.email);

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Exclude password before sending response
    const { password, ...userWithoutPassword } = user;

    return new Response(JSON.stringify({ user: userWithoutPassword }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Authentication API Error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
