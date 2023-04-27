import { NextApiHandler } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const deleteAccount: NextApiHandler = async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });

  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({
      error: 'not_authenticated',
      description:
        'The user does not have an active session or is not authenticated'
    });
  }

  try {
    const { error } = await supabase.from('profiles').delete().eq('id', session.user.id);

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: 'Account successfully deleted' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting account:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    } else {
      console.error('Error deleting account:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default deleteAccount;
