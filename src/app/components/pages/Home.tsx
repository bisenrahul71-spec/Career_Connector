import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import Lenis from "lenis";
import {
  BrainCircuit, Menu, X, ArrowUpRight, Search, MapPin, ArrowRight, Sparkles,
  FileScan, Target, TrendingUp, Building2, Users, Briefcase, CheckCircle2,
} from "lucide-react";
import API from "../../src/api/config";

const HERO_IMG = "https://images.unsplash.com/photo-1758773263238-1989d0cc788c";
const RECRUITER_IMG = "https://images.unsplash.com/photo-1740933084056-078fac872bff";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Jobs", href: "#jobs" },
  { label: "Recruiters", href: "#recruiters" },
];

 const FEATURES = [
  { n: "01", icon: BrainCircuit, title: "AI Career Recommender", desc: "Personalized job-role suggestions powered by Gemini, analyzing your full profile to surface the roles you'll actually thrive in." },
  { n: "02", icon: FileScan, title: "Resume Insight Engine", desc: "Automated extraction of technical and soft skills from PDF resumes using advanced multimodal AI analysis." },
  { n: "03", icon: Target, title: "Aptitude & Personality Mapping", desc: "LRDI, QA and VARC scores fused with MBTI types feed an intelligent recommendation engine built for fit." },
  { n: "04", icon: TrendingUp, title: "Skill Gap Analysis", desc: "Actionable, market-aware guidance on exactly what to learn next based on real-time demand and your goals." },
  { n: "05", icon: Building2, title: "Recruiter Portal", desc: "A secure command center for employers to post roles, manage requirements and review AI-ranked candidates." },
  { n: "06", icon: Users, title: "Student Portal", desc: "One dashboard to upload your resume, take assessments, and track your journey from application to offer." },
];

const MANIFESTO = [
  { n: "01", title: "Guidance, democratized.", body: "Great career advice shouldn't be a privilege. We put an AI mentor in every pocket — analyzing, mapping and recommending with zero bias and total transparency." },
  { n: "02", title: "Signal over noise.", body: "Job boards flood you with listings. We compute genuine fit — matching cognition, personality and skill against the role, not just keywords." },
  { n: "03", title: "The gap, made visible.", body: "You can't close what you can't see. We turn ambition into a concrete learning path, benchmarked against live market demand." },
];

const RIBBON_ITEMS = [
  "AI CAREER RECOMMENDER", "RESUME INSIGHT ENGINE", "APTITUDE MAPPING",
  "SKILL GAP ANALYSIS", "PERSONALITY PROFILING", "POWERED BY GEMINI",
];

const RECRUITER_CARDS = [
  { icon: Briefcase, title: "Post a Job", sub: "Takes less than 2 minutes" },
  { icon: BrainCircuit, title: "AI Matches Candidates", sub: "Powered by Gemini" },
  { icon: CheckCircle2, title: "Auto-Shortlisted", sub: "Top matches, ranked instantly" },
];

const lineVariants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.12 },
  }),
};

export function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applying, setApplying] = useState<string | null>(null);
  const [applyResult, setApplyResult] = useState<{ score: number; status: string } | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const recruiterRef = useRef(null);
  const { scrollYProgress: recruiterScroll } = useScroll({ target: recruiterRef, offset: ["start end", "end start"] });
  const recruiterImgY = useTransform(recruiterScroll, [0, 1], ["-8%", "12%"]);

  useEffect(() => {
    fetchJobs();
    const saved = localStorage.getItem("appliedJobs");
    if (saved) setAppliedJobs(JSON.parse(saved));
    setRole(localStorage.getItem("role"));

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: any;
    let raf: number;
    if (!prefersReduced) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (lenis) lenis.destroy();
    };
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/api/jobs/");
      setAllJobs(res.data);
    } catch {
      console.error("Failed to fetch jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const token = localStorage.getItem("token");

  const handleSearch = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (searchLocation) params.set("location", searchLocation);
    navigate(`/livejobs?${params.toString()}`);
  };

  const handleStudentPortal = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate("/student");
  };

  const handleRecruiterPortal = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate("/recruiter");
  };
  const handlePostJob = () => {
  if (role === "student") {
    alert("Please login as a recruiter to post a job.");
    return;
  }
  handleRecruiterPortal();
};

  const handleApply = async (jobId: string) => {
    if (!token) {
      alert("Please login first to apply for jobs!");
      navigate("/login");
      return;
    }
    if (appliedJobs.includes(jobId)) {
      alert("You have already applied for this job!");
      return;
    }
    setApplying(jobId);
    try {
      const res = await API.post("/api/applications/apply", { job_id: jobId });
      const updated = [...appliedJobs, jobId];
      setAppliedJobs(updated);
      localStorage.setItem("appliedJobs", JSON.stringify(updated));
      setApplyResult({ score: res.data.match_score, status: res.data.status });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (detail === "Already applied") {
        alert("You have already applied for this job!");
      } else if (detail === "Please upload your resume before applying for jobs") {
        alert("Please upload your resume first before applying!");
        navigate("/student/resume");
      } else {
        alert(detail || "Failed to apply. Please try again.");
      }
    } finally {
      setApplying(null);
    }
  };

  const featuredJobs = allJobs.slice(0, 6);
  const topJob = featuredJobs[0];

  return (
    <div className="font-body bg-void min-h-screen" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/10" : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto max-w-[1400px] px-5 sm:px-8 h-[72px] flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
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
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((l) => (
  <a key={l.label} href={l.href} className="text-[13px] uppercase tracking-[0.2em] text-white/60 hover:text-white pb-1 border-b-2 border-transparent hover:border-[#FF3300] transition-colors duration-200" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
    {l.label}
  </a>
))}
{role !== "recruiter" && (
  <button
    onClick={handleStudentPortal}
    className="text-[13px] uppercase tracking-[0.2em] text-white/60 hover:text-white pb-1 border-b-2 border-transparent hover:border-[#FF3300] transition-colors duration-200"
    style={{ fontFamily: '"JetBrains Mono", monospace' }}
  >
    Student Portal
  </button>
)}
{role !== "student" && (
  <button
    onClick={handleRecruiterPortal}
    className="text-[13px] uppercase tracking-[0.2em] text-white/60 hover:text-white pb-1 border-b-2 border-transparent hover:border-[#FF3300] transition-colors duration-200"
    style={{ fontFamily: '"JetBrains Mono", monospace' }}
  >
    Recruiter Portal
  </button>
)}
          </div>

          {/* Get Started Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="group inline-flex items-center gap-2 bg-[#FAFAFA] text-[#09090B] px-5 py-2.5 font-medium text-sm hover:bg-[#FF3300] hover:text-white transition-colors duration-200">
              Get started
              <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden text-[#FAFAFA]" aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-5 py-6 flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="text-xs uppercase tracking-[0.2em] text-white/70" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {l.label}
              </a>
            ))}
            {role !== "recruiter" && (
              <button
                onClick={() => { setMobileOpen(false); handleStudentPortal(); }}
                className="text-xs uppercase tracking-[0.2em] text-white/70 text-left"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                Student Portal
              </button>
            )}
            {role !== "student" && (
              <button
                onClick={() => { setMobileOpen(false); handleRecruiterPortal(); }}
                className="text-xs uppercase tracking-[0.2em] text-white/70 text-left"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                Recruiter Portal
              </button>
            )}
            <Link to="/login" onClick={() => setMobileOpen(false)} className="bg-[#FAFAFA] text-[#09090B] px-5 py-3 text-center font-medium text-sm">
              Get started
            </Link>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section id="home" ref={heroRef} className="relative bg-[#09090B] min-h-screen overflow-hidden pt-[72px]">
          <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#FF3300]/20 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[360px] w-[360px] rounded-full bg-[#FF3300]/10 blur-[120px]" />

          <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-6 pt-16 lg:pt-24 pb-10">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 w-fit border border-white/15 px-3 py-1.5 mb-8">
                <Sparkles size={13} className="text-[#FF3300]" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/70" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  AI-Powered Ecosystem
                </span>
              </motion.div>

              <h1 className="font-semibold text-[#FAFAFA] tracking-tighter leading-[0.92] text-[13vw] sm:text-[9vw] lg:text-[5.4vw]" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                <span className="overflow-hidden block">
                  <motion.span custom={0} variants={lineVariants} initial="hidden" animate="show" className="block">
                    Bridging talent
                  </motion.span>
                </span>
                <span className="overflow-hidden block">
                  <motion.span custom={1} variants={lineVariants} initial="hidden" animate="show" className="block">
                    &amp; opportunity
                  </motion.span>
                </span>
                <span className="overflow-hidden block">
                  <motion.span custom={2} variants={lineVariants} initial="hidden" animate="show" className="block">
                    with <span className="text-[#FF3300] italic">intelligence.</span>
                  </motion.span>
                </span>
              </h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9 }} className="mt-8 max-w-xl text-white/55 text-base sm:text-lg leading-relaxed">
  Democratizing career guidance through AI resume analysis, aptitude testing, and personality profiling that deliver data-backed career paths and close skill gaps for job seekers and employers alike.
</motion.p>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.05 }} className="mt-10 flex flex-col sm:flex-row border border-white/15 bg-white/[0.03] backdrop-blur-sm">
                <label className="flex items-center gap-3 px-4 py-4 flex-1 border-b sm:border-b-0 sm:border-r border-white/12">
                  <Search size={18} className="text-white/40 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Job title, skills, or company"
                    className="bg-transparent outline-none w-full text-sm text-[#FAFAFA] placeholder:text-white/35"
                  />
                </label>
                <label className="flex items-center gap-3 px-4 py-4 sm:w-56 border-b sm:border-b-0 sm:border-r border-white/12">
                  <MapPin size={18} className="text-white/40 shrink-0" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Location"
                    className="bg-transparent outline-none w-full text-sm text-[#FAFAFA] placeholder:text-white/35"
                  />
                </label>
                <button onClick={handleSearch} className="group bg-[#FF3300] text-white px-6 py-4 font-medium text-sm inline-flex items-center justify-center gap-2 hover:brightness-110 transition-[filter] duration-200">
                  Search Jobs
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.25 }} className="mt-6 flex flex-wrap gap-3">
                {role !== "recruiter" && (
                  <button
                    onClick={handleStudentPortal}
                    className="group inline-flex items-center gap-2 bg-[#FAFAFA] text-[#09090B] px-6 py-3 font-medium text-sm hover:bg-white transition-colors duration-200"
                  >
                    Get Started as Student
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                )}
                {role !== "student" && (
                  <button
                    onClick={handleRecruiterPortal}
                    className="group inline-flex items-center gap-2 border border-white/25 text-[#FAFAFA] px-6 py-3 font-medium text-sm hover:border-white/60 transition-colors duration-200"
                  >
                    I'm a Recruiter
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                )}
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative">
              <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative h-[420px] lg:h-full min-h-[420px] overflow-hidden border border-white/12">
                <motion.img src={HERO_IMG} alt="Professional working on career analytics" style={{ y: imgY, scale: imgScale }} className="absolute inset-0 h-[130%] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/60" style={{ fontFamily: '"JetBrains Mono", monospace' }}>Live match</p>
                    <p className="text-2xl text-[#FAFAFA] mt-1" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                      {topJob ? `${topJob.title} · ${topJob.company}` : "Data Analyst · Amazon"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl text-[#FF3300] leading-none" style={{ fontFamily: '"Clash Display", sans-serif' }}>94%</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 mt-1" style={{ fontFamily: '"JetBrains Mono", monospace' }}>fit score</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="relative border-t border-white/10 mt-4">
            <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {[
                { value: "12k+", label: "Careers mapped" },
                { value: "94%", label: "Match precision" },
                { value: "2 min", label: "To post a job" },
                { value: "500+", label: "Hiring partners" },
              ].map((s) => (
                <div key={s.label} className="py-6 px-2 md:px-6 first:pl-0">
                  <p className="text-3xl sm:text-4xl text-[#FAFAFA] tracking-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>{s.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 mt-1" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIBBON */}
        <div className="bg-[#FF3300] text-[#09090B] py-3.5 border-y border-black/10 select-none">
          <Marquee speed={38} gradient={false} autoFill>
            {RIBBON_ITEMS.map((t, i) => (
              <span key={i} className="mx-8 inline-flex items-center gap-8 text-xs uppercase tracking-[0.3em] font-medium" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {t}
                <span className="opacity-60">◆</span>
              </span>
            ))}
          </Marquee>
        </div>

        {/* FEATURES */}
        <section id="features" className="bg-[#F4F0EA] text-[#121212] py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF3300] mb-5" style={{ fontFamily: '"JetBrains Mono", monospace' }}>/ The System</p>
                <h2 className="font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                  Powerful tooling for career success.
                </h2>
              </div>
              <p className="text-black/60 max-w-sm text-sm leading-relaxed">
                Six connected engines that read, reason and recommend — turning scattered signals into one clear direction.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/10">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.n}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative border-r border-b border-black/10 p-8 lg:p-10 hover:bg-[#09090B] hover:text-[#FAFAFA] transition-colors duration-300"
                  >
                    <div className="flex items-start justify-between mb-14">
                      <span className="grid place-items-center h-12 w-12 border border-black/15 group-hover:border-white/20 text-[#FF3300] transition-colors duration-300">
                        <Icon size={22} strokeWidth={1.8} />
                      </span>
                      <span className="text-xs tracking-[0.2em] text-black/30 group-hover:text-white/30 transition-colors duration-300" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{f.n}</span>
                    </div>
                    <h3 className="text-xl font-medium tracking-tight mb-3" style={{ fontFamily: '"Clash Display", sans-serif' }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed text-black/60 group-hover:text-white/55 transition-colors duration-300">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED JOBS */}
        <section id="jobs" className="bg-[#F4F0EA] text-[#121212] pb-24 sm:pb-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="flex items-end justify-between gap-6 mb-12 pt-8 border-t border-black/10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF3300] mb-5" style={{ fontFamily: '"JetBrains Mono", monospace' }}>/ Featured Roles</p>
                <h2 className="font-semibold text-4xl sm:text-5xl tracking-tighter leading-[0.95]" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                  Apply with AI skill matching.
                </h2>
              </div>
              <Link to="/livejobs" className="group hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#121212] hover:text-[#FF3300] transition-colors duration-200" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                View all jobs
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {applyResult && (
              <div className={`mb-8 p-5 border-2 ${applyResult.status === "shortlisted" ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"}`}>
                <p className="font-semibold">
                  {applyResult.status === "shortlisted" ? "Congratulations! You've been shortlisted!" : "Not shortlisted this time"}
                </p>
                <p className="text-sm text-black/60 mt-1">Your skill match score: {applyResult.score}%</p>
                <button onClick={() => setApplyResult(null)} className="text-xs underline mt-2 text-black/40">Dismiss</button>
              </div>
            )}

            {loadingJobs ? (
              <p className="text-black/50 text-sm">Loading jobs...</p>
            ) : featuredJobs.length === 0 ? (
              <p className="text-black/50 text-sm">No jobs posted yet. Check back soon!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredJobs.map((job, i) => (
                  <motion.article
                    key={job._id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="group bg-[#FAFAFA] border border-black/10 p-6 flex flex-col hover:-translate-y-1 hover:border-black/40 hover:shadow-[6px_6px_0_0_#FF3300] transition-[transform,border-color,box-shadow] duration-200"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[9px] uppercase tracking-[0.2em] bg-[#FF3300]/10 text-[#FF3300] px-2.5 py-1" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        Career Connector
                      </span>
                    </div>
                    <h3 className="text-2xl font-medium tracking-tight leading-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>{job.title}</h3>
                    <p className="text-[#FF3300] font-medium text-sm mt-1">{job.company}</p>
                    <p className="flex items-center gap-1.5 text-black/50 text-xs mt-2">
                      <MapPin size={13} /> {job.location}
                    </p>
                    {job.description && <p className="text-sm text-black/60 leading-relaxed mt-4 line-clamp-2 whitespace-pre-line">{job.description}</p>}
                    <div className="flex flex-wrap gap-2 mt-5 mb-6">
                      {job.skills_required?.slice(0, 4).map((s: string) => (
                        <span key={s} className="text-[10px] uppercase tracking-[0.1em] border border-black/12 px-2.5 py-1 text-black/70" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {s}
                        </span>
                      ))}
                    </div>
         {appliedJobs.includes(job._id) ? (
  <div className="mt-auto inline-flex items-center justify-center gap-2 bg-green-100 text-green-700 py-3 text-sm font-medium">
    Applied!
  </div>
) : (
  <button
    onClick={() => navigate(`/jobs?highlight=${job._id}`)}
    className="group/btn mt-auto inline-flex items-center justify-center gap-2 bg-[#09090B] text-[#FAFAFA] py-3 text-sm font-medium hover:bg-[#FF3300] transition-colors duration-200"
  >
    Apply Now
    <ArrowRight size={15} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
  </button>
)}
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RECRUITER */}
        <section id="recruiters" ref={recruiterRef} className="bg-[#09090B] text-[#FAFAFA] py-24 sm:py-32 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF3300] mb-6" style={{ fontFamily: '"JetBrains Mono", monospace' }}>/ Career Connector for Recruiters</p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 flex flex-col justify-between border border-white/12 p-8 lg:p-12">
                <h2 className="font-semibold text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.9]" style={{ fontFamily: '"Clash Display", sans-serif' }}>
                  Hire your next great candidate. <span className="italic text-[#FF3300]">Fast.</span>
                </h2>
                <div className="mt-10">
                  <p className="text-white/55 max-w-md leading-relaxed">
                    No matter the skills, experience or qualifications you're looking for, our AI-powered matching surfaces the right candidates — ranked, scored and ready.
                  </p>
                  <button
                    onClick={handlePostJob}
                    className="group mt-8 inline-flex items-center gap-2 bg-[#FAFAFA] text-[#09090B] px-7 py-3.5 font-medium text-sm hover:bg-[#FF3300] hover:text-white transition-colors duration-200"
                  >
                    Post a Job
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="relative h-56 overflow-hidden border border-white/12">
                  <motion.img src={RECRUITER_IMG} alt="Modern corporate hiring meeting room" style={{ y: recruiterImgY }} className="absolute inset-0 h-[125%] w-full object-cover" />
                  <div className="absolute inset-0 bg-[#09090B]/30" />
                </div>
                <div className="flex flex-col gap-3">
                  {RECRUITER_CARDS.map((c, i) => (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="group flex items-center gap-4 border border-white/12 p-4 hover:border-[#FF3300]/50 transition-colors duration-200"
                    >
                      <span className="grid place-items-center h-11 w-11 bg-white/[0.04] text-[#FF3300] shrink-0">
                        <c.icon size={20} strokeWidth={1.9} />
                      </span>
                      <div>
                        <p className="text-base font-medium" style={{ fontFamily: '"Clash Display", sans-serif' }}>{c.title}</p>
                        <p className="text-white/45 text-xs mt-0.5">{c.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="bg-[#09090B] text-[#FAFAFA] py-24 sm:py-32 border-t border-white/10">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <h2 className="font-semibold text-4xl sm:text-5xl tracking-tighter mb-20 max-w-2xl leading-[0.95]" style={{ fontFamily: '"Clash Display", sans-serif' }}>
              Why we built <span className="text-[#FF3300]">Career Connector.</span>
            </h2>
            <div className="flex flex-col">
              {MANIFESTO.map((m) => (
                <motion.div
                  key={m.n}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 border-t border-white/10 items-start"
                >
                  <div className="md:col-span-3">
                    <span className="text-7xl sm:text-8xl text-[#FF3300] leading-none tracking-tighter" style={{ fontFamily: '"Clash Display", sans-serif' }}>{m.n}</span>
                  </div>
                  <h3 className="md:col-span-4 text-2xl sm:text-3xl font-medium tracking-tight leading-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>{m.title}</h3>
                  <p className="md:col-span-5 text-white/55 text-base leading-relaxed md:pt-2">{m.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#09090B] text-[#FAFAFA] border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24 sm:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-start">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF3300] mb-8" style={{ fontFamily: '"JetBrains Mono", monospace' }}>/ Start today</p>
            <h2 className="font-semibold text-[13vw] sm:text-[10vw] lg:text-[8vw] leading-[0.85] tracking-tighter" style={{ fontFamily: '"Clash Display", sans-serif' }}>
              Map your <span className="text-[#FF3300] italic">future.</span>
            </h2>
            <div className="mt-12 flex flex-wrap gap-4">
              {role !== "recruiter" && (
                <button
                  onClick={handleStudentPortal}
                  className="group inline-flex items-center gap-2 bg-[#FAFAFA] text-[#09090B] px-8 py-4 font-medium text-sm hover:bg-[#FF3300] hover:text-white transition-colors duration-200"
                >
                  Get Started as Student
                  <ArrowUpRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
              {role !== "student" && (
                <button
                  onClick={handleRecruiterPortal}
                  className="group inline-flex items-center gap-2 border border-white/25 px-8 py-4 font-medium text-sm hover:border-white/60 transition-colors duration-200"
                >
                  I'm a Recruiter
                  <ArrowUpRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-8 w-8 bg-[#FF3300] text-white">
                <BrainCircuit size={17} />
              </span>
              <span className="font-semibold text-base tracking-tight" style={{ fontFamily: '"Clash Display", sans-serif' }}>Career Connector</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
  {["About", "Contact", "Terms of Service", "Privacy Policy", "FAQ"].map((l) => (
    <a key={l} href="#" className="text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-200" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      {l}
    </a>
  ))}
</div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              © {new Date().getFullYear()} Career Connector
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
