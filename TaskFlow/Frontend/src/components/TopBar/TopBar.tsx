import { IoLanguage, IoMenu } from "react-icons/io5";
import { useTranslation } from "react-i18next";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

const Topbar = ({ onToggle }: Props) => {
  const { t, i18n } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || t("user_default");

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-20 flex items-center justify-between px-4 text-white border-b border-gray-500/50 bg-transparent">
      <div className="flex items-center gap-3 transition-all duration-200">
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="p-2 rounded-md hover:bg-white/10 transition"
        >
          <IoMenu size={22} />
        </button>

        <span className="font-bold text-lg">{t("dashboard")}</span>
      </div>

      <div className="flex items-center gap-3 pr-6">
        <button
        className="cursor-pointer"
          onClick={toggleLanguage}
        >
      <IoLanguage size={20}/>
        </button>

        <span className="text-sm opacity-80 font-bold">{userName}</span>

        <img
          src={user?.photo || '/assets/images/user.webp'} 
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Topbar;
