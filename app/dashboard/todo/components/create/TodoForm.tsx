"use client";
import { Input } from "@/components/ui/input";

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
import { toast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTodo } from "../../actions";
import { useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useUserStore } from "@/lib/store/user";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { DatePicker } from "./DatePicker";

// Add type for member data
type Member = {
  id: string;
  email: string;
  name: string;
};

type Permission = {
  id: string;
  member: Member;
};

const FormSchema = z.object({
  title: z.string().min(4, {
    message: "Title must be at least 4 characters.",
  }),
  // description can be null
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  deadline: z.string().optional(),
});

export default function TodoForm() {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const status = ["todo", "in-progress", "done"];

  const user = useUserStore.getState().user;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      deadline: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const payload = {
        ...data,
        deadline: date ? date.toISOString() : undefined, // Convert date to ISO format
      };

      const result = await createTodo(payload);
      const { error } = JSON.parse(result);
      console.log(error?.message);
      if (error?.message) {
        toast({
          title: "Fail to create todo",
          description: (
            <pre className='mt-2 w-[500px] rounded-md bg-slate-950 p-4'>
              <code className='text-white text-wrap'>{error.message}</code>
            </pre>
          ),
        });
      } else {
        document.getElementById("create-trigger")?.click();
        toast({
          title: "Successfully create todo",
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='todo title'
                  type='text'
                  {...field}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
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
              <FormControl>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue>{field.value}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {status.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='deadline'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <DatePicker date={date} setDate={setDate} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full flex gap-2 items-center'
          variant='outline'
        >
          Submit{" "}
          <AiOutlineLoading3Quarters
            className={cn("animate-spin", { hidden: !isPending })}
          />
        </Button>
      </form>
    </Form>
  );
}
