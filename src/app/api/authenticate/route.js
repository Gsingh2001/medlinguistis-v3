import database from '@/components/lib/firebase';
import { ref, get } from 'firebase/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization token missing' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch users from Firebase Realtime Database
    const snapshot = await get(ref(database, 'users'));
    if (!snapshot.exists()) {
      return new Response(
        JSON.stringify({ error: 'No users found in database' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const users = Object.values(snapshot.val());

    // Find user by userId or email in token payload
    const user = users.find(u => u.userId === decoded.userId || u.email === decoded.email);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Exclude password before sending response
    const { password, ...userWithoutPassword } = user;

    return new Response(JSON.stringify({ user: userWithoutPassword }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Authentication API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
