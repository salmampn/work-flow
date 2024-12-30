import React from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import EditTodo from "./edit/EditTodo";
import { cn } from "@/lib/utils";
import { readTodos } from "../actions";
import { ITask } from "@/lib/types";
import DeleteTodo from "./DeleteTodo";

export default async function ListOfTodo() {
  // Fetch todos
  const { data: todos, error } = await readTodos();

  // Handle loading or error states
  if (error) {
    return (
      <div className='text-red-500 p-4'>
        Failed to load todos. Please try again later.
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return <div className='text-gray-500 p-4'>No todos available.</div>;
  }

  return (
    <div className='dark:bg-inherit bg-white mx-2 rounded-sm p-4 space-y-4'>
      {(todos as ITask[])?.map((todos, index) => {
        return (
          <div
            key={index}
            className='grid grid-cols-5 items-center rounded-sm p-3 shadow-sm border dark:border-zinc-700'
          >
            {/* Title */}
            <h1 className='font-medium'>{todos.title}</h1>

            {/* Status Badge */}
            <span
              className={cn(
                "px-2 py-2 rounded-full shadow capitalize text-sm border w-32 text-center",
                {
                  "border-green-500 text-green-600 bg-green-200 ":
                    todos.status === "done",
                  "border-yellow-500 text-yellow-600 bg-yellow-100 ":
                    todos.status === "in-progress",
                  "border-red-500 text-red-600 bg-red-100  ":
                    todos.status === "todo",
                }
              )}
            >
              {todos.status}
            </span>

            {/* Created Date */}
            <span className='text-gray-600 dark:text-gray-400 text-sm'>
              {new Date(todos.created_at).toDateString()}
            </span>

            {/* Creator */}
            <span className='text-gray-600 dark:text-gray-400 text-sm'>
              {todos.member.name}
            </span>

            {/* Actions */}
            <div className='flex gap-2 items-center'>
              {/* Delete Button */}
              <DeleteTodo todo_id={todos.id} />

              {/* Edit Todo */}
              <EditTodo todos={todos} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
