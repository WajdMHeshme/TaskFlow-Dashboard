import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Topbar from "../components/TopBar/TopBar";
import Sidebar from "../components/SidBar/SidBar";

const BREAKPOINT = 768; // md

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < BREAKPOINT);
  const { i18n } = useTranslation();

  // local state for current language to force rerender when language changes
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < BREAKPOINT) setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // subscribe to language changes so component re-renders reliably
  useEffect(() => {
    const onLanguageChanged = (l: string) => setLang(l);
    i18n.on("languageChanged", onLanguageChanged);
    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, [i18n]);

  // ضبط اتجاه الصفحة حسب اللغة (يعمل عندما يتغير lang)
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  function toggleSidebar() {
    if (window.innerWidth < BREAKPOINT) return;
    setCollapsed((s) => !s);
  }

  // تغيير الهامش حسب اللغة (ml-20 => mr-20 عند العربية)
  const mainMargin =
    lang === "ar"
      ? collapsed
        ? "mr-20"
        : "mr-64"
      : collapsed
      ? "ml-20"
      : "ml-64";

  return (
    <div className="min-h-screen text-white bg-linear-to-br from-[#07121a] via-[#08221a] to-[#0e2b1f]">
      <Topbar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className={`flex ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
        <Sidebar collapsed={collapsed} />
        <main className={`flex-1 p-6 ${mainMargin} pt-20 transition-all duration-200`}>
          <Outlet /> {/* سيتم عرض الصفحات الفرعية هنا */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
