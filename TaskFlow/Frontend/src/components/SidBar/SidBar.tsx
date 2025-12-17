// Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { navItems } from "../navigator/navItem";
import { logout as apiLogout } from "../../api/api";
import { IoExitOutline, IoCloseOutline, IoMenuOutline } from "react-icons/io5";

type SidebarProps = {
  open: boolean; // للهواتف
  collapsed: boolean; // للشاشات الكبيرة
  onClose: () => void;
  onToggleCollapse: () => void; // زر تصغير Sidebar
};

const Sidebar = ({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  }

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 text-white border-r border-gray-500/50
        transform transition-all duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}   
        md:static md:translate-x-0
        ${collapsed ? "md:w-20" : "md:w-64"}             
        h-[calc(100vh-79.8px)]
      `}
    >
      <div className="p-5 h-full flex flex-col justify-between">
        <div>

          <div className="flex justify-end md:hidden mb-4">
            <button onClick={onClose} className="text-white hover:text-emerald-400">
              <IoCloseOutline size={25} />
            </button>
          </div>


          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition
                    ${isActive ? "bg-emerald-600/30" : ""}`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center"
        >
          <IoExitOutline size={25} />
          {!collapsed && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
