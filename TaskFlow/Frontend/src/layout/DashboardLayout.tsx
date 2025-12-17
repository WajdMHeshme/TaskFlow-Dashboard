import React, { useState } from "react";
import Topbar from "../components/TopBar/TopBar";
import Sidebar from "../components/SidBar/SidBar";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);       // للهواتف
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // للشاشات الكبيرة

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#07121a] via-[#08221a] to-[#0e2b1f]">
      <Topbar onMenuClick={() => setSidebarOpen((s) => !s)} />

      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed((s) => !s)}
        />

        <main
          className={`flex-1 p-6 transition-all duration-200 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
