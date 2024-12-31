"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { deleteTeamMemberById } from "../../../actions";
import { ITeamMember } from "@/lib/types";

function DeleteTeamMember({ team }: { team: ITeamMember }) {
  const [isPending, startTransition] = useTransition();

  // Handle button click to delete the member
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    startTransition(async () => {
      // Call the delete function directly
      const result = await deleteTeamMemberById(team.member_id, team.team_id);

      console.log("result", result);

      if (result?.success === false) {
        toast({
          title: "Failed to delete",
          description: (
            <div>
              <p>{result.error}</p>
            </div>
          ),
        });
      } else {
        toast({
          title: "Member deleted successfully",
        });
      }
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Button variant='outline' type='submit' disabled={isPending}>
        <TrashIcon />
        Delete
      </Button>
    </form>
  );
}

export default DeleteTeamMember;
