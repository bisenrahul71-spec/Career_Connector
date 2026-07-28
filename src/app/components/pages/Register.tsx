import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { BrainCircuit, ArrowRight } from "lucide-react"
import { registerUser } from "../../src/api/auth"

export function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      await registerUser({ name, email, password, role })
      navigate("/login")
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#09090B] flex flex-col"
      style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
    >
      {/* Glow effects */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#FF3300]/20 blur-[140px]" />
      <div className="pointer-events-none fixed top-1/3 right-0 h-[360px] w-[360px] rounded-full bg-[#FF3300]/10 blur-[120px]" />

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/10">
        <nav className="mx-auto max-w-[1400px] px-5 sm:px-8 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid place-items-center h-9 w-9 bg-[#FF3300] text-white">
              <BrainCircuit size={20} strokeWidth={2.2} />
            </span>
            <span className="leading-none">
              <span
                className="block font-semibold text-[17px] tracking-tight text-[#FAFAFA]"
                style={{ fontFamily: '"Clash Display", sans-serif' }}
              >
                Career Connector
              </span>
              <span
                 className="block text-[9px] uppercase tracking-[0.25em] text-white/45 mt-1"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Where Talent Meets Intelligence
          </span>
            </span>
          </Link>
          <Link
            to="/login"
            className="text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-200"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Login →
          </Link>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">

          {/* Label */}
          <p
            className="text-[11px] uppercase tracking-[0.3em] text-[#FF3300] mb-6"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            / Create account
          </p>

          {/* Heading */}
          <h1
            className="font-semibold text-4xl sm:text-5xl tracking-tighter text-[#FAFAFA] leading-[0.95] mb-10"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
          >
            Join Career <span className="italic text-[#FF3300]">Connector.</span>
          </h1>

          {/* Error */}
          {error && (
            <div className="mb-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4">

            {/* Full Name */}
            <div className="border border-white/15 bg-white/[0.03] backdrop-blur-sm">
              <label
                className="block text-[10px] uppercase tracking-[0.25em] text-white/45 px-4 pt-3"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="off"
                placeholder="Enter your full name"
                className="w-full bg-transparent outline-none px-4 pb-3 pt-1 text-[#FAFAFA] text-sm placeholder:text-white/30"
              />
            </div>

            {/* Email */}
            <div className="border border-white/15 bg-white/[0.03] backdrop-blur-sm">
              <label
                className="block text-[10px] uppercase tracking-[0.25em] text-white/45 px-4 pt-3"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="off"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none px-4 pb-3 pt-1 text-[#FAFAFA] text-sm placeholder:text-white/30"
              />
            </div>

            {/* Password */}
            <div className="border border-white/15 bg-white/[0.03] backdrop-blur-sm">
              <label
                className="block text-[10px] uppercase tracking-[0.25em] text-white/45 px-4 pt-3"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full bg-transparent outline-none px-4 pb-3 pt-1 text-[#FAFAFA] text-sm placeholder:text-white/30"
              />
            </div>

            {/* Role */}
            <div className="border border-white/15 bg-white/[0.03] backdrop-blur-sm">
              <label
                className="block text-[10px] uppercase tracking-[0.25em] text-white/45 px-4 pt-3"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                I am a
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-transparent outline-none px-4 pb-3 pt-1 text-[#FAFAFA] text-sm appearance-none cursor-pointer"
                style={{ background: "transparent" }}
              >
                <option value="student" className="bg-[#09090B] text-[#FAFAFA]">
                  Student / Job Seeker
                </option>
                <option value="recruiter" className="bg-[#09090B] text-[#FAFAFA]">
                  Recruiter
                </option>
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              disabled={loading || !name || !email || !password}
              className="group mt-2 inline-flex items-center justify-center gap-2 bg-[#FF3300] text-white px-6 py-4 font-medium text-sm hover:brightness-110 transition-[filter] duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

          {/* Login link */}
          <p
            className="mt-8 text-[11px] uppercase tracking-[0.2em] text-white/40"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#FF3300] hover:text-white transition-colors duration-200"
            >
              Login →
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
