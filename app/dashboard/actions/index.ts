import { createSupabaseServerClient } from '@/lib/supabase';

export async function getCurrentUser() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id;

    return await supabase.from("member").select("name").eq("id", userId);
}