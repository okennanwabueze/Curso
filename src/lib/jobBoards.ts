import axios from 'axios';

interface JobSource {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  postedDate: string;
  contractType: string;
  isRemote: boolean;
  country: string;
  requirements: string[];
  source: string;
  applyUrl: string;
}

const isWithinHours = (date: string, hours: number): boolean => {
  const jobDate = new Date(date);
  const now = new Date();
  const diffInHours = (now.getTime() - jobDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= hours;
};

const searchLinkedIn = async (query: string, filters: any): Promise<JobSource[]> => {
  try {
    const response = await axios.get('https://api.linkedin.com/v2/jobs', {
      params: {
        keywords: query,
        location: filters.country,
        remote: filters.isRemote,
        postedTime: 'PAST_24_HOURS',
      },
      headers: {
        'Authorization': `Bearer ${process.env.LINKEDIN_API_KEY}`,
      },
    });

    return response.data.elements.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company.name,
      location: job.location,
      description: job.description,
      salary: job.salary?.range,
      postedDate: job.postedAt,
      contractType: job.employmentStatus,
      isRemote: job.remote,
      country: job.location.country,
      requirements: job.requirements || [],
      source: 'LinkedIn',
      applyUrl: job.applyUrl,
    }));
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return [];
  }
};

const searchIndeed = async (query: string, filters: any): Promise<JobSource[]> => {
  try {
    const response = await axios.get('https://api.indeed.com/v2/jobs', {
      params: {
        query,
        location: filters.country,
        remote: filters.isRemote,
        fromage: 1, // Last 24 hours
      },
      headers: {
        'Authorization': `Bearer ${process.env.INDEED_API_KEY}`,
      },
    });

    return response.data.results.map((job: any) => ({
      id: job.jobkey,
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      description: job.snippet,
      salary: job.salary,
      postedDate: job.date,
      contractType: job.jobtype,
      isRemote: job.remote,
      country: filters.country,
      requirements: job.requirements || [],
      source: 'Indeed',
      applyUrl: job.url,
    }));
  } catch (error) {
    console.error('Indeed API error:', error);
    return [];
  }
};

const searchWeWorkRemotely = async (query: string, filters: any): Promise<JobSource[]> => {
  try {
    const response = await axios.get('https://weworkremotely.com/api/v1/jobs', {
      params: {
        search: query,
        category: 'all',
        region: filters.country,
      },
    });

    return response.data.jobs
      .filter((job: any) => isWithinHours(job.posted_at, 24))
      .map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        location: job.location,
        description: job.description,
        salary: job.salary,
        postedDate: job.posted_at,
        contractType: job.contract_type,
        isRemote: true,
        country: filters.country,
        requirements: job.requirements || [],
        source: 'WeWorkRemotely',
        applyUrl: job.url,
      }));
  } catch (error) {
    console.error('WeWorkRemotely API error:', error);
    return [];
  }
};

const searchGoogleJobs = async (query: string, filters: any): Promise<JobSource[]> => {
  try {
    const response = await axios.get('https://www.googleapis.com/jobs/v3/search', {
      params: {
        query: `${query} ${filters.country} ${filters.isRemote ? 'remote' : ''}`,
        location: filters.country,
        datePosted: 'PAST_24_HOURS',
      },
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_JOBS_API_KEY}`,
      },
    });

    return response.data.jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.companyName,
      location: job.location,
      description: job.description,
      salary: job.salary,
      postedDate: job.postedAt,
      contractType: job.employmentType,
      isRemote: job.remote,
      country: filters.country,
      requirements: job.requirements || [],
      source: 'Google Jobs',
      applyUrl: job.applyUrl,
    }));
  } catch (error) {
    console.error('Google Jobs API error:', error);
    return [];
  }
};

export const searchAllJobs = async (query: string, filters: any): Promise<JobSource[]> => {
  try {
    const [linkedInJobs, indeedJobs, weWorkRemotelyJobs, googleJobs] = await Promise.all([
      searchLinkedIn(query, filters),
      searchIndeed(query, filters),
      searchWeWorkRemotely(query, filters),
      searchGoogleJobs(query, filters),
    ]);

    const allJobs = [...linkedInJobs, ...indeedJobs, ...weWorkRemotelyJobs, ...googleJobs];
    
    // Filter jobs posted within the last 24 hours
    const recentJobs = allJobs.filter(job => isWithinHours(job.postedDate, 24));
    
    // Sort by most recent first
    return recentJobs.sort((a, b) => 
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );
  } catch (error) {
    console.error('Error searching jobs:', error);
    return [];
  }
}; 