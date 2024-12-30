import { readTeamsById } from "../../actions";
import EditTeamForm from "./EditTeamForm";

export default async function EditTeamPage({
  params,
}: {
  params: { teamId: string };
}) {
  const { data: team } = await readTeamsById(params.teamId);

  return (
    <div className='space-y-5 w-full overflow-y-auto px-3'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>Team, {team.name}</h1>
        <p className='text-muted-foreground'>Here's your team workspace</p>
      </div>

      {/* <EditTeamForm team={team} /> */}
    </div>
  );
}
