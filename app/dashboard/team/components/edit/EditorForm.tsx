import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicForm from "./BasicForm";
import { cn } from "@/lib/utils";
import { ITeamMember } from "@/lib/types";
import AssignForm from "./AssignForm";

export default function EditForm({
  isAdmin,
  teams,
}: {
  isAdmin: boolean;
  teams: ITeamMember;
}) {
  return (
    <Tabs defaultValue='basic' className='w-full space-y-5'>
      <TabsList className={cn("grid w-full grid-cols-2")}>
        <TabsTrigger value='basic'>Basic</TabsTrigger>
        <TabsTrigger value='assign'>Assign</TabsTrigger>
      </TabsList>
      <TabsContent value='basic'>
        <BasicForm teams={teams} />
      </TabsContent>
      <TabsContent value='assign'>
        <AssignForm teams={teams} />
      </TabsContent>
    </Tabs>
  );
}
