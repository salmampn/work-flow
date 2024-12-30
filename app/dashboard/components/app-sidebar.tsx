import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CrumpledPaperIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import ModeToggle from "../todo/components/ToggleDarkMode";

// Menu links
const links = [
  {
    url: "/dashboard/members",
    title: "Members",
    icon: PersonIcon,
  },
  {
    url: "/dashboard/todo",
    title: "Todos",
    icon: CrumpledPaperIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className='bg-white dark:bg-inherit'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-black dark:text-white flex gap-6 mt-6'>
            <Link href='/dashboard'>
              <h1 className='text-3xl font-bold '>Workflow</h1>
            </Link>
            <ModeToggle />
          </SidebarGroupLabel>
          <SidebarGroupContent className='flex flex-col gap-4 mt-8'>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
