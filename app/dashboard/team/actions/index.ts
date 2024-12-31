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

export async function updateTeamBasicById(id: string, data: {
    name: string;
    description?: string | undefined;
}) {
    const supabase = await createSupabaseAdmin();

    const result = await supabase.from("teams").update(data).eq("id", id);
    console.log("result", result);
    revalidatePath("/dashboard/team");
    return JSON.stringify(result);
}

export async function AssignTeamMember(data: {
    role: "leader" | "member";
    member_id: string;
    team_id: string;
}) {
    const supabase = await createSupabaseAdmin();

    // Check if the member is already assigned to the team
    const { data: existingMember, error: fetchError } = await supabase
        .from("team_members")
        .select("*")
        .eq("member_id", data.member_id)
        .eq("team_id", data.team_id)
        .single(); // Fetch a single row

    if (fetchError && fetchError.code !== "PGRST116") { // Ignore "No rows found" error
        console.error("Error checking existing member:", fetchError);
        return JSON.stringify({ success: false, error: fetchError.message });
    }

    if (existingMember) {
        console.log("Member is already assigned to this team.");
        return JSON.stringify({
            success: false,
            error: "This member is already assigned to this team.",
        });
    }

    // Proceed to insert the new team member
    const { data: insertedData, error: insertError } = await supabase
        .from("team_members")
        .insert(data);

    if (insertError) {
        console.error("Error assigning team member:", insertError);
        return JSON.stringify({ success: false, error: insertError.message });
    }

    console.log("Team member assigned successfully:", insertedData);

    // Revalidate the relevant path to update data on the frontend
    revalidatePath("/dashboard/team");

    return JSON.stringify({ success: true, data: insertedData });
}

export async function readTeamMembers(teamId: string | undefined) {
    const supabase = await createSupabaseAdmin();
    const { data, error } = await supabase.from("team_members").select("*,member(*)").eq("team_id", teamId);

    if (error) {
        console.error("Error fetching team members:", error);
        return { error };
    }

    return { data };
}

export async function deleteTeamMemberById(memberId: string, team_id: string) {
    const supabase = await createSupabaseServerClient();

    // Directly attempt to delete the record
    const { data, error } = await supabase
        .from("team_members")
        .delete()
        .eq("member_id", memberId)
        .eq("team_id", team_id)
        .select(); // Add select() to return the deleted record(s)

    if (error) {
        console.error("Error deleting team member:", error);
        return { success: false, error: error.message };
    }

    // Check if any rows were actually deleted
    if (data && data.length > 0) {
        revalidatePath("/dashboard/team/[teamId]/details");
        return { success: true, data };
    }

    return { success: false, error: "No team member found to delete." };
}