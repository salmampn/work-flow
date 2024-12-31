import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import TeamMembers from "./TeamMembers";
import { ITeamMember } from "@/lib/types";
import TeamTodos from "./TeamTodos";

export function PageTabs({ team }: { team: ITeamMember }) {
  return (
    <Tabs defaultValue='team' className='w-full space-y-5'>
      <TabsList
        className={cn("grid w-full grid-cols-2 border border-gray-300")}
      >
        <TabsTrigger value='team'>Team Members</TabsTrigger>
        <TabsTrigger value='todo'>Todos</TabsTrigger>
      </TabsList>

      {/* Team Members Tab Content */}
      <TabsContent value='team'>
        <TeamMembers team={team} />
      </TabsContent>

      {/* Team Todos Tab Content */}
      <TabsContent value='todo'>
        <TeamTodos />
      </TabsContent>
    </Tabs>
  );
}
