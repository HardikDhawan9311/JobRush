import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { JobListingPage } from "./pages/JobListingPage";
import { JobDetailsPage } from "./pages/JobDetailsPage";
import { CandidateDashboard } from "./pages/CandidateDashboard";
import { RecruiterDashboard } from "./pages/RecruiterDashboard";
import { SavedJobsPage } from "./pages/SavedJobsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";
import { PostJobPage } from "./pages/PostJobPage";

import { JobManagePage } from "./pages/JobManagePage";
import { CandidateProfilePage } from "./pages/CandidateProfilePage";
import { MyApplicationsPage } from "./pages/MyApplicationsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
      { path: "jobs", Component: JobListingPage },
      { path: "jobs/:id", Component: JobDetailsPage },
      { path: "dashboard/candidate", Component: CandidateDashboard },
      { path: "dashboard/recruiter", Component: RecruiterDashboard },
      { path: "dashboard/recruiter/jobs/:id", Component: JobManagePage },
      { path: "saved", Component: SavedJobsPage },
      { path: "settings", Component: SettingsPage },
      { path: "profile", Component: ProfilePage },
      { path: "change-password", Component: ChangePasswordPage },
      { path: "post-job", Component: PostJobPage },
      { path: "candidate/:id", Component: CandidateProfilePage },
      { path: "applications", Component: MyApplicationsPage },
    ],
  },
]);
