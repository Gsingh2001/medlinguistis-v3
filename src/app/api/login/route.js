import jwt from 'jsonwebtoken';
import database from '@/components/lib/firebase';
import { ref, get } from 'firebase/database';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch users from Firebase Realtime Database
    const snapshot = await get(ref(database, 'users'));
    const users = snapshot.exists() ? Object.values(snapshot.val()) : [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create JWT token
    const tokenPayload = {
      userId: foundUser.user_id,
      email: foundUser.email,
      role: foundUser.role,
      name: foundUser.name,
      isReport: foundUser.isReport,
      Patient_ID: foundUser.Patient_ID
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    const { password: _, ...userWithoutPassword } = foundUser;

    return new Response(JSON.stringify({ message: 'Login successful', user: userWithoutPassword, token }), {
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
