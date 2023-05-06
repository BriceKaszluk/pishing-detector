import { NextApiRequest, NextApiResponse } from 'next';
import { Mail } from '../../lib/types';
import { calculatePhishingScore } from './analyzers/calculatePhishingScore';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const emails: Mail[] = req.body.emails;

    if (!Array.isArray(emails)) {
      res.status(400).json({ message: 'Invalid input: expected an array of emails' });
      return;
    }
    const phishingProbabilities = emails.map(calculatePhishingScore);
    res.status(200).json( phishingProbabilities );
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
