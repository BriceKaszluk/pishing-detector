import { SupabaseClient } from '@supabase/supabase-js';
import { PhishingScore, UserStatistics, isUserStatistics } from '../../../lib/types';

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

  // Récupérer les statistiques actuelles de l'utilisateur
  const { data, error: fetchError } = await supabase
    .from('user_statistics')
    .select('*')
    .eq('user_id', userId);

  if (fetchError) {
    console.error('Error fetching user statistics:', fetchError.message);
    throw fetchError;
  }

  // Si aucune statistique d'utilisateur n'est trouvée, créez-en une nouvelle avec des valeurs initiales calculées
  let currentStats: UserStatistics;
  if (!data || data.length === 0) {
    console.log('No user statistics found for the given user ID. Creating a new record.');

    const initialStats: UserStatistics = {
      user_id: userId, 
      total_emails_week: 0,
      total_emails_all_time: 0,
      safe_week: 0,
      warning_week: 0,
      danger_week: 0,
      safe_all_time: 0,
      warning_all_time: 0,
      danger_all_time: 0,
    };

    phishingScores.forEach((score) => {
      initialStats.total_emails_week++;
      initialStats.total_emails_all_time++;

      switch (score.label) {
        case "safe":
          initialStats.safe_week++;
          initialStats.safe_all_time++;
          break;
        case "warning":
          initialStats.warning_week++;
          initialStats.warning_all_time++;
          break;
        case "danger":
          initialStats.danger_week++;
          initialStats.danger_all_time++;
          break;
      }
    });

    const { data: newStats, error: insertError } = await supabase
      .from('user_statistics')
      .insert(initialStats)
      .single();

    if (insertError) {
      console.error('Error creating a new user statistics record:', insertError.message);
      throw insertError;
    }

    currentStats = newStats as UserStatistics;
  } else {
    if (data && data.length > 0 && isUserStatistics(data[0])) {
      currentStats = data[0];

      phishingScores.forEach((score) => {
        currentStats.total_emails_week++;
        currentStats.total_emails_all_time++;
    
        switch (score.label) {
          case "safe":
            currentStats.safe_week++;
            currentStats.safe_all_time++;
            break;
          case "warning":
            currentStats.warning_week++;
            currentStats.warning_all_time++;
            break;
          case "danger":
            currentStats.danger_week++;
            currentStats.danger_all_time++;
            break;
        }
      });
    
      // Mettre à jour la table user_statistics avec les nouvelles valeurs
      const { error: updateError } = await supabase
        .from('user_statistics')
        .update(currentStats)
        .eq('user_id', userId);
    
      if (updateError) {
        console.error('Error updating user statistics:', updateError.message);
        throw updateError;
      }
      
    } else {
      console.error('data object is not corresponding to type déclaration');
      throw new Error('Invalid data object');
    }
  }


};
