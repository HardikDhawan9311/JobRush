import { useState } from "react";
import { X, MapPin, DollarSign, Briefcase, Calendar, Users, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { toast } from "sonner";

export function JobDetailsModal({ job, applicants, isOpen, onClose, onStatusUpdate, fetchingApplicants }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      const token = localStorage.getItem("token");
      // Note: We need to create this endpoint in the backend if we want it to work
      await axios.put(`http://localhost:5001/jobs/applications/${applicationId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Application ${newStatus}`);
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div>
              <h2 className="text-2xl font-bold mb-1">{job.title}</h2>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {job.company_name} • Posted on {new Date(job.posted_at).toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Job Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#3b82f6]">
                      <FileText className="w-5 h-5" /> Description
                    </h3>
                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                      {job.description || "No description provided."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-white/40 text-xs mb-1">Location</p>
                      <p className="font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-[#3b82f6]" /> {job.location}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-white/40 text-xs mb-1">Salary Range</p>
                      <p className="font-medium flex items-center gap-2"><DollarSign className="w-4 h-4 text-[#10b981]" /> ${job.salary_min} - ${job.salary_max}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-white/40 text-xs mb-1">Job Type</p>
                      <p className="font-medium">{job.job_type}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-white/40 text-xs mb-1">Experience</p>
                      <p className="font-medium">{job.experience_level}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#3b82f6]/10 to-[#8b5cf6]/10 border border-[#3b82f6]/20">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#3b82f6]" /> Stats
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Total Applicants</span>
                        <span className="text-xl font-bold text-[#3b82f6]">{applicants.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Openings</span>
                        <span className="font-bold">{job.openings}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs ${job.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {job.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3 text-sm text-white/40">REQUIRED SKILLS</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required?.split(',').map(skill => (
                        <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80">
                          {skill.trim()}
                        </span>
                      )) || <span className="text-white/40 text-xs">No skills listed</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicants Slider/Scroll */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#10b981]" /> Applicants
                  </h3>
                  <span className="text-white/40 text-sm">{applicants.length} applied</span>
                </div>

                {fetchingApplicants ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                    <p className="text-white/40">No applicants yet for this position.</p>
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-6 snap-x no-scrollbar">
                    {applicants.map((applicant) => (
                      <div 
                        key={applicant.id}
                        className="flex-shrink-0 w-80 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/30 transition-all snap-start"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3b82f6]/20 to-[#ef4444]/20 flex items-center justify-center border border-white/10 overflow-hidden">
                            {applicant.profile_image ? (
                              <img src={`http://localhost:5001${applicant.profile_image}`} alt={applicant.full_name} className="w-full h-full object-cover" />
                            ) : (
                              <Users className="w-6 h-6 text-[#3b82f6]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold truncate">{applicant.full_name}</h4>
                            <p className="text-xs text-white/40 truncate">{applicant.email}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Briefcase className="w-4 h-4" /> {applicant.experience || "Fresh Graduate"}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {applicant.skills?.split(',').slice(0, 3).map(skill => (
                              <span key={skill} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] border border-white/10">
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {applicant.resume_url ? (
                            <a 
                              href={`http://localhost:5001${applicant.resume_url}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium flex items-center justify-center gap-2 transition-all"
                            >
                              <ExternalLink className="w-3 h-3" /> Resume
                            </a>
                          ) : (
                            <div className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/20 text-center">No Resume</div>
                          )}
                          
                          <div className={`px-3 py-2 rounded-xl border text-xs font-medium capitalize flex items-center gap-1
                            ${applicant.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 
                              applicant.status === 'shortlisted' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
                              'bg-red-500/10 border-red-500/20 text-red-500'}
                          `}>
                            <Clock className="w-3 h-3" /> {applicant.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Helper icons for the modal
function FileText(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
