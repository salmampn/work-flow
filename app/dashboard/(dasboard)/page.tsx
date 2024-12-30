import React from "react";
import { getCurrentUser } from "../actions";

export default async function Dashboard() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className='text-2xl font-bold'>
        Welcome back, {user?.data?.[0]?.name}!
      </h1>
    </div>
  );
}
