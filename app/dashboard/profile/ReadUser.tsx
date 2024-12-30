import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { readUserSession } from "@/lib/actions";
import EditMember from "../members/components/edit/EditMember";
import { useUserStore } from "@/lib/store/user";
import { IPermission, IUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import { readMemberById } from "../members/actions";
import { readTeamMembersById } from "../team/actions";

export default async function ReadUser() {
  const { data: userSession } = await readUserSession();
  const userId = userSession?.session?.user.id;

  console.log("userId", userId);

  // Fetch permissions for the current user
  const permissions = await readMemberById(userId);

  if (!permissions) {
    console.log("No permissions found for this user.");
    return (
      <div className='dark:bg-inherit bg-white mx-2 border border-gray-300 rounded-lg'>
        <p>No permissions found for this user.</p>
      </div>
    );
  }

  // Assuming permissions is an array of IPermission
  const isAdmin = userSession?.session?.user.user_metadata.role === "admin";

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
          <TableRow className='hover:bg-gray-50'>
            <TableCell className='text-center p-4'>
              {permissions.member.name} {/* Accessing member name */}
            </TableCell>
            <TableCell className='text-center p-4'>
              <span
                className={cn(
                  "dark:bg-zinc-800 px-2 py-1 rounded-full shadow capitalize text-sm border-[.5px]",
                  {
                    "border-green-500 text-green-600 bg-green-200":
                      permissions.role === "admin",
                    "border-zinc-300 dark:text-yellow-300 dark:border-yellow-700 px-4 bg-yellow-50":
                      permissions.role === "user",
                  }
                )}
              >
                {permissions.role}
              </span>
            </TableCell>
            <TableCell className='text-center p-4'>
              {new Date(permissions.created_at).toDateString()}
            </TableCell>
            <TableCell className='text-center p-4'>
              <span
                className={cn(
                  "dark:bg-zinc-800 px-2 py-1 rounded-full capitalize text-sm border-zinc-300 border",
                  {
                    "text-green-600 px-4 dark:border-green-400 bg-green-200":
                      permissions.status === "active",
                    "text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400":
                      permissions.status === "resigned",
                  }
                )}
              >
                {permissions.status}
              </span>
            </TableCell>
            <TableCell className='text-center p-4'>
              <div className='flex justify-center gap-2 items-center'>
                <EditMember isAdmin={isAdmin} permission={permissions} />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
