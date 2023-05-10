import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { getEmailsFromLastWeek } from '../../services/googleClient';
import { gmail_v1 } from 'googleapis';

type Data = {
  emails?: gmail_v1.Schema$Message[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  // Vérifiez si l'objet des cookies existe
  if (!req || !req.headers || !req.headers.cookie) {
    // Gérer le cas où les cookies sont absents ou indéfinis
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Créez un client Supabase authentifié
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const providerToken = session?.provider_token ?? '';
    if (!providerToken) {
      throw new Error('Provider token is missing');
    }
    const emails = await getEmailsFromLastWeek(providerToken);
    res.status(200).json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
