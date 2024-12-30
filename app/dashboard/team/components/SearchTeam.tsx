import { Input } from "@/components/ui/input";
import React from "react";

export default function SearchTeam() {
  return (
    <Input
      placeholder='search by team name'
      className=' border-zinc-600  focus:border-zinc-600'
    />
  );
}
