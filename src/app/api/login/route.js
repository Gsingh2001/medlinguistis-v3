import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const isProd = process.env.VERCEL === '1';
const JWT_SECRET = process.env.JWT_SECRET;

const USERS_JSON_PATH = isProd
  ? path.join('/tmp', 'users.json') // You can pre-generate or sync it here for prod
  : path.join(process.cwd(), 'data', 'users.json'); // Local dev file

export async function POST(request) {
  try {
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Try reading users.json
    let users = [];
    try {
      const fileContent = await fs.readFile(USERS_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(fileContent);
      users = parsed.users || [];
    } catch (err) {
      console.warn('User database missing or unreadable:', err.message);
      return new Response(JSON.stringify({ error: 'User data unavailable' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find user
    const foundUser = users.find(
      user => user.email === email && user.password === password
    );

    if (!foundUser) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = foundUser;

    // Create token
    const tokenPayload = {
      userId: foundUser.userId,
      email: foundUser.email,
      Patient_ID: foundUser.Patient_ID,
      role: foundUser.role,
      isReport: foundUser.isReport,
      name: foundUser.name,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    return new Response(JSON.stringify({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
