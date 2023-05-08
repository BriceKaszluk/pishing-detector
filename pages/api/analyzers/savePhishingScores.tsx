// savePhishingScores.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { PhishingScore } from '../../../lib/types';

export const savePhishingScores = async (
  supabase: SupabaseClient,
  userId: string,
  phishingScores: PhishingScore[]
) => {
  const { error } = await supabase
    .from('phishing_scores')
    .insert(phishingScores.map((score) => ({
      user_id: userId,
      email_id: score.emailId,
      phishing_score: score.phishingScore,
      label: score.label,
      features: score.features,
    })));

  if (error) {
    console.error('Error saving phishing scores:', error.message);
    throw error;
  }
};
