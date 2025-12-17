import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import AuthLayout from "../pages/Auth/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardLayout from "../layout/DashboardLayout";



const isAuthenticated = () => {
  return (
    !!localStorage.getItem("token") ||
    !!sessionStorage.getItem("token")
  );
};

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // redirect root
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },

      // Auth pages
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },

      // Protected Dashboard
      {
        path: "dashboard",
        element: isAuthenticated() ? (
          <DashboardLayout children={undefined} />
        ) : (
          <Navigate to="/login" replace />
        ),
        children: [
          // { index: true, element: <DashboardHome /> },
          // لاحقًا:
          // { path: "projects", element: <Projects /> },
          // { path: "tasks", element: <Tasks /> },
        ],
      },
    ],
  },
]);

export default router;
