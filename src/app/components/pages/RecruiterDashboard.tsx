 import { useState, useEffect } from "react"
import { Link } from "react-router"
import { Briefcase, Plus, Users, CheckCircle, Clock, TrendingUp } from "lucide-react"
import API from "../api/config"

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
    if (!confirm("Are you sure you want to delete this job?")) return
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
      alert("Failed to update job status.")
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">Recruiter Dashboard</h1>
            <p className="text-gray-600">Manage your jobs and candidates</p>
          </div>
          <Link
            to="/recruiter/post-job"
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Post a Job</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100">
            <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.total_jobs}</p>
            <p className="text-gray-500 text-sm">Jobs Posted</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100">
            <div className="bg-red-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.total_applicants}</p>
            <p className="text-gray-500 text-sm">Total Applicants</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100">
            <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.shortlisted}</p>
            <p className="text-gray-500 text-sm">Shortlisted</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100">
            <div className="bg-yellow-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
            <p className="text-gray-500 text-sm">Pending Review</p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">My Job Postings</h2>
          <TrendingUp className="w-5 h-5 text-orange-400" />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Briefcase className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Jobs Posted Yet</h3>
            <p className="text-gray-600 mb-6">Click "Post a Job" to add your first listing</p>
            <Link
              to="/recruiter/post-job"
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Post First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                    <p className="text-orange-600 font-medium">{job.company}</p>
                    <p className="text-gray-500 text-sm">{job.location} • {job.job_type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {job.status === "active" ? "Active" : "Closed"}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 text-sm">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills_required?.map((skill: string, i: number) => (
                    <span key={i} className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="flex items-center space-x-1 bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-all"
                  >
                    <Users className="w-4 h-4" />
                    <span>View Applicants</span>
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(job._id, job.status)}
                    className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
                  >
                    {job.status === "active" ? "Close Job" : "Reopen Job"}
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
