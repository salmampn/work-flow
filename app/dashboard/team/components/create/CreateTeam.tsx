import { Button } from "@/components/ui/button";
import React from "react";
import DailogForm from "../DialogForm";
import TeamsForm from "./TeamsForm";

export default function CreateTeam() {
  return (
    <DailogForm
      id='create-trigger'
      title='Create Team'
      Trigger={<Button variant='outline'>Create Team</Button>}
      form={<TeamsForm />}
    />
  );
}
