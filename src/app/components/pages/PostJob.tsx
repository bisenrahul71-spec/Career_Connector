import { useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, Paperclip, X } from "lucide-react"
import API from "../../src/api/config"

export function PostJob() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [jdFile, setJdFile] = useState<File | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "Full-time",
    description: "",
    skills_required: "",
    salary_range: "",
    deadline: ""
  })

  const handleFileUpload = async (file: File) => {
    setJdFile(file)
    setExtracting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await API.post("/api/jobs/extract-jd", formData, {
        headers: { "Content-Type": undefined }
      })
      const data = res.data
      setForm(prev => ({
        ...prev,
        description: data.description || prev.description,
        skills_required: data.skills || prev.skills_required,
        title: data.title || prev.title,
        company: data.company || prev.company,
        location: data.location || prev.location,
      }))
    } catch (err) {
      console.error("JD extraction failed:", err)
      alert("Failed to extract from file. Please type the description manually.")
      setJdFile(null)
    } finally {
      setExtracting(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.title || !form.company || !form.location || !form.description) {
      alert("Please fill all required fields")
      return
    }
    setSubmitting(true)
    try {
      await API.post("/api/recruiter/jobs", {
        ...form,
        skills_required: form.skills_required.split(",").map((s: string) => s.trim()).filter(Boolean)
      })
      alert("Job posted successfully!")
      navigate("/recruiter")
    } catch {
      alert("Failed to post job. Make sure you are logged in as a recruiter.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F0EA] text-[#121212] pt-[104px] pb-24 px-5" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/recruiter")}
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-[#FF3300] transition-colors duration-200 mb-8"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <div className="bg-white border border-black/10 p-8 sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF3300] mb-4" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            / New Listing
          </p>
          <h1 className="font-semibold text-3xl sm:text-4xl tracking-tighter leading-[0.95] mb-8" style={{ fontFamily: '"Clash Display", sans-serif' }}>
            Post a new job.
          </h1>

          <div className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                Job Title <span className="text-[#FF3300]">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Data Analyst"
                className="w-full px-4 py-3 border border-black/15 bg-white text-sm outline-none focus:border-[#FF3300] transition-colors duration-200"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                Company <span className="text-[#FF3300]">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Company Name "
                className="w-full px-4 py-3 border border-black/15 bg-white text-sm outline-none focus:border-[#FF3300] transition-colors duration-200"
              />
            </div>

            {/* Location + Job Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Location <span className="text-[#FF3300]">*</span>
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Mumbai"
                  className="w-full px-4 py-3 border border-black/15 bg-white text-sm outline-none focus:border-[#FF3300] transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Job Type
                </label>
                <select
                  value={form.job_type}
                  onChange={e => setForm({ ...form, job_type: e.target.value })}
                  className="w-full px-4 py-3 border border-black/15 bg-white text-sm outline-none focus:border-[#FF3300] transition-colors duration-200"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Remote</option>
                  <option>Contract</option>
                </select>
              </div>
            </div>

            {/* Salary + Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Salary Range
                </label>
                <input
                  type="text"
                  value={form.salary_range}
                  onChange={e => setForm({ ...form, salary_range: e.target.value })}
                  placeholder="e.g. 5-8 LPA"
                  className="w-full px-4 py-3 border border-black/15 bg-white text-sm outline-none focus:border-[#FF3300] transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Deadline
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm({ ...form, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-black/15 bg-white text-sm outline-none focus:border-[#FF3300] transition-colors duration-200"
                />
              </div>
            </div>

            {/* Job Description with attachment icon */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                Job Description <span className="text-[#FF3300]">*</span>
              </label>

              <div className="relative">
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={5}
                  className="w-full px-4 py-3 pb-10 border border-black/15 bg-white text-sm outline-none focus:border-[#FF3300] transition-colors duration-200 resize-none"
                />

                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  {jdFile && !extracting && (
                    <div className="flex items-center gap-1.5 bg-[#FF3300]/10 text-[#FF3300] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      <span>{jdFile.name.length > 15 ? jdFile.name.substring(0, 15) + "..." : jdFile.name}</span>
                      <button
                        onClick={() => {
                          setJdFile(null)
                          setForm(prev => ({ ...prev, description: "", skills_required: "" }))
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {extracting && (
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#FF3300]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      Extracting...
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => document.getElementById("jdFileInput")?.click()}
                    className="text-black/35 hover:text-[#FF3300] transition-colors duration-200"
                    title="Attach JD file (PDF, Word, TXT)"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    id="jdFileInput"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                  />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.1em] text-black/40 mt-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                Click the paperclip icon to attach a JD file (PDF, Word, TXT) — details will be auto-filled
              </p>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                Skills Required <span className="normal-case text-black/35">(comma separated)</span>
              </label>
              <input
                type="text"
                value={form.skills_required}
                onChange={e => setForm({ ...form, skills_required: e.target.value })}
                placeholder="Python, SQL, Power BI, Excel"
                className="w-full px-4 py-3 border border-black/15 bg-white text-sm outline-none focus:border-[#FF3300] transition-colors duration-200"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || extracting}
              className="inline-flex items-center justify-center gap-2 bg-[#09090B] text-[#FAFAFA] py-4 text-sm font-medium hover:bg-[#FF3300] transition-colors duration-200 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post Job</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
