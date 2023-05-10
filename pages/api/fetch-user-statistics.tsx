import type { NextApiRequest, NextApiResponse } from "next";
import { UserStatistics } from "../../lib/types";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  async function fetchUserStatistics(userId: string): Promise<UserStatistics> {
    const { data, error } = await supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId)
      .single();
  
    if (error || !data) {
      throw error || new Error("No data found");
    }
  
    return data as UserStatistics;
  }

  try {
    const userStatistics = await fetchUserStatistics(session.user.id);
    res.status(200).json(userStatistics);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user statistics" });
  }
}
