import { ITeamMember } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { readTeamMembers } from "../../actions";

export default async function TeamMembers() {
  const { data: teamMembers } = await readTeamMembers();

  return (
    <div className='space-y-4'>
      <h1 className='text-xl'>Team Members</h1>
      {/* {teamMembers.length === 0 ? (
        <p>No team members found.</p>
      ) : (
        <ul>
          {teamMembers.map((member) => (
            <li key={member.id} className='border p-4 rounded'>
              <h2 className='font-bold'>{member.member.name}</h2>
              <p>Email: {member.member.email}</p>
              <p>Role: {member.role}</p>
              <p>Team: {member.teams.name}</p>
              <p>Description: {member.teams.description || "No description"}</p>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}
