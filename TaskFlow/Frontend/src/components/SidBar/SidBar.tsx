import { NavLink, useNavigate } from "react-router-dom";
import { navItems } from "../navigator/navItem";
import { logout as apiLogout } from "../../api/api";
import { IoExitOutline } from "react-icons/io5";

type Props = {
  collapsed: boolean;
};

const Sidebar = ({ collapsed }: Props) => {
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
        fixed top-20 left-0 z-30
        ${collapsed ? "w-20" : "w-64"}
        text-white
        border-r border-gray-500/50
        h-[calc(100vh-5rem)]
        bg-transparent
        transition-all duration-200
      `}
    >
      <div className="p-5 h-full flex flex-col justify-between">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.name}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition
     ${isActive ? "bg-emerald-600/30" : ""}
     ${collapsed ? "justify-center px-0" : ""}`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={`${collapsed ? "hidden" : "inline"}`}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition ${
            collapsed ? "justify-center" : ""
          }`}
          title="Logout"
        >
          <IoExitOutline size={22} className="shrink-0" />
          <span className={`${collapsed ? "hidden" : "ml-2 inline"}`}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
