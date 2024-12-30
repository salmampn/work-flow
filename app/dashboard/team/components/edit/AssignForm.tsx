"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
// import { updateMemberAdvanceById } from "../../actions";
import { useEffect, useState, useTransition } from "react";
import { IPermission, ITeamMember } from "@/lib/types";
import { readMembers } from "@/app/dashboard/members/actions";
import { AssignTeamMember } from "../../actions";

const FormSchema = z.object({
  role: z.enum(["leader", "member"]),
  member_id: z.string(),
  team_id: z.string(),
});

export default function AssignForm({ teams }: { teams: ITeamMember }) {
  const roles = ["leader", "member"];
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: "member",
      member_id: "",
      team_id: teams.team_id,
    },
  });

  const [members, setMembers] = useState([] as IPermission[]);

  useEffect(() => {
    async function fetchMembers() {
      const response = await readMembers();
      if (response.error) {
        console.error(response.error);
      } else {
        setMembers(response.data);
      }
    }
    fetchMembers();
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const { error } = JSON.parse(await AssignTeamMember(data));
      if (error?.message) {
        console.log(error?.message);
        toast({
          title: "Fail to update",
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>{error?.message}</code>
            </pre>
          ),
        });
        console.error(error.message);
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
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role, index) => {
                    return (
                      <SelectItem value={role} key={index}>
                        {role}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='member_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a member' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem value={member.member_id} key={member.id}>
                      {member.member.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              <FormDescription className='mx-1'>
                Assign a member to a role in the team
              </FormDescription>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='flex gap-2 items-center w-full'
          variant='outline'
        >
          Assign{" "}
          <AiOutlineLoading3Quarters
            className={cn(" animate-spin", { hidden: !isPending })}
          />
        </Button>
      </form>
    </Form>
  );
}
