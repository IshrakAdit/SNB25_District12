import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const filename = `${userId}-${uuidv4()}.${file.name.split('.').pop()}`;
    
    // Upload to Vercel Blob Storage with public access
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Return the URL of the uploaded file
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile image' },
      { status: 500 }
    );
  }
}
