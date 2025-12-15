import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className=" min-h-screen bg-gradient-to-br from-[#07121a] via-[#08221a] to-[#0e2b1f] flex items-center justify-center p-6">
      <Outlet />
    </div>
  );
}
