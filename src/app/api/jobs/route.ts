import { NextResponse } from 'next/server';

// Mock job data - In a real application, this would come from job APIs
const mockJobs = [
  {
    id: '1',
    title: 'Senior Customer Success Manager',
    company: 'Tech Corp',
    location: 'Lisbon, Portugal',
    description: 'Looking for an experienced CSM to manage enterprise clients. Must have experience with SaaS products and strong communication skills.',
    salary: '€45k - €65k',
    postedDate: '2024-03-20',
    contractType: 'B2B',
    isRemote: true,
    country: 'Portugal',
    requirements: [
      '5+ years of customer success experience',
      'Experience with enterprise clients',
      'Strong communication skills',
      'Fluent in English and Portuguese'
    ]
  },
  {
    id: '2',
    title: 'Product Analyst',
    company: 'StartupX',
    location: 'Remote',
    description: 'Join our fast-growing startup as a Product Analyst. Experience with data analysis and product metrics required.',
    salary: '€40k - €55k',
    postedDate: '2024-03-19',
    contractType: 'B2B',
    isRemote: true,
    country: 'Portugal',
    requirements: [
      '3+ years of product analytics experience',
      'Strong SQL skills',
      'Experience with data visualization tools',
      'Understanding of product metrics'
    ]
  },
  {
    id: '3',
    title: 'Product Owner',
    company: 'Global Tech',
    location: 'Porto, Portugal',
    description: 'Seeking a Product Owner to drive product development and strategy.',
    salary: '€50k - €70k',
    postedDate: '2024-03-18',
    contractType: 'B2B',
    isRemote: false,
    country: 'Portugal',
    requirements: [
      '5+ years of product management experience',
      'Agile/Scrum certification',
      'Strong technical background',
      'Experience with B2B products'
    ]
  },
  {
    id: '4',
    title: 'Data Analyst',
    company: 'Data Insights Co',
    location: 'Remote',
    description: 'Looking for a Data Analyst to help drive business decisions through data analysis.',
    salary: '€35k - €50k',
    postedDate: '2024-03-17',
    contractType: 'B2B',
    isRemote: true,
    country: 'Portugal',
    requirements: [
      '3+ years of data analysis experience',
      'Strong SQL and Python skills',
      'Experience with BI tools',
      'Business acumen'
    ]
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const contractType = searchParams.get('contractType') || 'B2B';
  const country = searchParams.get('country') || 'Portugal';
  const isRemote = searchParams.get('isRemote') === 'true';
  
  // In a real application, this would make API calls to job search services
  const filteredJobs = mockJobs.filter(job => {
    const matchesQuery = 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase());
    
    const matchesContract = job.contractType === contractType;
    const matchesCountry = job.country === country;
    const matchesRemote = !isRemote || job.isRemote;

    return matchesQuery && matchesContract && matchesCountry && matchesRemote;
  });

  return NextResponse.json({ jobs: filteredJobs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real application, this would handle job application submission
    // For now, we'll just return a success message
    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 