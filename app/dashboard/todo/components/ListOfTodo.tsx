import React from "react";
import { cn } from "@/lib/utils";
import { readTodos } from "../actions";
import { ITask } from "@/lib/types";
import DeleteTodo from "./DeleteTodo";
import EditTodo from "./edit/EditTodo";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className='dark:bg-inherit bg-white mx-2 border border-gray-300 rounded-lg'>
      <Table className='table-auto w-full'>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center p-4'>Title</TableHead>
            <TableHead className='text-center p-4'>Status</TableHead>
            <TableHead className='text-center p-4'>Created</TableHead>
            <TableHead className='text-center p-4'>Deadline</TableHead>
            <TableHead className='text-center p-4'>Creator</TableHead>
            <TableHead className='text-center p-4'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(todos as ITask[])?.map((todo, index) => (
            <TableRow key={index}>
              {/* Title */}
              <TableCell className='text-center p-4'>{todo.title}</TableCell>
              {/* Status */}
              <TableCell className='text-center p-4'>
                <span
                  className={cn(
                    "px-4 py-2 rounded-full text-sm capitalize w-full",
                    {
                      "bg-green-200 text-green-600": todo.status === "done",
                      "bg-yellow-100 text-yellow-600":
                        todo.status === "in-progress",
                      "bg-red-100 text-red-600": todo.status === "todo",
                    }
                  )}
                  style={{ display: "inline-block", width: "65%" }}
                >
                  {todo.status}
                </span>
              </TableCell>
              {/* Created Date */}
              <TableCell className='text-center p-4'>
                {format(new Date(todo.created_at), "MMMM dd, yyyy")}
              </TableCell>

              {/* Deadline */}
              <TableCell className='text-center p-4'>
                {todo.deadline
                  ? format(new Date(todo.deadline), "MMMM dd, yyyy")
                  : "No deadline"}
              </TableCell>

              {/* Creator */}
              <TableCell className='text-center p-4'>
                {todo.member.name}
              </TableCell>

              {/* Actions */}
              <TableCell className='text-center p-4'>
                <div className='flex items-center justify-center gap-2'>
                  <DeleteTodo todo_id={todo.id} />
                  <EditTodo todos={todo} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
