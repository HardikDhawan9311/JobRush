import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Briefcase, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp: showOTP ? otp : undefined }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.message === "OTP_SENT") {
          setShowOTP(true);
          toast.info("OTP sent to your email for recruiter verification");
        } else {
          localStorage.setItem("token", data.token);
          updateUser(data.user);
          toast.success("Login successful!");
          navigate(data.user.role === "candidate" ? "/dashboard/candidate" : "/dashboard/recruiter");
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Connection error. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        toast.success("A new OTP has been sent to your email");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#10b981]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome Back
          </h1>
          <p className="text-white/60">Sign in to continue your job search</p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl glass-card">
          <form onSubmit={handleLogin} className="space-y-6">
            {!showOTP ? (
              <>
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
              </>
            ) : (
              <div>
                <label className="block text-sm mb-2 text-[#3b82f6]">Enter Recruiter OTP</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-[#3b82f6] transition-colors">
                  <ShieldCheck className="w-5 h-5 text-[#3b82f6]" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit code"
                    className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
                    required
                    autoFocus
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={() => setShowOTP(false)}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    ← Back to login
                  </button>
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={loading}
                    className="text-xs text-[#3b82f6] hover:underline font-medium"
                  >
                    {loading ? "Resending..." : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:shadow-2xl hover:shadow-[#3b82f6]/50 transition-all font-bold disabled:opacity-50"
            >
              {loading ? "Processing..." : (showOTP ? "Verify & Sign In" : "Sign In")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#3b82f6] hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
