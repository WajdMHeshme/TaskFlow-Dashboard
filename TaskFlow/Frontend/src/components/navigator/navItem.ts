import type { IconType } from "react-icons";
import { AiOutlineFolder, AiOutlineCheckCircle, AiOutlineSetting } from "react-icons/ai";
import { IoTrashSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { TbTagStarred } from "react-icons/tb";

export interface NavItem {
  nameKey: string; // مفتاح الترجمة
  path: string;
  icon: IconType;
}

export const navItems: NavItem[] = [
  { nameKey: "dashboard", path: "/dashboard", icon: MdDashboard },
  { nameKey: "projects", path: "/dashboard/projects", icon: AiOutlineFolder },
  { nameKey: "tasks", path: "/dashboard/tasks", icon: AiOutlineCheckCircle },
  { nameKey: "trash", path: "/dashboard/team", icon: IoTrashSharp },
  { nameKey: "starred", path: "/dashboard/tasks/favorites", icon: TbTagStarred },
  { nameKey: "settings", path: "/dashboard/settings", icon: AiOutlineSetting },
];
