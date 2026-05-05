import { Link, useLocation } from "react-router";
import { Home, Briefcase, ClipboardList, User, LogIn } from "lucide-react";

export function MobileNav() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isActive = (path) => location.pathname === path;

  const profilePath = user 
    ? (user.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/candidate")
    : "/login";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0b14]/95 border-t border-white/10">
      <div className="flex items-center justify-around px-4 py-3">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            isActive('/') ? 'text-[#3b82f6]' : 'text-white/60'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/jobs"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            isActive('/jobs') ? 'text-[#3b82f6]' : 'text-white/60'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-xs">Jobs</span>
        </Link>
        <Link
          to="/applications"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            isActive('/applications') ? 'text-[#3b82f6]' : 'text-white/60'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-xs">Status</span>
        </Link>
        <Link
          to={profilePath}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            isActive(profilePath) ? 'text-[#3b82f6]' : 'text-white/60'
          }`}
        >
          {user ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
          <span className="text-xs">{user ? "Profile" : "Sign In"}</span>
        </Link>
      </div>
    </nav>
  );
}
