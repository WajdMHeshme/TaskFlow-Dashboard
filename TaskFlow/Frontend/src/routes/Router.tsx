import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import AuthLayout from "../pages/Auth/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "./protected/ProtectedRoute";
import TasksPage from "../pages/Dashboard/TasksPage";
 import CreateProfilePage from "../pages/Dashboard/EditeProfilePage";
import ProfilePage from "../pages/Dashboard/ProfilePage";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // redirect root
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
          { path: "tasks", element: <TasksPage /> },
          {
            path: "profile",
            element: <ProfilePage />,
          },

          // create / edit my profile
           { path: "profile/create", element: <CreateProfilePage /> },
        ],
      },
    ],
  },
]);

export default router;
