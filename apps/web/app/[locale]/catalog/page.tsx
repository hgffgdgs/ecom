async function fetchProducts() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${base}/api/catalog/products`, {next: {revalidate: 60}});
  if (!res.ok) return [];
  return res.json();
}

export default async function Catalog() {
  const products = await fetchProducts();
  return (
    <main style={{ padding: 24 }}>
      <h1>Catalogue</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {products.map((p: any) => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 12 }}>
            <h3>{p.name}</h3>
            <p>{(p.basePriceCents/100).toFixed(2)} {p.currency}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

