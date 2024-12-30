"use client";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { createTodo, updateTodoById } from "../../actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, useTransition } from "react";
import { useUserStore } from "@/lib/store/user";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { readMembers } from "@/app/dashboard/members/actions";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

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
  // assignees: z.array(z.string()),
  // .min(1, { message: "Please select at least one assignee" }),
});

export default function TodoForm() {
  const [isPending, startTransition] = useTransition();
  const [members, setMembers] = useState<Permission[]>([]);
  const [open, setOpen] = useState(false);
  const status = ["todo", "in-progress", "done"];

  const user = useUserStore.getState().user;
  const userId = user?.id;
  const isAdmin = user?.user_metadata.role === "admin";

  // Fetch members when component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await readMembers();
        if (response.data) {
          setMembers(response.data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        toast({
          title: "Error fetching members",
          variant: "destructive",
        });
      }
    };

    fetchMembers();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      // assignees: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await createTodo(data);
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
        {/* <FormField
          control={form.control}
          name='assignees'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select an assignee' />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((permission) => (
                      <SelectItem
                        key={permission.member.id}
                        value={permission.member.id}
                      >
                        {permission.member.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
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
        {/* <FormField
          control={form.control}
          name='assignees'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignees</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        "w-full justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length === 0
                        ? "Select assignees"
                        : `${field.value.length} assignee(s) selected`}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0'>
                    <Command>
                      <CommandInput placeholder='Search assignees...' />
                      <CommandEmpty>No assignee found.</CommandEmpty>
                      <CommandGroup className='max-h-64 overflow-auto'>
                        {members.map((permission) => (
                          <CommandItem
                            key={permission.member.id}
                            onSelect={() => {
                              const value = permission.member.id;
                              const currentValues = field.value || [];
                              const newValues = currentValues.includes(value)
                                ? currentValues.filter((v) => v !== value)
                                : [...currentValues, value];
                              field.onChange(newValues);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value?.includes(permission.member.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {permission.member.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              {field.value.length > 0 && (
                <div className='flex gap-2 flex-wrap mt-2'>
                  {field.value.map((assigneeId) => {
                    const assignee = members.find(
                      (p) => p.member.id === assigneeId
                    )?.member;
                    return (
                      <Badge
                        key={assigneeId}
                        variant='secondary'
                        className='flex items-center gap-1'
                      >
                        {assignee?.email}
                        <X
                          className='h-3 w-3 cursor-pointer'
                          onClick={() => {
                            field.onChange(
                              field.value.filter((id) => id !== assigneeId)
                            );
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        /> */}
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
