"use server";
import { readUserSession } from "@/lib/actions";
import { createSupabaseAdmin, createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function createTodo(data: {
	title: string;
	status: "todo" | "in-progress" | "done";
	description?: string | undefined;
}) {

	const { data: userSession } = await readUserSession();
	const userId = userSession.session?.user.id;

	const supabase = await createSupabaseServerClient();

	// create a new todo
	const createResult = await supabase.from("tasks").insert({
		...data, created_by: userId
	});
	revalidatePath("/dashboard/todo");
	return JSON.stringify(createResult);
}

export async function updateTodoBasicById(id: string, data: {
	title: string;
	status: "todo" | "in-progress" | "done";
	description?: string | undefined;
}) {
	const supabase = await createSupabaseServerClient();

	const result = await supabase.from("tasks").update(data).eq("id", id);
	revalidatePath("/dashboard/todo");
	return JSON.stringify(result);
}
export async function deleteTodoById(id: string) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("tasks").delete().eq("id", id);
	revalidatePath("/dashboard/todo");
	return JSON.stringify(result);
}

export async function readTodos() {
	unstable_noStore();

	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("tasks").select("*,member(*)");

	return result;
}
