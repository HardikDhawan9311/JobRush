import { useState, useEffect } from "react";
import { Plus, Briefcase, Users, Eye, CheckCircle2, XCircle, Calendar, MapPin, DollarSign, Trash2 } from "lucide-react";
import api from "../utils/api";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router";

export function RecruiterDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [statsData, setStatsData] = useState({
    active_jobs: 0,
    total_applicants: 0,
    hired: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecruiterData();
    fetchJobs();
    fetchStats();
  }, []);

  const fetchRecruiterData = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching recruiter data:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/recruiter");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/jobs/stats");
      setStatsData(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleJobClick = (job) => {
    navigate(`/dashboard/recruiter/jobs/${job.id}`);
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      fetchJobs();
      fetchStats();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  const stats = [
    { label: "Active Jobs", value: statsData.active_jobs, icon: Briefcase, color: "#3b82f6" },
    { label: "Total Applicants", value: statsData.total_applicants, icon: Users, color: "#ef4444" },
    { label: "Hired", value: statsData.hired, icon: CheckCircle2, color: "#10b981" }
  ];

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Welcome Back, <span className="text-[#3b82f6]">{user?.full_name || "Recruiter"}</span>
            </h1>
            <p className="text-white/60">Manage your job postings and candidates</p>
          </div>
          <Link
            to="/post-job"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:shadow-2xl hover:shadow-[#3b82f6]/50 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </Link>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/50 transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-7 h-7" style={{ color: stat.color }} />
                </div>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-white/40 font-medium uppercase tracking-wider text-xs">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#3b82f6]" />
              Your Job Postings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.length === 0 ? (
                <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                  <p className="text-white/40">You haven't posted any jobs yet.</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobClick(job)}
                    className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/50 transition-all relative group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 pr-12">
                        <h3 className="font-bold text-xl mb-1">{job.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/60">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary_min}-{job.salary_max}</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs">{job.job_type}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob(job.id);
                        }}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-white/40">Posted on {new Date(job.posted_at).toLocaleDateString()}</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${job.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500'}`}>
                        {job.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
