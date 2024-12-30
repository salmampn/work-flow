import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import TeamMembers from "./TeamMembers";

export function PageTabs() {
  return (
    <Tabs defaultValue='team' className='w-full space-y-5'>
      <TabsList className={cn("grid w-full grid-cols-2")}>
        <TabsTrigger value='team'>Team Members</TabsTrigger>
        <TabsTrigger value='todo'>Todos</TabsTrigger>
      </TabsList>
      <TabsContent value='team'></TabsContent>
      <TeamMembers />
      <TabsContent value='assign'></TabsContent>
    </Tabs>
  );
}
