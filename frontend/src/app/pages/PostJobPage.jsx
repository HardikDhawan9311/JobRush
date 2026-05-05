import { useState, useEffect } from "react";
import { Briefcase, MapPin, DollarSign, ArrowLeft, Send, Save } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import api from "../utils/api";
import { toast } from "sonner";

export function PostJobPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    salary_min: "",
    salary_max: "",
    job_type: "Full-time",
    experience_level: "Fresher",
    category: "",
    skills_required: "",
    description: "",
    openings: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (editId) {
      fetchJobDetails();
    }
  }, [editId]);

  const fetchJobDetails = async () => {
    setFetching(true);
    try {
      const res = await api.get(`/jobs/${editId}`);
      const job = res.data;
      setFormData({
        title: job.title || "",
        company_name: job.company_name || "",
        location: job.location || "",
        salary_min: job.salary_min || "",
        salary_max: job.salary_max || "",
        job_type: job.job_type || "Full-time",
        experience_level: job.experience_level || "Fresher",
        category: job.category || "",
        skills_required: job.skills_required || "",
        description: job.description || "",
        openings: job.openings || 1,
        status: job.status || "active"
      });
    } catch (err) {
      toast.error("Failed to fetch job details");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/jobs/${editId}`, formData);
        toast.success("Job updated successfully!");
        navigate(`/dashboard/recruiter/jobs/${editId}`);
      } else {
        await api.post("/jobs", formData);
        toast.success("Job posted successfully!");
        navigate("/dashboard/recruiter");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <button 
          onClick={() => navigate("/dashboard/recruiter")}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
            <Briefcase className="w-10 h-10 text-[#3b82f6]" />
            {editId ? "Edit" : "Post a New"} <span className="text-[#3b82f6]">Job</span>
          </h1>
          <p className="text-white/60">
            {editId ? "Update the details of your job posting" : "Fill in the details to find your next great hire"}
          </p>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                    placeholder="e.g., Senior React Developer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                    placeholder="e.g., TechCorp Inc"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                    placeholder="e.g., Remote or New York, NY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Job Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                    placeholder="e.g., Engineering, Marketing"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Salary & Type Section */}
            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#10b981] rounded-full"></span>
                Salary & Job Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Min Salary
                    </label>
                    <input
                      type="number"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Max Salary
                    </label>
                    <input
                      type="number"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                      placeholder="e.g., 80000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Job Type</label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    className="w-full bg-[#0a0b14] border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Experience Level</label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full bg-[#0a0b14] border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Number of Openings</label>
                  <input
                    type="number"
                    name="openings"
                    value={formData.openings}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#8b5cf6] rounded-full"></span>
                Requirements & Description
              </h2>
              <div className="space-y-6">
                {editId && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Job Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-[#0a0b14] border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Skills Required (Comma separated)</label>
                  <input
                    type="text"
                    name="skills_required"
                    value={formData.skills_required}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                    placeholder="e.g., React, Node.js, TypeScript"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Detailed Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all resize-none"
                    placeholder="Describe the role, expectations, and benefits..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] font-bold text-xl hover:shadow-2xl hover:shadow-[#3b82f6]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {editId ? <Save className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                {loading ? (editId ? "Updating..." : "Posting Job...") : (editId ? "Save Changes" : "Publish Job Posting")}
              </button>
              <button
                type="button"
                onClick={() => navigate(editId ? `/dashboard/recruiter/jobs/${editId}` : "/dashboard/recruiter")}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}
