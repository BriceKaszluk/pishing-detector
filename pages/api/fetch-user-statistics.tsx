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

  async function fetchUserStatistics(userId: string): Promise<UserStatistics | null> {
    const { data, error } = await supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId);
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      const { data: newData, error: newError } = await supabase
        .from("user_statistics")
        .insert({
          user_id: userId,
          total_emails_week: 0,
          total_emails_all_time: 0,
          safe_week: 0,
          warning_week: 0,
          danger_week: 0,
          safe_all_time: 0,
          warning_all_time: 0,
          danger_all_time: 0,
        })
        .single();
    
      if (newError || !newData) {
        throw newError || new Error("Error creating new statistics");
      }
    
      return newData as UserStatistics;
    }
    
    return data[0] as UserStatistics;
  }
  
  
  try {
    const userStatistics = await fetchUserStatistics(session.user.id);
    res.status(200).json(userStatistics);
  } catch (error) {
    res.status(500).json({ 
        message: "Error fetching or creating user statistics",
        error: error.message || error
    });
}
}