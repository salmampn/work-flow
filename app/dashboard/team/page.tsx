import { useUserStore } from "@/lib/store/user";
import CreateTeam from "./components/create/CreateTeam";
import SearchTeam from "./components/SearchTeam";
import TeamsData from "./components/TeamsData";

function Teams() {
  const user = useUserStore.getState().user;
  const isAdmin = user?.user_metadata.role === "admin";

  return (
    <div className='space-y-5 w-full overflow-y-auto px-3'>
      <h1 className='text-3xl font-bold'>Teams</h1>
      {isAdmin && (
        <div className='flex gap-2 justify-end'>
          {/* <SearchTeam /> */}
          <CreateTeam />
        </div>
      )}
      <TeamsData />
    </div>
  );
}
export default Teams;
