import Link from 'next/link';

async function fetchCategories() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${base}/api/catalog/categories`, {next: {revalidate: 60}});
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const categories = await fetchCategories();
  return (
    <main style={{ padding: 24 }}>
      <h1>ElectroPap</h1>
      <p>Bienvenue / Welcome</p>
      <nav style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <Link href="/fr">FR</Link>
        <Link href="/en">EN</Link>
        <Link href="/fr/catalog">Catalogue</Link>
        <Link href="/fr/auth/login">Connexion</Link>
      </nav>
      <section style={{ marginTop: 24 }}>
        <h2>Catégories</h2>
        <ul>
          {categories.map((c: any) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

