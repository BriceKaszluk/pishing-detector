// phishingScore.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Mail } from '../../lib/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { calculatePhishingScore } from './analyzers/calculatePhishingScore';
import { savePhishingScores } from './analyzers/savePhishingScores';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const emails: Mail[] = req.body.emails;

    if (!Array.isArray(emails)) {
      res.status(400).json({ message: 'Invalid input: expected an array of emails' });
      return;
    }

    const phishingScores = emails.map(calculatePhishingScore);

    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient({ req, res });

    // Get the current user's ID
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user.id;

    if (userId) {
      try {
        await savePhishingScores(supabase, userId, phishingScores);
      } catch (error) {
        res.status(500).json({ message: 'Error saving phishing scores' });
        return;
      }
    } else {
      res.status(400).json({ message: 'User not authenticated' });
      return;
    }

    res.status(200).json(phishingScores);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
