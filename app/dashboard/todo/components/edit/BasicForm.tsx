"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { ITask } from "@/lib/types";
import { updateTodoBasicById } from "../../actions";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["todo", "in-progress", "done"]),
  description: z.string().optional(),
});

export default function BasicForm({ todos }: { todos: ITask }) {
  const status = ["todo", "in-progress", "done"];
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      title: todos.title,
      status: todos.status,
      description: todos.description ?? undefined,
    },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const { error } = JSON.parse(await updateTodoBasicById(todos.id, data));
      if (error?.message) {
        toast({
          title: "Fail to update",
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>{error?.message}</code>
            </pre>
          ),
        });
      } else {
        toast({
          title: "Successfully updated",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Todo Title</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter todo description'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select user status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.map((status, index) => {
                    return (
                      <SelectItem value={status} key={index}>
                        {status}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='flex gap-2 items-center w-full'
          variant='outline'
        >
          Update{" "}
          <AiOutlineLoading3Quarters
            className={cn(" animate-spin", "hidden")}
          />
        </Button>
      </form>
    </Form>
  );
}
