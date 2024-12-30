"use server";

import { readUserSession } from "@/lib/actions";
import { createSupabaseAdmin, createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath, unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeams(data: {
    name: string;
    description?: string | undefined;
}) {

    const { data: userSession } = await readUserSession();
    if (userSession.session?.user.user_metadata.role !== "admin") {
        return JSON.stringify({ error: { message: "You are not authorized to perform this action." } });
    }

    const userId = userSession.session?.user.id;
    const supabase = await createSupabaseAdmin();

    // Insert the new team into the `teams` table
    const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({ ...data, created_by: userId })
        .select("id")
        .single(); // Get the newly created team's ID

    if (teamError) {
        return JSON.stringify({ error: teamError });
    }

    const teamId = teamData?.id;

    if (!teamId) {
        return JSON.stringify({ error: { message: "Failed to retrieve team ID after creation." } });
    }

    // Insert the team creator as a leader into the `team_members` table
    const { error: memberError } = await supabase.from("team_members").insert({
        team_id: teamId,
        member_id: userId,
        role: "leader",
    });

    if (memberError) {
        return JSON.stringify({ error: memberError });
    }

    // Revalidate the path to refresh the team dashboard
    revalidatePath("/dashboard/team");
    return JSON.stringify({ success: true });
}

export async function createTeamMembers(data: {
    team_id: string;
    member_id: string;
    role: "leader" | "member";
}) {

    const { data: userSession } = await readUserSession();

    if (userSession.session?.user.user_metadata.role !== "admin") {
        return JSON.stringify({ error: { message: "You are not authorized to perform this action." } });
    }

    const supabase = await createSupabaseAdmin();

    const result = await supabase.from("team_members").insert(data);
    revalidatePath("/dashboard/team");
    return JSON.stringify(result);
}

export async function readTeamsById(teamId: string) {
    const supabase = await createSupabaseAdmin();
    return await supabase.from("teams").select("*").eq("id", teamId).single();
}

export async function readTeamMembersById(userId: string | undefined) {
    const supabase = await createSupabaseAdmin();
    return await supabase.from("team_members").select("*,teams(*)").eq("member_id", userId);
}

export async function readTeamMembers() {
    const supabase = await createSupabaseAdmin();
    const result = supabase.from("team_members").select("*,teams(*),member(*)");

    // console.log("result", result);
    return result;
}

export async function updateTeamBasicById(id: string, data: {
    name: string;
    description?: string | undefined;
}) {
    const supabase = await createSupabaseAdmin();

    const result = await supabase.from("teams").update(data).eq("id", id);
    revalidatePath("/dashboard/team");
    return JSON.stringify(result);
}

export async function AssignTeamMember(data: {
    role: "leader" | "member";
    member_id: string;
    team_id: string;
}) {
    const supabase = await createSupabaseAdmin();

    const result = await supabase.from("team_members").insert(data)
    revalidatePath("/dashboard/team");
    return JSON.stringify(result);
    redirect("/dashboard/team");
}