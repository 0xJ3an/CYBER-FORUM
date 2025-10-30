import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { content, authorId, username } = await request.json();
    
    if (!content || !authorId || !username) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('cyberforum');
    
    const reply = {
      _id: new ObjectId(),
      content,
      authorId,
      username,
      createdAt: new Date()
    };

    await db.collection('posts').updateOne(
      { _id: new ObjectId(params.postId) },
      { $push: { replies: reply } }
    );
    
    return NextResponse.json(reply);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error al crear respuesta' }, { status: 500 });
  }
}