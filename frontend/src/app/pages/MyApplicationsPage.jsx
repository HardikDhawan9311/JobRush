import { useState, useEffect } from "react";
import { Briefcase, Clock, CheckCircle2, XCircle, Calendar, Eye, ArrowLeft, Search, Filter, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { motion } from "motion/react";

export function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 30000); // Auto refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "hired":
        return (
          <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            HIRED
          </span>
        );
      case "shortlisted":
        return (
          <span className="px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold border border-purple-500/20 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            SHORTLISTED
          </span>
        );
      case "reviewed":
        return (
          <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold border border-blue-500/20 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" />
            REVIEWED
          </span>
        );
      case "pending":
        return (
          <span className="px-4 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            PENDING
          </span>
        );
      case "rejected":
        return (
          <span className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5" />
            REJECTED
          </span>
        );
      default:
        return (
          <span className="px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-xs font-bold border border-white/20">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(search.toLowerCase()) || 
                         app.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || app.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => navigate("/dashboard/candidate")}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              My <span className="text-[#3b82f6]">Applications</span>
            </h1>
            <p className="text-white/60 mt-2">You have applied to {applications.length} positions in total.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#3b82f6] transition-colors" />
              <input
                type="text"
                placeholder="Search by role or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-[#3b82f6]/50 outline-none w-full sm:w-64 transition-all"
              />
            </div>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#3b82f6] transition-colors" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-[#3b82f6]/50 outline-none w-full sm:w-48 transition-all appearance-none text-white/80"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-white/10 bg-white/5">
            <Briefcase className="w-16 h-16 text-white/10 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-2">No applications found</h3>
            <p className="text-white/40 max-w-md mx-auto">
              {search || filter !== "all" 
                ? "Try adjusting your search or filters to find what you're looking for." 
                : "You haven't applied to any jobs yet. Start exploring opportunities!"}
            </p>
            <Link to="/jobs" className="inline-block mt-8 px-8 py-3 rounded-2xl bg-[#3b82f6] text-white font-bold hover:shadow-lg hover:shadow-[#3b82f6]/30 transition-all">
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((app, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={app.application_id}
                onClick={() => navigate(`/jobs/${app.id}`)}
                className="p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/5 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3b82f6]/20 to-[#ef4444]/20 flex items-center justify-center border border-white/10 overflow-hidden shadow-xl group-hover:scale-105 transition-transform shrink-0">
                      <Briefcase className="w-7 h-7 text-[#3b82f6]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-[#3b82f6] transition-colors">{app.title}</h3>
                      <p className="text-white/60 font-medium">{app.company_name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {app.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(app.status)}
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Current Status</p>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="mt-12 pt-8 border-t border-white/5 overflow-x-auto pb-12">
                  <div className="flex items-center justify-between min-w-[700px] px-8">
                    {[
                      { id: 'pending', label: 'Applied' },
                      { id: 'reviewed', label: 'Reviewed' },
                      { id: 'shortlisted', label: 'Shortlisted' },
                      { id: 'hired', label: 'Hired' }
                    ].map((step, sIdx, steps) => {
                      // Logic for determining if a stage is "done"
                      const statusOrder = ['pending', 'reviewed', 'shortlisted', 'hired'];
                      const currentStatus = (app.status || "").toLowerCase().trim();
                      const currentStatusIndex = statusOrder.indexOf(currentStatus);
                      const isCompleted = sIdx <= currentStatusIndex;
                      
                      const isLast = sIdx === steps.length - 1;
                      const isRejected = currentStatus === 'rejected';

                      return (
                        <div key={step.id} className={`flex items-center ${!isLast ? 'flex-1' : ''}`}>
                          <div className="relative flex flex-col items-center group/step">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10
                              ${isRejected ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                                isCompleted ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 
                                'bg-red-500/10 border-red-500/50 text-red-500'}
                            `}>
                              {isRejected ? <XCircle className="w-5 h-5" /> :
                               isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                               <span className="text-xs font-bold">{sIdx + 1}</span>}
                            </div>
                            
                            <div className="absolute -bottom-8 flex flex-col items-center">
                              <span className={`text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors px-2 py-0.5 rounded-md
                                ${isRejected ? 'text-red-500 bg-red-500/10' : 
                                  isCompleted ? 'text-green-500 bg-green-500/10' : 
                                  'text-red-500/40 bg-red-500/5'}
                              `}>
                                {isRejected ? 'REJECTED' : step.label.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          {!isLast && (
                            <div className={`h-1 flex-1 mx-[-5px] transition-all duration-700 relative
                              ${isRejected ? 'bg-red-500/30' : 
                                isCompleted && (sIdx < currentStatusIndex) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-red-500/10'}
                            `}>
                              {(isCompleted && sIdx < currentStatusIndex) && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
