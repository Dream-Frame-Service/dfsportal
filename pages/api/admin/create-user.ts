import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/utils/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // Simple key check
  if (req.headers['x-api-key'] !== process.env.ADMIN_API_KEY)
    return res.status(401).json({ error: 'Unauthorized' });

  const { email, password, role = 'admin' } = req.body as {
    email: string;
    password: string;
    role?: string;
  };

  if (!email || !password)
    return res.status(400).json({ error: 'email and password required' });

  // 1. create user
  const { data: userData, error: userErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { role }
  });
  if (userErr) return res.status(400).json({ error: userErr.message });

  // 2. store role in profiles table
  const { error: profileErr } = await supabaseAdmin
    .from('profiles')
    .insert({ user_id: userData.user?.id, role });

  if (profileErr) return res.status(400).json({ error: profileErr.message });

  res.status(200).json({ id: userData.user?.id, email, role });
}
