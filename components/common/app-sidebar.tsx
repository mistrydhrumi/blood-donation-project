"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DASHBOARD_LINKS } from "@/constant/dashboard-link";
import { Droplets, LogOut } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "../auth/BrandLogo";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="bg-white">
      <SidebarHeader>
        <SidebarContent className="pb-4 border-b border-red-200">
          <div className="transition-all duration-300 overflow-hidden whitespace-nowrap group-data-[collapsible=icon]:hidden">
            <Link href="/dashboard">
              <div className="flex items-center gap-2">
                <span className="brand-mark inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-600 text-white shadow-sm">
                  <Droplets size={18} fill="currentColor" />
                </span>

                <span className="font-semibold text-xl">RaktSetu</span>
              </div>
            </Link>
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <span className="brand-mark inline-flex items-center justify-center size-8 rounded-xl bg-red-600 text-white shadow-sm  ">
              <Droplets size={18} fill="currentColor" />
            </span>
          </div>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent className="p-2 flex flex-col gap-2">
        <SidebarMenu>
          {DASHBOARD_LINKS.map((link) => (
            <SidebarMenuItem key={link.title} className="mt-2">
              <SidebarMenuButton
                render={<Link href={link.href} />}
                className={`p-2 hover:bg-red-100  active:bg-red-100             
                     ${link.href === pathname ? "bg-red-100" : ""}`}
                isActive={link.href === pathname}
                tooltip={link.title}
              >
                <link.icon />
                <span className="text-left">{link.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="border-t border-red-300 pt-4">
            <SidebarMenuButton className="bg-red-500 text-white hover:bg-red-400 hover:text-white transition duration-200 cursor-pointer active:bg-red-400 active:text-white">
              <LogOut /> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
