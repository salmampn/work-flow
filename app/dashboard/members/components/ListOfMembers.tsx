import React from "react";
import EditMember from "./edit/EditMember";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/store/user";
import { readMembers } from "../actions";
import { IPermission } from "@/lib/types";
import DeleteMember from "./DeleteMember";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ListOfMembers() {
  const { data: permissions } = await readMembers();

  const user = useUserStore.getState().user;
  const isAdmin = user?.user_metadata.role === "admin";

  return (
    <div className='dark:bg-inherit bg-white mx-2 border border-gray-300 rounded-lg'>
      <Table className='table-auto w-full'>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center p-4'>Name</TableHead>
            <TableHead className='text-center p-4'>Role</TableHead>
            <TableHead className='text-center p-4'>Created At</TableHead>
            <TableHead className='text-center p-4'>Status</TableHead>
            <TableHead className='text-center p-4'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(permissions as IPermission[])?.map((permission, index) => (
            <TableRow key={index} className='hover:bg-gray-50'>
              <TableCell className='text-center p-4'>
                {permission.member.name}
              </TableCell>
              <TableCell className='text-center p-4'>
                <span
                  className={cn(
                    "dark:bg-zinc-800 px-2 py-1 rounded-full shadow capitalize text-sm border-[.5px]",
                    {
                      "border-green-500 text-green-600 bg-green-200":
                        permission.role === "admin",
                      "border-zinc-300 dark:text-yellow-300 dark:border-yellow-700 px-4 bg-yellow-50":
                        permission.role === "user",
                    }
                  )}
                >
                  {permission.role}
                </span>
              </TableCell>
              <TableCell className='text-center p-4'>
                {new Date(permission.created_at).toDateString()}
              </TableCell>
              <TableCell className='text-center p-4'>
                <span
                  className={cn(
                    "dark:bg-zinc-800 px-2 py-1 rounded-full capitalize text-sm border-zinc-300 border",
                    {
                      "text-green-600 px-4 dark:border-green-400 bg-green-200":
                        permission.status === "active",
                      "text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400":
                        permission.status === "resigned",
                    }
                  )}
                >
                  {permission.status}
                </span>
              </TableCell>
              <TableCell className='text-center p-4'>
                <div className='flex justify-center gap-2 items-center'>
                  {isAdmin && <DeleteMember user_id={permission.member.id} />}
                  <EditMember isAdmin={isAdmin} permission={permission} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
