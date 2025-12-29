import type { IconType } from "react-icons"

export type ProfilePayload = {
  date: string | null | undefined
  data: ProfilePayload
  id?: number
  user_id?: number
  name?: string | null
  bio?: string | null
  info?: string | null
  image?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type TaskPayload = {
  favorites_count: number
  is_favorite: any
  id: number
  user_id?: number
  title: string
  description?: string | null
  priority?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "danger" | "primary" | "neutral";
};

export interface NavItem {
  nameKey: string;
  path: string;
  icon: IconType;
}

export type SidBarProps = {
  collapsed: boolean;
};

export type TopBarProps = {
  collapsed: boolean
  onToggle: () => void
}