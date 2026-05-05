import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  FileText, 
  Code, 
  Upload, 
  Check, 
  Edit3, 
  Save, 
  X,
  Phone,
  Calendar
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";

export function ProfilePage() {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    location: "",
    bio: "",
    company_name: "",
    company_website: "",
    company_logo: ""
  });
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(res.data);
      setFormData({
        full_name: res.data.full_name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        skills: res.data.skills || "",
        experience: res.data.experience || "",
        location: res.data.location || "",
        bio: res.data.bio || "",
        company_name: res.data.company_name || "",
        company_website: res.data.company_website || "",
        company_logo: res.data.company_logo || ""
      });
      if (res.data.company_logo) {
        setCompanyLogoPreview(`${import.meta.env.VITE_API_URL}${res.data.company_logo}`);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (profileImage) data.append("profile_image", profileImage);
    if (resumeFile) data.append("resume_url", resumeFile);
    if (companyLogoFile) data.append("company_logo", companyLogoFile);

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/user/profile`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              My <span className="text-[#3b82f6]">Profile</span>
            </h1>
            <p className="text-white/60">View and manage your professional identity</p>
          </div>
          <button
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            className={`px-6 py-3 rounded-xl border transition-all flex items-center gap-2 ${
              isEditing 
                ? "bg-white/5 border-white/10 hover:bg-white/10" 
                : "bg-[#3b82f6] border-[#3b82f6] hover:shadow-2xl hover:shadow-[#3b82f6]/50"
            }`}
          >
            {isEditing ? <><X className="w-5 h-5" /> Cancel</> : <><Edit3 className="w-5 h-5" /> Edit Profile</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
              <div className="relative w-40 h-40 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden mb-6 group">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : user.profile_image ? (
                  <img src={`${import.meta.env.VITE_API_URL}${user.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-white/20" />
                )}
                
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="flex flex-col items-center gap-2 text-sm">
                      <Upload className="w-6 h-6" />
                      <span>Change Photo</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
              
              <h2 className="text-2xl font-bold mb-1">{user.full_name}</h2>
              <p className="text-[#3b82f6] font-medium mb-4">{user.role?.toUpperCase()}</p>
              
              <div className="w-full pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-3 text-white/60">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{user.location || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Member since {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {user.role === 'candidate' && (
              <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#3b82f6]" />
                  Resume
                </h3>
                {user.resume_url ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-red-500" />
                        </div>
                        <span className="text-sm font-medium">My_Resume.pdf</span>
                      </div>
                      <a 
                        href={`${import.meta.env.VITE_API_URL}${user.resume_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#3b82f6] hover:underline text-sm"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/40">No resume uploaded yet.</p>
                )}
                
                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <label className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/5 transition-all cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload New Resume</span>
                      <input type="file" className="hidden" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Personal Information</h3>
                  {isEditing && <Save className="w-5 h-5 text-[#3b82f6]" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-lg font-medium">{user.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                      />
                    ) : (
                      <p className="text-lg font-medium">{user.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                        placeholder="+1 234 567 890"
                      />
                    ) : (
                      <p className="text-lg font-medium">{user.phone || "Not provided"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                        placeholder="e.g., New York, NY"
                      />
                    ) : (
                      <p className="text-lg font-medium">{user.location || "Not provided"}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-white/60">{user.role === 'recruiter' ? 'Company Bio' : 'Personal Bio'}</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all resize-none"
                        placeholder={user.role === 'recruiter' ? "Tell us about your company..." : "Tell us about yourself..."}
                      ></textarea>
                    ) : (
                      <p className="text-white/80 leading-relaxed">{user.bio || "No bio added yet."}</p>
                    )}
                  </div>
                </div>
              </div>

              {user.role === 'candidate' && (
                <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold mb-8">Professional Details</h3>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white/60">
                        <Code className="w-4 h-4" />
                        Skills
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                          placeholder="e.g., React, Node.js, Python (comma separated)"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.skills ? user.skills.split(',').map(skill => (
                            <span key={skill} className="px-4 py-2 rounded-xl bg-[#3b82f6]/10 text-[#3b82f6] text-sm border border-[#3b82f6]/20">
                              {skill.trim()}
                            </span>
                          )) : <p className="text-white/40 italic text-sm">No skills listed.</p>}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white/60">
                        <Briefcase className="w-4 h-4" />
                        Experience
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                          placeholder="e.g., 3 years"
                        />
                      ) : (
                        <p className="text-lg font-medium">{user.experience || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'recruiter' && (
                <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold mb-8">Company Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Company Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                            placeholder="e.g., Google"
                          />
                        ) : (
                          <p className="text-lg font-medium">{user.company_name || "Not set"}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Company Website</label>
                        {isEditing ? (
                          <input
                            type="url"
                            name="company_website"
                            value={formData.company_website}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#3b82f6] outline-none transition-all"
                            placeholder="https://company.com"
                          />
                        ) : (
                          user.company_website ? (
                            <a href={user.company_website} target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline block truncate">
                              {user.company_website}
                            </a>
                          ) : <p className="text-white/40">Not set</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-white/60">Company Logo</label>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                          {companyLogoPreview ? (
                            <img src={companyLogoPreview} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <Briefcase className="w-8 h-8 text-white/20" />
                          )}
                        </div>
                        {isEditing && (
                          <label className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer text-sm flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Logo
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setCompanyLogoFile(file);
                                  setCompanyLogoPreview(URL.createObjectURL(file));
                                }
                              }} 
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] font-bold text-lg hover:shadow-2xl hover:shadow-[#3b82f6]/40 transition-all disabled:opacity-50"
                  >
                    {loading ? "Saving Changes..." : "Save Profile Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-lg hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
