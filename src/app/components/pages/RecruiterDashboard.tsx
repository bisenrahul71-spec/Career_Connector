import { useState, useEffect } from "react"
import { Link } from "react-router"
import { Briefcase, Plus, Users, CheckCircle2, Clock, TrendingUp, ArrowRight } from "lucide-react"
import API from "../../src/api/config"

export function RecruiterDashboard() {
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_applicants: 0,
    shortlisted: 0,
    pending: 0
  })
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
    fetchJobs()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/api/recruiter/dashboard")
      setStats(res.data)
    } catch {
      console.error("Failed to fetch dashboard stats")
    }
  }

  const fetchJobs = async () => {
    try {
      const res = await API.get("/api/recruiter/jobs")
      setJobs(res.data)
    } catch {
      console.error("Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm("Delete this job?")) return
    try {
      await API.delete(`/api/recruiter/jobs/${jobId}`)
      fetchJobs()
      fetchDashboard()
    } catch {
      alert("Failed to delete job.")
    }
  }

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "closed" : "active"
    try {
      await API.patch(`/api/recruiter/jobs/${jobId}/status?status=${newStatus}`)
      fetchJobs()
    } catch {
      alert("Failed to update status.")
    }
  }

  const STAT_CARDS = [
    { label: "Jobs Posted", value: stats.total_jobs, icon: Briefcase },
    { label: "Total Applicants", value: stats.total_applicants, icon: Users },
    { label: "Shortlisted", value: stats.shortlisted, icon: CheckCircle2 },
    { label: "Pending Review", value: stats.pending, icon: Clock },
  ]

  return (
    <div className="min-h-screen bg-[#F4F0EA] text-[#121212] pt-[104px] pb-24" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF3300] mb-5" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              / Recruiter
            </p>
            <h1 className="font-semibold text-4xl sm:text-5xl tracking-tighter leading-[0.95] mb-3" style={{ fontFamily: '"Clash Display", sans-serif' }}>
              Recruiter dashboard.
            </h1>
            <p className="text-black/55 text-base leading-relaxed">
              Manage your jobs and candidates.
            </p>
          </div>
          <Link
            to="/recruiter/post-job"
            className="group inline-flex items-center justify-center gap-2 bg-[#09090B] text-[#FAFAFA] px-6 py-3.5 font-medium text-sm hover:bg-[#FF3300] transition-colors duration-200 w-fit shrink-0"
          >
            <Plus size={17} />
            Post a Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-black/10 mb-16">
          {STAT_CARDS.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="border-r border-b border-black/10 bg-white p-6 lg:p-8">
                <span className="grid place-items-center h-11 w-11 border border-black/15 text-[#FF3300] mb-6">
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <p className="text-3xl tracking-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/45 mt-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  {s.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* Job Postings */}
        <div className="flex items-end justify-between gap-6 mb-6">
          <h2 className="text-2xl font-medium tracking-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>
            My job postings.
          </h2>
          <TrendingUp size={18} className="text-[#FF3300]" />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-[#FF3300] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-black/45 text-sm uppercase tracking-[0.2em]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              Loading...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="border border-black/10 bg-white p-16 text-center">
            <Briefcase size={40} className="text-[#FF3300]/40 mx-auto mb-5" strokeWidth={1.6} />
            <h3 className="text-xl font-medium tracking-tight mb-2" style={{ fontFamily: '"Clash Display", sans-serif' }}>
              No jobs posted yet
            </h3>
            <p className="text-black/50 text-sm">Click "Post a Job" to add your first listing.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <article
                key={job._id}
                className="group bg-white border border-black/10 p-6 sm:p-8 hover:-translate-y-0.5 hover:border-black/40 hover:shadow-[6px_6px_0_0_#FF3300] transition-[transform,border-color,box-shadow] duration-200"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight leading-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                      {job.title}
                    </h3>
                    <p className="text-[#FF3300] font-medium text-sm mt-1">{job.company}</p>
                    <p className="text-black/45 text-xs mt-1">{job.location} · {job.job_type}</p>
                  </div>
                  <span
                    className={`shrink-0 text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 ${
                      job.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-black/5 text-black/50"
                    }`}
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    {job.status === "active" ? "Active" : "Closed"}
                  </span>
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

                <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-black/10">
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="group/btn inline-flex items-center gap-2 bg-[#09090B] text-[#FAFAFA] px-5 py-2.5 text-sm font-medium hover:bg-[#FF3300] transition-colors duration-200"
                  >
                    <Users size={15} />
                    View Applicants
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(job._id, job.status)}
                    className="px-5 py-2.5 text-sm font-medium border border-black/15 text-black/70 hover:border-black/40 transition-colors duration-200"
                  >
                    {job.status === "active" ? "Close Job" : "Reopen Job"}
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="ml-auto px-5 py-2.5 text-sm font-medium text-[#FF3300] hover:bg-[#FF3300]/5 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
