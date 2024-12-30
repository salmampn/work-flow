import React from "react";
import TodoTable from "./components/TodoTable";
import SearchTodo from "./components/SearchTodo";
import CreateTodo from "./components/create/CreateTodo";

export default function Todo() {
  return (
    <div className='space-y-5 w-full overflow-y-auto px-3'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold'>Todos</h1>
        <p className='text-muted-foreground'>Here's your todo workspace</p>
      </div>
      <div className='flex gap-2 justify-end'>
        {/* <SearchTodo /> */}
        <CreateTodo />
      </div>
      <TodoTable />
    </div>
  );
}
