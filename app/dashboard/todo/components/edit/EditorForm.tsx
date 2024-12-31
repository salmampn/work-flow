import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicForm from "./BasicForm";
import AccountForm from "./AccountForm";
import AdvanceForm from "./AdvanceForm";
import { cn } from "@/lib/utils";
import { ITask } from "@/lib/types";

export default function EditForm({ todos }: { todos: ITask }) {
  return (
    <Tabs defaultValue='basic' className='w-full space-y-5'>
      <TabsList className={cn("grid w-full grid-cols-1")}>
        <TabsTrigger value='basic'>Basic</TabsTrigger>
        {/* <TabsTrigger value='account'>Acccount</TabsTrigger>
        <TabsTrigger value='advance'>Advance</TabsTrigger> */}
      </TabsList>
      <TabsContent value='basic'>
        <BasicForm todos={todos} />
      </TabsContent>

      {/* <TabsContent value='account'>
        <AccountForm />
      </TabsContent>
      <TabsContent value='advance'>
        <AdvanceForm />
      </TabsContent> */}
    </Tabs>
  );
}
