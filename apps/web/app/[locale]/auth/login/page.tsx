'use client';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erreur');
      localStorage.setItem('token', data.token);
      setMessage('Connecté');
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Connexion</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Se connecter</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}

