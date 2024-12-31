import React from "react";
import { readTeamMembers } from "../../actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import DeleteTeamMember from "./components/DeleteTeamMember";
import { ITeamMember } from "@/lib/types";
import { useUserStore } from "@/lib/store/user";

export default async function TeamMembers({ team }: { team: ITeamMember }) {
  const { data: teamMembers } = await readTeamMembers(team.id);

  const user = useUserStore.getState().user;
  const isAdmin = user?.user_metadata.role === "admin";

  return (
    <div className='bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden'>
      <Table className='w-full text-sm'>
        <TableHeader>
          <TableRow className='bg-gray-100 dark:bg-zinc-800'>
            <TableHead className='text-center p-4'>Name</TableHead>
            <TableHead className='text-center p-4'>Role</TableHead>
            <TableHead className='text-center p-4'>Email</TableHead>
            {isAdmin && (
              <TableHead className='text-center p-4'>Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(teamMembers as ITeamMember[])?.map((member, index) => (
            <TableRow
              key={index}
              className='hover:bg-gray-50 dark:hover:bg-zinc-800'
            >
              <TableCell className='text-center p-4'>
                {member.member.name}
              </TableCell>
              <TableCell className='text-center p-4'>
                <span
                  className={cn(
                    "dark:bg-zinc-800 px-2 py-1 rounded-full shadow capitalize text-sm border-[.5px]",
                    {
                      "border-green-500 text-green-600 bg-green-200 px-5":
                        member.role === "leader",
                      "border-zinc-300 dark:text-yellow-300 dark:border-yellow-700 px-4 bg-yellow-50":
                        member.role === "member",
                    }
                  )}
                >
                  {member.role}
                </span>
              </TableCell>
              <TableCell className='text-center p-4'>
                {member.member.email}
              </TableCell>
              <TableCell className='text-center p-4'>
                {isAdmin && <DeleteTeamMember team={member} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
