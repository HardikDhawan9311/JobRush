import { useNavigate } from "react-router";
import { Settings, User, Lock, LogOut } from "lucide-react";
import { toast } from "sonner";

export function SettingsPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const sections = [
    { 
      title: "Account", 
      icon: User, 
      description: "Manage your personal information and profile settings",
      onClick: () => navigate("/profile")
    },
    { 
      title: "Password", 
      icon: Lock, 
      description: "Change your password with OTP verification",
      onClick: () => navigate("/change-password")
    },
    { 
      title: "Logout", 
      icon: LogOut, 
      description: "Securely sign out of your account",
      onClick: handleLogout
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
            <Settings className="w-10 h-10 text-[#3b82f6]" />
            Settings
          </h1>
          <p className="text-white/60">Manage your account preferences and security</p>
        </div>

        <div className="grid gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              onClick={section.onClick}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center border border-[#3b82f6]/20 group-hover:scale-110 transition-transform">
                  <section.icon className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{section.title}</h3>
                  <p className="text-sm text-white/60">{section.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
