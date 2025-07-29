import fs from 'fs/promises';
import path from 'path';

const USERS_JSON_PATH = path.join('src/components/data/users.json');

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Read users.json file
    const fileContent = await fs.readFile(USERS_JSON_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    const users = data.users || [];

    // Find matching user
    const foundUser = users.find(
      user => user.email === email && user.password === password
    );

    if (!foundUser) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = foundUser;

    return new Response(JSON.stringify({
      message: 'Login successful',
      user: userWithoutPassword,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Login Error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
