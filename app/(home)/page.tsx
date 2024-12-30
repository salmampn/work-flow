import { Button } from "@/components/ui/button";
import { Waypoints } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center space-y-2'>
      <div className='flex space-x-4'>
        <h1 className='text-7xl'>Welcome to Workflow</h1>
        <Waypoints className='w-16 h-16' />
      </div>
      <p className='text-2xl opacity-70 text-balance'>
        This is a simple workflow management system that allows you to create
        and manage tasks and projects.
      </p>
      <Link href='/auth'>
        <Button className='mt-6 text-xl p-6'>Get Started</Button>
      </Link>
    </div>
  );
}
