import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { navItems } from "../navigator/navItem";
import { logout as apiLogout } from "../../api/api";
import { IoExitOutline } from "react-icons/io5";
import { showSuccess } from "../../utils/toast/toastUtils/toastUtils";
import { useTranslation } from "react-i18next";

type Props = {
  collapsed: boolean;
};

const Sidebar = ({ collapsed }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";

  async function handleLogout() {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      showSuccess(t("logout_success") ?? "Logged out successfully!");
      navigate("/login");
    }
  }

  return (
    <aside
      className={`
        fixed top-20 ${isRTL ? "right-0" : "left-0"} z-30
        ${collapsed ? "w-20" : "w-64"}
        text-white
        ${isRTL ? "border-l" : "border-r"} border-gray-500/50
        h-[calc(100vh-5rem)]
        bg-transparent
        transition-all duration-200
      `}
    >
      <div className="p-5 h-full flex flex-col justify-between">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            // --- طريقة بديلة: مطابقة صارمة (exact) باستخدام location
            // --- لو تحب تعتبر المسارات الفرعية تابعة (مثلاً /tasks/*) استخدم:
            // const isActiveStartsWith = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end // <-- مهم: يجعل المطابقة exact (لا partial match)
                title={t(item.nameKey)}
                className={({ isActive }) =>
                  // نستخدم isActive من NavLink (الذي يحترم end)،
                  // أو نقدر نستخدم isExactActive بدل isActive لو حبيت override
                  `flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition
                   ${isActive ? "bg-emerald-600/30" : ""}
                   ${collapsed ? "justify-center px-0" : ""} 
                   ${isRTL ? "flex-row-reverse" : "flex-row"}`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={`${collapsed ? "hidden" : "inline"} ${isRTL ? "text-right" : "text-left"}`}>
                  {t(item.nameKey)}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold flex items-center transition ${
            collapsed ? "justify-center" : "justify-center"
          } ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          title={t("logout")}
        >
          <IoExitOutline size={22} className="shrink-0" />
          <span className={`${collapsed ? "hidden" : "ml-2 inline"}`}>
            {t("logout")}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
