type TopbarProps = {
  onMenuClick: () => void;
  onToggleCollapse?: () => void; // زر تصغير Sidebar للشاشات الكبيرة
};

const Topbar = ({ }: TopbarProps) => {
  return (
    <header className="flex items-center justify-between p-6 text-white border-b border-gray-500/50">
      <div className="flex items-center gap-3">


        <span className="font-bold text-lg">Dashboard</span>
      </div>


    </header>
  );
};

export default Topbar;
