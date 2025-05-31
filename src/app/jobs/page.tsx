'use client';

import { useState } from 'react';
import { Search, Briefcase, Upload, Send, MapPin, Building2, BriefcaseIcon } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  postedDate: string;
  contractType: 'B2B' | 'Full-time' | 'Contract';
  isRemote: boolean;
  country: string;
  requirements: string[];
}

const TARGET_ROLES = [
  'Customer Success Manager',
  'Product Analyst',
  'Product Owner',
  'Data Analyst',
  'CSM',
  'Customer Success',
  'Product Management',
  'Business Analyst'
];

const COUNTRIES = ['Portugal', 'United States', 'United Kingdom', 'Remote'];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    contractType: 'B2B',
    country: 'Portugal',
    isRemote: true,
    targetRoles: TARGET_ROLES
  });

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/jobs?q=${searchQuery}&contractType=${filters.contractType}&country=${filters.country}&isRemote=${filters.isRemote}`);
      const data = await response.json();
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
    }
  };

  const handleQuickApply = async (job: Job) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          location: job.location,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Search & Apply</h1>
          <p className="mt-2 text-gray-600">Find B2B and remote opportunities in Portugal and beyond</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for jobs..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-500" />
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.contractType}
                  onChange={(e) => setFilters({ ...filters, contractType: e.target.value as 'B2B' | 'Full-time' | 'Contract' })}
                >
                  <option value="B2B">B2B Contract</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                >
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5 text-gray-500" />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.isRemote}
                    onChange={(e) => setFilters({ ...filters, isRemote: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  Remote Only
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Resume</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Drag and drop your resume here, or click to browse</p>
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
            />
            <label
              htmlFor="resume-upload"
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer inline-block"
            >
              Upload Resume
            </label>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Searching for jobs...</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                      {job.isRemote && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Remote</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickApply(job)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Quick Apply
                  </button>
                </div>
                <p className="mt-4 text-gray-700">{job.description}</p>
                {job.requirements && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900">Requirements:</h4>
                    <ul className="list-disc list-inside mt-2 text-gray-600">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.salary}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {job.contractType}
                  </span>
                  <span>Posted: {job.postedDate}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 