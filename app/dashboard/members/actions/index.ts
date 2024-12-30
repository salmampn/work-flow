"use server";
import { readUserSession } from "@/lib/actions";
import { createSupabaseAdmin, createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function createMember(data: {
	name: string;
	role: "user" | "admin";
	status: "active" | "resigned";
	email: string;
	password: string;
	confirm: string;
}) {

	const { data: userSession } = await readUserSession();

	if (userSession.session?.user.user_metadata.role !== "admin") {
		return JSON.stringify({ error: { message: "You are not authorized to perform this action." } });
	}

	const supabase = await createSupabaseAdmin();

	// create account
	const createResult = await supabase.auth.admin.createUser({
		email: data.email,
		password: data.password,
		email_confirm: true,
		user_metadata: {
			role: data.role
		}
	})

	if (createResult.error?.message) {
		return JSON.stringify(createResult);
	} else {
		const memberResult = await supabase.from("member").insert({ name: data.name, id: createResult.data.user?.id, email: data.email });
		if (memberResult.error?.message) {
			return JSON.stringify(memberResult);
		} else {
			const permissionResult = await supabase.from("permission").insert({ member_id: createResult.data.user?.id, role: data.role, status: data.status })
			revalidatePath("/dashboard/members");
			return JSON.stringify(permissionResult);
		}
	}
}

export async function updateMemberBasicById(id: string, data: {
	name: string;
}) {
	const supabase = await createSupabaseServerClient();

	const result = await supabase.from("member").update(data).eq("id", id);
	revalidatePath("/dashboard/members");
	return JSON.stringify(result);
}

export async function updateMemberAdvanceById(permission_id: string, user_id: string, data: {
	role: "admin" | "user";
	status: "active" | "resigned";
}) {

	const { data: userSession } = await readUserSession();
	if (userSession.session?.user.user_metadata.role !== "admin") {
		return JSON.stringify({ error: { message: "You are not authorized to perform this action." } });
	}

	const supabaseAdmin = await createSupabaseAdmin();

	// update account
	const updateResult = await supabaseAdmin.auth.admin.updateUserById(
		user_id,
		{ user_metadata: { role: data.role } }
	)

	if (updateResult.error?.message) {
		return JSON.stringify(updateResult);
	} else {
		const supabase = await createSupabaseServerClient();
		const result = await supabase.from("permission").update(data).eq("id", permission_id);
		revalidatePath("/dashboard/members");
		return JSON.stringify(result);
	}
}

export async function updateMemberAccountById(user_id: string, data: {
	email: string;
	password?: string | undefined;
	confirm?: string | undefined;
}) {

	const { data: userSession } = await readUserSession();
	if (userSession.session?.user.user_metadata.role !== "admin") {
		return JSON.stringify({ error: { message: "You are not authorized to perform this action." } });
	}

	let updateObject: {
		email: string;
		password?: string | undefined;
	} = { email: data.email }

	if (data.password) {
		updateObject["password"] = data.password;
	}

	const supabaseAdmin = await createSupabaseAdmin();

	// update email account
	const updateResult = await supabaseAdmin.auth.admin.updateUserById(
		user_id, updateObject
	);

	if (updateResult.error?.message) {
		return JSON.stringify(updateResult);
	} else {
		const supabase = await createSupabaseServerClient();
		const result = await supabase.from("member").update({ email: data.email }).eq("id", user_id);
		revalidatePath("/dashboard/members");
		return JSON.stringify(result);
	}
}

export async function deleteMemberById(user_id: string) {
	// only admin can delete member
	const { data: userSession } = await readUserSession();

	if (userSession.session?.user.user_metadata.role !== "admin") {
		return JSON.stringify({ error: { message: "You are not authorized to perform this action." } });
	}

	const supabaseAdmin = await createSupabaseAdmin();
	const deleteResult = await supabaseAdmin.auth.admin.deleteUser(user_id);

	if (deleteResult.error?.message) {
		return JSON.stringify(deleteResult);
	} else {
		const supabase = await createSupabaseServerClient();
		const result = await supabase.from("member").delete().eq("id", user_id);
		revalidatePath("/dashboard/members");
		return JSON.stringify(result);
	}

}

export async function readMembers() {
	unstable_noStore();

	const supabase = await createSupabaseServerClient();
	return await supabase.from("permission").select("*,member(*)");
}

export async function readMemberById(memberId: string | undefined) {
	if (!memberId) {
		throw new Error("Member ID is required");
	}

	// Prevent caching of the response
	unstable_noStore();

	const supabase = await createSupabaseServerClient();

	// Fetch the member details based on the member_id in the permission table
	const { data, error } = await supabase
		.from("permission") // Start from the permission table
		.select("*, member(*)") // Select all fields from permission and all fields from the member table
		.eq("member_id", memberId) // Filter where member_id matches the current user's ID
		.single(); // Expect a single record

	if (error) {
		console.error("Error fetching member:", error);
		throw new Error(error.message); // Handle the error appropriately
	}

	console.log("Fetched member profile:", data);
	return data; // Return the fetched member profile data
}