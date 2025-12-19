import { IoMenu } from "react-icons/io5";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

const Topbar = ({ onToggle }: Props) => {
  // يمكنك جلب اسم المستخدم من localStorage أو context
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "المستخدم";

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-20 flex items-center justify-between px-4 text-white border-b border-gray-500/50 bg-transparent">
      <div className={`flex items-center gap-3 transition-all duration-200`}>
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="p-2 rounded-md hover:bg-white/10 transition"
        >
          <IoMenu size={22} />
        </button>

        <span className="font-bold text-lg">Dashboard</span>
      </div>

      <div className="flex items-center gap-3 pr-6">
        <span className="text-sm opacity-80 font-bold">{userName}</span>

        <img
          src={user?.photo || '/assets/images/user.webp'} 
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Topbar;
