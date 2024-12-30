"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";

function DeleteTeam() {
  const [isPending, startTransition] = useTransition();
  const onSubmit = () => {
    // startTransition(async () => {
    //   const result = JSON.parse(await deleteMemberById(user_id));
    //   if (result?.error?.message) {
    //     toast({
    //       title: "Fail to delete",
    //     });
    //   } else {
    //     toast({
    //       title: "Member deleted",
    //     });
    //   }
    // });
  };

  return (
    <form action={onSubmit}>
      <Button variant='ghost' size='icon' className='h-8 w-8'>
        <TrashIcon className='h-4 w-4 text-destructive' />
      </Button>
    </form>
  );
}
export default DeleteTeam;
