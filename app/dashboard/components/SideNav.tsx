import React from "react";
import NavLinks from "./NavLinks";

import { cn } from "@/lib/utils";
import ModeToggle from "../todo/components/ToggleDarkMode";
import { Button } from "@/components/ui/button";
import SignOut from "./SignOut";
import Link from "next/link";

export default function SideNav() {
  return <SideBar className=' hidden lg:block dark:bg-graident-dark flex-1' />;
}

export const SideBar = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div
        className={cn(
          "h-full w-full lg:w-92 lg:p-10 space-y-5 lg:border-r flex flex-col "
        )}
      >
        <div className='flex-1 space-y-5'>
          <div className='flex items-center gap-6 flex-1'>
            <Link href='/dashboard'>
              <h1 className='text-3xl font-bold'>Workflow</h1>
            </Link>
            <ModeToggle />
          </div>
          <NavLinks />
        </div>
        <div className=''>
          <SignOut />
        </div>
      </div>
    </div>
  );
};
