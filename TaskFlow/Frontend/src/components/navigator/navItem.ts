// navItems.ts

import type { IconType } from "react-icons";
import { AiOutlineHome, AiOutlineFolder, AiOutlineCheckCircle, AiOutlineTeam, AiOutlineSetting } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { IoTrashSharp } from "react-icons/io5";
import { TbTagStarred } from "react-icons/tb";

export interface NavItem {
  name: string;
  path: string;
  icon: IconType;
}

export const navItems: NavItem[] = [
  { name: "Overview", path: "/dashboard", icon: AiOutlineHome },
  { name: "Projects", path: "/dashboard/projects", icon: AiOutlineFolder },
  { name: "Tasks", path: "/dashboard/tasks", icon: AiOutlineCheckCircle },
  { name: "Trash", path: "/dashboard/team", icon: IoTrashSharp   },
  { name: "Starred", path: "/dashboard/team", icon: TbTagStarred    },
  { name: "Settings", path: "/dashboard/settings", icon: AiOutlineSetting },
];
