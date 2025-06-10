import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

const roles = ['admin', 'editor', 'viewer'];

export default function CreateUserForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(roles[1]);
  const [status, setStatus] = useState<string | null>(null);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Creating user...');
    const { data: userResp, error: userErr } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { role }
    });
    if (userErr) return setStatus(userErr.message);

    const { error: profileErr } = await supabase
      .from('profiles')
      .insert({ user_id: userResp.user?.id, role });

    setStatus(profileErr ? profileErr.message : 'User created.');
  };

  return (
    <form onSubmit={createUser} className="space-y-4">
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input
        value={password}
        type="password"
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <select value={role} onChange={e => setRole(e.target.value)}>
        {roles.map(r => (
          <option key={r}>{r}</option>
        ))}
      </select>
      <button type="submit">Create</button>
      {status && <p>{status}</p>}
    </form>
  );
}
