import database from '@/components/lib/firebase';
import { ref, get, update } from 'firebase/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function PUT(req) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
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

    const tokenPatientId = decoded.Patient_ID || decoded.patientId || decoded.userId;
    if (!tokenPatientId) {
      return new Response(JSON.stringify({ error: 'Token missing Patient_ID' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const body = await req.json();
    const { isReport } = body;

    if (typeof isReport !== 'boolean') {
      return new Response(JSON.stringify({ error: 'isReport must be a boolean' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch all users from Firebase
    const snapshot = await get(ref(database, 'users'));
    if (!snapshot.exists()) {
      return new Response(JSON.stringify({ error: 'No users found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const usersData = snapshot.val();

    // Find the key for the user with matching Patient_ID
    const userKey = Object.keys(usersData).find(
      (key) => usersData[key].Patient_ID === tokenPatientId
    );

    if (!userKey) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update isReport for that user
    const userRef = ref(database, `users/${userKey}`);
    await update(userRef, { isReport });

    // Return updated user data (optional: fetch again or merge manually)
    const updatedUserSnapshot = await get(userRef);
    const updatedUser = updatedUserSnapshot.val();

    // Remove sensitive data before returning (like password)
    if (updatedUser.password) {
      delete updatedUser.password;
    }

    return new Response(
      JSON.stringify({
        message: 'isReport updated successfully',
        user: updatedUser,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (err) {
    console.error('[PUT /api/isreport] Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
