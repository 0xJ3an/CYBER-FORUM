import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateUserId } from '@/app/models/User';

export async function POST(request: Request) {
  try {
    const { userId, username } = await request.json();
    
    // Validate userId format (10 digits)
    if (!userId || !/^\d{10}$/.test(userId)) {
      return NextResponse.json({ error: 'ID inválido. Debe tener 10 dígitos.' }, { status: 400 });
    }
    
    // Validate username
    if (!username || username.trim().length < 3) {
      return NextResponse.json({ error: 'El nombre de usuario debe tener al menos 3 caracteres.' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('cyberforum');
    
    // Check if userId already exists
    const existingUser = await db.collection('users').findOne({ userId });
    
    if (existingUser) {
      // Update username and lastLogin for existing user
      await db.collection('users').updateOne(
        { userId },
        { $set: { username, lastLogin: new Date() } }
      );
      return NextResponse.json({ userId, username });
    } else {
      // Create new user
      await db.collection('users').insertOne({
        userId,
        username,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      return NextResponse.json({ userId, username });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error en el acceso al foro' }, { status: 500 });
  }
}
