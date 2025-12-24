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
          // Tasks
          { path: "tasks", element: <TasksPage /> },
          { path: "tasks/create", element: <CreateTaskPage /> }, // صفحة إنشاء التاسك
          { path: "tasks/:id/edit", element: <EditTaskPage/> }, // صفحة إنشاء التاسك

          // Profile
          { path: "profile", element: <ProfilePage /> },
          { path: "profile/create", element: <CreateProfilePage /> },
        ],
      },
    ],
  },
])

export default router
