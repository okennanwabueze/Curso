import { NextResponse } from 'next/server';

// In a real application, this would be stored in a database
let userResume: {
  id: string;
  fileName: string;
  uploadDate: string;
  content: string;
} | null = null;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No resume file provided' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Upload the file to cloud storage (e.g., AWS S3)
    // 2. Parse the resume content using a resume parsing service
    // 3. Store the parsed data in a database
    
    // For now, we'll just store the file name and a mock upload date
    userResume = {
      id: Date.now().toString(),
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      content: 'Mock resume content', // In reality, this would be the parsed content
    };

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: userResume,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!userResume) {
    return NextResponse.json(
      { error: 'No resume found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ resume: userResume });
} 