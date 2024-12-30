import ReadUser from "./ReadUser";

function Profile() {
  return (
    <div className='space-y-5 w-full overflow-y-auto px-3'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold'>Profile</h1>
        <p className='text-muted-foreground'>Your Profile Details </p>
      </div>
      <ReadUser />
    </div>
  );
}
export default Profile;
