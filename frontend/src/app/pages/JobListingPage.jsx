import { useState, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal, Loader2 } from "lucide-react";
import { JobCard } from "../components/JobCard";
import axios from "axios";
import { toast } from "sonner";

export function JobListingPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    salaryRange: [0, 200000]
  });

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, [searchQuery, locationQuery, filters]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/all`, {
        params: {
          title: searchQuery,
          location: locationQuery,
          jobType: filters.jobType.join(','),
          experience: filters.experience.join(','),
          maxSalary: filters.salaryRange[1]
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(new Set(res.data.map(job => job.id)));
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  };

  const handleSave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/jobs/${jobId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSavedJobs(prev => {
        const newSet = new Set(prev);
        if (res.data.saved) {
          newSet.add(jobId);
          toast.success("Job saved successfully");
        } else {
          newSet.delete(jobId);
          toast.info("Job removed from saved");
        }
        return newSet;
      });
    } catch (err) {
      console.error("Error saving job:", err);
      toast.error("Failed to save job");
    }
  };

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      experience: [],
      salaryRange: [0, 200000]
    });
    setSearchQuery("");
    setLocationQuery("");
  };

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Find Your <span className="text-[#3b82f6]">Perfect Job</span>
          </h1>
          <p className="text-white/60">Browse through {jobs.length} available positions</p>
        </div>

        <div className="mb-8 p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#3b82f6] transition-colors">
              <Search className="w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Job title, skills, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
              />
            </div>

            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#3b82f6] transition-colors">
              <MapPin className="w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="sticky top-24 p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 space-y-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </h3>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Job Type</h4>
                <div className="space-y-2">
                  {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => toggleFilter("jobType", type)}
                        className="w-4 h-4 rounded bg-white/5 border border-white/20 checked:bg-[#3b82f6]"
                      />
                      <span className="text-sm text-white/80">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Experience Level</h4>
                <div className="space-y-2">
                  {["Fresher", "Junior", "Mid", "Senior"].map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.experience.includes(level)}
                        onChange={() => toggleFilter("experience", level)}
                        className="w-4 h-4 rounded bg-white/5 border border-white/20 checked:bg-[#3b82f6]"
                      />
                      <span className="text-sm text-white/80">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-4">Salary Range</h4>
                <div className="space-y-5 px-1">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={filters.salaryRange[1]}
                    onChange={(e) => setFilters({...filters, salaryRange: [0, parseInt(e.target.value)]})}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#3b82f6] hover:accent-[#2563eb] transition-all"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Budget</span>
                    <div className="px-3 py-1 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-sm font-bold">
                      Up to ${(filters.salaryRange[1] / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={clearFilters}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-[#3b82f6] animate-spin" />
                <p className="text-white/40">Fetching latest jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 p-8 rounded-3xl border border-dashed border-white/10 bg-white/5">
                <p className="text-white/40 text-lg">No jobs found matching your criteria.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company_name}
                  location={job.location}
                  salary={`$${job.salary_min} - $${job.salary_max}`}
                  type={job.job_type}
                  tags={job.skills_required?.split(',') || []}
                  isSaved={savedJobs.has(job.id)}
                  hasApplied={job.hasApplied}
                  onSave={() => handleSave(job.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
