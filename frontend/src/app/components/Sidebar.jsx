import { Link, useLocation } from "react-router";
import { 
  Briefcase, 
  LayoutDashboard, 
  Search, 
  Heart, 
  Settings, 
  User,
  ChevronRight,
  ClipboardList
} from "lucide-react";

import { useUser } from "../context/UserContext";

import { useState, useEffect } from "react";
import api, { getAssetUrl } from "../utils/api";

export function Sidebar() {
  const location = useLocation();
  const { user, updateUser } = useUser();

  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        const res = await api.get("/user/profile");
        updateUser(res.data);
      } catch (err) {
        console.error("Error syncing user data:", err);
      }
    };
    fetchLatestUser();
  }, []);

  const isActive = (path) => location.pathname === path;

  const dashboardPath = user?.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/candidate";

  const allMenuItems = [
    { label: "Dashboard", path: dashboardPath, icon: LayoutDashboard },
    { label: "Find Jobs", path: "/jobs", icon: Search },
    { label: "Track Status", path: "/applications", icon: ClipboardList },
    { label: "Saved Jobs", path: "/saved", icon: Heart },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const menuItems = user?.role === "recruiter" 
    ? allMenuItems.filter(item => item.label !== "Find Jobs" && item.label !== "Saved Jobs" && item.label !== "Track Status")
    : allMenuItems;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-50 bg-[#0a0b14]/80 backdrop-blur-xl border-r border-white/10 p-6">
      <Link to="/" className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#10b981] flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          JobRush
        </span>
      </Link>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                active 
                  ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-colors ${active ? "text-white" : "text-white/40 group-hover:text-white"}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {active && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="pt-6 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#3b82f6]/20 flex items-center justify-center overflow-hidden border border-[#3b82f6]/30">
              {user.profile_image ? (
                <img src={getAssetUrl(user.profile_image)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-[#3b82f6]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.full_name}</p>
              <p className="text-xs text-white/40 truncate">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
