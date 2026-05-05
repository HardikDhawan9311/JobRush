import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { 
  ArrowLeft, Edit3, Trash2, MapPin, DollarSign, Briefcase, 
  Users, Clock, CheckCircle2, XCircle, ExternalLink, Mail, Phone, Eye,
  ChevronLeft, ChevronRight, Download
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "motion/react";

export function JobManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = 4; // Showing 4 applicants per page (2x2 grid)

  useEffect(() => {
    fetchJobDetails();
    fetchApplicants();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5001/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJob(res.data);
    } catch (err) {
      console.error("Error fetching job:", err);
      toast.error("Failed to load job details");
    }
  };

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5001/jobs/${id}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants(res.data);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5001/jobs/applications/${applicationId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Application marked as ${newStatus}`);
      fetchApplicants();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleExport = () => {
    const exportedApplicants = applicants.filter(a => a.status === 'shortlisted' || a.status === 'hired');
    
    if (exportedApplicants.length === 0) {
      toast.error("No shortlisted or hired candidates to export");
      return;
    }

    const headers = ["Candidate Name", "Email", "Location", "Status", "Resume URL"];
    const csvRows = exportedApplicants.map(a => [
      a.full_name,
      a.email,
      a.location || "N/A",
      a.status,
      a.resume_url ? `http://localhost:5001${a.resume_url}` : "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.title}_Selected_Applicants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Exported successfully");
  };

  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Job deleted");
      navigate("/dashboard/recruiter");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) return <div className="text-center py-20 text-white/40 text-xl">Job not found</div>;

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate("/dashboard/recruiter")}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          
          <div className="flex gap-3">
            <Link
              to={`/post-job?edit=${id}`}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/10 transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-[#3b82f6]" />
              Edit Job
            </Link>
            <button
              onClick={handleDeleteJob}
              className="px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Info Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {job.status.toUpperCase()}
                </span>
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6]/20 to-[#ef4444]/20 flex items-center justify-center mb-6 border border-white/10">
                <Briefcase className="w-8 h-8 text-[#3b82f6]" />
              </div>

              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              <p className="text-white/60 mb-6">{job.company_name}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#3b82f6]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#10b981]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span>${job.salary_min} - ${job.salary_max}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#8b5cf6]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>{job.job_type} • {job.experience_level}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <h3 className="text-sm font-bold text-white/40 mb-4 uppercase tracking-wider">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required?.split(',').map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3b82f6]" />
                Job Description
              </h3>
              <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          {/* Applicants Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8 text-[#10b981]" />
                Applicants List
              </h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981] hover:text-white transition-all text-sm font-bold"
                >
                  <Download className="w-4 h-4" />
                  Export Selected
                </button>
                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
                  {applicants.length} Total
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'shortlisted', 'hired', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap border ${
                    activeTab === tab 
                      ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-lg shadow-[#3b82f6]/20" 
                      : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {tab} ({
                    tab === 'all' 
                      ? applicants.length 
                      : applicants.filter(a => a.status === tab).length
                  })
                </button>
              ))}
            </div>

            {applicants.length === 0 ? (
              <div className="p-20 text-center rounded-3xl border border-dashed border-white/10 bg-white/5">
                <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40">No one has applied for this job yet.</p>
              </div>
            ) : applicants.filter(a => activeTab === 'all' || a.status === activeTab).length === 0 ? (
              <div className="p-20 text-center rounded-3xl border border-dashed border-white/10 bg-white/5">
                <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40">No candidates in {activeTab} yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider text-white/40">
                  <div className="col-span-3">Candidate</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-2 text-center">Experience</div>
                  <div className="col-span-2 text-center">Applied Date</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>

                <div className="space-y-3">
                  {applicants
                    .filter(a => activeTab === 'all' || a.status === activeTab)
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((applicant) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={applicant.application_id}
                      onClick={() => navigate(`/candidate/${applicant.user_id}`)}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/5 transition-all cursor-pointer group"
                    >
                      <div className="col-span-1 md:col-span-3 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 flex items-center justify-center border border-white/10 overflow-hidden shadow-sm">
                          {applicant.profile_image ? (
                            <img src={`http://localhost:5001${applicant.profile_image}`} alt={applicant.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-5 h-5 text-[#3b82f6]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold truncate group-hover:text-[#3b82f6] transition-colors">{applicant.full_name}</h4>
                          <p className="text-[10px] text-white/40 truncate">{applicant.email}</p>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex justify-center">
                        <span className={`text-[10px] uppercase font-bold px-4 py-1.5 rounded-full border shadow-sm transition-all
                          ${applicant.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 
                            applicant.status === 'reviewed' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                            applicant.status === 'shortlisted' ? 'bg-purple-500/10 border-purple-500/30 text-purple-500' : 
                            applicant.status === 'hired' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                            'bg-red-500/10 border-red-500/30 text-red-500'}
                        `}>
                          {applicant.status}
                        </span>
                      </div>

                      <div className="col-span-1 md:col-span-2 text-center text-sm text-white/60">
                        {applicant.experience || "0"} Years
                      </div>

                      <div className="col-span-1 md:col-span-2 text-center text-sm text-white/40">
                        {new Date(applicant.applied_at).toLocaleDateString()}
                      </div>

                      <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {applicant.resume_url && (
                          <a 
                            href={`http://localhost:5001${applicant.resume_url}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#3b82f6] hover:border-[#3b82f6]/50 transition-all"
                            title="View Resume"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <div className="flex gap-1">
                          {applicant.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateStatus(applicant.application_id, 'reviewed')}
                              title="Mark as Reviewed"
                              className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {applicant.status !== 'hired' && applicant.status !== 'rejected' && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(applicant.application_id, 'shortlisted')}
                                title="Shortlist"
                                className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(applicant.application_id, 'hired')}
                                title="Hire"
                                className="p-2 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"
                              >
                                <Briefcase className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleUpdateStatus(applicant.application_id, 'rejected')}
                            title="Reject"
                            className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {applicants.length > itemsPerPage && (
                  <div className="flex items-center justify-center gap-4 pt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.ceil(applicants.length / itemsPerPage) }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${
                            currentPage === i + 1 
                              ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30" 
                              : "bg-white/5 border border-white/10 text-white/40 hover:text-white"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(applicants.length / itemsPerPage), p + 1))}
                      disabled={currentPage === Math.ceil(applicants.length / itemsPerPage)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
