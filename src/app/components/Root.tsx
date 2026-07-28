import { useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { BrainCircuit, Home, Users, LogIn, LogOut, Briefcase, Search, Menu, X, ArrowUpRight } from "lucide-react"

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false)

  const getRole = () => {
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.role
    } catch {
      return null
    }
  }

  const role = getRole()
  const isStudent = role === "student"
  const isRecruiter = role === "recruiter"

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("appliedJobs")
    localStorage.removeItem("extractedSkills")
    localStorage.removeItem("aptitudeScore")
    localStorage.removeItem("mbtiResult")
    navigate("/login")
    setMenuOpen(false)
  };

  const closeMenu = () => setMenuOpen(false)

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"
  const isHomePage = location.pathname === "/"

 const navLinkClass = (path: string, exact = false) => {
  const active = exact ? location.pathname === path : isActive(path)
  return `text-[13px] uppercase tracking-[0.2em] pb-1 border-b-2 transition-colors duration-200 ${
    active ? "text-[#FF3300] border-[#FF3300]" : "text-white/60 border-transparent hover:text-white"
  }`
}

  const mobileLinkClass = (path: string, exact = false) => {
    const active = exact ? location.pathname === path : isActive(path)
    return `text-xs uppercase tracking-[0.2em] text-left ${
      active ? "text-[#FF3300]" : "text-white/70"
    }`
  }

  return (
    <div className="min-h-screen bg-[#09090B]">

      {/* Hide header on homepage AND auth pages */}
      {!isHomePage && !isAuthPage && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <nav className="mx-auto max-w-[1400px] px-5 sm:px-8 h-[72px] flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
              <span className="grid place-items-center h-9 w-9 bg-[#FF3300] text-white">
                <BrainCircuit size={20} strokeWidth={2.2} />
              </span>
              <span className="leading-none">
                <span className="block font-semibold text-[17px] tracking-tight text-[#FAFAFA]" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                  Career Connector
                </span>
                <span className="block text-[9px] uppercase tracking-[0.25em] text-white/45 mt-1" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Where Talent Meets Intelligence
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-9">
              <Link to="/" className={navLinkClass("/", true)} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                Home
              </Link>

              {isStudent && (
                <Link to="/student" className={navLinkClass("/student")} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Student Portal
                </Link>
              )}

              {isRecruiter && (
                <Link to="/recruiter" className={navLinkClass("/recruiter")} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Recruiter Portal
                </Link>
              )}

 {(isStudent || !token) && (
  <Link to="/jobs" className={navLinkClass("/jobs")} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
    Jobs
  </Link>
)}
<Link to="/livejobs" className={navLinkClass("/livejobs")} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
  Live Jobs
</Link>

              <div className="pl-2 border-l border-white/15">
                {token ? (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 border border-white/25 text-[#FAFAFA] px-5 py-2.5 font-medium text-sm hover:border-[#FF3300] hover:text-[#FF3300] transition-colors duration-200"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="group inline-flex items-center gap-2 bg-[#FAFAFA] text-[#09090B] px-5 py-2.5 font-medium text-sm hover:bg-[#FF3300] hover:text-white transition-colors duration-200"
                  >
                    <LogIn size={15} />
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden text-[#FAFAFA]" aria-label="Toggle menu">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-5 py-6 flex flex-col gap-5">
              <Link to="/" onClick={closeMenu} className={mobileLinkClass("/", true)} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                Home
              </Link>

              {isStudent && (
                <Link to="/student" onClick={closeMenu} className={mobileLinkClass("/student")} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Student Portal
                </Link>
              )}

              {isRecruiter && (
                <Link to="/recruiter" onClick={closeMenu} className={mobileLinkClass("/recruiter")} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Recruiter Portal
                </Link>
              )}

      {(isStudent || !token) && (
  <Link to="/jobs" onClick={closeMenu} className={mobileLinkClass("/jobs")} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
    Jobs
  </Link>
)}
<Link to="/livejobs" onClick={closeMenu} className={mobileLinkClass("/livejobs")} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
  Live Jobs
</Link>

              <div className="pt-2 border-t border-white/10">
                {token ? (
                  <button
                    onClick={handleLogout}
                    className="w-full inline-flex items-center justify-center gap-2 border border-white/25 text-[#FAFAFA] px-5 py-3 font-medium text-sm hover:border-[#FF3300] hover:text-[#FF3300] transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 bg-[#FAFAFA] text-[#09090B] px-5 py-3 font-medium text-sm"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      <main>
        <Outlet />
      </main>

      {/* Hide footer on homepage AND auth pages */}
      {!isHomePage && !isAuthPage && (
        <footer className="bg-[#09090B] border-t border-white/10">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-8">
            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/35" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              © {new Date().getFullYear()} Career Connector — Powered by AI to bridge the gap between talent and opportunity.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
