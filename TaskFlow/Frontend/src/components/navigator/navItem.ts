// navItems.ts

import type { IconType } from "react-icons";
import { AiOutlineHome, AiOutlineFolder, AiOutlineCheckCircle, AiOutlineTeam, AiOutlineSetting } from "react-icons/ai";

export interface NavItem {
  name: string;
  path: string;
  icon: IconType;
}

export const navItems: NavItem[] = [
  { name: "Overview", path: "/dashboard", icon: AiOutlineHome },
  { name: "Projects", path: "/dashboard/projects", icon: AiOutlineFolder },
  { name: "Tasks", path: "/dashboard/tasks", icon: AiOutlineCheckCircle },
  { name: "Team", path: "/dashboard/team", icon: AiOutlineTeam },
  { name: "Settings", path: "/dashboard/settings", icon: AiOutlineSetting },
];
