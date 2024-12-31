import CreateTodo from "@/app/dashboard/todo/components/create/CreateTodo";
import { readTeamsById } from "../../actions";
import EditTeamForm from "./components/EditTeamForm";
import { readUserSession } from "@/lib/actions";
import { CreateTeamTodo } from "./components/CreateTeamTodo";
import { PageTabs } from "./PageTabs";

export default async function EditTeamPage({
  params,
}: {
  params: { teamId: string };
}) {
  const { data: team } = await readTeamsById(params.teamId);
  const { data: userSession } = await readUserSession();
  const isAdmin = userSession?.session?.user.user_metadata.role === "admin";

  return (
    <div className='space-y-5 w-full overflow-y-auto px-3'>
      <div className='flex flex-col gap-2'>
        <p className='text-muted-foreground'>Here is your team workspace </p>
        <h1 className='text-4xl font-bold uppercase'>{team.name}</h1>
        <p className='opacity-80'>{team.description}</p>
      </div>
      <PageTabs team={team} />
      {isAdmin && (
        <div className='flex gap-2 justify-end'>
          {/* <SearchTodo /> */}
          {/* <CreateTodo /> */}
          {/* <CreateTeamTodo /> */}
        </div>
      )}
      {/* <EditTeamForm team={team} /> */}
    </div>
  );
}
