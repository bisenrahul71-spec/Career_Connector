import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeft, User, FileText, Clock, CheckCircle2, XCircle, X, Download, ExternalLink } from "lucide-react"
import API from "../../src/api/config"

export function Applicants() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [previewResume, setPreviewResume] = useState<{ url: string; name: string } | null>(null)

  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    try {
      const res = await API.get(`/api/recruiter/jobs/${jobId}/applicants`)
      setApplicants(res.data)
    } catch {
      console.error("Failed to fetch applicants")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appId: string, status: string) => {
    try {
      await API.patch(`/api/recruiter/applicants/${appId}/status`, { status })
      fetchApplicants()
    } catch {
      alert("Failed to update status")
    }
  }

  const handleViewResume = (app: any) => {
    if (app.resume_url) {
      setPreviewResume({ url: app.resume_url, name: app.student_name || "Applicant" })
    } else {
      alert("Resume not available yet for this applicant.")
    }
  }

  const scoreColor = (score: number) => {
    if (score >= 60) return "text-green-700"
    return "text-[#FF3300]"
  }

  const pending = applicants.filter(a => !a.status || a.status === "pending")
  const shortlisted = applicants.filter(a => a.status === "shortlisted")
  const rejected = applicants.filter(a => a.status === "rejected")

  const ApplicantCard = ({ app }: { app: any }) => (
    <div className="bg-white border border-black/10 p-5">
      <div className="flex justify-between items-start gap-3 mb-4">
        <div>
          <h3 className="text-base font-medium tracking-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>
            {app.student_name || "Applicant"}
          </h3>
          <p className="text-black/50 text-xs mt-1">{app.student_email}</p>
          <p className="text-black/35 text-[10px] uppercase tracking-[0.15em] mt-1" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            Applied {new Date(app.applied_at).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-xl font-semibold ${scoreColor(app.match_score ?? 0)}`} style={{ fontFamily: '"Clash Display", sans-serif' }}>
            {app.match_score ?? 0}%
          </p>
          <p className="text-[9px] uppercase tracking-[0.15em] text-black/35" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            match
          </p>
        </div>
      </div>

      <button
        onClick={() => handleViewResume(app)}
        className="w-full inline-flex items-center justify-center gap-2 border border-black/15 text-black/70 py-2 text-xs font-medium hover:border-[#FF3300] hover:text-[#FF3300] transition-colors duration-200 mb-4"
      >
        <FileText size={13} />
        View Resume
      </button>

      <div className="flex gap-2 pt-3 border-t border-black/10">
        <button
          onClick={() => updateStatus(app._id, "shortlisted")}
          disabled={app.status === "shortlisted"}
          className="flex-1 bg-green-50 text-green-700 px-3 py-2 text-xs font-medium hover:bg-green-100 transition-colors duration-200 disabled:opacity-40"
        >
          Shortlist
        </button>
        <button
          onClick={() => updateStatus(app._id, "rejected")}
          disabled={app.status === "rejected"}
          className="flex-1 bg-[#FF3300]/10 text-[#FF3300] px-3 py-2 text-xs font-medium hover:bg-[#FF3300]/20 transition-colors duration-200 disabled:opacity-40"
        >
          Reject
        </button>
      </div>
    </div>
  )

  const Column = ({ title, list, icon: Icon, accent }: { title: string; list: any[]; icon: any; accent: string }) => (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className={accent} />
        <h2 className="text-sm font-medium uppercase tracking-[0.15em]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          {title}
        </h2>
        <span className="text-xs text-black/40">({list.length})</span>
      </div>
      {list.length === 0 ? (
        <p className="text-black/40 text-sm bg-white border border-black/10 p-5 text-center">
          No candidates here yet
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map(app => <ApplicantCard key={app._id} app={app} />)}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F4F0EA] text-[#121212] pt-[104px] pb-24 px-5" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
      <div className="max-w-[1400px] mx-auto">
        <button
          onClick={() => navigate("/recruiter")}
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-[#FF3300] transition-colors duration-200 mb-8"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF3300] mb-4" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          / Candidates
        </p>
        <h1 className="font-semibold text-3xl sm:text-4xl tracking-tighter leading-[0.95] mb-10" style={{ fontFamily: '"Clash Display", sans-serif' }}>
          Applicants.
        </h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-[#FF3300] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-black/45 text-sm uppercase tracking-[0.2em]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              Loading applicants...
            </p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="border border-black/10 bg-white p-16 text-center">
            <User size={40} className="text-[#FF3300]/40 mx-auto mb-5" strokeWidth={1.6} />
            <h3 className="text-xl font-medium tracking-tight mb-2" style={{ fontFamily: '"Clash Display", sans-serif' }}>
              No applicants yet
            </h3>
            <p className="text-black/50 text-sm">Applicants will appear here once students apply.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <Column title="Pending" list={pending} icon={Clock} accent="text-black/40" />
            <Column title="Shortlisted" list={shortlisted} icon={CheckCircle2} accent="text-green-600" />
            <Column title="Rejected" list={rejected} icon={XCircle} accent="text-[#FF3300]" />
          </div>
        )}
      </div>

      {previewResume && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreviewResume(null)}
        >
          <div
            className="bg-white w-full max-w-3xl h-full max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 shrink-0">
              <h3 className="font-medium tracking-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                {previewResume.name}'s Resume
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewResume.url}
                  download
                  className="inline-flex items-center gap-1.5 border border-black/15 text-black/70 px-3 py-1.5 text-xs font-medium hover:border-[#FF3300] hover:text-[#FF3300] transition-colors duration-200"
                >
                  <Download size={13} />
                  Download
                </a>
                <a
                  href={previewResume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-black/15 text-black/70 px-3 py-1.5 text-xs font-medium hover:border-[#FF3300] hover:text-[#FF3300] transition-colors duration-200"
                >
                  <ExternalLink size={13} />
                  New Tab
                </a>
                <button
                  onClick={() => setPreviewResume(null)}
                  className="grid place-items-center h-8 w-8 text-black/50 hover:text-black transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black/5">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewResume.url)}&embedded=true`}
                className="w-full h-full border-0"
                title="Resume preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
