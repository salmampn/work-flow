import React from "react";
import DailogForm from "../DialogForm";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import EditForm from "./EditorForm";
import { ITeamMember } from "@/lib/types";

export default function EditTeam({
  isAdmin,
  teams,
}: {
  isAdmin: boolean;
  teams: ITeamMember;
}) {
  return (
    <DailogForm
      id='update-trigger'
      title='Edit Team'
      Trigger={
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <Pencil1Icon />
        </Button>
      }
      form={<EditForm isAdmin={isAdmin} teams={teams} />}
    />
  );
}
