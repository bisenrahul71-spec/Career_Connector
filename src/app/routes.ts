import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/pages/Home";
import { StudentDashboard } from "./components/pages/StudentDashboard";
import { ResumeUpload } from "./components/pages/ResumeUpload";
import { AptitudeTest } from "./components/pages/AptitudeTest";
import { PersonalityTest } from "./components/pages/PersonalityTest";
import { CareerRecommendations } from "./components/pages/CareerRecommendations";
import { RecruiterDashboard } from "./components/pages/RecruiterDashboard";
import { PostJob } from "./components/pages/PostJob";
import { Applicants } from "./components/pages/Applicants";
import { ApiDocs } from "./components/pages/ApiDocs";
import { Login } from "./components/pages/Login";
import { Register } from "./components/pages/Register";
import { JobListings } from "./components/pages/JobListings";
import { LiveJobs } from "./components/pages/LiveJobs";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "student", Component: StudentDashboard },
      { path: "student/resume", Component: ResumeUpload },
      { path: "student/aptitude", Component: AptitudeTest },
      { path: "student/personality", Component: PersonalityTest },
      { path: "student/recommendations", Component: CareerRecommendations },
      { path: "recruiter", Component: RecruiterDashboard },
      { path: "recruiter/post-job", Component: PostJob },
      { path: "recruiter/jobs/:jobId/applicants", Component: Applicants },
      { path: "api", Component: ApiDocs },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "jobs", Component: JobListings },
      { path: "livejobs", Component: LiveJobs },
    ],
  },
]);
