import { useState } from "react";
import { Link } from "react-router";
import { Search, MapPin, Rocket, TrendingUp, Users, Zap, Code, Palette, DollarSign, Megaphone, ArrowRight, Sparkles, Globe, ShieldCheck } from "lucide-react";
import { JobCard } from "../components/JobCard";

const featuredJobs = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp Inc",
    location: "Remote",
    salary: "$120k - $180k",
    type: "Full-time",
    tags: ["Remote", "React", "TypeScript"]
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "San Francisco, CA",
    salary: "$90k - $130k",
    type: "Full-time",
    tags: ["Figma", "Design Systems"]
  },
  {
    id: "3",
    title: "Product Manager",
    company: "StartupX",
    location: "New York, NY",
    salary: "$140k - $200k",
    type: "Full-time",
    tags: ["SaaS", "B2B"]
  }
];

const categories = [
  { name: "Development", icon: Code, count: "2,450 jobs", color: "#3b82f6", size: "large" },
  { name: "Design", icon: Palette, count: "1,230 jobs", color: "#10b981", size: "small" },
  { name: "Marketing", icon: Megaphone, count: "980 jobs", color: "#8b5cf6", size: "small" },
  { name: "Finance", icon: DollarSign, count: "760 jobs", color: "#10b981", size: "medium" }
];

export function LandingPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());

  const handleSave = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0b14]">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Abstract Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20 scale-110 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b14] via-transparent to-[#0a0b14]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8 animate-bounce-slow">
                <Sparkles className="w-4 h-4 text-[#3b82f6]" />
                <span className="text-sm font-medium text-[#3b82f6]">The Future of Recruitment is Here</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-white mb-8 leading-[1.1]" style={{ fontFamily: 'var(--font-heading)' }}>
                Elevate Your <br />
                <span className="text-gradient">Career Path</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl leading-relaxed">
                Beyond just job listings. We provide a curated ecosystem for top talent to connect with industry-defining companies.
              </p>

              {/* Unique Floating Search Bar */}
              <div className="max-w-xl p-2 rounded-2xl bg-white/[0.03] border border-white/10 relative group">
                <div className="absolute inset-0 bg-[#3b82f6]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus-within:border-[#3b82f6]/50 transition-all">
                    <Search className="w-5 h-5 text-[#3b82f6]" />
                    <input
                      type="text"
                      placeholder="Role or skill"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-white placeholder-white/40 text-sm"
                    />
                  </div>
                  <Link
                    to="/jobs"
                    className="px-8 py-3 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] transition-all flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#3b82f6]/20 group/btn"
                  >
                    <span>Explore Jobs</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-8 mt-12 opacity-80">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0b14] bg-white/10 overflow-hidden backdrop-blur-md" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-[#0a0b14] bg-[#3b82f6] flex items-center justify-center text-xs font-bold">+2k</div>
                </div>
                <p className="text-sm text-white/40 font-medium">Trusted by 2,000+ top-tier professionals</p>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#3b82f6]/20 to-[#10b981]/20 rounded-[2rem] blur-2xl opacity-50" />
              <img 
                src="/professional-hero.png" 
                alt="Professional Workspace" 
                className="relative rounded-[2rem] border border-white/10 shadow-2xl animate-float"
              />
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl glass-card animate-bounce-slow delay-150">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">94%</p>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Bento Grid Categories */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Explore by <span className="text-gradient">Specialization</span>
              </h2>
              <p className="text-lg text-white/50 leading-relaxed">
                We've categorized opportunities into specialized hubs to help you find precisely where you belong.
              </p>
            </div>
            <Link to="/jobs" className="flex items-center gap-2 text-[#3b82f6] font-semibold hover:underline group">
              View all domains <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to="/jobs"
                  className={`group relative p-8 rounded-[2rem] glass-card overflow-hidden hover:border-[#3b82f6]/50 transition-all duration-500 ${
                    cat.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                    cat.size === 'medium' ? 'md:col-span-2 md:row-span-1' : ''
                  }`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon size={120} />
                  </div>
                  
                  <div className="relative h-full flex flex-col justify-between z-10">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                      <p className="text-white/40 font-medium">{cat.count}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs - Clean & Minimalist */}
      <section className="py-32 px-4 sm:px-6 bg-[#0a0b14]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Curated <span className="text-[#10b981]">Opportunities</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Our algorithm selects only the highest-quality roles from certified employers.
            </p>
          </div>

          <div className="grid gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isSaved={savedJobs.has(job.id)}
                onSave={() => handleSave(job.id)}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/jobs" className="glass-button px-10 py-4 rounded-2xl text-white font-bold hover:bg-white/5 inline-flex items-center gap-3 group transition-all">
              Launch Full Search <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-32 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Global Reach", desc: "Access talent and roles from every corner of the digital world." },
              { icon: ShieldCheck, title: "Verified Roles", desc: "Every company and job posting is manually vetted by our team." },
              { icon: Zap, title: "Instant Connect", desc: "No more waiting. Real-time feedback for both talent and hiring teams." }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2rem] glass-card group hover:bg-[#3b82f6]/5 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-[#3b82f6]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact CTA */}
      <section className="py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative p-12 md:p-20 rounded-[3rem] overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] to-[#10b981] opacity-90" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                Ready to redefine <br /> your future?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="px-10 py-4 rounded-2xl bg-[#0a0b14] text-white font-bold hover:scale-105 transition-transform shadow-2xl">
                  Get Started Now
                </Link>
                <Link to="/jobs" className="px-10 py-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold hover:bg-white/30 transition-all border border-white/20">
                  Browse Roles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-white/20 text-sm font-medium">© 2026 JobRush. All rights reserved. Designed for the bold.</p>
      </footer>
    </div>
  );
}
