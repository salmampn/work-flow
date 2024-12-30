"use client";
import React, { useEffect, useState } from "react";
import { PersonIcon, CrumpledPaperIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ListCollapse, UserPen } from "lucide-react";
import { RiTeamLine } from "react-icons/ri";
import { readUserSession } from "@/lib/actions";

export default function NavLinks() {
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: userSession } = await readUserSession();
      setAdmin(userSession?.session?.user.user_metadata.role === "admin");
    };
    fetchUserSession();
  }, []);

  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard/profile",
      text: "Profile",
      Icon: UserPen,
    },
    {
      href: "/dashboard/team",
      text: "Teams",
      Icon: RiTeamLine,
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

  if (isAdmin) {
    links.unshift({
      href: "/dashboard/members",
      text: "Members",
      Icon: PersonIcon,
      children: [],
    });
  }

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
            {/* {pathname.startsWith("/dashboard/todo") && link.children && (
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
            )} */}
          </div>
        );
      })}
    </div>
  );
}
