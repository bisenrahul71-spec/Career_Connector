import { useState, useEffect } from "react"
import { Briefcase, MapPin, Search, CheckCircle2, ArrowRight, Calendar } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router"
import API from "../../src/api/config"

export function JobListings() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("q") || searchParams.get("location") || "")
  const [applying, setApplying] = useState<string | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<Record<string, number>>({})
  const [applyResult, setApplyResult] = useState<{jobId: string, score: number, status: string} | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobs()
    const saved = localStorage.getItem("appliedJobs")
    if (saved) setAppliedJobs(JSON.parse(saved))
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await API.get("/api/jobs/")
      setJobs(res.data)
    } catch {
      console.error("Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (jobId: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Please login first to apply for jobs!")
      navigate("/login")
      return
    }

    if (appliedJobs[jobId] !== undefined) {
      alert("You have already applied for this job!")
      return
    }

    setApplying(jobId)
    try {
      const res = await API.post("/api/applications/apply", {
        job_id: jobId
      })

      const updated = { ...appliedJobs, [jobId]: res.data.match_score }
      setAppliedJobs(updated)
      localStorage.setItem("appliedJobs", JSON.stringify(updated))

      setApplyResult({
        jobId: jobId,
        score: res.data.match_score,
        status: res.data.status
      })

    } catch (err: any) {
      const detail = err?.response?.data?.detail

      if (detail === "Already applied") {
        alert("You have already applied for this job!")
      } else if (detail === "Please upload your resume before applying for jobs") {
        alert("Please upload your resume first before applying!")
        navigate("/student/resume")
      } else {
        alert(detail || "Failed to apply. Please try again.")
      }
    } finally {
      setApplying(null)
    }
  }

  const highlightedJobId = searchParams.get("highlight")

  const filtered = jobs.filter(job =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.company?.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F4F0EA] text-[#121212] pt-[104px] pb-24" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
      <div className="mx-auto max-w-[1000px] px-5 sm:px-8">

        {/* Header */}
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF3300] mb-5" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          / Open Roles
        </p>
        <h1 className="font-semibold text-4xl sm:text-5xl tracking-tighter leading-[0.95] mb-3" style={{ fontFamily: '"Clash Display", sans-serif' }}>
          Job listings.
        </h1>
        <p className="text-black/55 text-base leading-relaxed mb-10">
          Find your perfect career opportunity, matched by skill and fit.
        </p>

        {/* Match Result Banner */}
        {applyResult && (
          <div className={`mb-8 p-5 border-2 flex items-start gap-4 ${
            applyResult.status === "shortlisted"
              ? "bg-green-50 border-green-400"
              : "bg-white border-black/15"
          }`}>
            <div className="flex-1">
              <h3 className="font-medium text-lg tracking-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                {applyResult.status === "shortlisted"
                  ? "Congratulations! You've been shortlisted!"
                  : "Not shortlisted this time"}
              </h3>
              <p className="text-black/60 text-sm mt-1">
                Your skill match score: <span className="font-semibold text-[#FF3300]">{applyResult.score}%</span>
              </p>
              <p className="text-black/45 text-xs mt-1">
                {applyResult.status === "shortlisted"
                  ? "Your skills match well with this job. The recruiter has been notified."
                  : "Your skills don't fully match this job. Keep improving your skills."}
              </p>
              <button
                onClick={() => setApplyResult(null)}
                className="mt-3 text-xs uppercase tracking-[0.15em] text-black/40 hover:text-black underline"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <label className="flex items-center gap-3 border border-black/15 bg-white px-4 py-4 mb-10">
          <Search size={18} className="text-black/35 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company or location..."
            className="bg-transparent outline-none w-full text-sm text-[#121212] placeholder:text-black/35"
          />
        </label>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-[#FF3300] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-black/45 text-sm uppercase tracking-[0.2em]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              Loading jobs...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-black/10 bg-white p-16 text-center">
            <Briefcase size={40} className="text-[#FF3300]/40 mx-auto mb-5" strokeWidth={1.6} />
            <h3 className="text-xl font-medium tracking-tight mb-2" style={{ fontFamily: '"Clash Display", sans-serif' }}>
              No jobs found
            </h3>
            <p className="text-black/50 text-sm">Try a different search term.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((job) => (
              <article
                key={job._id}
                className={`group bg-white border p-6 sm:p-8 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#FF3300] ${
                  highlightedJobId === job._id ? "border-[#FF3300]" : "border-black/10 hover:border-black/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight leading-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                      {job.title}
                    </h3>
                    <p className="text-[#FF3300] font-medium text-sm mt-1">{job.company}</p>
                    {job.job_type && (
                      <span className="inline-block mt-2 text-[9px] uppercase tracking-[0.2em] bg-[#FF3300]/10 text-[#FF3300] px-2.5 py-1" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        {job.job_type}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                    <span className="flex items-center gap-1.5 text-black/50 text-xs">
                      <MapPin size={13} /> {job.location}
                    </span>
                    {job.salary_range && (
                      <span className="text-xs text-green-700 font-medium">{job.salary_range}</span>
                    )}
                  </div>
                </div>

               {job.description && (
                  <p className="text-black/60 text-sm leading-relaxed mb-5 whitespace-pre-line">{job.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills_required?.map((skill: string, i: number) => (
                    <span key={i} className="text-[10px] uppercase tracking-[0.1em] border border-black/12 px-2.5 py-1 text-black/70" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      {skill}
                    </span>
                  ))}
                </div>

                {job.deadline && (
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-black/40 mb-5" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <Calendar size={12} /> Apply by {new Date(job.deadline).toLocaleDateString()}
                  </p>
                )}

                {appliedJobs[job._id] !== undefined ? (
                  <div className="inline-flex items-center gap-3 flex-wrap">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-3 text-sm font-medium w-fit">
                      <CheckCircle2 size={16} />
                      Applied!
                    </div>
                    <span className="text-xs font-medium text-[#FF3300]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      {appliedJobs[job._id]}% match
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(job._id)}
                    disabled={applying === job._id}
                    className="group/btn inline-flex items-center justify-center gap-2 bg-[#09090B] text-[#FAFAFA] px-6 py-3 text-sm font-medium hover:bg-[#FF3300] transition-colors duration-200 disabled:opacity-50"
                  >
                    {applying === job._id ? "Applying..." : "Apply Now"}
                    {applying !== job._id && (
                      <ArrowRight size={15} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                    )}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
