import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import AuthLayout from "../pages/Auth/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "./protected/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },

      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },

      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          // sub-routes هنا
        ],
      },
    ],
  },
]);


export default router;
