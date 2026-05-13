import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { ClientProfile } from "./pages/client/ClientProfile";
import { MyProjects } from "./pages/client/MyProjects";
import { CreateProject } from "./pages/client/CreateProject";
import { ProjectDetails } from "./pages/client/ProjectDetails";
import { ExpertDashboard } from "./pages/expert/ExpertDashboard";
import { ExpertProfile } from "./pages/expert/ExpertProfile";
import { ExpertProfileEdit } from "./pages/expert/ExpertProfileEdit";
import { BrowseProjects } from "./pages/expert/BrowseProjects";
import { ProjectOpportunity } from "./pages/expert/ProjectOpportunity";
import { Workspace } from "./pages/workspace/Workspace";
import { WorkspaceOverview } from "./pages/workspace/WorkspaceOverview";
import { WorkspaceMilestones } from "./pages/workspace/WorkspaceMilestones";
import { WorkspaceMessages } from "./pages/workspace/WorkspaceMessages";
import { WorkspaceFiles } from "./pages/workspace/WorkspaceFiles";
import { WorkspaceAudit } from "./pages/workspace/WorkspaceAudit";
import { NotFound } from "./pages/NotFound";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ExpertModeration } from "./pages/admin/ExpertModeration";
import { ProjectModeration } from "./pages/admin/ProjectModeration";
import { DisputeResolution } from "./pages/admin/DisputeResolution";
import { Analytics } from "./pages/admin/Analytics";

import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/client",
    element: <ProtectedRoute allowedRoles={['CLIENT']}><ClientDashboard /></ProtectedRoute>,
  },
  {
    path: "/client/profile",
    element: <ProtectedRoute allowedRoles={['CLIENT']}><ClientProfile /></ProtectedRoute>,
  },
  {
    path: "/client/projects",
    element: <ProtectedRoute allowedRoles={['CLIENT']}><MyProjects /></ProtectedRoute>,
  },
  {
    path: "/client/project/new",
    element: <ProtectedRoute allowedRoles={['CLIENT']}><CreateProject /></ProtectedRoute>,
  },
  {
    path: "/client/project/:id",
    element: <ProtectedRoute allowedRoles={['CLIENT']}><ProjectDetails /></ProtectedRoute>,
  },
  {
    path: "/expert",
    element: <ProtectedRoute allowedRoles={['EXPERT']}><ExpertDashboard /></ProtectedRoute>,
  },
  {
    path: "/expert/profile",
    element: <ProtectedRoute allowedRoles={['EXPERT']}><ExpertProfile /></ProtectedRoute>,
  },
  {
    path: "/expert/profile/edit",
    element: <ProtectedRoute allowedRoles={['EXPERT']}><ExpertProfileEdit /></ProtectedRoute>,
  },
  {
    path: "/expert/projects",
    element: <ProtectedRoute allowedRoles={['EXPERT']}><BrowseProjects /></ProtectedRoute>,
  },
  {
    path: "/expert/projects/:id",
    element: <ProtectedRoute allowedRoles={['EXPERT']}><ProjectOpportunity /></ProtectedRoute>,
  },
  {
    path: "/workspace/:id",
    element: <ProtectedRoute><Workspace /></ProtectedRoute>,
    children: [
      {
        index: true,
        Component: WorkspaceOverview,
      },
      {
        path: "milestones",
        Component: WorkspaceMilestones,
      },
      {
        path: "messages",
        Component: WorkspaceMessages,
      },
      {
        path: "files",
        Component: WorkspaceFiles,
      },
      {
        path: "audit",
        Component: WorkspaceAudit,
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: "/admin/experts",
    element: <ProtectedRoute allowedRoles={['ADMIN']}><ExpertModeration /></ProtectedRoute>,
  },
  {
    path: "/admin/projects",
    element: <ProtectedRoute allowedRoles={['ADMIN']}><ProjectModeration /></ProtectedRoute>,
  },
  {
    path: "/admin/disputes",
    element: <ProtectedRoute allowedRoles={['ADMIN']}><DisputeResolution /></ProtectedRoute>,
  },
  {
    path: "/admin/analytics",
    element: <ProtectedRoute allowedRoles={['ADMIN']}><Analytics /></ProtectedRoute>,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
