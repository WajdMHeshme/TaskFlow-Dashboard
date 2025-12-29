import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "../App"
import AuthLayout from "../pages/Auth/AuthLayout"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import DashboardLayout from "../layout/DashboardLayout"
import ProtectedRoute from "./protected/ProtectedRoute"
import TasksPage from "../pages/Dashboard/Tasks/TasksPage"

import CreateProfilePage from "../pages/Dashboard/Profile/CreateProfilePage"
import ProfilePage from "../pages/Dashboard/Profile/ProfilePage"
import CreateTaskPage from "../pages/Dashboard/Tasks/CreateTaskPage"
import EditTaskPage from "../pages/Dashboard/Tasks/EditTaskPage"
import StarredTasksPage from "../pages/Dashboard/Tasks/StarredTasksPage"
import Dashboard from "../pages/Dashboard/Dashboard"

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Redirect root
      { index: true, element: <Navigate to="/login" replace /> },

      // ---------- AUTH ----------
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },

      // ---------- DASHBOARD (PROTECTED) ----------
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          // Tasks
          { path: "tasks", element: <TasksPage /> },
          { path: "tasks/create", element: <CreateTaskPage /> },
          { path: "tasks/:id/edit", element: <EditTaskPage/> }, 
          { path: "tasks/favorites", element: <StarredTasksPage/> }, 

          // Profile
          { path: "profile", element: <ProfilePage /> },
          { path: "profile/create", element: <CreateProfilePage /> },
        ],
      },
    ],
  },
])

export default router
