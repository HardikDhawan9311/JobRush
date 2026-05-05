import { useState, useEffect } from "react";
import { Upload, FileText, Briefcase, Heart, Clock, CheckCircle2, XCircle, Calendar, User, Settings, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export function CandidateDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchApplications();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/jobs/applications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Applications", value: applications.length, icon: Briefcase, color: "#3b82f6" },
    { label: "Shortlisted", value: applications.filter(a => a.status === 'shortlisted').length, icon: Calendar, color: "#8b5cf6" },
    { label: "Hired", value: applications.filter(a => a.status === 'hired').length, icon: CheckCircle2, color: "#10b981" }
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "hired":
        return (
          <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 text-sm border border-green-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Hired
          </span>
        );
      case "shortlisted":
        return (
          <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-500 text-sm border border-purple-500/20 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Shortlisted
          </span>
        );
      case "reviewed":
        return (
          <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-sm border border-blue-500/20 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Reviewed
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 text-sm border border-yellow-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Applied
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-sm border border-red-500/20 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-lg bg-white/10 text-white/60 text-sm border border-white/20">
            {status}
          </span>
        );
    }
  };

  const calculateCompletion = () => {
    if (!user) return 0;
    const fields = [
      user.full_name,
      user.email,
      user.phone,
      user.bio,
      user.skills,
      user.experience,
      user.location,
      user.profile_image,
      user.resume_url
    ];
    const completedFields = fields.filter(field => field && field.toString().trim() !== "").length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateCompletion();

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Welcome Back, <span className="text-[#3b82f6]">{user?.full_name || "Candidate"}</span>
            </h1>
            <p className="text-white/60">Track your applications and manage your profile</p>
          </div>
        </div>

        {profileCompletion < 100 && (
          <div 
            onClick={() => navigate("/profile")}
            className="mb-8 p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-[#3b82f6]/10 to-[#10b981]/10 border border-white/10 cursor-pointer hover:border-[#3b82f6]/50 transition-all group/progress"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Profile Completion</span>
              <span className="text-sm font-semibold group-hover/progress:text-[#3b82f6] transition-colors">{profileCompletion}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            {profileCompletion < 100 && (
              <p className="text-sm text-white/80 mt-3">
                Complete your profile to increase your visibility to recruiters.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/50 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Applications</h2>
              <Link to="/applications" className="text-[#3b82f6] hover:underline text-sm">
                View all
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.length === 0 ? (
                <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                  <p className="text-white/40">You haven't applied for any jobs yet.</p>
                </div>
              ) : (
                applications.slice(0, 6).map((app) => (
                  <div
                    key={app.application_id}
                    className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/50 transition-all cursor-pointer"
                    onClick={() => navigate(`/jobs/${app.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{app.title}</h3>
                        <p className="text-sm text-white/60">{app.company_name}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-white/40">Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
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
