import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ClientDashboard } from "./pages/client/ClientDashboard";
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
import { NotFound } from "./pages/NotFound";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ExpertModeration } from "./pages/admin/ExpertModeration";
import { ProjectModeration } from "./pages/admin/ProjectModeration";
import { DisputeResolution } from "./pages/admin/DisputeResolution";
import { Analytics } from "./pages/admin/Analytics";

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
    Component: ClientDashboard,
  },
  {
    path: "/client/projects",
    Component: MyProjects,
  },
  {
    path: "/client/project/new",
    Component: CreateProject,
  },
  {
    path: "/client/project/:id",
    Component: ProjectDetails,
  },
  {
    path: "/expert",
    Component: ExpertDashboard,
  },
  {
    path: "/expert/profile",
    Component: ExpertProfile,
  },
  {
    path: "/expert/profile/edit",
    Component: ExpertProfileEdit,
  },
  {
    path: "/expert/projects",
    Component: BrowseProjects,
  },
  {
    path: "/expert/projects/:id",
    Component: ProjectOpportunity,
  },
  {
    path: "/workspace/:id",
    Component: Workspace,
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
    ],
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/experts",
    Component: ExpertModeration,
  },
  {
    path: "/admin/projects",
    Component: ProjectModeration,
  },
  {
    path: "/admin/disputes",
    Component: DisputeResolution,
  },
  {
    path: "/admin/analytics",
    Component: Analytics,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
