import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Generate a unique filename with original extension
    const filename = `content-${uuidv4()}.${file.name.split('.').pop()}`;
    
    // Upload to Vercel Blob Storage with public access
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Return the URL and other metadata of the uploaded file
    return NextResponse.json({ 
      url: blob.url,
      size: blob.size,
      contentType: blob.contentType,
      pathname: blob.pathname
    });
  } catch (error) {
    console.error('Error uploading content image:', error);
    return NextResponse.json(
      { error: 'Failed to upload content image' },
      { status: 500 }
    );
  }
}
