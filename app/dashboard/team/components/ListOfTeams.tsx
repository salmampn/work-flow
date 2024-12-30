import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { toast } from "@/hooks/use-toast";
import { readTeamMembersById } from "../actions";
import EditTeam from "./edit/EditTeam";
import DeleteTeam from "./DeleteTeam";
import { ITeamMember } from "@/lib/types";
import { useRouter } from "next/router";
import { readUserSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ListOfTeams() {
  const { data: userSession } = await readUserSession();
  const userId = userSession?.session?.user.id;
  const isAdmin = userSession?.session?.user.user_metadata.role === "admin";

  const { data: teams } = await readTeamMembersById(userId);

  // const router = useRouter();
  const handleDetailsClick = (teamId: string) => {
    redirect(`/dashboard/team/${teamId}/details`);
  };

  return (
    <div className='dark:bg-inherit bg-white mx-2 rounded-sm'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
        {(teams as ITeamMember[])?.map((teams, index) => (
          <Card key={teams.id} className='flex flex-col'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span className='truncate text-2xl'>{teams.teams.name}</span>
                {isAdmin && (
                  <div className='flex gap-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <EditTeam isAdmin={isAdmin} teams={teams} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit team</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DeleteTeam />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete team</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </CardTitle>
              <CardDescription className='truncate'>
                {teams.teams.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-grow'>
              <div className='text-sm text-muted-foreground'>
                Created:{" "}
                {new Date(teams.teams.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
              <Link href={`/dashboard/team/${teams.teams.id}/details`}>
                <Button variant='outline' size='sm'>
                  Team Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
