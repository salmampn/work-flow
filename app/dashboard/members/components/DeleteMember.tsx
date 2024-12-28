"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { deleteMemberById } from "../actions";
import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";

function DeleteMember({ user_id }: { user_id: string }) {
  const [isPending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(async () => {
      const result = JSON.parse(await deleteMemberById(user_id));
      if (result?.error?.message) {
        toast({
          title: "Fail to delete",
        });
      } else {
        toast({
          title: "Member deleted",
        });
      }
    });
  };

  return (
    <form action={onSubmit}>
      <Button variant='outline'>
        <TrashIcon />
        Delete
      </Button>
    </form>
  );
}
export default DeleteMember;
