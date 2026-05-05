import { Link, useLocation, useNavigate } from "react-router";
import { Briefcase, User, Heart, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const dashboardPath = user?.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/candidate";

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0b14]/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#10b981] flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              JobRush
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/jobs"
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive('/jobs')
                  ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
                  : 'hover:bg-white/5'
              }`}
            >
              Find Jobs
            </Link>
            <Link
              to="/saved"
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive('/saved')
                  ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
                  : 'hover:bg-white/5'
              }`}
            >
              Saved Jobs
            </Link>

            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    isActive(dashboardPath)
                      ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 text-white/80"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:shadow-lg hover:shadow-[#3b82f6]/50 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
