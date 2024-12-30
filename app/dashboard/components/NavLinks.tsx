"use client";
import React from "react";
import { PersonIcon, CrumpledPaperIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ListCollapse } from "lucide-react";
import { RiTeamFill } from "react-icons/ri";

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard/members",
      text: "Members",
      Icon: PersonIcon,
    },
    {
      href: "/dashboard/team",
      text: "Teams",
      Icon: RiTeamFill,
    },
    {
      href: "/dashboard/todo",
      text: "Todos",
      Icon: CrumpledPaperIcon,
      children: [
        {
          href: "/dashboard/todo/details",
          text: "Todo Details",
          Icon: ListCollapse,
        },
      ],
    },
  ];

  return (
    <div className='space-y-5'>
      {links.map((link, index) => {
        const Icon = link.Icon;
        return (
          <div key={index}>
            <Link
              onClick={() => document.getElementById("sidebar-close")?.click()}
              href={link.href}
              className={cn("flex items-center gap-2 rounded-sm p-2 text-md", {
                " text-white dark:text-black bg-black dark:bg-white":
                  pathname === link.href,
              })}
            >
              <Icon />
              {link.text}
            </Link>
            {pathname.startsWith("/dashboard/todo") && link.children && (
              <div className='ml-4 space-y-2'>
                {link.children.map((childLink, childIndex) => {
                  const ChildIcon = childLink.Icon;
                  return (
                    <Link
                      onClick={() =>
                        document.getElementById("sidebar-close")?.click()
                      }
                      href={childLink.href}
                      key={childIndex}
                      className={cn(
                        "flex items-center gap-2 rounded-sm p-2 text-sm",
                        {
                          " text-white dark:text-black bg-black dark:bg-white":
                            pathname === childLink.href,
                        }
                      )}
                    >
                      <ChildIcon />
                      {childLink.text}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
