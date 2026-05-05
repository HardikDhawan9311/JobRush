import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, Mail, Phone, MapPin, Briefcase, 
  Download, ExternalLink, Calendar, CheckCircle2, 
  User, Code, GraduationCap, Award
} from "lucide-react";
import api, { getAssetUrl } from "../utils/api";
import { toast } from "sonner";
import { motion } from "motion/react";

export function CandidateProfilePage() {
  const { id } = useParams(); // candidate_id
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidateProfile();
  }, [id]);

  const fetchCandidateProfile = async () => {
    try {
      const res = await api.get(`/user/profile/${id}`);
      setCandidate(res.data);
    } catch (err) {
      console.error("Error fetching candidate profile:", err);
      toast.error("Failed to load candidate profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!candidate) return <div className="text-center py-20 text-white/40 text-xl">Candidate not found</div>;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Applicants
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#3b82f6]/20 to-[#ef4444]/20 flex items-center justify-center mb-6 border border-white/10 overflow-hidden shadow-2xl">
                  {candidate.profile_image ? (
                    <img src={getAssetUrl(candidate.profile_image)} alt={candidate.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-[#3b82f6]" />
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-2">{candidate.full_name}</h1>
                <p className="text-white/60 mb-6 capitalize">{candidate.role}</p>

                <div className="w-full space-y-4 text-left">
                  <div className="flex items-center gap-3 text-white/80 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <Mail className="w-4 h-4 text-[#3b82f6]" />
                    <span className="text-sm truncate">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <Phone className="w-4 h-4 text-[#10b981]" />
                    <span className="text-sm">{candidate.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <MapPin className="w-4 h-4 text-[#ef4444]" />
                    <span className="text-sm">{candidate.location || "Not provided"}</span>
                  </div>
                </div>
              </div>
            </div>

            {candidate.resume_url && (
              <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#3b82f6]" />
                  Documents
                </h3>
                <a 
                  href={getAssetUrl(candidate.resume_url)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full p-4 rounded-2xl bg-[#3b82f6] text-white flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-[#3b82f6]/30 transition-all font-bold"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Resume
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Briefcase className="w-7 h-7 text-[#10b981]" />
                Professional Summary
              </h2>
              <p className="text-white/60 leading-relaxed whitespace-pre-wrap">
                {candidate.bio || "No bio provided yet. This candidate is ready to take on new challenges and contribute to your team's success."}
              </p>
            </div>

            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Code className="w-7 h-7 text-[#3b82f6]" />
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {candidate.skills ? candidate.skills.split(',').map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-sm hover:border-[#3b82f6]/50 transition-colors">
                    {skill.trim()}
                  </span>
                )) : (
                  <p className="text-white/40 italic">No skills listed</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#f59e0b]" />
                  Experience
                </h3>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-lg font-bold text-[#f59e0b]">{candidate.experience || "0"} Years</p>
                  <p className="text-sm text-white/40 uppercase tracking-wider">Total Professional Experience</p>
                </div>
              </div>

              <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#8b5cf6]" />
                  Education
                </h3>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-lg font-bold text-[#8b5cf6]">{candidate.education || "Bachelor's Degree"}</p>
                  <p className="text-sm text-white/40 uppercase tracking-wider">Highest Qualification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
