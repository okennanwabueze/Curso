import { NextResponse } from 'next/server';
import { searchAllJobs } from '@/lib/jobBoards';
import { sendApplicationNotification } from '@/lib/emailService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const contractType = searchParams.get('contractType') || 'B2B';
  const country = searchParams.get('country') || 'Portugal';
  const isRemote = searchParams.get('isRemote') === 'true';
  
  try {
    const jobs = await searchAllJobs(query, {
      contractType,
      country,
      isRemote,
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobId, jobTitle, company, location } = body;
    
    // Send email notification
    await sendApplicationNotification({
      jobTitle,
      company,
      location,
      applicationDate: new Date().toISOString(),
      status: 'applied',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully and notification sent' 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 