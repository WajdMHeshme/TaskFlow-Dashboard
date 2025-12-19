import React, { useEffect, useState } from "react";
import Topbar from "../components/TopBar/TopBar";
import Sidebar from "../components/SidBar/SidBar";

type Props = {
  children: React.ReactNode;
};

const BREAKPOINT = 768; // md

const DashboardLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < BREAKPOINT);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < BREAKPOINT) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function toggleSidebar() {
    if (window.innerWidth < BREAKPOINT) return;

    setCollapsed((s) => !s);
  }

  const mainMargin = collapsed ? "ml-20" : "ml-64";

  return (
    <div className="min-h-screen text-white bg-linear-to-br from-[#07121a] via-[#08221a] to-[#0e2b1f]">
      <Topbar collapsed={collapsed} onToggle={toggleSidebar} />

      <div className="flex">
        <Sidebar collapsed={collapsed} />

        <main className={`flex-1 p-6 ${mainMargin} pt-20 transition-all duration-200`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
