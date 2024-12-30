import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { ReactNode } from "react";

export default function DailogForm({
  Trigger,
  id,
  title,
  form,
}: {
  title: string;
  Trigger: ReactNode;
  id: string;
  form: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild id={id}>
        {Trigger}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Create a new todo by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
