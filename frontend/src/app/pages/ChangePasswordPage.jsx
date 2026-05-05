import { useState } from "react";
import { Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/auth/send-otp", { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5001/auth/update-password", {
        email,
        otp,
        newPassword
      });
      toast.success("Password changed successfully!");
      setTimeout(() => navigate("/settings"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
            <Lock className="w-10 h-10 text-[#3b82f6]" />
            Change <span className="text-[#3b82f6]">Password</span>
          </h1>
          <p className="text-white/60">Secure your account with a new password</p>
        </div>

        <div className="max-w-xl">
          <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3b82f6]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-[#3b82f6] text-white' : 'bg-white/10 text-white/40'}`}>1</div>
                <div className={`h-px flex-1 transition-all ${step >= 2 ? 'bg-[#3b82f6]' : 'bg-white/10'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-[#3b82f6] text-white' : 'bg-white/10 text-white/40'}`}>2</div>
              </div>

              {step === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Verify your email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#3b82f6] outline-none transition-all text-lg"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] font-bold text-lg hover:shadow-2xl hover:shadow-[#3b82f6]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Verification OTP"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit code"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#3b82f6] outline-none transition-all text-center text-2xl tracking-[0.5em] font-mono"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#3b82f6] outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#3b82f6] outline-none transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] font-bold text-lg hover:shadow-2xl hover:shadow-[#3b82f6]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Password"}
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-3 text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Use a different email
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-[#3b82f6]/5 border border-[#3b82f6]/10 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#3b82f6] shrink-0 mt-1" />
            <div className="text-sm text-white/60 space-y-2">
              <p className="font-semibold text-white">Security Tip:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Use a mix of letters, numbers, and special characters.</li>
                <li>Avoid using personal information like birthdays.</li>
                <li>Never share your OTP with anyone.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
