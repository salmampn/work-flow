import React from "react";
import DailogForm from "../DialogForm";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import EditForm from "./EditorForm";
import { ITask } from "@/lib/types";

export default function EditTodo({ todos }: { todos: ITask }) {
  return (
    <DailogForm
      id='update-trigger'
      title='Edit Todo'
      Trigger={
        <Button variant='outline'>
          <Pencil1Icon />
          Edit
        </Button>
      }
      form={<EditForm todos={todos} />}
    />
  );
}
