import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { JobCard } from "../components/JobCard";
import axios from "axios";
import { toast } from "sonner";

export function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/jobs/saved", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(res.data);
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:5001/jobs/${jobId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.data.saved) {
        setSavedJobs(prev => prev.filter(job => job.id !== jobId));
        toast.info("Job removed from saved");
      }
    } catch (err) {
      console.error("Error unsaving job:", err);
      toast.error("Failed to update");
    }
  };

  const activeSavedJobs = savedJobs;

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
            <Heart className="w-10 h-10 text-[#ef4444] fill-current" />
            Saved <span className="text-[#ef4444]">Jobs</span>
          </h1>
          <p className="text-white/60">
            {activeSavedJobs.length} {activeSavedJobs.length === 1 ? 'job' : 'jobs'} saved for later
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#ef4444] animate-spin" />
            <p className="text-white/40">Loading your saved jobs...</p>
          </div>
        ) : activeSavedJobs.length > 0 ? (
          <div className="space-y-6">
            {activeSavedJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.company_name}
                location={job.location}
                salary={`$${job.salary_min} - $${job.salary_max}`}
                type={job.job_type}
                tags={job.skills_required?.split(',') || []}
                isSaved={true}
                onSave={() => handleSave(job.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white/5 flex items-center justify-center">
              <Heart className="w-12 h-12 text-white/40" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No saved jobs yet</h2>
            <p className="text-white/60 mb-8">
              Start saving jobs you're interested in to view them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
