import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeft, User } from "lucide-react"
import API from "../api/config"

export function Applicants() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const statusColor = (status: string) => {
    if (status === "shortlisted") return "bg-green-100 text-green-700"
    if (status === "rejected") return "bg-red-100 text-red-700"
    return "bg-yellow-100 text-yellow-700"
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate("/recruiter")}
          className="flex items-center space-x-2 text-orange-600 mb-6 hover:text-orange-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-2xl font-bold text-orange-600 mb-6">Applicants</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applicants...</p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <User className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Applicants Yet</h3>
            <p className="text-gray-600">Applicants will appear here once students apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{app.student_name || "Applicant"}</h3>
                    <p className="text-gray-500 text-sm">{app.student_email}</p>
                    <p className="text-gray-400 text-xs mt-1">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(app.status)}`}>
                    {app.status || "pending"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => updateStatus(app._id, "shortlisted")}
                    className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-all"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "pending")}
                    className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-all"
                  >
                    Mark Pending
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
