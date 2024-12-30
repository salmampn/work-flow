"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { deleteTodoById } from "../actions";

function DeleteTodo({ todo_id }: { todo_id: string }) {
  const [isPending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(async () => {
      const result = JSON.parse(await deleteTodoById(todo_id));
      if (result?.error?.message) {
        toast({
          title: "Fail to delete",
        });
      } else {
        toast({
          title: "Todo deleted",
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
export default DeleteTodo;
