import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateUserId } from '@/app/models/User';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const client = await clientPromise;
    const db = client.db('cyberforum');
    
    const userId = generateUserId();
    
    await db.collection('users').insertOne({
      userId,
      username,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    return NextResponse.json({ userId, username });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('cyberforum');
    
    const user = await db.collection('users').findOne({ userId });
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Error al buscar usuario' }, { status: 500 });
  }
}