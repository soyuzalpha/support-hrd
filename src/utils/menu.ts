import {
  Home,
  BarChart3,
  Settings,
  Users,
  Bell,
  MessageSquare,
  Plus,
  LogOut,
  PartyPopper,
  BookUser,
  PersonStanding,
  ShieldAlert,
  HandMetal,
  HandGrab,
  Ship,
  Medal,
  DoorOpen,
} from "lucide-react";

export const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
  { id: "master", label: "Master", icon: BarChart3, path: "/dashboard/master" },
  // { id: "attendance", label: "Attendance", icon: BookUser, path: "/dashboard/attendance" },
  { id: "leave", label: "Leaves", icon: DoorOpen, path: "/dashboard/leaves" },
  { id: "warning", label: "Employe Warning", icon: ShieldAlert, path: "/dashboard/employee-warning" },
  { id: "Appraisal", label: "Employe Appraisal", icon: Medal, path: "/dashboard/employee-appraisal" },
  { id: "detail", label: "Details", icon: BookUser, path: "/dashboard/detail" },
  // { id: "team", label: "Team", icon: Users, },
  // { id: "messages", label: "Messages", icon: MessageSquare },
  // { id: "notifications", label: "Notifications", icon: Bell },
  // { id: "settings", label: "Settings", icon: Settings },
];

export const roleAccess = {
  Superadmin: "all",
  Admin: "all",
  Manager: "all",
  Staff: ["dashboard", "leave", "detail"],
  "Super Admin": "all",
} as const;
