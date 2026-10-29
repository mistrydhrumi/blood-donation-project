import { ClipboardList, LayoutDashboardIcon, Search } from "lucide-react";
export const DASHBOARD_LINKS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Find Blood",
    href: "/dashboard/find-blood",
    icon: Search,
  },
  {
    title: "My Blood Requests",
    href: "/dashboard/my-blood-requests",
    icon: ClipboardList,
  },
];
