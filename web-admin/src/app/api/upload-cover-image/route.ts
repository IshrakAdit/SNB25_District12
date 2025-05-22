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
    const filename = `cover-${uuidv4()}.${file.name.split('.').pop()}`;
    
    // Upload to Vercel Blob Storage with public access
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Return the URL and other metadata of the uploaded file
    return NextResponse.json({ 
      url: blob.url,
      contentType: blob.contentType,
      pathname: blob.pathname,
      downloadUrl: blob.downloadUrl
    });
  } catch (error) {
    console.error('Error uploading cover image:', error);
    return NextResponse.json(
      { error: 'Failed to upload cover image' },
      { status: 500 }
    );
  }
}
