import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('cyberforum');
    
    const posts = await db.collection('posts')
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    
    // Convert ObjectId to string for proper JSON serialization
    const serializedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString()
    }));
    
    return NextResponse.json(serializedPosts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, authorId, username } = await request.json();
    
    if (!title || !content || !authorId || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate input lengths
    if (title.length > 100) {
      return NextResponse.json({ error: 'Title too long (max 100 characters)' }, { status: 400 });
    }

    if (content.length > 5000) {
      return NextResponse.json({ error: 'Content too long (max 5000 characters)' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('cyberforum');
    
    const post = {
      title: title.trim(),
      content: content.trim(),
      authorId,
      username,
      createdAt: new Date(),
      replies: []
    };

    const result = await db.collection('posts').insertOne(post);
    
    // Return the created post with serialized ID
    return NextResponse.json({
      ...post,
      _id: result.insertedId.toString(),
      createdAt: post.createdAt.toISOString()
    });
  } catch (err) {
    console.error('Error creating post:', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}