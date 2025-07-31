import { NextResponse } from 'next/server';
import database from '@/components/lib/firebase';
import { ref, get, push } from 'firebase/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Only keep these user fields
const allowedUserFields = ['Patient_ID', 'email', 'name', 'password', 'role', 'user_id','isReport'];

export async function GET() {
  try {
    const snapshot = await get(ref(database, 'users'));
    if (!snapshot.exists()) {
      return NextResponse.json([], { status: 200 });
    }

    const usersRaw = Object.values(snapshot.val());

    // Map and return only allowed fields
    const users = usersRaw.map(user => {
      const filteredUser = {};
      for (const key of allowedUserFields) {
        if (key in user) {
          filteredUser[key] = user[key];
        }
      }
      // Ensure isReport is boolean, default to false if missing
      if (typeof filteredUser.isReport !== 'boolean') {
        filteredUser.isReport = false;
      }
      return filteredUser;
    });

    return NextResponse.json(users);

  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (decoded.role !== 'doctor') {
      return NextResponse.json({ error: 'Forbidden: only doctors can create users' }, { status: 403 });
    }

    const body = await request.json();

    // Validate string fields
    const stringFields = ['Patient_ID', 'email', 'name', 'password', 'role', 'user_id'];
    for (const field of stringFields) {
      if (!(field in body) || typeof body[field] !== 'string') {
        return NextResponse.json({ error: `Missing or invalid field: ${field}` }, { status: 400 });
      }
    }

    // Validate isReport as boolean, default to false if missing
    if ('isReport' in body) {
      if (typeof body.isReport !== 'boolean') {
        return NextResponse.json({ error: 'Field isReport must be a boolean' }, { status: 400 });
      }
    } else {
      body.isReport = false; // default value
    }

    // Now push user to Firebase
    const usersRef = ref(database, 'users');
    await push(usersRef, body);

    return NextResponse.json({ message: 'User created successfully', user: body }, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

