import { Link } from "react-router";
import { MapPin, DollarSign, Briefcase, Heart, CheckCircle2 } from "lucide-react";

export function JobCard({
  id,
  title,
  company,
  location,
  salary,
  type,
  tags,
  logo,
  isSaved,
  hasApplied,
  onSave
}) {
  return (
    <div className="group p-4 sm:p-6 rounded-2xl glass-card hover:border-[#3b82f6]/50 hover:shadow-xl hover:shadow-[#3b82f6]/10 hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#3b82f6]/20 to-[#ef4444]/20 flex items-center justify-center flex-shrink-0 border border-white/10">
          {logo ? (
            <img src={logo} alt={company} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
          ) : (
            <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-[#3b82f6]" />
          )}
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link to={`/jobs/${id}`}>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#3b82f6] transition-colors line-clamp-1">
                    {title}
                  </h3>
                  {hasApplied && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      Applied
                    </span>
                  )}
                </div>
              </Link>
              <p className="text-white/60 text-sm mt-1">{company}</p>
            </div>

            <button
              onClick={onSave}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                isSaved
                  ? 'bg-[#ef4444]/20 text-[#ef4444]'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-[#ef4444]'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 sm:mt-4 text-xs sm:text-sm text-white/60">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
              {salary}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] sm:text-sm border border-[#3b82f6]/20">
              {type}
            </span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-white/5 text-white/80 text-[10px] sm:text-sm border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            to={`/jobs/${id}`}
            className="mt-4 inline-flex w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:shadow-lg hover:shadow-[#3b82f6]/50 transition-all text-sm items-center justify-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
