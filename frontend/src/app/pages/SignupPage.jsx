import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Mail, Lock, User, Briefcase, Users, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api from "../utils/api";


export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState(searchParams.get("role") || "candidate");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && (roleParam === "candidate" || roleParam === "recruiter")) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/send-otp", { email });
      if (res.status === 200) {
        setShowOTP(true);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Connection error. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (role === "recruiter" && !showOTP) {
      toast.error("Please verify your email with OTP first");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        full_name: name,
        email,
        password,
        role,
        otp: role === "recruiter" ? otp : undefined,
      });

      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Account created successfully!");
      navigate(role === "candidate" ? "/dashboard/candidate" : "/dashboard/recruiter");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-8">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#10b981]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#10b981] flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Join JobRush
          </h1>
          <p className="text-white/60">Create your account and start your journey</p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl glass-card">
          <div className="mb-6">
            <label className="block text-sm mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setRole("candidate");
                  setShowOTP(false);
                }}
                className={`p-4 rounded-xl border transition-all ${
                  role === "candidate"
                    ? "bg-[#3b82f6]/20 border-[#3b82f6]"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`p-4 rounded-xl border transition-all ${
                  role === "recruiter"
                    ? "bg-[#ef4444]/20 border-[#ef4444]"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Recruiter</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#3b82f6] transition-colors">
                <User className="w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#3b82f6] transition-colors">
                <Mail className="w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#3b82f6] transition-colors">
                <Lock className="w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
                  required
                />
              </div>
            </div>

            {role === "recruiter" && (
              <div className="space-y-4">
                {!showOTP ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 hover:bg-[#3b82f6]/30 transition-all text-sm font-medium"
                  >
                    {loading ? "Sending..." : "Verify Email with OTP"}
                  </button>
                ) : (
                  <div>
                    <label className="block text-sm mb-2">Enter OTP</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-[#3b82f6] transition-colors">
                      <ShieldCheck className="w-5 h-5 text-[#3b82f6]" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit code"
                        className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="mt-2 text-xs text-[#3b82f6] hover:underline"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Resend OTP"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:shadow-2xl hover:shadow-[#3b82f6]/50 transition-all font-bold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3b82f6] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
