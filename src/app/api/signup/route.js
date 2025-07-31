import { ref, get, push, set } from 'firebase/database';
import database from '@/components/lib/firebase'; // your firebase init file
import jwt from 'jsonwebtoken';

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

    // Fetch existing users from Firebase
    const snapshot = await get(ref(database, 'users'));
    const users = snapshot.exists() ? Object.values(snapshot.val()) : [];

    // Check if user already exists by email
    if (users.find(user => user.email === email)) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate new user ID (simple increment based on count)
    const newUserIdNumber = users.length + 1;
    const newUserId = `u${newUserIdNumber.toString().padStart(3, '0')}`;
    const newPatientId = newUserIdNumber.toString().padStart(4, '0');

    const newUser = {
      user_id: newUserId,
      Patient_ID: newPatientId,
      email,
      password, // ⚠️ Hash password in production!
      name,
      role: 'patient',
      isReport: false,
    };

    // Add new user to Firebase under users/{user_id}
    await set(ref(database, `users/${newUserId}`), newUser);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.user_id,
        email: newUser.email,
        Patient_ID: newUser.Patient_ID,
        role: newUser.role,
        isReport: newUser.isReport,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    return new Response(
      JSON.stringify({
        message: 'User created successfully',
        user: userWithoutPassword,
        token,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[POST /api/users] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
