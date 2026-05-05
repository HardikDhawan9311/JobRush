import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { MapPin, DollarSign, Briefcase, Heart, Upload, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchJobDetails();
    fetchUserProfile();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5001/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJob(res.data);
    } catch (err) {
      console.error("Error fetching job details:", err);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const handleApply = async () => {
    if (!user?.resume_url) {
      toast.error("Please upload your resume in your profile before applying");
      navigate("/profile");
      return;
    }

    setApplying(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5001/jobs/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJob(prev => ({ ...prev, hasApplied: true }));
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#3b82f6] animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-xl">Job not found</p>
        <Link to="/jobs" className="text-[#3b82f6] hover:underline">Back to listings</Link>
      </div>
    );
  }

  const skills = job.skills_required?.split(',') || [];

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-[#3b82f6] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </Link>

        <div className="p-6 sm:p-8 rounded-2xl glass-card mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#3b82f6]/20 to-[#ef4444]/20 flex items-center justify-center flex-shrink-0 border border-white/10">
              <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-[#3b82f6]" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {job.title}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleApply}
                  disabled={applying || job.hasApplied}
                  className={`px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 ${
                    job.hasApplied 
                      ? "bg-green-500/20 border border-green-500/50 text-green-500" 
                      : "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:shadow-2xl hover:shadow-[#3b82f6]/50"
                  }`}
                >
                  {applying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {applying ? "Applying..." : job.hasApplied ? "Applied" : "Apply Now"}
                </button>

                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`px-6 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-sm ${
                    isSaved
                      ? "bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444]"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? "Saved" : "Save Job"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {skills.length > 0 && (
            <div className="p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
              <h2 className="text-2xl font-semibold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-xl bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 text-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-white/40 text-sm">Experience Level</p>
                <p className="font-medium">{job.experience_level}</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/40 text-sm">Job Category</p>
                <p className="font-medium">{job.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/40 text-sm">Openings</p>
                <p className="font-medium">{job.openings}</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/40 text-sm">Posted Date</p>
                <p className="font-medium">{new Date(job.posted_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
